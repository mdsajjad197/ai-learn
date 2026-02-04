import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWeakAreas, getRevisionPlan, getProgressAnalytics } from '../controllers/efficiencyController.js';

const router = express.Router();

router.get('/weak-areas', protect, getWeakAreas);
router.get('/revision-plan', protect, getRevisionPlan);
router.get('/analytics', protect, getProgressAnalytics);

export default router;
