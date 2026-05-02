const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Core (Usamos require para asegurar compatibilidad en el bundle)
const { WhatsAppClient } = require('./whatsapp/connection');
const { SystemUtils } = require('./core/system');
const { TunnelService } = require('./core/tunnel');

// Refactored Components
const { createMainRouter } = require('./routes/index');
const { errorHandler } = require('./middleware/errorHandler');
const { Scheduler } = require('./modules/scheduling/scheduler');
const { WhatsAppService } = require('./services/whatsapp.service');
const { ReminderService } = require('./services/reminder.service');
const { WhatsAppEventHandler } = require('./whatsapp/handler');
const { MassDiffusionService } = require('./services/diffusion.service');
const { initTelegramBot } = require('./telegram/bot');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Basic Auth Middleware for Dashboard
const basicAuth = (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return next();
    }

    const auth = { 
        login: process.env.DASHBOARD_USER || 'admin', 
        password: process.env.DASHBOARD_PASS || 'admin123' 
    };
    
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="BotMaRe Dashboard"');
    res.status(401).send('Authentication required.');
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(basicAuth);

const waClient = new WhatsAppClient(io);
const waService = new WhatsAppService(waClient);
const reminderService = new ReminderService();
const diffusionService = new MassDiffusionService(waService);
const waHandler = new WhatsAppEventHandler(io, waService);
waClient.setHandler(waHandler);

// Initialize Tools with Services
const { initTools } = require('./tools/index');
initTools(waService);

app.use('/api', createMainRouter(waClient));

const isPkg = (process as any).pkg;
const frontendPath = isPkg 
    ? path.join(path.dirname(process.execPath), 'frontend')
    : path.join(__dirname, '../../frontend/out');

if (process.env.NODE_ENV === 'development' && !isPkg) {
    app.use('/', createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        pathFilter: (path: string) => !path.startsWith('/api') && !path.startsWith('/socket.io')
    }));
} else {
    app.use(express.static(frontendPath));
    app.get('*', (req: any, res: any) => {
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

io.on('connection', (socket: any) => {
    const status = waClient.getStatus();
    socket.emit('status', status.state);
    if (status.qr) socket.emit('qr', status.qr);
});

const PORT = process.env.PORT || 3001;

async function bootstrap() {
    SystemUtils.ensureDirs();
    SystemUtils.validateEnv();
    
    server.listen(Number(PORT), '0.0.0.0', async () => {
        console.log(`\n🚀 KITSUNE ENGINE (Portable) activo en: http://localhost:${PORT}`);
        
        try {
            const tunnelUrl = await TunnelService.getInstance().start(Number(PORT));
            if (tunnelUrl) console.log(`🌍 TUNEL: ${tunnelUrl}`);
        } catch (e) {}
        
        await waClient.init();
        initTelegramBot(waService, reminderService, diffusionService);
        Scheduler.init(waService, reminderService);
    });
}

bootstrap().catch(err => {
    console.error("FATAL:", err);
    process.exit(1);
});
