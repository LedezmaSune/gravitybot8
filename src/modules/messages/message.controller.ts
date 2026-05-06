import { MessageService } from './message.service';
import { AIService } from '../ai/ai.service';

/**
 * MODULE LAYER - MESSAGES CONTROLLER
 * El controlador orquestra el flujo de los mensajes.
 */
export class MessageController {
    constructor(
        private messageService: MessageService,
        private aiService: AIService
    ) {}

    /**
     * Punto de entrada para cualquier mensaje de texto entrante
     */
    async handleIncoming(jid: string, text: string, sender: string) {
        console.log(`[MessageController] Nuevo mensaje de ${sender}: ${text.substring(0, 50)}`);

        try {
            // 1. Obtener respuesta de la IA
            const response = await this.aiService.runAgent(jid, text, sender);
            
            // 2. Enviar respuesta vía WhatsApp
            await this.messageService.sendMessage(jid, response);

        } catch (error) {
            console.error('[MessageController] Error handling incoming message:', error);
            await this.messageService.sendMessage(jid, 'Ups, tuve un error interno al procesar tu mensaje.');
        }
    }
}
