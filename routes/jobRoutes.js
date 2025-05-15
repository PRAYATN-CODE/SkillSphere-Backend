import express from 'express';
import { createJob, deleteJob, getAllJobs, getJobs } from '../controllers/jobController.js';
import { protect, restrictTo } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/all', getAllJobs);
router.post('/', protect, restrictTo('employer'), createJob);
router.delete('/:jobId', protect, restrictTo('admin'), deleteJob);

export default router;