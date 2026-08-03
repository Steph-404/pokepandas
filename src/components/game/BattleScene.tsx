import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment as DreiEnvironment, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";

export function BattleScene() {
  const { camera } = useThree();

  useEffect(() => {
    // Cinematic camera behind the player's monster (moved back to Z=10 to avoid clipping)
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 1, -2);
  }, [camera]);

  useFrame(() => {
    // Cinematic camera drift
    camera.position.x = Math.sin(performance.now() / 2000) * 0.5;
    camera.lookAt(0, 1, -2);
  });

  return (
    <group>
      {/* Grassy Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4d9e3f" />
      </mesh>

      <BattleProp path="/models/environment/nature/Tree.glb" position={[-5, 0, -8]} scale={2} />
      <BattleProp path="/models/environment/nature/Tree.glb" position={[5, 0, -10]} scale={2.5} />
      <BattleProp path="/models/environment/nature/Tall Grass.glb" position={[-2, 0, -3]} scale={1} />
      <BattleProp path="/models/environment/nature/Tall Grass.glb" position={[3, 0, -5]} scale={1} />

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffa500" />

      {/* Battle Platform */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[8, 8, 1, 32]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>

      {/* Player Monster (Left) */}
      <BattleMonster 
        path="/models/monsters/Alpaking.glb" 
        position={[-3, 0, 1]} 
        rotation={[0, Math.PI, 0]} 
        isPlayer={true} 
        scale={0.6}
      />
      
      {/* Enemy Monster (Right) */}
      <BattleMonster 
        path="/models/monsters/Alien.glb" 
        position={[3, 0, -3]} 
        rotation={[0, 0, 0]} 
        isPlayer={false} 
      />
    </group>
  );
}

function BattleProp({ path, position, scale = 1 }: { path: string; position: [number, number, number]; scale?: number }) {
  const { scene } = useGLTF(path);
  const clone = scene.clone();
  return <primitive object={clone} position={position} scale={scale} castShadow receiveShadow />;
}

function BattleMonster({ path, position, rotation = [0, 0, 0], scale, isPlayer = false }: { path: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; isPlayer?: boolean }) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  const playerAnimation = useGameStore((state) => state.playerAnimation);
  const enemyAnimation = useGameStore((state) => state.enemyAnimation);

  const currentAnim = isPlayer ? playerAnimation : enemyAnimation;

  useEffect(() => {
    if (!actions) return;
    
    // Find the closest matching animation key
    let animKey = Object.keys(actions)[0]; // fallback
    if (currentAnim === "Idle") {
      animKey = Object.keys(actions).find(k => k.toLowerCase().includes('idle')) || animKey;
    } else if (currentAnim === "Attack") {
      animKey = Object.keys(actions).find(k => k.toLowerCase().includes('bite') || k.toLowerCase().includes('headbutt') || k.toLowerCase().includes('punch') || k.toLowerCase().includes('attack')) || animKey;
    }

    const action = actions[animKey];
    if (action) {
      action.reset().fadeIn(0.2).play();
      // Slow down idle bobbing, play attack at normal speed
      action.setEffectiveTimeScale(currentAnim === "Idle" ? 0.5 : 1.0);
      return () => {
        action.fadeOut(0.2);
      };
    }
  }, [currentAnim, actions]);

  // Do NOT clone skinned meshes in React Three Fiber to avoid invisibility bugs!
  return (
    <primitive 
      object={scene} 
      position={position} 
      rotation={rotation} 
      castShadow 
      receiveShadow 
      scale={scale !== undefined ? scale : (isPlayer ? 1.5 : 1.2)}
    />
  );
}
