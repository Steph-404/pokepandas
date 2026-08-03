import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const StartScreenUI = () => {
  const [slide, setSlide] = useState(0);
  const setGameState = useGameStore((state) => state.setGameState);

  const slides = [
    {
      title: "Welcome to PokéPandas!",
      content: "Embark on an educational journey to master the art of Data Science with Pandas! You will explore the village, encounter wild monsters, and battle them using your programming knowledge.",
      image: "🎓"
    },
    {
      title: "How to Play",
      content: "Use W, A, S, D on your keyboard to move your character around the 3D world. Your trusty companion will follow you wherever you go!",
      image: "⌨️"
    },
    {
      title: "Quiz Battles",
      content: "When you get close to a wild monster, a Challenge button will appear. During combat, select 'Attack' to trigger a Pandas Quiz. You have 25 seconds to answer correctly to deal damage! If you get it wrong, or run out of time, the enemy attacks you!",
      image: "⚔️"
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      setGameState('OVERWORLD');
    }
  };

  const handleBack = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#8c7050]/80 backdrop-blur-sm font-sans">
      <div className="bg-[#fcf8e3] border-8 border-[#bca06b] rounded-2xl p-8 max-w-2xl w-full shadow-[8px_8px_0_rgba(0,0,0,0.3)] text-center animate-fade-in relative overflow-hidden">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-colors duration-300 ${i === slide ? 'bg-[#e47661] border-2 border-[#b84a38]' : 'bg-[#d4cbb8] border-2 border-[#bca06b]'}`}
            />
          ))}
        </div>

        <div className="text-6xl mb-6">{slides[slide].image}</div>
        
        <h1 className="text-4xl font-bold text-[#4a3f35] mb-6 tracking-wide drop-shadow-sm">
          {slides[slide].title}
        </h1>
        
        <p className="text-xl text-[#6b5d4f] mb-12 leading-relaxed min-h-[100px]">
          {slides[slide].content}
        </p>
        
        <div className="flex justify-between items-center px-4">
          <button 
            onClick={handleBack}
            className={`px-8 py-3 rounded-xl font-bold text-lg border-b-4 transition-all uppercase tracking-widest
              ${slide === 0 
                ? 'bg-[#d4cbb8] text-[#8c7b66] border-[#bca06b] opacity-50 cursor-not-allowed' 
                : 'bg-[#a6b1b8] hover:bg-[#96a1a8] text-white border-[#768188] active:border-b-0 active:translate-y-1 shadow-sm'
              }`}
            disabled={slide === 0}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-[#7bc86c] hover:bg-[#6ab85c] text-white px-10 py-3 rounded-xl font-bold text-xl border-b-4 border-[#4a983c] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-widest shadow-sm"
          >
            {slide === slides.length - 1 ? "Start Adventure!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};
