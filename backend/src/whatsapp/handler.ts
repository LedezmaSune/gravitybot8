import { ConnectionState, DisconnectReason, WAMessage, downloadContentFromMessage } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { WhatsAppService } from '../services/whatsapp.service';
import { getSettings } from '../core/memory';

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

            const rawJid = msg.key.remoteJid!;
            const participant = msg.key.participant;
            let jid = rawJid;

            if (jid.endsWith('@lid')) {
                if (participant && !participant.endsWith('@lid')) {
                    jid = participant;
                }
                console.log(`[WA Handler] JID @lid detectado: ${rawJid} (usando para envío)`);
            }

            const messageData = msg.message;
            const text = messageData.conversation
                || messageData.extendedTextMessage?.text
                || messageData.listResponseMessage?.singleSelectReply?.selectedRowId
                || messageData.buttonsResponseMessage?.selectedButtonId
                || '';

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
                return;
            }

            console.log(`[WA Handler] Nuevo mensaje de ${jid}: ${text.substring(0, 50)}...`);
            
            const isGroup = jid.endsWith('@g.us');
            const botJid = socket.user?.id?.split(':')[0] + '@s.whatsapp.net';
            const botLid = socket.user?.lid;
            const botName = (await getSettings() as any).bot_name || 'BotMaRe';
            
            if (isGroup) {
                const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const repliedJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
                const botLidClean = botLid?.split(':')[0]?.split('@')[0];
                const botJidClean = botJid.split('@')[0];
                
                console.log(`[WA Handler] DEBUG: Text="${text}", Mentions=${JSON.stringify(mentions)}, RepliedJid=${repliedJid}, BotJID=${botJid}, BotLid=${botLid}`);
                
                const isMentioned = text.includes(`@${botJidClean}`) || 
                                   (botLidClean && text.includes(`@${botLidClean}`)) ||
                                   text.toLowerCase().includes(botName.toLowerCase()) ||
                                   mentions.some((m: string) => {
                                       const mClean = m.split(':')[0].split('@')[0];
                                       return mClean === botJidClean || mClean === botLidClean;
                                   }) ||
                                   repliedJid?.split(':')[0]?.split('@')[0] === botJidClean ||
                                   repliedJid?.split(':')[0]?.split('@')[0] === botLidClean;

                console.log(`[WA Handler] Mensaje en grupo ${jid}. Mencionado: ${isMentioned}`);
                if (!isMentioned) return;
            }

            this.waService.handleIncomingMessage(jid, text, participant || jid, imageBase64)
                .catch(err => console.error('[WA Handler] Error crítico en handleIncomingMessage:', err));
        });
    }
}
