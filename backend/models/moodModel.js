import mongoose from 'mongoose';

const moodEntrySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mood: {
      type: String,
      required: true,
      enum: ['excellent', 'good', 'okay', 'bad', 'terrible'],
    },
    note: {
      type: String,
      maxlength: 500,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for efficient querying by user and date
moodEntrySchema.index({ user: 1, date: -1 });

const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);

export default MoodEntry;
