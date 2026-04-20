import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db, listReminders } from '../core/memory';
import { asyncHandler } from '../middleware/errorHandler';
import { UpdateService } from '../services/update.service';

const uploadDir = path.resolve('data/uploads');

export class SystemController {
    private updateService = new UpdateService();
    constructor(private waClient?: any) {}

    getAudits = asyncHandler(async (req: Request, res: Response) => {
        const audits = db
            .prepare('SELECT id, userId, action, details, timestamp FROM audits ORDER BY timestamp DESC LIMIT 50')
            .all();
        res.json(audits);
    });

    cleanUploads = asyncHandler(async (req: Request, res: Response) => {
        if (!fs.existsSync(uploadDir)) return res.json({ success: true, deletedCount: 0 });
        
        const files = fs.readdirSync(uploadDir);
        let deletedCount = 0;
        const pendingReminders = await listReminders('owner');
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

    resetWhatsApp = asyncHandler(async (req: Request, res: Response) => {
        console.log('[System] Resetting WhatsApp requested...');
        
        // 1. Disconnect current client if possible
        if (this.waClient) {
            try {
                await this.waClient.disconnect();
            } catch (e) {
                console.warn('[System] Error disconnecting client (ignoring):', e);
            }
        }

        // 2. Clear auth folder
        const authDir = path.resolve('auth_info_baileys');
        if (fs.existsSync(authDir)) {
            console.log('[System] Clearing auth_info_baileys folder...');
            fs.rmSync(authDir, { recursive: true, force: true });
            fs.mkdirSync(authDir);
        }

        // 3. Re-initialize client
        if (this.waClient) {
            console.log('[System] Re-initializing WhatsApp client...');
            // We run it asynchronously to avoid blocking the response
            void this.waClient.init();
        }

        res.json({ success: true, message: 'WhatsApp session reset initiated.' });
    });
    checkUpdates = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.updateService.checkUpdate();
        res.json(result);
    });

    applyUpdate = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.updateService.performUpdate();
        res.json(result);
    });
}
