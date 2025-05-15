import express from 'express';
import { applyForJob, getApplications, getEmployerApplications, getUserApplications } from '../controllers/applicationController.js';
import { protect, restrictTo } from '../utils/authMiddleware.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/:jobId/apply', protect, restrictTo('seeker'), upload.single('resume'), applyForJob);
router.get('/employer/applications', protect, restrictTo('employer'), getEmployerApplications);
router.get('/:jobId/applications', protect, restrictTo('employer'), getApplications);
router.get('/my-applications', protect, getUserApplications);

export default router;
