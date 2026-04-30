import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    ConnectionState,
    AnyMessageContent
} from '@whiskeysockets/baileys';
import { useSQLiteAuthState } from './sqlite-auth';
import path from 'path';
import pino from 'pino';
import { Server } from 'socket.io';

const logger = pino({ level: process.env.LOGGER_LEVEL || 'error' });

export class WhatsAppClient {
    private socket: any;
    private state: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
    private qr: string | null = null;
    private io: Server;
    private isInitializing = false;
    private eventHandler: any = null;

    constructor(io: Server) {
        this.io = io;
    }

    /**
     * Attach an external event handler to process socket events
     */
    setHandler(handler: any) {
        this.eventHandler = handler;
    }

    async init() {
        if (this.isInitializing) {
            console.log('[WA] Initialization already in progress, skipping duplicate call.');
            return;
        }

        this.isInitializing = true;

        try {
            const { state, saveCreds } = await useSQLiteAuthState(path.join('data', 'whatsapp_auth.db'));
            const { version } = await fetchLatestBaileysVersion();

            this.socket = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, logger),
                },
                logger,
                browser: ['Ubuntu', 'Chrome', '20.0.04'],
                syncFullHistory: false,
                markOnlineOnConnect: true,
                generateHighQualityLinkPreview: false,
            });

            this.socket.ev.on('creds.update', saveCreds);

            // Forward to Handler if attached
            if (this.eventHandler) {
                this.eventHandler.listen(this.socket, () => this.init());
            } else {
                // Fallback basic connection handling if no handler (for bootstrap)
                this.socket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
                    const { connection, lastDisconnect, qr } = update;
                    if (qr) this.qr = qr;
                    if (connection === 'open') {
                        this.state = 'connected';
                        this.qr = null;
                    } else if (connection === 'close') {
                        this.state = 'disconnected';
                        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
                        if (statusCode !== DisconnectReason.loggedOut) void this.init();
                    }
                });
            }

            // Sync internal state with connection updates
            this.socket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
                const { connection, qr } = update;
                if (qr) this.qr = qr;
                if (connection === 'open') {
                    this.state = 'connected';
                    this.qr = null;
                } else if (connection === 'close') {
                    this.state = 'disconnected';
                } else if (connection === 'connecting') {
                    this.state = 'connecting';
                }
            });

        } finally {
            this.isInitializing = false;
        }
    }

    getSocket() {
        return this.socket;
    }

    private ensureJid(jid: string): string {
        if (!jid) return '';
        const clean = jid.trim();
        if (clean.includes('@')) return clean;
        let numbers = clean.replace(/\D/g, '');
        // Si el usuario ingresó solo 10 dígitos, asumimos que es de México y agregamos 521
        if (numbers.length === 10) {
            numbers = `521${numbers}`;
        }
        return `${numbers}@s.whatsapp.net`;
    }

    getStatus() {
        return { state: this.state, qr: this.qr };
    }

    async disconnect() {
        if (this.socket) {
            console.log('[WA] Desconectando socket de WhatsApp...');
            this.socket.end(undefined);
            this.state = 'disconnected';
            this.io.emit('status', 'disconnected');
        }
    }

    async sendMessage(jid: string, text: string) {
        if (this.state !== 'connected') throw new Error('Not connected');
        const formattedJid = this.ensureJid(jid);
        return await this.socket.sendMessage(formattedJid, { text });
    }

    /**
     * Send raw content directly (abstraction for service)
     */
    async sendRawMessage(jid: string, content: AnyMessageContent) {
        if (this.state !== 'connected') throw new Error('Not connected');
        const formattedJid = this.ensureJid(jid);
        return await this.socket.sendMessage(formattedJid, content);
    }

    async sendMedia(jid: string, filePath: string, caption?: string, mimeType?: string, fileName?: string) {
        if (this.state !== 'connected') throw new Error('Not connected');
        const formattedJid = this.ensureJid(jid);

        const fs = await import('fs');
        const path = await import('path');

        const ext = path.extname(filePath).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.mp4', '.mp3', '.ogg', '.wav'];

        if (!allowedExtensions.includes(ext)) {
            throw new Error(`Extension de archivo no permitida: ${ext}`);
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`Archivo no encontrado: ${filePath}`);
        }

        const buffer = fs.readFileSync(filePath);
        const message: any = { caption };

        if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            message.image = buffer;
        } else if (ext === '.mp4') {
            message.video = buffer;
        } else if (['.mp3', '.ogg', '.wav'].includes(ext)) {
            message.audio = buffer;
            message.mimetype = mimeType || (ext === '.ogg' ? 'audio/ogg; codecs=opus' : 'audio/mpeg');
            message.ptt = false;
            delete message.caption;
        } else {
            message.document = buffer;
            message.mimetype = mimeType || 'application/octet-stream';
            message.fileName = fileName || path.basename(filePath);
        }

        await this.socket.sendMessage(formattedJid, message);

        if (caption && (message.audio || message.document)) {
            await this.socket.sendMessage(formattedJid, { text: caption });
        }
    }
}
