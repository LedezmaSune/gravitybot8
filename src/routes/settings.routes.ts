import { Router } from 'express';
import { SettingsController } from '../modules/settings/settings.controller';

export function createSettingsRouter(controller: SettingsController) {
    const router = Router();
    
    router.get('/', controller.getSettings);
    router.post('/', controller.updateSettings);
    router.delete('/clean-uploads', controller.cleanUploads);
    
    router.post('/parse-env', controller.parseEnvFile);
    router.post('/learn-url', controller.learnFromUrl);
    
    return router;
}
