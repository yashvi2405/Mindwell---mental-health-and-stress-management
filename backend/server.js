import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import moodRoutes from './routes/moodRoutes.js';

const port = process.env.PORT || 5000;
const app = express();

// First connect DB once, not on every request
await connectDB();

// CORS configuration - Allow multiple origins for development and production
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.startsWith('http://localhost')) {
        return callback(null, true);
      }

      // Allow all Vercel deployments (preview + production)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Allow Render deployments
      if (origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }

      // Allow explicit CLIENT_URL from environment
      if (origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);

export default app;
