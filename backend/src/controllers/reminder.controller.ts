import { Request, Response } from 'express';
import path from 'path';
import { ReminderService } from '../services/reminder.service';
import { asyncHandler } from '../middleware/errorHandler';

export class ReminderController {
    constructor(private reminderService: ReminderService) {}

    list = asyncHandler(async (req: Request, res: Response) => {
        const reminders = await this.reminderService.list('owner', true);
        res.json(reminders);
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const { chatId, text, time } = req.body;
        const id = await this.reminderService.create('owner', chatId, text, time);
        res.json({ success: true, id });
    });

    createWithMedia = asyncHandler(async (req: Request, res: Response) => {
        const { chatId, text, time } = req.body;
        const file = req.file;

        let mediaType;
        if (file) {
            if (file.mimetype.startsWith('image/')) mediaType = 'image';
            else if (file.mimetype.startsWith('video/')) mediaType = 'video';
            else if (file.mimetype.startsWith('audio/')) mediaType = 'audio';
            else mediaType = 'document';
        }

        const mediaPath = file ? path.resolve(file.path) : undefined;
        const id = await this.reminderService.create('owner', chatId, text, time, mediaPath, mediaType);
        res.json({ success: true, id, mediaPath });
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        await this.reminderService.delete(parseInt(id as string));
        res.json({ success: true });
    });
}
