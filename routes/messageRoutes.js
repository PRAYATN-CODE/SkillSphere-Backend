import express from 'express';
import {
    getMessagesByReceiverAndJob,
    sendMessage
} from '../controllers/messageController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

// New route to get messages by receiverId and jobId
router.get('/seeker/:receiverId/:jobId', protect, getMessagesByReceiverAndJob);

router.post('/', protect, sendMessage);
export default router;