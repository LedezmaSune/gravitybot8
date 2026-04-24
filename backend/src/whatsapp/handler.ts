import { ConnectionState, DisconnectReason, WAMessage, downloadContentFromMessage } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { WhatsAppService } from '../services/whatsapp.service';

export class WhatsAppEventHandler {
    constructor(
        private io: Server,
        private waService: WhatsAppService
    ) {}

    /**
     * Listen to all relevant socket events
     */
    listen(socket: any, reinitCallback: () => Promise<void>) {
        // 1. Connection Updates
        socket.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                this.io.emit('qr', qr);
            }

            if (connection === 'close') {
                const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                this.io.emit('status', 'disconnected');
                console.log(`[WA Handler] Connection closed. Status Code: ${statusCode}. Reconnecting: ${shouldReconnect}`);

                if (statusCode === 401 || statusCode === DisconnectReason.loggedOut) {
                    console.warn('[WA Handler] Session invalid or logged out. Clearing auth data...');
                    const authDir = path.resolve('auth_info_baileys');
                    if (fs.existsSync(authDir)) {
                        fs.rmSync(authDir, { recursive: true, force: true });
                    }
                    await reinitCallback();
                } else if (shouldReconnect) {
                    await reinitCallback();
                }
            } else if (connection === 'open') {
                this.io.emit('status', 'connected');
                console.log('[WA Handler] Connection established successfully!');
            } else if (connection === 'connecting') {
                this.io.emit('status', 'connecting');
            }
        });

        // 2. Message Upsert (Incoming Messages)
        socket.ev.on('messages.upsert', async ({ messages }: { messages: WAMessage[], type: string }) => {
            const msg = messages[0];
            if (msg.key.fromMe || !msg.message) return;

            const jid = msg.key.remoteJid!;
            const messageData = msg.message;
            const text = messageData.conversation || messageData.extendedTextMessage?.text || '';

            // Handle Media if present
            let imageBase64: string | undefined;
            const imageMsg = messageData.imageMessage;
            if (imageMsg) {
                try {
                    const stream = await downloadContentFromMessage(imageMsg, 'image');
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk]);
                    }
                    imageBase64 = buffer.toString('base64');
                } catch (e) {
                    console.error('[WA Handler] Error downloading image message:', e);
                }
            }

            console.log(`[WA Handler] Nuevo mensaje de ${jid}: ${text.substring(0, 50)}...`);
            
            // Delegate to Service for Business Logic (AI, TTS, etc.)
            void this.waService.handleIncomingMessage(jid, text, imageBase64);
        });
    }
}
