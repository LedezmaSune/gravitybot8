import { Router } from 'express';
import multer from 'multer';
import { DiffusionController } from '../controllers/diffusion.controller';

export function createDiffusionRouter(controller: DiffusionController, upload: multer.Multer) {
    const router = Router();
    
    router.post('/', upload.single('media'), controller.sendMass);
    
    return router;
}
