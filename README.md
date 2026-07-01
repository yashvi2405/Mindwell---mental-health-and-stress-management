# Mindwell

Mindwell is a premium, beautifully designed digital sanctuary for mental wellness and emotional calibration. Grounded in evidence-based observation tools and styled with a serene, organic sage green and cream aesthetic, it provides users with a comprehensive set of resources to track their emotional state, manage daily stress, and receive mindful guidance.

## Premium Sanctuary Features

### 🌟 Personal Growth & Mood Aura
- **Aura Tracking (Mood Tracker)**: A minimalist, private system to log emotional states and notes daily, complete with dynamic visualization statistics. Supports guest local storage and user databases.
- **Monthly Aura Grid Calendar**: A monthly mood visualization calendar highlighting logged emotion gradients, integrated with a **Sanctuary Insight** analytics engine that summarizes emotional cycles and suggests therapeutic coping actions.
- **Daily Affirmations**: A positive inspiration header that rotates 31 unique, non-repeating mindful intentions.
- **Dynamic Milestone Badges**: Progress indicators that award wellness badges (e.g. *First Light*, *Inner Awareness*, *Reflection Explorer*, *Focus Anchor*, *Focused Intent*) based on your logs and journal activity.

### 🧘 Stress Sanctuary (Decompress)
- **Breathing & Meditation**: Interactive custom timers and a visual 4-4-6 paced breathing guide to regulate the autonomic nervous system.
- **Custom Soundscape Mixer**: Layer tranquil nature elements (Rain, Campfire, Waves) or paste your own **YouTube or Spotify** playlists to run custom focus tracks inside the player.
- **Mindful Focus Checklist**: A built-in tasks and goals to-do tracker to ease mental load and structure daily intentions.
- **Thought Journaling**: A private reflection space supporting live edits and secure deletion of past entries.

### 🤝 Support & Connection
- **Support Community Forum**: A non-toxic support network space to publish posts, write replies, like entries, and filter post categories (general support vs. verified therapist advice).
- **Therapist Directory**: An interactive search index of certified clinical psychologists and coaches, fetched dynamically from MongoDB. Includes an online **Callback Scheduling Form** to book therapy inquiry callbacks.
- **Companion AI**: A secure, judgment-free conversational chatbot powered by Groq LLM API for empathetic coaching.
- **UK Password Authentication**: Upgraded login UI with password visibility toggle and strict 8-digit character requirement checks (uppercase, number, special character).

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



