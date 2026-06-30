import express from 'express';
import { runGemini } from '../config/groqApi.js';

const router = express.Router();

// @desc    Chat with AI bot
// @route   POST /api/chat
// @access  Public (or you can protect it with auth middleware)
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      res.status(400);
      throw new Error('Please provide a message');
    }

    // Call Groq API (system context is set in the API config)
    const response = await runGemini(prompt);
    
    res.json({ 
      response: response,
      success: true 
    });
  } catch (error) {
    console.error('Error in chatbot route:', error);
    res.status(500).json({ 
      error: 'Failed to process your message. Please try again.',
      success: false 
    });
  }
});

export default router;
