import { Router } from 'express';
import { SystemController } from '../controllers/system.controller';
import multer from 'multer';

const upload = multer({ dest: 'backups/temp_uploads/' });

export function createSystemRouter(controller: SystemController) {
    const router = Router();
    
    router.get('/audits', controller.getAudits);
    router.delete('/clean-uploads', controller.cleanUploads);
    router.post('/reset-whatsapp', controller.resetWhatsApp);
    
    router.get('/check-update', controller.checkUpdates);
    router.post('/apply-update', controller.applyUpdate);
    router.get('/backup', controller.downloadBackup);
    router.post('/restore', upload.single('backup'), controller.restoreBackup);
    
    return router;
}
