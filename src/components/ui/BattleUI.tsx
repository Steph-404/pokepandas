import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";

export default function BattleUI() {
  const { activeMonster, enemyMonster, setGameState, damageActiveMonster, damageEnemyMonster, healPlayer, setPlayerAnimation, setEnemyAnimation } = useGameStore();
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  const ATTACK_NAMES = ["Scratch", "Tackle", "Bite", "Headbutt"];
  const getRandomAttack = () => ATTACK_NAMES[Math.floor(Math.random() * ATTACK_NAMES.length)];

  const handleAttack = () => {
    if (!activeMonster || !enemyMonster) return;
    
    // Player Turn
    const pAttack = getRandomAttack();
    setDialogMessage(`${activeMonster.name} used ${pAttack}!`);
    setPlayerAnimation('Attack');
    setTimeout(() => setPlayerAnimation('Idle'), 1000);
    
    setTimeout(() => {
      damageEnemyMonster(5);
      
      // Check if enemy died
      if (enemyMonster.hp - 5 <= 0) {
        setDialogMessage(`Wild ${enemyMonster.name} fainted!`);
        setTimeout(() => {
          healPlayer();
          setGameState("OVERWORLD");
        }, 2000);
        return;
      }

      // Enemy Turn
      setTimeout(() => {
        const eAttack = getRandomAttack();
        setDialogMessage(`Wild ${enemyMonster.name} used ${eAttack}!`);
        setEnemyAnimation('Attack');
        setTimeout(() => setEnemyAnimation('Idle'), 1000);
        
        setTimeout(() => {
          damageActiveMonster(4);
          
          if (activeMonster.hp - 4 <= 0) {
            setDialogMessage(`${activeMonster.name} fainted! You blacked out...`);
            setTimeout(() => {
               healPlayer();
               setGameState("OVERWORLD");
            }, 2000);
            return;
          }

          // Reset turn
          setTimeout(() => setDialogMessage(null), 1500);
        }, 1500);
      }, 1500);
    }, 1500);
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
                className="bg-[#e47661] hover:bg-[#d55f4a] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#b84a38] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none"
              >
                Attack
              </button>
              <button 
                className="bg-[#4a8ebf] hover:bg-[#3a7eaf] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#296896] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none"
              >
                Items
              </button>
              <button 
                className="bg-[#7bc86c] hover:bg-[#6ab85c] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#4a983c] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none"
              >
                Switch
              </button>
              <button 
                onClick={handleFlee}
                className="bg-[#a6b1b8] hover:bg-[#96a1a8] text-white font-bold py-4 px-6 rounded-lg border-b-4 border-[#768188] active:border-b-0 active:translate-y-1 transition-all text-center uppercase tracking-widest text-lg focus:outline-none"
              >
                Flee
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
