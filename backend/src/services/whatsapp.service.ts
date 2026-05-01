import { WhatsAppClient } from '../whatsapp/connection';
import { WhatsAppStatus } from '../types';
import { runAgent } from '../core/agent';
import { textToSpeech } from '../core/voice';

export class WhatsAppService {
    constructor(private client: WhatsAppClient) {}

    getStatus(): WhatsAppStatus {
        return this.client.getStatus();
    }

    async sendMessage(jid: string, text: string) {
        return await this.client.sendMessage(jid, text);
    }

    async sendMedia(jid: string, filePath: string, caption?: string, mimeType?: string, fileName?: string) {
        return await this.client.sendMedia(jid, filePath, caption, mimeType, fileName);
    }

    async disconnect() {
        return await this.client.disconnect();
    }

    /**
     * Internal logic for handling incoming messages.
     * Orchestrates AI Agent and Voice synthesis.
     */
    async handleIncomingMessage(jid: string, text: string, imageBase64?: string) {
        try {
            // 1. Show 'composing' (typing) status
            const socket = this.client.getSocket();
            if (socket) {
                try {
                    await socket.sendPresenceUpdate('composing', jid);
                } catch (_) {
                    // @lid JIDs don't support presence updates — safe to ignore
                }
            }

            // 2. Run AI Agent
            const response = await runAgent(jid, text, imageBase64);

            // 3. Small delay for realism
            await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
            if (socket) await socket.sendPresenceUpdate('paused', jid);

            // 4. Determine response format (Audio vs Text)
            if (text.toLowerCase().includes('audio') || text.toLowerCase().includes('voz')) {
                const audio = await textToSpeech(response);
                if (audio) {
                    await this.client.sendRawMessage(jid, { audio, mimetype: 'audio/mp4', ptt: true });
                    return;
                }
            }

            // 5. Send Text Response
            await this.client.sendMessage(jid, response);
        } catch (error) {
            console.error('[WhatsAppService] Error handling incoming message:', error);
            await this.client.sendMessage(jid, 'Lo siento, tuve un problema procesando tu mensaje.');
        }
    }
}
