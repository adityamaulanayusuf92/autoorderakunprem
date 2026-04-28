import express from 'express';
import { productController } from '../controllers/product.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', productController.getAll);
router.get('/search', productController.search);
router.get('/category/:category', productController.getByCategory);
router.get('/:id', productController.getById);

// Admin only
router.post('/', authMiddleware, adminMiddleware, productController.create);
router.put('/:id', authMiddleware, adminMiddleware, productController.update);
router.delete('/:id', authMiddleware, adminMiddleware, productController.delete);

export default router;
