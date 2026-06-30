import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { createMoodEntry } from './controllers/moodController.js';

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const req = {
    body: {
      mood: 'good',
      note: 'Feeling fine',
      user: '6a43902bcfc717897c3e315c'
    }
  };

  const res = {
    status: (code) => {
      console.log('Response Status:', code);
      return res;
    },
    json: (data) => {
      console.log('Response JSON:', data);
    }
  };

  try {
    await createMoodEntry(req, res);
    console.log('Execution completed successfully!');
  } catch (err) {
    console.error('Execution failed with error:', err);
  }
  process.exit(0);
}

test();
