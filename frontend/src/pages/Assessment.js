// pages/Assessment.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      text: "How often have you felt little interest or pleasure in doing things?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 2,
      text: "How often have you felt down, depressed, or hopeless?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 3,
      text: "How often have you had trouble falling or staying asleep, or sleeping too much?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 4,
      text: "How often have you felt tired or had little energy?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 5,
      text: "How often have you had poor appetite or overeaten?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    Object.values(answers).forEach(answer => {
      score += ["Not at all", "Several days", "More than half the days", "Nearly every day"].indexOf(answer);
    });
    return score;
  };

  const getResultDetails = (score) => {
    if (score <= 5) return { 
        title: "Balanced State", 
        message: "Your responses suggest minimal symptoms of depression. You seem to be maintaining a healthy emotional balance.", 
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    };
    if (score <= 10) return { 
        title: "Mild Challenges", 
        message: "Your responses suggest mild symptoms. It might be helpful to practice some stress management techniques.", 
        color: "text-amber-600",
        bg: "bg-amber-50"
    };
    if (score <= 15) return { 
        title: "Moderate Strain", 
        message: "Your responses suggest moderate symptoms. Consider speaking with someone you trust or a professional.", 
        color: "text-orange-600",
        bg: "bg-orange-50"
    };
    return { 
        title: "Significant Needs", 
        message: "Your responses suggest severe symptoms. We strongly recommend reaching out to a mental health professional.", 
        color: "text-rose-600",
        bg: "bg-rose-50"
    };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-serene-50 pt-28 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-serene-200/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-serene-300/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-xl w-full">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-serene-900/5 border border-serene-100"
            >
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-serene-400 uppercase tracking-widest">Question {currentQuestion + 1} of {questions.length}</span>
                  <Activity size={18} className="text-serene-500" />
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-serene-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-serene-700" 
                  />
                </div>
              </div>

              <h2 className="text-2xl font-serif font-bold text-serene-900 mb-8 leading-relaxed">
                {questions[currentQuestion].text}
              </h2>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-6 bg-serene-50/50 rounded-2xl border-2 border-transparent hover:border-serene-400 hover:bg-white transition-all duration-300 flex items-center justify-between group"
                  >
                    <span className="font-medium text-serene-850">{option}</span>
                    <ArrowRight size={18} className="text-serene-300 group-hover:text-serene-700 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-widest ${currentQuestion === 0 ? 'text-serene-200 cursor-not-allowed' : 'text-serene-400 hover:text-serene-700 transition-colors'}`}
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-serene-900/5 border border-serene-100 text-center"
            >
              <div className="w-20 h-20 bg-serene-700 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                <CheckCircle2 size={40} />
              </div>
              
              <h2 className="text-4xl font-serif font-bold text-serene-900 mb-4">Assessment Complete</h2>
              <p className="text-serene-500 mb-10 italic">A small step towards understanding yourself better.</p>

              <div className={`p-8 rounded-[2.5rem] mb-10 ${getResultDetails(calculateScore()).bg}`}>
                <h3 className={`text-2xl font-serif font-bold mb-4 ${getResultDetails(calculateScore()).color}`}>
                    {getResultDetails(calculateScore()).title}
                </h3>
                <p className="text-serene-700 leading-relaxed italic">
                    {getResultDetails(calculateScore()).message}
                </p>
              </div>

              <div className="bg-serene-50 p-6 rounded-[2rem] border border-serene-100 flex items-start space-x-4 text-left mb-10">
                <AlertCircle size={24} className="text-serene-400 shrink-0" />
                <p className="text-xs text-serene-500 leading-relaxed font-medium">
                  <strong>Important:</strong> This assessment is a tool for self-reflection and not a clinical diagnosis. For a formal evaluation, please contact a licensed professional.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers({});
                    setShowResults(false);
                  }}
                  className="flex-1 py-5 border-2 border-serene-100 rounded-full font-bold text-serene-800 hover:bg-serene-50 transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshCcw size={18} />
                  <span>Retake</span>
                </button>
                <Link
                  to="/stress-management"
                  className="flex-1 py-5 bg-serene-700 text-white rounded-full font-bold shadow-xl hover:bg-serene-850 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore Tools</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assessment;