import { create } from 'zustand';
import * as THREE from 'three';

export type GameState = 'START_SCREEN' | 'OVERWORLD' | 'BATTLE';
export type BattleState = 'PLAYER_INPUT' | 'QUIZ_ACTIVE' | 'ANIMATING' | 'ENEMY_TURN';

export interface MonsterStats {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
}

interface GameStore {
  gameState: GameState;
  battleState: BattleState;
  locationName: string;
  activeMonster: MonsterStats | null;
  enemyMonster: MonsterStats | null;
  characterModelPath: string | null;
  playerAnimation: string;
  enemyAnimation: string;
  playerPosition: [number, number, number];
  playerWorldPosition: THREE.Vector3;
  playerRotation: number;
  hasCompletedTutorial: boolean;
  
  // Actions
  setGameState: (state: GameState) => void;
  setBattleState: (state: BattleState) => void;
  setLocationName: (name: string) => void;
  completeTutorial: () => void;
  setActiveMonster: (monster: MonsterStats) => void;
  setEnemyMonster: (monster: MonsterStats | null) => void;
  setCharacterModelPath: (path: string) => void;
  setPlayerAnimation: (anim: string) => void;
  setEnemyAnimation: (anim: string) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerWorldPosition: (pos: THREE.Vector3) => void;
  setPlayerRotation: (rot: number) => void;
  damageActiveMonster: (amount: number) => void;
  healActiveMonster: (amount: number) => void;
  damageEnemyMonster: (amount: number) => void;
  healPlayer: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'START_SCREEN',
  battleState: 'PLAYER_INPUT',
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
  playerRotation: 0,
  hasCompletedTutorial: false,

  setGameState: (state) => set({ gameState: state }),
  setBattleState: (state) => set({ battleState: state }),
  setLocationName: (name) => set({ locationName: name }),
  completeTutorial: () => set((state) => {
    state.playerWorldPosition.set(0, 5, 5);
    return { hasCompletedTutorial: true, playerPosition: [0, 5, 5], playerRotation: 0, locationName: 'Emberleaf Copse' };
  }),
  setActiveMonster: (monster) => set({ activeMonster: monster }),
  setEnemyMonster: (monster) => set({ enemyMonster: monster }),
  setCharacterModelPath: (path) => set({ characterModelPath: path }),
  setPlayerAnimation: (anim) => set({ playerAnimation: anim }),
  setEnemyAnimation: (anim) => set({ enemyAnimation: anim }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerWorldPosition: (pos) => set({ playerWorldPosition: pos }),
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  
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
