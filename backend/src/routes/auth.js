import express from 'express';
import { authController } from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.get('/me', authMiddleware, authController.me);

export default router;
