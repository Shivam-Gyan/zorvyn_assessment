import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, taskIdParamSchema, taskListQuerySchema, updateTaskSchema } from '../validators/task.validators';

const router = Router();

router.use(requireAuth);

router.post('/', validate({ body: createTaskSchema }), asyncHandler(taskController.createTask));
router.get('/', validate({ query: taskListQuerySchema }), asyncHandler(taskController.listTasks));
router.get('/:taskId', validate({ params: taskIdParamSchema }), asyncHandler(taskController.getTask));
router.patch(
  '/:taskId',
  validate({ params: taskIdParamSchema, body: updateTaskSchema }),
  asyncHandler(taskController.updateTask),
);
router.delete('/:taskId', validate({ params: taskIdParamSchema }), asyncHandler(taskController.deleteTask));

export default router;
