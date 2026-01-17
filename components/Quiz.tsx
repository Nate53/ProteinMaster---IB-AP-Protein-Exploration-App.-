import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Brain, Check, X, Loader2 } from 'lucide-react';

interface QuizProps {
  topic: string; // e.g., 'Protein Structure', 'Translation'
}

const Quiz: React.FC<QuizProps> = ({ topic }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const qs = await generateQuizQuestions(topic, 'IB');
      setQuestions(qs);
      setLoading(false);
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === questions[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
        <p>Generating smart questions with Gemini AI...</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-lg mx-auto animate-fade-in">
        <Brain className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-lg mb-6">You scored <span className="font-bold text-indigo-600">{score}</span> out of <span className="font-bold">{questions.length}</span></p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Try Another Topic
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Question {currentQIndex + 1}/{questions.length}</span>
        <span className="text-sm font-semibold text-indigo-600">{topic}</span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          let optionClass = "w-full p-4 text-left rounded-lg border-2 transition-all font-medium ";
          
          if (selectedOption === null) {
            optionClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
          } else {
            if (idx === currentQuestion.correctAnswer) {
              optionClass += "border-green-500 bg-green-50 text-green-800";
            } else if (idx === selectedOption) {
              optionClass += "border-red-500 bg-red-50 text-red-800";
            } else {
              optionClass += "border-slate-100 text-slate-400 opacity-50";
            }
          }

          return (
            <button 
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={selectedOption !== null}
              className={optionClass}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {selectedOption !== null && idx === currentQuestion.correctAnswer && <Check className="w-5 h-5"/>}
                {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctAnswer && <X className="w-5 h-5"/>}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
          <p className="font-bold text-slate-700 mb-1">Explanation:</p>
          <p className="text-slate-600 text-sm">{currentQuestion.explanation}</p>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={nextQuestion}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
            >
              {currentQIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
