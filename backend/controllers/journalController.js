import asyncHandler from 'express-async-handler';
import JournalEntry from '../models/journalModel.js';

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Public (optional auth)
const createJournalEntry = asyncHandler(async (req, res) => {
  const { content, date, user } = req.body;

  // Validate required fields
  if (!content || content.trim() === '') {
    res.status(400);
    throw new Error('Please provide journal content');
  }

  // Create journal entry (user is optional)
  const journalEntry = await JournalEntry.create({
    user: user || null,
    content: content.trim(),
    date: date || new Date(),
  });

  res.status(201).json(journalEntry);
});

// @desc    Get all journal entries (optionally filtered by user)
// @route   GET /api/journal
// @access  Public
const getJournalEntries = asyncHandler(async (req, res) => {
  const { startDate, endDate, limit, user } = req.query;

  let query = {};
  
  // Filter by user if provided
  if (user) {
    query.user = user;
  }

  // Filter by date range if provided
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const journalEntries = await JournalEntry.find(query)
    .sort({ date: -1 })
    .limit(limit ? parseInt(limit) : 100);

  res.json(journalEntries);
});

// @desc    Get a single journal entry by ID
// @route   GET /api/journal/:id
// @access  Public
const getJournalEntryById = asyncHandler(async (req, res) => {
  const journalEntry = await JournalEntry.findById(req.params.id);

  if (!journalEntry) {
    res.status(404);
    throw new Error('Journal entry not found');
  }

  res.json(journalEntry);
});

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
// @access  Public
const updateJournalEntry = asyncHandler(async (req, res) => {
  const journalEntry = await JournalEntry.findById(req.params.id);

  if (!journalEntry) {
    res.status(404);
    throw new Error('Journal entry not found');
  }

  // Update fields
  journalEntry.content = req.body.content?.trim() || journalEntry.content;
  journalEntry.date = req.body.date || journalEntry.date;

  const updatedJournalEntry = await journalEntry.save();

  res.json(updatedJournalEntry);
});

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Public
const deleteJournalEntry = asyncHandler(async (req, res) => {
  const journalEntry = await JournalEntry.findById(req.params.id);

  if (!journalEntry) {
    res.status(404);
    throw new Error('Journal entry not found');
  }

  await JournalEntry.deleteOne({ _id: req.params.id });

  res.json({ message: 'Journal entry removed' });
});

// @desc    Get journal entry for today (optionally filtered by user)
// @route   GET /api/journal/today
// @access  Public
const getTodayJournalEntry = asyncHandler(async (req, res) => {
  const { user } = req.query;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let query = {
    date: { $gte: today, $lt: tomorrow }
  };
  
  if (user) {
    query.user = user;
  }

  const journalEntry = await JournalEntry.findOne(query).sort({ date: -1 });

  if (!journalEntry) {
    return res.json(null);
  }

  res.json(journalEntry);
});

export {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry,
  getTodayJournalEntry,
};
