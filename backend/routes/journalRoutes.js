import express from 'express';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
  getTodayJournalEntry,
} from '../controllers/journalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes are public but can optionally use authentication
router.route('/')
  .get(getJournalEntries)
  .post(createJournalEntry);

router.get('/today', getTodayJournalEntry);

router.route('/:id')
  .get(getJournalEntryById)
  .put(updateJournalEntry)
  .delete(deleteJournalEntry);

export default router;
