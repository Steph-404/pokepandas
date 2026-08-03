import { useGameStore } from "../../store/useGameStore";

export default function GameUI() {
  const { activeMonster, locationName, gameState } = useGameStore();

  if (gameState !== "OVERWORLD") return null;

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex justify-between items-start font-sans">
      {/* Player Status - Top Left */}
      {activeMonster && (
        <div className="bg-[#fcf8e3] border-4 border-[#bca06b] rounded-lg p-3 w-64 shadow-lg flex flex-col gap-2 pointer-events-auto relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#bca06b]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#bca06b]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#bca06b]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#bca06b]" />

          <div className="flex justify-between items-center text-[#4a3f35] font-bold text-sm">
            <span>{activeMonster.name}</span>
            <span>Lv {activeMonster.level}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#6ea6d8]" />
            <div className="flex-1">
              <div className="w-full bg-[#e0d6b8] h-3 rounded-full overflow-hidden border border-[#bca06b]">
                <div 
                  className="bg-[#7bc86c] h-full transition-all duration-300"
                  style={{ width: `${(activeMonster.hp / activeMonster.maxHp) * 100}%` }}
                />
              </div>
              <div className="text-right text-xs text-[#8c7a6b] font-semibold mt-1">
                {activeMonster.hp}/{activeMonster.maxHp}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Banner - Top Right */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        <div className="bg-[#fcf8e3] border-4 border-[#bca06b] rounded-lg p-3 w-64 shadow-lg text-center relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#bca06b]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#bca06b]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#bca06b]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#bca06b]" />
          
          <h2 className="text-[#4a3f35] font-bold text-lg">{locationName}</h2>
          <div className="flex items-center justify-center gap-1 text-[#bca06b] font-bold text-sm">
            <div className="w-3 h-3 rounded-full bg-[#d4af37]" /> 2,500
          </div>
        </div>
        <div className="bg-[#fcf8e3] border-2 border-[#e0d6b8] rounded p-2 text-xs text-[#8c7a6b] shadow font-semibold">
          Discovered: {locationName}
        </div>
      </div>
    </div>
  );
}
