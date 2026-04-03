import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTransactionSchema,
  transactionIdParamSchema,
  transactionListQuerySchema,
  updateTransactionSchema,
} from '../validators/transaction.validators';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requireRole('admin'),
  validate({ body: createTransactionSchema }),
  asyncHandler(transactionController.createTransaction),
);
router.get('/', validate({ query: transactionListQuerySchema }), asyncHandler(transactionController.listTransactions));
router.get(
  '/:transactionId',
  validate({ params: transactionIdParamSchema }),
  asyncHandler(transactionController.getTransaction),
);
router.patch(
  '/:transactionId',
  requireRole('admin'),
  validate({ params: transactionIdParamSchema, body: updateTransactionSchema }),
  asyncHandler(transactionController.updateTransaction),
);
router.delete(
  '/:transactionId',
  requireRole('admin'),
  validate({ params: transactionIdParamSchema }),
  asyncHandler(transactionController.deleteTransaction),
);

export default router;
