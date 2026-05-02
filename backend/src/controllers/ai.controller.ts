import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { asyncHandler } from '../middleware/errorHandler';

export class AIController {
    constructor(private aiService: AIService) {}

    reviewMessage = asyncHandler(async (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, error: "Text is required" });
        }
        
        console.log(`[AI Controller] Reviewing message...`);
        const corrected = await this.aiService.reviewMessage(text);
        res.json({ success: true, corrected });
    });

    perfectMessage = asyncHandler(async (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, error: "Text is required" });
        }
        
        console.log(`[AI Controller] Perfecting message...`);
        const perfected = await this.aiService.reviewMessage(text);
        res.json({ success: true, perfected });
    });
}
