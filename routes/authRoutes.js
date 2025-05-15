import express from 'express';
import { getProfile, login, signup } from '../controllers/authController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);

export default router;

