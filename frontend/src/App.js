// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import StressManagement from './pages/StressManagement';
import MoodTracker from './pages/MoodTracker';
import Chatbot from './pages/Chatbot';
import About from './pages/About';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen bg-serene-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              
              {/* Public Access Features */}
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/stress-management" element={<StressManagement />} />
              <Route path="/mood-tracker" element={<MoodTracker />} />
              
              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <PrivateRoute>
                    <Chatbot />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;