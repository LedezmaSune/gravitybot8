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

            // Resolve the correct JID for replying
            // @lid JIDs are internal linked-device identifiers — Baileys supports sending to them
            // but sendPresenceUpdate does NOT, so we keep both: rawJid for sending, safeJid for presence
            const rawJid = msg.key.remoteJid!;
            const participant = msg.key.participant; // only set in group messages
            let jid = rawJid;

            if (jid.endsWith('@lid')) {
                // For group messages, participant has the real sender JID
                if (participant && !participant.endsWith('@lid')) {
                    jid = participant;
                }
                // For individual chats keep rawJid — Baileys handles @lid for sendMessage
                console.log(`[WA Handler] JID @lid detectado: ${rawJid} (usando para envío)`);
            }

            const messageData = msg.message;
            const text = messageData.conversation
                || messageData.extendedTextMessage?.text
                || messageData.listResponseMessage?.singleSelectReply?.selectedRowId
                || messageData.buttonsResponseMessage?.selectedButtonId
                || '';

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

            if (!text && !imageBase64) {
                console.log(`[WA Handler] Mensaje ignorado (tipo no soportado) de ${jid}`);
                return;
            }

            console.log(`[WA Handler] Nuevo mensaje de ${jid}: ${text.substring(0, 50)}...`);
            
            // Delegate to Service for Business Logic (AI, TTS, etc.)
            this.waService.handleIncomingMessage(jid, text, imageBase64)
                .catch(err => console.error('[WA Handler] Error crítico en handleIncomingMessage:', err));
        });
    }
}
