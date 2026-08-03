import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { QuizUI } from "./QuizUI";
import { getRandomQuestion } from "../../data/questions";
import type { Question } from "../../data/questions";

export default function BattleUI() {
  const { 
    activeMonster, enemyMonster, setGameState, 
    damageActiveMonster, damageEnemyMonster, healPlayer, 
    setPlayerAnimation, setEnemyAnimation,
    battleState, setBattleState 
  } = useGameStore();
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const ATTACK_NAMES = ["Scratch", "Tackle", "Bite", "Headbutt"];
  const getRandomAttack = () => ATTACK_NAMES[Math.floor(Math.random() * ATTACK_NAMES.length)];

  const handleAttack = () => {
    if (!activeMonster || !enemyMonster || battleState !== 'PLAYER_INPUT') return;
    
    setCurrentQuestion(getRandomQuestion());
    setBattleState('QUIZ_ACTIVE');
  };

  const handleQuizResult = (isCorrect: boolean) => {
    if (!activeMonster || !enemyMonster) return;
    
    setBattleState('ANIMATING');
    
    if (isCorrect) {
      // Success condition: Player attacks, enemy takes damage
      const pAttack = getRandomAttack();
      setDialogMessage(`Correct! ${activeMonster.name} used ${pAttack}!`);
      setPlayerAnimation('Attack');
      
      setTimeout(() => {
        setPlayerAnimation('Idle');
        damageEnemyMonster(5);
        
        // Win condition check
        const storeState = useGameStore.getState();
        if (storeState.enemyMonster && storeState.enemyMonster.hp - 5 <= 0) {
          const isTutorial = !storeState.hasCompletedTutorial;
          if (isTutorial) {
            setDialogMessage(`Tutorial Complete! Transporting to Main Village...`);
          } else {
            setDialogMessage(`Wild ${storeState.enemyMonster.name} fainted!`);
          }
          
          setTimeout(() => {
            healPlayer();
            if (isTutorial) {
              storeState.completeTutorial();
            }
            setGameState("OVERWORLD");
          }, 2000);
          return;
        }

        // Return to player turn
        setTimeout(() => {
          setDialogMessage(null);
          setBattleState('PLAYER_INPUT');
        }, 1500);
      }, 1000);
    } else {
      // Failure/Timeout condition: Player loses turn, enemy attacks
      const eAttack = getRandomAttack();
      setDialogMessage(`Wrong! Wild ${enemyMonster.name} countered with ${eAttack}!`);
      setEnemyAnimation('Attack');
      
      setTimeout(() => {
        setEnemyAnimation('Idle');
        damageActiveMonster(4);
        
        // Lose condition check
        const storeState = useGameStore.getState();
        if (storeState.activeMonster && storeState.activeMonster.hp - 4 <= 0) {
          setDialogMessage(`${storeState.activeMonster.name} fainted! You blacked out...`);
          setTimeout(() => {
             healPlayer();
             setGameState("OVERWORLD");
          }, 2000);
          return;
        }

        // Return to player turn
        setTimeout(() => {
          setDialogMessage(null);
          setBattleState('PLAYER_INPUT');
        }, 1500);
      }, 1000);
    }
  };

  const handleFlee = () => {
    setDialogMessage("Got away safely!");
    setTimeout(() => {
      healPlayer();
      setGameState("OVERWORLD");
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between pointer-events-none p-8 font-sans">
      
      {/* Top Section: Enemy Stats */}
      <div className="flex justify-end w-full max-w-4xl mx-auto mt-6">
        {enemyMonster && (
          <div className="bg-[#fcf8e3] border-4 border-[#bca06b] rounded-lg p-4 w-80 shadow-[4px_4px_0_rgba(0,0,0,0.2)] relative pointer-events-auto">
            <div className="flex justify-between items-center text-[#4a3f35] font-bold text-xl mb-3 tracking-wide">
              <span>{enemyMonster.name}</span>
              <span className="text-[#8c7b66] text-sm">Lv {enemyMonster.level}</span>
            </div>
            <div className="w-full bg-[#d4cbb8] h-4 rounded-full overflow-hidden border-2 border-[#8c7b66] shadow-inner">
              <div 
                className="bg-[#7bc86c] h-full transition-all duration-500"
                style={{ width: `${Math.max(0, (enemyMonster.hp / enemyMonster.maxHp)) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Player Stats & Actions/Dialog */}
      <div className="w-full max-w-4xl mx-auto mb-6 flex flex-col gap-6">
        
        {/* Player Stats */}
        {activeMonster && (
          <div className="self-start bg-[#fcf8e3] border-4 border-[#bca06b] rounded-lg p-4 w-80 shadow-[4px_4px_0_rgba(0,0,0,0.2)] relative pointer-events-auto">
            <div className="flex justify-between items-center text-[#4a3f35] font-bold text-xl mb-3 tracking-wide">
              <span>{activeMonster.name}</span>
              <span className="text-[#8c7b66] text-sm">Lv {activeMonster.level}</span>
            </div>
            <div className="w-full bg-[#d4cbb8] h-4 rounded-full overflow-hidden border-2 border-[#8c7b66] shadow-inner">
              <div 
                className="bg-[#7bc86c] h-full transition-all duration-500"
                style={{ width: `${Math.max(0, (activeMonster.hp / activeMonster.maxHp)) * 100}%` }}
              />
            </div>
            <div className="text-right text-sm text-[#4a3f35] font-bold mt-2 tracking-wider">
              {Math.max(0, activeMonster.hp)} / {activeMonster.maxHp}
            </div>
          </div>
        )}

        {/* Dialog or Actions */}
        <div className="bg-[#fcf8e3] border-4 border-[#bca06b] rounded-xl p-6 shadow-[6px_6px_0_rgba(0,0,0,0.2)] pointer-events-auto w-full min-h-[140px] flex items-center">
          {dialogMessage ? (
            <div className="text-[#4a3f35] text-2xl font-bold tracking-wide animate-fade-in w-full">
              {dialogMessage}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 ml-auto">
              <button 
                onClick={handleAttack}
                disabled={battleState !== 'PLAYER_INPUT'}
                className="bg-[#e47661] hover:bg-[#d55f4a] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#b84a38] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Attack
              </button>
              <button 
                disabled={battleState !== 'PLAYER_INPUT'}
                className="bg-[#4a8ebf] hover:bg-[#3a7eaf] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#296896] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Items
              </button>
              <button 
                disabled={battleState !== 'PLAYER_INPUT'}
                className="bg-[#7bc86c] hover:bg-[#6ab85c] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#4a983c] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Switch
              </button>
              <button 
                onClick={handleFlee}
                disabled={battleState !== 'PLAYER_INPUT'}
                className="bg-[#a6b1b8] hover:bg-[#96a1a8] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#768188] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Flee
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Quiz Overlay */}
      {battleState === 'QUIZ_ACTIVE' && currentQuestion && (
        <QuizUI 
          question={currentQuestion} 
          onAnswer={handleQuizResult}
          onTimeout={() => {
            setDialogMessage("Time's up!");
            handleQuizResult(false);
          }}
        />
      )}
    </div>
  );
}
