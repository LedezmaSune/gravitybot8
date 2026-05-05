import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Core
import { WhatsAppClient } from './whatsapp/connection';
import { SystemUtils } from './core/system';
import { TunnelService } from './core/tunnel';

// Components
import { createMainRouter } from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { basicAuth } from './middleware/auth.middleware';
import { Scheduler } from './modules/scheduling/scheduler';
import { WhatsAppService } from './services/whatsapp.service';
import { ReminderService } from './services/reminder.service';
import { WhatsAppEventHandler } from './whatsapp/handler';
import { MassDiffusionService } from './services/diffusion.service';
import { initTelegramBot } from './telegram/bot';
import { initTools } from './tools/index';
import { BackupService } from './services/backup.service';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware Configuration
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(basicAuth);

// Service Initialization
const waClient = new WhatsAppClient(io);
const waService = new WhatsAppService(waClient);
const reminderService = new ReminderService();
const diffusionService = new MassDiffusionService(waService);
const waHandler = new WhatsAppEventHandler(io, waService);

waClient.setHandler(waHandler);
initTools(waService);

// Routes Configuration
app.use('/api', createMainRouter(waClient));

// Static Files & Proxy Logic
const isPkg = (process as any).pkg;
const frontendPath = isPkg 
    ? path.join(path.dirname(process.execPath), 'frontend')
    : path.join(__dirname, '../../frontend/out');

if (process.env.NODE_ENV === 'development' && !isPkg) {
    app.use('/', createProxyMiddleware({
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        pathFilter: (path: string) => !path.startsWith('/api') && !path.startsWith('/socket.io')
    }));
} else {
    app.use(express.static(frontendPath));
    app.get('(.*)', (req: any, res: any) => {
        if (!req.path.startsWith('/api')) {
            const indexPath = path.join(frontendPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.status(404).send('Dashboard files not found in: ' + frontendPath);
            }
        }
    });
}

app.use(errorHandler);

// WebSocket Status Handlers
io.on('connection', (socket: any) => {
    const status = waClient.getStatus();
    socket.emit('status', status.state);
    if (status.qr) socket.emit('qr', status.qr);
});

const PORT = process.env.PORT || 8001;

/**
 * Bootstrap Application
 */
async function bootstrap() {
    SystemUtils.ensureDirs();
    SystemUtils.validateEnv();
    
    server.listen(Number(PORT), '0.0.0.0', async () => {
        console.log(`\n🚀 KITSUNE ENGINE (Portable) activo en: http://localhost:${PORT}`);
        
        try {
            const tunnelUrl = await TunnelService.getInstance().start(Number(PORT));
            if (tunnelUrl) console.log(`🌍 TUNEL: ${tunnelUrl}`);
        } catch (e) {
            console.error("[Tunnel] Error starting tunnel:", e);
        }
        
        await waClient.init();
        initTelegramBot(waService, reminderService, diffusionService);
        Scheduler.init(waService, reminderService);
        BackupService.initScheduledBackup();
    });
}

bootstrap().catch(err => {
    console.error("FATAL ERROR DURING BOOTSTRAP:", err);
    process.exit(1);
});
