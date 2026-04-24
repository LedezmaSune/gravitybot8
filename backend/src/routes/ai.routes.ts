import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

export function createAIRouter(controller: AIController) {
    const router = Router();
    
    router.post('/review-message', controller.reviewMessage);
    
    return router;
}
