import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from '../validators/project.validators';

const router = Router();

router.use(requireAuth);

router.post('/', requireRole('admin', 'manager'), validate({ body: createProjectSchema }), asyncHandler(projectController.createProject));
router.get('/', asyncHandler(projectController.listProjects));
router.get('/:projectId', validate({ params: projectIdParamSchema }), asyncHandler(projectController.getProject));
router.patch(
  '/:projectId',
  requireRole('admin', 'manager'),
  validate({ params: projectIdParamSchema, body: updateProjectSchema }),
  asyncHandler(projectController.updateProject),
);

export default router;
