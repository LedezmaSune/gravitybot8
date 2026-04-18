import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getSettings, updateSettings, listReminders, addMessage } from '../core/memory';
import { asyncHandler } from '../middleware/errorHandler';
import { scrapeUrl } from '../core/scraper';

const uploadDir = path.resolve('data/uploads');

export class SettingsController {
    getSettings = asyncHandler(async (req: Request, res: Response) => {
        const settings = await getSettings();
        res.json(settings);
    });

    updateSettings = asyncHandler(async (req: Request, res: Response) => {
        await updateSettings(req.body);
        res.json({ success: true });
    });

    cleanUploads = asyncHandler(async (req: Request, res: Response) => {
        if (!fs.existsSync(uploadDir)) return res.json({ success: true, deletedCount: 0 });
        
        const files = fs.readdirSync(uploadDir);
        let deletedCount = 0;
        const pendingReminders = await listReminders('owner');
        // Keep media linked to pending reminders
        const activePaths = new Set(pendingReminders.map((r: any) => r.mediaPath).filter(Boolean));
        
        files.forEach(file => {
            const fullPath = path.join(uploadDir, file);
            if (!activePaths.has(fullPath)) {
                try {
                    fs.unlinkSync(fullPath);
                    deletedCount++;
                } catch (e) {
                    console.error("Could not delete file", fullPath, e);
                }
            }
        });
        res.json({ success: true, deletedCount });
    });
    learnFromUrl = asyncHandler(async (req: Request, res: Response) => {
        const { url } = req.body;
        if (!url) throw new Error("URL is required");

        const content = await scrapeUrl(url);
        
        // Fetch current knowledge or possible responses
        const settings = await getSettings() as any;
        const currentKnowledge = settings.possible_responses || "";
        
        const newKnowledge = `${currentKnowledge}\n\n[CONOCIMIENTO DE ${url}]:\n${content}`;
        
        await updateSettings({ possible_responses: newKnowledge });
        
        res.json({ success: true, learnedCount: content.length });
    });
}

