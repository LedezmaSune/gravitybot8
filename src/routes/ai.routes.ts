import { Router } from 'express';
import { AIController } from '../modules/ai/ai.controller';

export function createAIRouter(controller: AIController) {
    const router = Router();
    
    router.post('/review-message', controller.reviewMessage);
    router.post('/perfect', controller.perfectMessage);
    
    return router;
}
