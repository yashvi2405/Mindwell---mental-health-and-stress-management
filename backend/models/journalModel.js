import mongoose from 'mongoose';

const journalEntrySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
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
journalEntrySchema.index({ user: 1, date: -1 });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
