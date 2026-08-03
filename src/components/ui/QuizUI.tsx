import React, { useState, useEffect } from 'react';
import type { Question } from '../../data/questions';

interface QuizUIProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  onTimeout: () => void;
}

export const QuizUI: React.FC<QuizUIProps> = ({ question, onAnswer, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(25);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    // Reset state when question changes
    setTimeLeft(25);
    setSelectedOption(null);
  }, [question]);

  useEffect(() => {
    if (selectedOption !== null) return; // Stop timer if an answer was selected
    
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedOption, onTimeout]);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    setSelectedOption(index);
    
    const isCorrect = index === question.correctIndex;
    
    // Slight delay so the user sees what they selected
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1000);
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto font-sans">
      <div className="bg-[#fcf8e3] border-8 border-[#bca06b] rounded-2xl p-8 max-w-3xl w-full shadow-[8px_8px_0_rgba(0,0,0,0.5)] flex flex-col relative animate-fade-in">
        
        {/* Timer */}
        <div className="absolute -top-8 -right-8 bg-[#e47661] border-4 border-[#b84a38] rounded-full w-24 h-24 flex items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,0.3)] animate-bounce">
          <span className="text-white text-4xl font-black drop-shadow-md">{timeLeft}</span>
        </div>

        {/* Citation Badge */}
        <div className="bg-[#d4cbb8] text-[#6b5d4f] font-bold text-sm px-4 py-1 rounded-full self-start mb-4 border-2 border-[#bca06b]">
          {question.citation}
        </div>

        {/* Question Text */}
        <h2 className="text-3xl font-bold text-[#4a3f35] mb-8 leading-snug">
          {question.text}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            let buttonStyle = "bg-[#a6b1b8] text-white border-[#768188] hover:bg-[#96a1a8]";
            
            if (selectedOption !== null) {
              if (index === question.correctIndex) {
                buttonStyle = "bg-[#7bc86c] text-white border-[#4a983c]"; // Correct answer is green
              } else if (index === selectedOption) {
                buttonStyle = "bg-[#e47661] text-white border-[#b84a38]"; // Wrong selected is red
              } else {
                buttonStyle = "bg-[#d4cbb8] text-[#8c7b66] border-[#bca06b] opacity-50"; // Others are faded
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
                className={`py-4 px-6 rounded-xl font-bold text-lg border-b-4 transition-all shadow-sm flex items-center gap-4 ${buttonStyle} ${selectedOption === null ? 'active:border-b-0 active:translate-y-1' : ''}`}
              >
                <span className="bg-black/20 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-left leading-tight font-mono">{option}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
