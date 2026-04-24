import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';

export function createSettingsRouter(controller: SettingsController) {
    const router = Router();
    
    router.get('/', controller.getSettings);
    router.post('/', controller.updateSettings);
    router.delete('/clean-uploads', controller.cleanUploads);
    
    router.post('/learn-url', controller.learnFromUrl);
    
    return router;
}
