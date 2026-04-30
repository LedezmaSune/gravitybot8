import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { WhatsAppClient } from '../whatsapp/connection';

// Services
import { WhatsAppService } from '../services/whatsapp.service';
import { ReminderService } from '../services/reminder.service';
import { AIService } from '../services/ai.service';
import { MassDiffusionService } from '../services/diffusion.service';

// Controllers
import { WhatsAppController } from '../controllers/whatsapp.controller';
import { ReminderController } from '../controllers/reminder.controller';
import { AIController } from '../controllers/ai.controller';
import { DiffusionController } from '../controllers/diffusion.controller';
import { SettingsController } from '../controllers/settings.controller';
import { SystemController } from '../controllers/system.controller';
import { TemplateController } from '../controllers/template.controller';

// Routes
import { createWhatsAppRouter } from './whatsapp.routes';
import { createReminderRouter } from './reminder.routes';
import { createAIRouter } from './ai.routes';
import { createDiffusionRouter } from './diffusion.routes';
import { createSettingsRouter } from './settings.routes';
import { createSystemRouter } from './system.routes';
import { createTemplateRouter } from './template.routes';

// Shared Multer Setup
const uploadDir = path.resolve('data/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

/**
 * Route Aggregator
 * Instantiates all services and controllers to build the main router.
 */
export function createMainRouter(waClient: WhatsAppClient) {
    const router = Router();

    // 1. Instantiate Services
    const waService = new WhatsAppService(waClient);
    const reminderService = new ReminderService();
    const aiService = new AIService();
    const diffusionService = new MassDiffusionService(waService);

    // 2. Instantiate Controllers
    const waController = new WhatsAppController(waService);
    const reminderController = new ReminderController(reminderService);
    const aiController = new AIController(aiService);
    const diffusionController = new DiffusionController(diffusionService);
    const settingsController = new SettingsController();
    const systemController = new SystemController(waClient);
    const templateController = new TemplateController();

    // 3. Mount Routes
    router.use('/whatsapp', createWhatsAppRouter(waController));
    router.use('/reminders', createReminderRouter(reminderController, upload));
    router.use('/ai', createAIRouter(aiController));
    router.use('/send-mass', createDiffusionRouter(diffusionController, upload));
    router.use('/settings', createSettingsRouter(settingsController));
    router.use('/system', createSystemRouter(systemController));
    router.use('/templates', createTemplateRouter(templateController));

    return router;
}
