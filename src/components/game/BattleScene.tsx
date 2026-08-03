import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment as DreiEnvironment } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

export function BattleScene() {
  const { camera } = useThree();

  useEffect(() => {
    // Cinematic camera behind the player's monster
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 1, -5);
  }, [camera]);

  useFrame(() => {
    // Cinematic camera drift
    camera.position.x = Math.sin(performance.now() / 2000) * 0.5;
    camera.lookAt(0, 1, -5);
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

      {/* Player Monster (right in front of camera) */}
      <BattleMonster path="/models/monsters/Alpaking.glb" position={[0, 0, 3]} rotation={[0, Math.PI, 0]} isPlayer={true} />
      
      {/* Enemy Monster (farther back) */}
      <BattleMonster path="/models/monsters/Alien.glb" position={[0, 0, -3]} rotation={[0, 0, 0]} isPlayer={false} />
    </group>
  );
}

function BattleProp({ path, position, scale = 1 }: { path: string; position: [number, number, number]; scale?: number }) {
  const { scene } = useGLTF(path);
  const clone = scene.clone();
  return <primitive object={clone} position={position} scale={scale} castShadow receiveShadow />;
}

function BattleMonster({ path, position, rotation = [0, 0, 0], isPlayer = false }: { path: string; position: [number, number, number]; rotation?: [number, number, number]; isPlayer?: boolean }) {
  const { scene } = useGLTF(path);
  // Do NOT clone skinned meshes in React Three Fiber to avoid invisibility bugs!
  return (
    <primitive 
      object={scene} 
      position={position} 
      rotation={rotation} 
      castShadow 
      receiveShadow 
      scale={isPlayer ? 1.5 : 1.2}
    />
  );
}
