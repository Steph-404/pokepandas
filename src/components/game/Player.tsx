import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useKeyboardControls, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider, vec3, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGameStore } from "../../store/useGameStore";

const SPEED = 5;
const DIRECTION = new THREE.Vector3();
const FRONT = new THREE.Vector3();
const RIGHT = new THREE.Vector3();

const CHARACTER_MODELS = [
  "/models/characters/Adventurer.glb",
];

export function Player() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const playerGroup = useRef<THREE.Group>(null);
  const [, get] = useKeyboardControls();
  
  const playerPosition = useGameStore(state => state.playerPosition);
  const setPlayerPosition = useGameStore(state => state.setPlayerPosition);

  useEffect(() => {
    return () => {
      // Do NOT read from bodyRef.current.translation() here because the 
      // Rapier WASM object may already be destroyed on unmount, causing a crash.
      // Instead, use the playerWorldPosition we've been tracking every frame.
      const pos = useGameStore.getState().playerWorldPosition;
      setPlayerPosition([pos.x, pos.y, pos.z]);
    };
  }, [setPlayerPosition]);

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={playerPosition}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
      <group ref={playerGroup}>
        <PlayerModel bodyRef={bodyRef} />
      </group>
      <CameraController bodyRef={bodyRef} playerGroup={playerGroup} />
    </RigidBody>
  );
}

function PlayerModel({ bodyRef }: { bodyRef: React.RefObject<RapierRigidBody | null> }) {
  const path = "/models/characters/Adventurer.glb";
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  const previousAction = useRef<string | null>(null);

  useFrame(() => {
    if (!bodyRef.current || !actions) return;
    
    const vel = bodyRef.current.linvel();
    const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);

    // Quaternius packs typically use these naming conventions
    const walkActionName = Object.keys(actions).find(k => k.toLowerCase().includes('walk') || k.toLowerCase().includes('run'));
    const idleActionName = Object.keys(actions).find(k => k.toLowerCase().includes('idle'));
    
    const fallbackWalk = walkActionName || Object.keys(actions)[1];
    const fallbackIdle = idleActionName || Object.keys(actions)[0];

    const isMoving = speed > 0.1;
    const currentAction = isMoving ? fallbackWalk : fallbackIdle;

    if (currentAction !== previousAction.current) {
      if (previousAction.current && actions[previousAction.current]) {
        actions[previousAction.current].fadeOut(0.2);
      }
      if (currentAction && actions[currentAction]) {
        actions[currentAction].reset().fadeIn(0.2).play();
      }
      previousAction.current = currentAction;
    }
  });

  return <primitive object={scene} />;
}

CHARACTER_MODELS.forEach((model) => {
  useGLTF.preload(model);
});

function CameraController({ bodyRef, playerGroup }: { bodyRef: React.RefObject<RapierRigidBody | null>, playerGroup: React.RefObject<THREE.Group | null> }) {
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    if (!bodyRef.current || !playerGroup.current) return;
    
    const { forward, backward, left, right } = get();
    const velocity = bodyRef.current.linvel();
    
    FRONT.set(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    RIGHT.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    
    DIRECTION.subVectors(FRONT, RIGHT).normalize().multiplyScalar(SPEED);
    
    bodyRef.current.setLinvel({ x: DIRECTION.x, y: velocity.y, z: DIRECTION.z }, true);

    // Rotate player model to face movement direction
    if (DIRECTION.length() > 0) {
      const angle = Math.atan2(DIRECTION.x, DIRECTION.z);
      // Lerp the rotation for smoothness
      const currentRotation = playerGroup.current.rotation.y;
      
      // Handle the 360 degree wrapping cleanly for shortest rotation path
      let diff = angle - currentRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      
      playerGroup.current.rotation.y = currentRotation + diff * 0.15;
    }

    const playerPos = vec3(bodyRef.current.translation());
    const cameraOffset = new THREE.Vector3(12, 6, 12);
    const targetCameraPos = playerPos.clone().add(cameraOffset);
    
    // Update global world position for the pet to track (mutating to avoid re-renders)
    useGameStore.getState().playerWorldPosition.copy(playerPos);

    state.camera.position.lerp(targetCameraPos, 0.1);
    state.camera.lookAt(playerPos);
  });

  return null;
}
