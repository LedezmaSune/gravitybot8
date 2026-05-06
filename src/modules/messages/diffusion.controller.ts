import { Request, Response } from 'express';
import path from 'path';
import { MassDiffusionService } from './diffusion.service';
import { asyncHandler } from '../../middleware/errorHandler';

export class DiffusionController {
    constructor(private diffusionService: MassDiffusionService) {}

    sendMass = asyncHandler(async (req: Request, res: Response) => {
        let contacts = [];
        try {
            const parsed = JSON.parse(req.body.contacts);
            if (typeof parsed[0] === 'string') {
                contacts = parsed.map((p: string) => ({ number: p, name: '' }));
            } else {
                contacts = parsed;
            }
        } catch (e) {
            return res.status(400).json({ success: false, error: "Invalid contacts format" });
        }

        const rawMessage = req.body.message;
        const file = (req as any).file;

        if (!Array.isArray(contacts) || contacts.length === 0 || !rawMessage) {
            return res.status(400).json({ success: false, error: "Invalid payload: contacts and message are required" });
        }

        const mediaPath = file ? path.resolve(file.path) : undefined;
        const mediaType = file ? file.mimetype : undefined;
        const fileName = file ? file.originalname : undefined;

        const queuedCount = await this.diffusionService.sendMass(contacts, rawMessage, mediaPath, mediaType, fileName);

        res.json({ success: true, queued: queuedCount });
    });
}
