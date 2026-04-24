import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Core
import { WhatsAppClient } from './whatsapp/connection';
import { SystemUtils } from './core/system';
import { TunnelService } from './core/tunnel';

// Refactored Components
import { createMainRouter } from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { Scheduler } from './modules/scheduling/scheduler';
import { WhatsAppService } from './services/whatsapp.service';
import { ReminderService } from './services/reminder.service';
import { WhatsAppEventHandler } from './whatsapp/handler';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Core Components
const waClient = new WhatsAppClient(io);

// Services for internal use (Scheduler)
const waService = new WhatsAppService(waClient);
const reminderService = new ReminderService();

// Event Handling Registration
const waHandler = new WhatsAppEventHandler(io, waService);
waClient.setHandler(waHandler);

// Routes
// Modular router handles all /api sub-paths
app.use('/api', createMainRouter(waClient));

// Red Bridge Proxy (UI Fallback)
app.use('/', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true,
    pathFilter: (path) => {
        return !path.startsWith('/api') && !path.startsWith('/socket.io');
    }
}));

// Global Error Handler (Must be after routes)
app.use(errorHandler);

// Socket.io Events
io.on('connection', (socket) => {
    console.log('[Socket] Client connected');
    const status = waClient.getStatus();
    socket.emit('status', status.state);
    if (status.qr) {
        socket.emit('qr', status.qr);
    }
});

const PORT = process.env.PORT || 3001;

/**
 * Orchestrator Bootstrap
 */
async function bootstrap() {
    console.log("-----------------------------------------");
    console.log("  OpenGravity Orchestrator Boot Sequence ");
    console.log("-----------------------------------------");

    // Phase 0: System Validation
    SystemUtils.ensureDirs();
    SystemUtils.validateEnv();
    SystemUtils.checkDependencies();

    // Phase 1: HTTP & WebSocket Server
    console.log("[Phase 1] Starting Express Server...");
    server.listen(Number(PORT), '0.0.0.0', async () => {
        console.log(`[Phase 1] 🚀 KITSUNE ENGINE (Backend/API) activo en: http://localhost:${PORT}`);
        
        // Phase 1.5: Cloudflare Tunnel
        try {
            const tunnelUrl = await TunnelService.getInstance().start(Number(PORT));
            if (tunnelUrl && !tunnelUrl.includes('api.trycloudflare.com')) {
                console.log(`\n-----------------------------------------`);
                console.log(`🌍 TUNEL ACTIVO: ${tunnelUrl}`);
                console.log(`-----------------------------------------\n`);
            }
        } catch (e: any) {
            console.warn(`[Phase 1.5] Cloudflare tunnel failed: ${e.message}`);
        }
        
        // Phase 2: WhatsApp Engine
        console.log("[Phase 2] Initializing WhatsApp Connection...");
        await waClient.init();

        // Phase 3: Background Tasks
        console.log("[Phase 3] Starting Scheduler...");
        Scheduler.init(waService, reminderService);

        console.log("\n🚀 Orchestrator Boot Sequence Completed!");
        console.log("-----------------------------------------");
    });
}

/**
 * Graceful Shutdown Handler
 */
async function gracefulShutdown() {
    console.log("\n[Teardown] Shutting down orchestrator gracefully...");
    
    try {
        Scheduler.stop();
        await waClient.disconnect();
        TunnelService.getInstance().stop();
        
        server.close(() => {
            console.log("[Teardown] Express server closed.");
            process.exit(0);
        });
    } catch (error) {
        console.error("[Teardown] Error during shutdown:", error);
        process.exit(1);
    }

    // Force exit after 5s
    setTimeout(() => {
        console.error("[Teardown] Forceful exit required.");
        process.exit(1);
    }, 5000);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Run the bootstrap
bootstrap().catch(err => {
    console.error("FATAL ERROR during bootstrap:", err);
    process.exit(1);
});

