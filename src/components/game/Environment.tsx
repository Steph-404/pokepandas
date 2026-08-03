import { useState } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { RigidBody, CylinderCollider } from "@react-three/rapier";
import { useGameStore } from "../../store/useGameStore";
import * as THREE from "three";

const MONSTERS = [
  { name: "Alpaking", path: "/models/monsters/Alpaking.glb", position: [10, 0, 10] },
  { name: "Alien", path: "/models/monsters/Alien.glb", position: [-10, 0, -10] },
];

export function Environment() {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[100, 1, 100]} />
          <meshStandardMaterial color="#3a822b" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Town Center */}
      <DecorativeProp path="/models/environment/medieval/Well.glb" position={[0, 0, 0]} />
      
      {/* Central Paths */}
      <DecorativeProp path="/models/environment/medieval/Path Straight.glb" position={[0, 0, 4]} scale={2} />
      <DecorativeProp path="/models/environment/medieval/Path Straight.glb" position={[0, 0, -4]} scale={2} />
      <DecorativeProp path="/models/environment/medieval/Path Straight.glb" position={[-4, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={2} />
      <DecorativeProp path="/models/environment/medieval/Path Straight.glb" position={[4, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={2} />

      {/* Tightly clustered buildings */}
      <DecorativeProp path="/models/environment/medieval/Fantasy House-BH2XHWUNmF.glb" position={[-8, 0, 5]} rotation={[0, Math.PI / 2, 0]} scale={2} />
      <DecorativeProp path="/models/environment/medieval/Fantasy House-dcPho4SUA3.glb" position={[8, 0, 5]} rotation={[0, -Math.PI / 2, 0]} scale={2} />
      <DecorativeProp path="/models/environment/medieval/Fantasy Inn.glb" position={[-8, 0, -5]} rotation={[0, Math.PI / 2, 0]} scale={2} />
      <DecorativeProp path="/models/environment/medieval/Blacksmith.glb" position={[8, 0, -5]} rotation={[0, -Math.PI / 2, 0]} scale={2} />

      {/* Props around the well */}
      <DecorativeProp path="/models/environment/medieval/Market Stand.glb" position={[-4, 0, 3]} rotation={[0, Math.PI/4, 0]} scale={1.5} />
      <DecorativeProp path="/models/environment/medieval/Bench.glb" position={[3, 0, -3]} rotation={[0, -Math.PI / 4, 0]} scale={1.2} />
      <DecorativeProp path="/models/environment/medieval/Bonfire.glb" position={[-4, 0, -3]} scale={1.2} />

      {/* Fences outlining the village square */}
      <DecorativeProp path="/models/environment/medieval/Fence.glb" position={[-5, 0, -8]} rotation={[0, 0, 0]} scale={1.5} />
      <DecorativeProp path="/models/environment/medieval/Fence.glb" position={[5, 0, -8]} rotation={[0, 0, 0]} scale={1.5} />

      {/* Trees framing the village */}
      <DecorativeProp path="/models/environment/nature/Tree.glb" position={[-12, 0, -12]} scale={2} />
      <DecorativeProp path="/models/environment/nature/Pine.glb" position={[12, 0, -12]} scale={2.5} />
      <DecorativeProp path="/models/environment/nature/Tree-t9KbsfYdXz.glb" position={[-12, 0, 12]} scale={2} />
      <DecorativeProp path="/models/environment/nature/Bush.glb" position={[-5, 0, 8]} scale={1.5} />
      <DecorativeProp path="/models/environment/nature/Bush with Flowers.glb" position={[5, 0, 8]} scale={1.5} />
      <DecorativeProp path="/models/environment/nature/Tall Grass.glb" position={[2, 0, 8]} scale={1} />
      <DecorativeProp path="/models/environment/nature/Tall Grass.glb" position={[-2, 0, -8]} scale={1} />

      {MONSTERS.map((monster, i) => (
        <MonsterEncounter 
          key={i} 
          path={monster.path} 
          name={monster.name} 
          position={new THREE.Vector3(...monster.position)} 
        />
      ))}
    </group>
  );
}

function DecorativeProp({ path, position, rotation = [0, 0, 0], scale = 1 }: { path: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  const { scene } = useGLTF(path);
  const clone = scene.clone();
  
  return (
    <RigidBody type="fixed" colliders="hull" position={position} rotation={rotation}>
      <primitive object={clone} scale={scale} castShadow receiveShadow />
    </RigidBody>
  );
}

function MonsterEncounter({ path, position, name }: { path: string; position: THREE.Vector3; name: string }) {
  const { scene } = useGLTF(path);
  const clone = scene.clone();
  const setGameState = useGameStore(state => state.setGameState);
  const setEnemyMonster = useGameStore(state => state.setEnemyMonster);
  const [isNear, setIsNear] = useState(false);

  const handleChallenge = () => {
    console.log(`Challenging ${name}!`);
    setEnemyMonster({
      name: name,
      level: 3,
      hp: 15,
      maxHp: 15
    });
    setGameState("BATTLE");
  };

  return (
    <RigidBody 
      type="fixed" 
      colliders="cuboid" 
      position={position}
    >
      <primitive object={clone} castShadow receiveShadow />
      
      {/* Sensor for proximity detection */}
      <CylinderCollider 
        args={[2, 3]} // Half-height, radius
        position={[0, 1, 0]}
        sensor 
        onIntersectionEnter={() => setIsNear(true)}
        onIntersectionExit={() => setIsNear(false)}
      />

      {isNear && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-[#fcf8e3] border-4 border-[#bca06b] rounded-lg p-2 shadow-lg flex flex-col items-center pointer-events-auto transform hover:scale-105 transition-transform cursor-pointer" onClick={handleChallenge}>
             <div className="text-[#4a3f35] font-bold text-sm mb-1">Wild {name}!</div>
             <button className="bg-[#7bc86c] text-white px-4 py-1 rounded border-2 border-[#5a9c4e] font-bold shadow-sm active:translate-y-0.5 active:shadow-none">
               Challenge
             </button>
          </div>
        </Html>
      )}
    </RigidBody>
  );
}
