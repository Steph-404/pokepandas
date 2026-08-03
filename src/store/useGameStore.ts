import { create } from 'zustand';
import * as THREE from 'three';

export type GameState = 'OVERWORLD' | 'BATTLE';

export interface MonsterStats {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
}

interface GameStore {
  gameState: GameState;
  locationName: string;
  activeMonster: MonsterStats | null;
  enemyMonster: MonsterStats | null;
  characterModelPath: string | null;
  playerAnimation: string;
  enemyAnimation: string;
  playerPosition: [number, number, number];
  playerWorldPosition: THREE.Vector3;
  
  // Actions
  setGameState: (state: GameState) => void;
  setLocationName: (name: string) => void;
  setActiveMonster: (monster: MonsterStats) => void;
  setEnemyMonster: (monster: MonsterStats | null) => void;
  setCharacterModelPath: (path: string) => void;
  setPlayerAnimation: (anim: string) => void;
  setEnemyAnimation: (anim: string) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerWorldPosition: (pos: THREE.Vector3) => void;
  damageActiveMonster: (amount: number) => void;
  healActiveMonster: (amount: number) => void;
  damageEnemyMonster: (amount: number) => void;
  healPlayer: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'OVERWORLD',
  locationName: 'Emberleaf Copse',
  activeMonster: {
    name: 'Alpaking',
    level: 5,
    hp: 20,
    maxHp: 20,
  },
  enemyMonster: null,
  characterModelPath: null, // Will be set randomly on mount
  playerAnimation: 'Idle',
  enemyAnimation: 'Idle',
  playerPosition: [0, 5, 5],
  playerWorldPosition: new THREE.Vector3(0, 5, 5),

  setGameState: (state) => set({ gameState: state }),
  setLocationName: (name) => set({ locationName: name }),
  setActiveMonster: (monster) => set({ activeMonster: monster }),
  setEnemyMonster: (monster) => set({ enemyMonster: monster }),
  setCharacterModelPath: (path) => set({ characterModelPath: path }),
  setPlayerAnimation: (anim) => set({ playerAnimation: anim }),
  setEnemyAnimation: (anim) => set({ enemyAnimation: anim }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerWorldPosition: (pos) => set({ playerWorldPosition: pos }),
  
  healPlayer: () => set((state) => {
    if (!state.activeMonster) return state;
    return { activeMonster: { ...state.activeMonster, hp: state.activeMonster.maxHp } };
  }),
  
  damageActiveMonster: (amount) => 
    set((state) => {
      if (!state.activeMonster) return state;
      const newHp = Math.max(0, state.activeMonster.hp - amount);
      return { 
        activeMonster: { ...state.activeMonster, hp: newHp } 
      };
    }),
    
  healActiveMonster: (amount) => 
    set((state) => {
      if (!state.activeMonster) return state;
      const newHp = Math.min(state.activeMonster.maxHp, state.activeMonster.hp + amount);
      return { 
        activeMonster: { ...state.activeMonster, hp: newHp } 
      };
    }),

  damageEnemyMonster: (amount) => 
    set((state) => {
      if (!state.enemyMonster) return state;
      const newHp = Math.max(0, state.enemyMonster.hp - amount);
      return { 
        enemyMonster: { ...state.enemyMonster, hp: newHp } 
      };
    }),
}));

(window as any).useGameStore = useGameStore;
