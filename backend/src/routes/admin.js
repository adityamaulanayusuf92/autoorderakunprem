import express from 'express';
import { adminController } from '../controllers/admin.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', adminController.getDashboard);

// Products
router.post('/products', adminController.addProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Restock
router.post('/restock', adminController.bulkRestockAccounts);

// Users
router.get('/users', adminController.getUsers);
router.post('/users/:userId/ban', adminController.banUser);
router.post('/users/:userId/unban', adminController.unbanUser);

// Logs
router.get('/logs', adminController.getActivityLogs);

export default router;
