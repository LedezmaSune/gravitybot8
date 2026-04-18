import { DateTime } from 'luxon';
import { WhatsAppService } from '../../services/whatsapp.service';
import { ReminderService } from '../../services/reminder.service';
import { db } from '../../core/memory'; // Still needed for raw queries for now, or we could move this to ReminderService

export class Scheduler {
    private static waService: WhatsAppService;
    private static reminderService: ReminderService;

    private static intervalId: NodeJS.Timeout | null = null;
    private static isChecking: boolean = false;

    static init(waService: WhatsAppService, reminderService: ReminderService) {
        this.waService = waService;
        this.reminderService = reminderService;
        console.log("[Scheduler] System Initialized");
        
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.checkReminders(), 30000);
        
        // Background file cleanup (runs daily)
        setInterval(() => this.checkUploadCleanup(), 24 * 60 * 60 * 1000);
        setTimeout(() => this.checkUploadCleanup(), 5000); // Also run on startup after 5 secs
    }

    static stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log("[Scheduler] System Stopped");
        }
    }

    private static async asyncBatch(reminders: any[]) {
        for (const r of reminders) {
            try {
                // Phase 1: Lock for processing
                await this.reminderService.updateStatus(r.id, 'processing');
                console.log(`[Scheduler] Procesando recordatorio ${r.id} para ${r.chatId}`);
                
                // Phase 2: Send
                if (r.mediaPath) {
                    await this.waService.sendMedia(r.chatId, r.mediaPath, r.text);
                } else {
                    await this.waService.sendMessage(r.chatId, r.text);
                }

                // Phase 3: Success
                await this.reminderService.updateStatus(r.id, 'sent');
                await this.reminderService.logAudit('system', 'REMINDER_SENT', { id: r.id, to: r.chatId, type: r.mediaPath ? 'media' : 'text' });
                console.log(`[Scheduler] Recordatorio ${r.id} enviado con éxito.`);
            } catch (error: any) {
                console.error(`[Scheduler] Error enviando recordatorio ${r.id}:`, error.message);
                await this.reminderService.updateStatus(r.id, 'failed'); 
                await this.reminderService.logAudit('system', 'REMINDER_FAILED', { id: r.id, to: r.chatId, error: error.message });
            }
        }
    }

    private static async checkReminders() {
        if (this.isChecking) return;
        this.isChecking = true;

        try {
            const now = DateTime.now().setZone('America/Mexico_City').toISO()?.substring(0, 16);
            
            // Detection Phase - using db directly for specific query but we could also move this to reminderService
            const pending = db.prepare("SELECT * FROM reminders WHERE status = 'pending' AND time <= ?").all(now);

            if (pending.length > 0) {
                console.log(`[Scheduler] [Audit] Iniciando proceso para ${pending.length} recordatorios.`);
                await this.reminderService.logAudit('system', 'SCHEDULER_BATCH_START', { count: pending.length });
                await this.asyncBatch(pending);
                await this.reminderService.logAudit('system', 'SCHEDULER_BATCH_COMPLETE', { count: pending.length });
            }
        } catch (error: any) {
            console.error("[Scheduler] Error en el ciclo de revisión:", error);
            await this.reminderService.logAudit('system', 'SCHEDULER_CRITICAL_ERROR', { error: error.message });
        } finally {
            this.isChecking = false;
        }
    }

    private static async checkUploadCleanup() {
        try {
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.resolve('data/uploads');
            if (!fs.existsSync(uploadDir)) return;
            
            const files = fs.readdirSync(uploadDir);
            const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            
            // Querying pending reminders to avoid deleting active media
            const pendingReminders = db.prepare("SELECT mediaPath FROM reminders WHERE status = 'pending' AND mediaPath IS NOT NULL").all();
            const activePaths = new Set(pendingReminders.map((r: any) => r.mediaPath));
            
            let deleted = 0;
            files.forEach((file: string) => {
                const fullPath = path.join(uploadDir, file);
                try {
                    const stats = fs.statSync(fullPath);
                    // Delete if older than 30 days and NOT currently used in a pending reminder
                    if (!activePaths.has(fullPath) && (now - stats.mtimeMs > THIRTY_DAYS_MS)) {
                        fs.unlinkSync(fullPath);
                        deleted++;
                    }
                } catch(e) {}
            });
            if (deleted > 0) {
                console.log(`[Scheduler] Cleaned up ${deleted} old media files.`);
            }
        } catch (error) {
            console.error("[Scheduler] Error in cleanup cycle:", error);
        }
    }
}
