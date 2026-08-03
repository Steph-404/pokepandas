
import Scene from './components/game/Scene';
import BattleUI from './components/ui/BattleUI';
import { OverworldUI } from './components/ui/OverworldUI';
import { StartScreenUI } from './components/ui/StartScreenUI';
import { useGameStore } from './store/useGameStore';
import GameUI from "./components/ui/GameUI";

function App() {
  const gameState = useGameStore((state) => state.gameState);

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden select-none">
      {/* 3D World */}
      <Scene />
      
      {/* 2D UI Overlays */}
      {gameState === 'START_SCREEN' && <StartScreenUI />}
      {gameState === "OVERWORLD" && (
        <>
          <GameUI />
          <OverworldUI />
        </>
      )}
      {gameState === "BATTLE" && <BattleUI />}
    </div>
  );
}

export default App;
