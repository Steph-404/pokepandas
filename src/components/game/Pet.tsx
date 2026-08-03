import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useGameStore } from "../../store/useGameStore";
import * as THREE from "three";

export function Pet() {
  const { scene, animations } = useGLTF("/models/monsters/Alpaking.glb");
  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.position.copy(scene.position);
    c.rotation.copy(scene.rotation);
    c.scale.copy(scene.scale);
    return c;
  }, [scene]);
  const { actions } = useAnimations(animations, clone);
  const petRef = useRef<THREE.Group>(null);
  const previousAction = useRef<string | null>(null);

  useEffect(() => {
    if (actions) {
      const idleKey = Object.keys(actions).find(key => key.toLowerCase().includes('idle'));
      const animName = idleKey || Object.keys(actions)[0];
      const action = actions[animName];
      if (action) {
        action.reset().fadeIn(0.5).play();
        action.setEffectiveTimeScale(1.0);
        previousAction.current = animName;
      }
    }
  }, [actions]);

  useFrame(() => {
    if (!petRef.current || !actions) return;
    
    const store = useGameStore.getState();
    const playerPos = store.playerWorldPosition;
    const playerRot = store.playerRotation;
    
    const walkActionName = Object.keys(actions).find(k => k.toLowerCase().includes('walk') || k.toLowerCase().includes('run') || k.toLowerCase().includes('fly'));
    const idleActionName = Object.keys(actions).find(k => k.toLowerCase().includes('idle'));
    
    const fallbackWalk = walkActionName || Object.keys(actions)[1] || Object.keys(actions)[0];
    const fallbackIdle = idleActionName || Object.keys(actions)[0];
    
    const offsetX = Math.sin(playerRot) * 2;
    const offsetZ = Math.cos(playerRot) * 2;
    
    const targetPos = playerPos.clone();
    targetPos.x -= offsetX;
    targetPos.y += 1.0; 
    targetPos.z -= offsetZ;

    const currentPos = petRef.current.position.clone();
    const distance = currentPos.distanceTo(targetPos);
    
    if (distance > 0.5) {
      petRef.current.position.lerp(targetPos, 0.05);
      
      const movementDir = targetPos.clone().sub(currentPos);
      movementDir.y = 0; 
      
      if (movementDir.lengthSq() > 0.0001) {
        const lookTarget = petRef.current.position.clone().add(movementDir);
        petRef.current.lookAt(lookTarget);
      }
      
      if (previousAction.current !== fallbackWalk) {
        if (previousAction.current && actions[previousAction.current]) actions[previousAction.current]?.fadeOut(0.2);
        actions[fallbackWalk]?.reset().fadeIn(0.2).play();
        previousAction.current = fallbackWalk;
      }
    } else {
      petRef.current.rotation.x = 0;
      petRef.current.rotation.z = 0;
      
      let currentRotY = petRef.current.rotation.y;
      let diff = playerRot - currentRotY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      petRef.current.rotation.y = currentRotY + diff * 0.1;
      
      if (previousAction.current !== fallbackIdle) {
        if (previousAction.current && actions[previousAction.current]) actions[previousAction.current]?.fadeOut(0.2);
        actions[fallbackIdle]?.reset().fadeIn(0.2).play();
        previousAction.current = fallbackIdle;
      }
    }
  });

  return (
    <group ref={petRef} scale={1.5}>
      <primitive object={clone} />
    </group>
  );
}
