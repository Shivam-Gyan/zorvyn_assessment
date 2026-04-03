import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { dashboardQuerySchema } from '../validators/dashboard.validators';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin', 'manager'));

router.get('/summary', validate({ query: dashboardQuerySchema }), asyncHandler(dashboardController.summary));
router.get('/categories', validate({ query: dashboardQuerySchema }), asyncHandler(dashboardController.categories));
router.get('/trends', validate({ query: dashboardQuerySchema }), asyncHandler(dashboardController.trends));
router.get('/recent', validate({ query: dashboardQuerySchema }), asyncHandler(dashboardController.recent));

export default router;
