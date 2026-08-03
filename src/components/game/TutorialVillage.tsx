import { RigidBody } from "@react-three/rapier";
import { TUTORIAL_SPAWNS } from "../../config/spawns";
import { DecorativeProp, MonsterEncounter } from "./MainVillage";

export function TutorialVillage() {
  return (
    <group>
      {/* Base plane (green grass) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[120, 1, 120]} />
          <meshStandardMaterial color="#5c9a43" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Simple props from the original scene */}
      <DecorativeProp path="/models/village/Well.glb" position={[4, 0, 4]} scale={1} />
      
      {/* Couple of background houses */}
      <DecorativeProp path="/models/village/Fantasy House.glb" position={[15, 0, -5]} rotation={[0, -Math.PI / 4, 0]} scale={2} />
      <DecorativeProp path="/models/village/Fantasy Inn.glb" position={[-5, 0, -15]} rotation={[0, Math.PI / 4, 0]} scale={2} />

      {/* Basic foliage */}
      <DecorativeProp path="/models/village/Bush.glb" position={[-8, 0, 8]} scale={1.5} />
      <DecorativeProp path="/models/village/Bush.glb" position={[8, 0, 12]} scale={1.3} />
      <DecorativeProp path="/models/village/Tree.glb" position={[-15, 0, 15]} scale={2} />
      <DecorativeProp path="/models/village/Tree.glb" position={[15, 0, 15]} scale={2} />

      {/* Tutorial Monsters */}
      {TUTORIAL_SPAWNS.map(spawn => (
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
