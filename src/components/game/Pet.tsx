import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useGameStore } from "../../store/useGameStore";
import * as THREE from "three";

export function Pet() {
  const { scene, animations } = useGLTF("/models/monsters/Alpaking.glb");
  const { actions } = useAnimations(animations, scene);
  const petRef = useRef<THREE.Group>(null);
  
  // Get the store directly so we can poll world position without triggering re-renders
  const playerWorldPosition = useGameStore(state => state.playerWorldPosition);

  useEffect(() => {
    // Alpaking's idle animation is CharacterArmature|Flying_Idle
    if (actions) {
      const idleKey = Object.keys(actions).find(key => key.toLowerCase().includes('idle'));
      const animName = idleKey || Object.keys(actions)[0];
      const action = actions[animName];
      if (action) {
        action.reset().fadeIn(0.5).play();
        action.setEffectiveTimeScale(1.0); // Standard speed for flying
      }
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!petRef.current) return;
    
    // Target position is slightly behind and above the player
    // We poll playerWorldPosition directly
    const targetPos = playerWorldPosition.clone();
    
    // Simple follow logic: try to stay 2 units behind and 2 units up
    // This is naive and doesn't consider player rotation, but works for a floating pet
    targetPos.x += 1.5;
    targetPos.y += 1.5;
    targetPos.z += 1.5;

    // Store previous position to calculate movement direction
    const prevPos = petRef.current.position.clone();
    
    // Lerp towards the target position smoothly
    petRef.current.position.lerp(targetPos, delta * 3);
    
    // Calculate which way the pet just moved
    const movementDir = petRef.current.position.clone().sub(prevPos);
    
    // If the pet is actively moving, make it look in the direction of movement
    if (movementDir.lengthSq() > 0.0001) {
      // Flatten the Y axis so the pet doesn't pitch up/down weirdly
      movementDir.y = 0; 
      const lookTarget = petRef.current.position.clone().add(movementDir);
      petRef.current.lookAt(lookTarget);
    }
    
    // Add a slight bobbing effect on top of the animation
    petRef.current.position.y += Math.sin(state.clock.elapsedTime * 3) * 0.005;
  });

  return (
    <group ref={petRef} scale={0.4}>
      <primitive object={scene} />
    </group>
  );
}
