import fs from 'fs';
import path from 'path';
import { WhatsAppService } from './whatsapp.service';
import { Contact } from '../types';
import { processVariables } from '../utils/variables';

export class MassDiffusionService {
    private isProcessing = false;

    constructor(private waService: WhatsAppService) {}

    async sendMass(contacts: Contact[], rawMessage: string, mediaPath?: string, mediaType?: string, fileName?: string) {
        if (this.isProcessing) {
             console.warn("[Mass] A mass diffusion is already in progress. Queueing is not yet implemented.");
        }

        // Run in background
        this.processQueue(contacts, rawMessage, mediaPath, mediaType, fileName).catch(err => {
            console.error("[Mass] Fatal error in processQueue:", err);
        });

        return contacts.length;
    }

    private async processQueue(contacts: Contact[], rawMessage: string, mediaPath?: string, mediaType?: string, fileName?: string) {
        this.isProcessing = true;
        console.log(`[Mass] Starting diffusion to ${contacts.length} contacts`);

        for (const contact of contacts) {
            try {
                const to = contact.number;
                if (!to || to.trim() === '') continue;
                
                const personalizedMessage = processVariables(rawMessage, contact.name || '');

                console.log(`[Mass] Sending to ${to}...`);
                
                // Simulate typing
                // Note: We need internal socket for presence, but services should be clean.
                // For now, we'll just rely on the waService high level calls if presence isn't critical
                // or we could add a simulateTyping method to waService.
                
                if (mediaPath && mediaType && fs.existsSync(mediaPath)) {
                    await this.waService.sendMedia(to, mediaPath, personalizedMessage, mediaType, fileName);
                } else {
                    await this.waService.sendMessage(to, personalizedMessage);
                }

                // Delay between contacts (3-6s) to avoid bans
                const delay = 3000 + Math.random() * 3000;
                await new Promise(r => setTimeout(r, delay));
            } catch (error: any) {
                console.error(`[Mass] Failed to send to ${contact.number}:`, error.message);
            }
        }

        console.log(`[Mass] Completed diffusion to ${contacts.length} contacts`);
        this.isProcessing = false;
    }
}
