import { 
    createReminder, 
    listReminders, 
    deleteReminder, 
    updateReminderStatus, 
    logAudit 
} from '../core/memory';
import { Reminder } from '../types';

export class ReminderService {
    async create(userId: string, chatId: string, text: string, time: string, mediaPath?: string, mediaType?: string, repeat?: string, repeatInterval?: number, repeatUnit?: string) {
        return await createReminder(userId, chatId, text, time, mediaPath, mediaType, repeat, repeatInterval, repeatUnit);
    }

    async list(userId: string, includeProcessed: boolean = false): Promise<Reminder[]> {
        return await listReminders(userId, includeProcessed) as Reminder[];
    }

    async delete(id: number) {
        return await deleteReminder(id);
    }

    async updateStatus(id: number, status: Reminder['status']) {
        return await updateReminderStatus(id, status);
    }

    async logAudit(userId: string, action: string, details: any) {
        return await logAudit(userId, action, details);
    }
}
