import express from 'express';
import { sendNotification } from '../controllers/emailController.js';
import { protect, restrictTo } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/:jobId/notify', protect, restrictTo('employer'), sendNotification);

export default router;