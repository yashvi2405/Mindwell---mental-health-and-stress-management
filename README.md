# Mindwell

Mindwell is a premium, beautifully designed digital sanctuary for mental wellness and emotional calibration. Grounded in evidence-based observation tools and styled with a serene, organic sage green and cream aesthetic, it provides users with a comprehensive set of resources to track their emotional state, manage daily stress, and receive mindful guidance.

## Key Features

- **Aura Tracking (Mood Tracker)**: A minimalist, private system to log emotional states and notes daily, complete with dynamic visualization statistics. Supports guest local storage and user databases.
- **Stress Sanctuary (Decompress)**:
  - *Ambient Sound Mixer*: Layer high-fidelity, playable nature sounds (rain, forest stream, ocean waves, campfire crackle) to create your ideal sanctuary.
  - *Meditation Timer*: Customizable timers (5, 10, or 20 minutes) for mindfulness sessions.
  - *4-4-6 Breathing Rhythm*: An organic visual breathing guide to reset the nervous system.
  - *Thought Journaling*: A private space to unload reflections and journal daily.
- **Self-Reflective Assessment**: A validated observation questionnaire that estimates emotional strain (anxiety/depression severity) with suggestions on next steps.
- **Companion AI**: A judgment-free chatbot powered by Groq LLM API for secure, empathetic guidance.
- **Confidential and Secure**: Support for anonymous guest usage via localStorage and database syncing for authenticated profiles.

## Technology Stack

- **Frontend**: React (v19), Tailwind CSS, Framer Motion (for premium transitions), Lucide React (for icons)
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Deployment**: Vercel ready (monorepo settings)

---

## Getting Started (Local Development)

The repository is structured as a monorepo containing `frontend` and `backend` directories.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- Local MongoDB running, or a MongoDB Atlas cloud connection URI.

### 1. Set Up the Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/mindwell
   PORT=5000
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret
   GROQ_API_KEY=your_groq_api_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The server runs by default on `http://localhost:5000`.*

### 2. Set Up the Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
   *The client will open in your browser on `http://localhost:3000`.*

---



