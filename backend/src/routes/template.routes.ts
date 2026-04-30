import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';

export function createTemplateRouter(controller: TemplateController) {
    const router = Router();
    
    router.get('/', controller.list);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);
    
    return router;
}
