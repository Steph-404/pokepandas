import GameUI from "./components/ui/GameUI";
import BattleUI from "./components/ui/BattleUI";
import Scene from "./components/game/Scene";
import { useGameStore } from "./store/useGameStore";

function App() {
  const gameState = useGameStore((state) => state.gameState);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#87CEEB]">
      {/* 3D World */}
      <Scene />
      
      {/* 2D UI Overlays */}
      {gameState === "OVERWORLD" && <GameUI />}
      {gameState === "BATTLE" && <BattleUI />}
    </main>
  );
}

export default App;
