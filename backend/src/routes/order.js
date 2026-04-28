import express from 'express';
import { orderController } from '../controllers/order.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, orderController.create);
router.get('/my', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getById);
router.post('/:id/confirm-payment', authMiddleware, orderController.confirmPayment);

// Admin only
router.get('/', authMiddleware, adminMiddleware, orderController.getAll);
router.post('/:id/approve', authMiddleware, adminMiddleware, orderController.approvePendingOrder);

export default router;
