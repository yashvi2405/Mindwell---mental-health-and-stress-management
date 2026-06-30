import express from 'express';
import {
  createMoodEntry,
  getMoodEntries,
  getMoodEntryById,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
} from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes are public but can optionally use authentication
// Note: /stats must come before /:id to avoid route matching issues
router.get('/stats', getMoodStats);

router.route('/')
  .get(getMoodEntries)
  .post(createMoodEntry);

router.route('/:id')
  .get(getMoodEntryById)
  .put(updateMoodEntry)
  .delete(deleteMoodEntry);

export default router;
