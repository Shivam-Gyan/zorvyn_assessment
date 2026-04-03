import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema, userIdParamSchema } from '../validators/user.validators';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', asyncHandler(userController.listUsers));
router.patch('/:userId', validate({ params: userIdParamSchema, body: updateUserSchema }), asyncHandler(userController.updateUser));

export default router;
