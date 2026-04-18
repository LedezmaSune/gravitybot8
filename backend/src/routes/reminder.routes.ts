import { Router } from 'express';
import multer from 'multer';
import { ReminderController } from '../controllers/reminder.controller';

export function createReminderRouter(controller: ReminderController, upload: multer.Multer) {
    const router = Router();
    
    router.get('/', controller.list);
    router.post('/', controller.create);
    router.post('/with-media', upload.single('media'), controller.createWithMedia);
    router.delete('/:id', controller.delete);
    
    return router;
}
