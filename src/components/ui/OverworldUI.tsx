import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { MONSTER_SPAWNS, TUTORIAL_SPAWNS } from '../../config/spawns';

export const OverworldUI: React.FC = () => {
  const hasCompletedTutorial = useGameStore((state) => state.hasCompletedTutorial);
  const activeSpawns = hasCompletedTutorial ? MONSTER_SPAWNS : TUTORIAL_SPAWNS;
  const playerMarkerRef = useRef<HTMLDivElement>(null);
  const monsterMarkersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let animationFrameId: number;

    const updateMinimap = () => {
      const playerPos = useGameStore.getState().playerWorldPosition;
      
      // We assume the minimap is 160x160 (w-40 h-40). Center is at 80,80.
      // 1 unit in 3D world = 2 pixels on minimap.
      // The player is always at the center of the minimap.
      if (playerMarkerRef.current) {
        playerMarkerRef.current.style.transform = `translate(76px, 76px)`; // 80 - 4 (half of w-2/h-2 which is 8px)
      }

      // Update monster positions relative to player
      activeSpawns.forEach((spawn, index) => {
        const marker = monsterMarkersRef.current[index];
        if (marker) {
          const dx = spawn.position.x - playerPos.x;
          const dz = spawn.position.z - playerPos.z;
          
          // Map to pixels (scale = 2)
          const px = 80 + dx * 2 - 4; // -4 to center the 8px marker
          const pz = 80 + dz * 2 - 4;
          
          marker.style.transform = `translate(${px}px, ${pz}px)`;
          
          // Hide marker if it's too far away (approximate circle crop)
          const distSq = dx*dx + dz*dz;
          if (distSq > 1600) { // roughly 40 units away
            marker.style.opacity = '0';
          } else {
            marker.style.opacity = '1';
          }
        }
      });

      animationFrameId = requestAnimationFrame(updateMinimap);
    };

    updateMinimap();

    return () => cancelAnimationFrame(animationFrameId);
  }, [activeSpawns]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top area */}
      <div className="absolute top-4 right-4 text-right">
        <div className="bg-black/50 text-white p-3 rounded pointer-events-auto shadow-md">
          <h2 className="font-bold text-lg">Overworld</h2>
          <p className="text-sm">Explore the village</p>
        </div>
      </div>

      {/* Bottom area */}
      <div className="absolute bottom-4 left-4 w-full pr-8">
        <div className="flex justify-between items-end w-full">
          
          {/* Minimap (bottom-left) */}
          <div className="w-40 h-40 rounded-full border-4 border-gray-700 bg-[#5c9a43]/80 overflow-hidden pointer-events-auto shadow-lg relative">
            {/* Player marker (Blue) */}
            <div 
              ref={playerMarkerRef}
              className="absolute top-0 left-0 w-2 h-2 rounded-full bg-blue-500 z-20 shadow-[0_0_4px_rgba(59,130,246,0.8)]" 
            /> 
            
            {/* Monster markers (Red) */}
            {activeSpawns.map((spawn, index) => (
              <div 
                key={spawn.id}
                ref={el => { monsterMarkersRef.current[index] = el; }}
                className="absolute top-0 left-0 w-2 h-2 rounded-full bg-red-500 z-10 transition-opacity duration-200 shadow-[0_0_4px_rgba(239,68,68,0.8)]"
                title={spawn.name}
              />
            ))}
          </div>

          {/* Hotbar (bottom-center) */}
          <div className="flex space-x-2 pointer-events-auto absolute left-1/2 -translate-x-1/2 bottom-0">
            {[1, 2, 3, 4, 5, 6].map((slot) => (
              <div 
                key={slot} 
                className="w-12 h-12 bg-gray-800/80 border-2 border-gray-600 rounded flex items-center justify-center text-white font-bold hover:bg-gray-700 cursor-pointer shadow-md"
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
