import asyncHandler from 'express-async-handler';
import MoodEntry from '../models/moodModel.js';

// @desc    Create a new mood entry
// @route   POST /api/mood
// @access  Public (optional auth)
const createMoodEntry = asyncHandler(async (req, res) => {
  const { mood, note, date, user } = req.body;

  // Validate required fields
  if (!mood) {
    res.status(400);
    throw new Error('Mood is required');
  }

  // Create mood entry (user is optional)
  const moodEntry = await MoodEntry.create({
    user: user || null,
    mood,
    note: note || '',
    date: date || new Date(),
  });

  res.status(201).json(moodEntry);
});

// @desc    Get all mood entries (optionally filtered by user)
// @route   GET /api/mood
// @access  Public
const getMoodEntries = asyncHandler(async (req, res) => {
  const { startDate, endDate, limit, user } = req.query;

  let query = {};
  
  // Filter by user if provided
  if (user) {
    query.user = user;
  }

  // Add date range filter if provided
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const entries = await MoodEntry.find(query)
    .sort({ date: -1 })
    .limit(limit ? parseInt(limit) : 100);

  res.json(entries);
});

// @desc    Get mood entry by ID
// @route   GET /api/mood/:id
// @access  Public
const getMoodEntryById = asyncHandler(async (req, res) => {
  const moodEntry = await MoodEntry.findById(req.params.id);

  if (!moodEntry) {
    res.status(404);
    throw new Error('Mood entry not found');
  }

  res.json(moodEntry);
});

// @desc    Update a mood entry
// @route   PUT /api/mood/:id
// @access  Public
const updateMoodEntry = asyncHandler(async (req, res) => {
  const { mood, note } = req.body;

  const moodEntry = await MoodEntry.findById(req.params.id);

  if (!moodEntry) {
    res.status(404);
    throw new Error('Mood entry not found');
  }

  moodEntry.mood = mood || moodEntry.mood;
  moodEntry.note = note !== undefined ? note : moodEntry.note;

  const updatedMoodEntry = await moodEntry.save();
  res.json(updatedMoodEntry);
});

// @desc    Delete a mood entry
// @route   DELETE /api/mood/:id
// @access  Public
const deleteMoodEntry = asyncHandler(async (req, res) => {
  const moodEntry = await MoodEntry.findById(req.params.id);

  if (!moodEntry) {
    res.status(404);
    throw new Error('Mood entry not found');
  }

  await MoodEntry.deleteOne({ _id: req.params.id });
  res.json({ message: 'Mood entry removed' });
});

// @desc    Get mood stats (optionally filtered by user)
// @route   GET /api/mood/stats
// @access  Public
const getMoodStats = asyncHandler(async (req, res) => {
  const { days = 30, user } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  let query = {
    date: { $gte: startDate },
  };
  
  // Filter by user if provided
  if (user) {
    query.user = user;
  }

  const entries = await MoodEntry.find(query).sort({ date: 1 });

  // Calculate mood distribution
  const moodCounts = {
    excellent: 0,
    good: 0,
    okay: 0,
    bad: 0,
    terrible: 0,
  };

  entries.forEach((entry) => {
    moodCounts[entry.mood]++;
  });

  res.json({
    totalEntries: entries.length,
    moodCounts,
    entries,
  });
});

export {
  createMoodEntry,
  getMoodEntries,
  getMoodEntryById,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
};
