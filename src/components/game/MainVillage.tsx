import { useState, useEffect, useMemo } from "react";
import { useGLTF, Html, useAnimations } from "@react-three/drei";
import { RigidBody, CylinderCollider, CuboidCollider } from "@react-three/rapier";
import { useGameStore } from "../../store/useGameStore";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { MONSTER_SPAWNS } from "../../config/spawns";

export function MainVillage() {
  return (
    <group>
      {/* Base plane (green grass) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[120, 1, 120]} />
          <meshStandardMaterial color="#5c9a43" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Blue river intersecting the grass */}
      <mesh position={[0, 0.01, -15]} receiveShadow>
        <boxGeometry args={[120, 0.05, 12]} />
        <meshStandardMaterial color="#3a8cc7" roughness={0.2} transparent opacity={0.8} />
      </mesh>

      {/* Dirt path layout */}
      {/* Main vertical path */}
      <mesh position={[0, 0.02, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 30]} />
        <meshStandardMaterial color="#8c7050" roughness={1} />
      </mesh>
      {/* Horizontal path to the farm */}
      <mesh position={[-15, 0.02, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#8c7050" roughness={1} />
      </mesh>

      {/* Plaza Center */}
      <DecorativeProp path="/models/village/Well.glb" position={[4, 0, 4]} scale={1} />
      <DecorativeProp path="/models/village/Cart.glb" position={[-3, 0, -4]} rotation={[0, Math.PI / 4, 0]} scale={1} />
      <DecorativeProp path="/models/village/Garden Lamp.glb" position={[-5, 0, 2]} scale={1.5} />
      <DecorativeProp path="/models/village/Garden Lamp.glb" position={[5, 0, 2]} scale={1.5} />

      {/* Plaza Buildings */}
      <DecorativeProp path="/models/village/Fantasy Inn.glb" position={[-15, 0, -2]} rotation={[0, Math.PI / 2, 0]} scale={2} />
      <DecorativeProp path="/models/village/Fantasy House.glb" position={[12, 0, -2]} rotation={[0, -Math.PI / 2, 0]} scale={2} />
      <DecorativeProp path="/models/village/Blacksmith.glb" position={[15, 0, 10]} rotation={[0, -Math.PI / 3, 0]} scale={1.5} />
      
      {/* Bridge over the river */}
      <DecorativeProp path="/models/village/Bridge.glb" position={[0, 0, -15]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />

      {/* Farm Area */}
      <DecorativeProp path="/models/village/Barn.glb" position={[-25, 0, 25]} rotation={[0, Math.PI / 4, 0]} scale={2} />
      <DecorativeProp path="/models/village/Tower Windmill.glb" position={[-35, 0, 15]} rotation={[0, 0, 0]} scale={1.8} />

      {/* Fenced in area at the farm */}
      <DecorativeProp path="/models/village/Fence.glb" position={[-15, 0, 30]} rotation={[0, 0, 0]} scale={1.5} />
      <DecorativeProp path="/models/village/Fence.glb" position={[-10, 0, 30]} rotation={[0, 0, 0]} scale={1.5} />
      <DecorativeProp path="/models/village/Fence.glb" position={[-5, 0, 30]} rotation={[0, 0, 0]} scale={1.5} />
      <DecorativeProp path="/models/village/Fence.glb" position={[-5, 0, 25]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
      <DecorativeProp path="/models/village/Fence.glb" position={[-5, 0, 20]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />

      {/* Animals in Farm */}
      <DecorativeProp path="/models/village/Cow.glb" position={[-12, 0, 25]} rotation={[0, Math.PI / 3, 0]} scale={1.5} isAnimal={true} />
      <DecorativeProp path="/models/village/Cow.glb" position={[-8, 0, 27]} rotation={[0, -Math.PI / 4, 0]} scale={1.5} isAnimal={true} />
      <DecorativeProp path="/models/village/Shiba Inu.glb" position={[-20, 0, 22]} rotation={[0, Math.PI, 0]} scale={1.2} isAnimal={true} />
      <DecorativeProp path="/models/village/Fox.glb" position={[15, 0, 25]} rotation={[0, -Math.PI/2, 0]} scale={1.0} isAnimal={true} />

      {/* Nature (Heavily along the edges) */}
      <DecorativeProp path="/models/village/Pine.glb" position={[-30, 0, -25]} scale={2} />
      <DecorativeProp path="/models/village/Tree.glb" position={[-20, 0, -22]} scale={2.2} />
      <DecorativeProp path="/models/village/Pine.glb" position={[-10, 0, -28]} scale={2.5} />
      <DecorativeProp path="/models/village/Tree.glb" position={[0, 0, -25]} scale={2} />
      <DecorativeProp path="/models/village/Pine.glb" position={[12, 0, -26]} scale={2.2} />
      <DecorativeProp path="/models/village/Tree.glb" position={[25, 0, -22]} scale={1.8} />
      <DecorativeProp path="/models/village/Pine.glb" position={[35, 0, -10]} scale={2.5} />
      <DecorativeProp path="/models/village/Tree.glb" position={[30, 0, 5]} scale={2} />
      <DecorativeProp path="/models/village/Pine.glb" position={[35, 0, 20]} scale={2.2} />
      <DecorativeProp path="/models/village/Tree.glb" position={[25, 0, 35]} scale={2} />
      <DecorativeProp path="/models/village/Pine.glb" position={[10, 0, 38]} scale={2.5} />
      <DecorativeProp path="/models/village/Tree.glb" position={[-5, 0, 40]} scale={2} />
      <DecorativeProp path="/models/village/Pine.glb" position={[-25, 0, 38]} scale={2.2} />
      <DecorativeProp path="/models/village/Tree.glb" position={[-40, 0, 25]} scale={2} />
      <DecorativeProp path="/models/village/Pine.glb" position={[-40, 0, 5]} scale={2.5} />
      <DecorativeProp path="/models/village/Tree.glb" position={[-35, 0, -10]} scale={2} />

      {/* Rocks and Bushes */}
      <DecorativeProp path="/models/village/Rock Medium.glb" position={[-18, 0, -18]} scale={1.5} />
      <DecorativeProp path="/models/village/Rock Medium.glb" position={[20, 0, -12]} scale={1.2} />
      <DecorativeProp path="/models/village/Bush.glb" position={[-12, 0, 10]} scale={1.5} />
      <DecorativeProp path="/models/village/Bush.glb" position={[8, 0, -10]} scale={1.3} />
      <DecorativeProp path="/models/village/Flower Single.glb" position={[2, 0, 2]} scale={0.3} />
      <DecorativeProp path="/models/village/Flower Single.glb" position={[-2, 0, 2]} scale={0.3} />

      {/* Monster Encounters */}
      {MONSTER_SPAWNS.map(spawn => (
        <MonsterEncounter 
          key={spawn.id}
          path={spawn.path} 
          name={spawn.name} 
          position={spawn.position} 
          scale={spawn.scale}
        />
      ))}
    </group>
  );
}

// Fixed DecorativeProp to correctly handle materials and clones
export function DecorativeProp({ path, position, rotation = [0, 0, 0], scale = 1, isAnimal = false }: { path: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; isAnimal?: boolean }) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.position.copy(scene.position);
    c.rotation.copy(scene.rotation);
    c.scale.copy(scene.scale);
    return c;
  }, [scene]);
  
  if (isAnimal) {
    return (
      <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
        <group scale={scale}>
          <primitive object={clone} castShadow receiveShadow />
        </group>
        <CuboidCollider args={[2, 2, 2]} position={[0, 2, 0]} />
      </RigidBody>
    );
  }

  return (
    <RigidBody type="fixed" colliders="hull" position={position} rotation={rotation}>
      <group scale={scale}>
        <primitive object={clone} castShadow receiveShadow />
      </group>
    </RigidBody>
  );
}

export function MonsterEncounter({ path, position, name, scale = 1 }: { path: string; position: THREE.Vector3; name: string; scale?: number }) {
  const { scene, animations } = useGLTF(path);
  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.position.copy(scene.position);
    c.rotation.copy(scene.rotation);
    c.scale.copy(scene.scale);
    return c;
  }, [scene]);
  const { actions } = useAnimations(animations, clone);
  const setGameState = useGameStore(state => state.setGameState);
  const setEnemyMonster = useGameStore(state => state.setEnemyMonster);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const idleKey = Object.keys(actions).find(key => key.toLowerCase().includes('idle'));
      const animName = idleKey || Object.keys(actions)[0];
      const action = actions[animName];
      if (action) {
        action.reset().fadeIn(0.5).play();
        action.setEffectiveTimeScale(0.5);
      }
    }
  }, [actions]);

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
      colliders={false} 
      position={position}
    >
      <group scale={scale}>
        <primitive object={clone} castShadow receiveShadow />
      </group>
      
      <CylinderCollider args={[2, 1.0]} position={[0, 1, 0]} />

      <CylinderCollider 
        args={[2, 1.8]} 
        position={[0, 1, 0]}
        sensor 
        onIntersectionEnter={() => setIsNear(true)}
        onIntersectionExit={() => setIsNear(false)}
      />

      {isNear && (
        <Html position={[0, 4, 0]} center>
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

// Preload common village models to avoid stutter
[
  "/models/village/Water Fountain.glb",
  "/models/village/Fantasy Inn.glb",
  "/models/village/Fantasy House.glb",
  "/models/village/Fence.glb",
  "/models/village/Pine.glb",
  "/models/village/Tree.glb"
].forEach((model) => useGLTF.preload(model));
