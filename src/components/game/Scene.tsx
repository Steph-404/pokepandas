import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Sky, Environment as DreiEnvironment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "./Player";
import { Environment } from "./Environment";
import { Pet } from "./Pet";
import { BattleScene } from "./BattleScene";
import { useGameStore } from "../../store/useGameStore";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];

export default function Scene() {
  const gameState = useGameStore((state) => state.gameState);

  return (
    <div className="absolute inset-0">
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ position: [10, 15, 10], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[10, 20, 10]}
            intensity={1.5}
            shadow-mapSize={[1024, 1024]}
          >
            <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
          </directionalLight>

          <Sky sunPosition={[10, 20, 10]} />
          <DreiEnvironment preset="sunset" />

          <Suspense fallback={null}>
            {gameState === "OVERWORLD" ? (
              <Physics>
                <Player />
                <Pet />
                <Environment />
              </Physics>
            ) : (
              <BattleScene />
            )}
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
