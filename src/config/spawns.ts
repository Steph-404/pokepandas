import * as THREE from 'three';

export interface MonsterSpawn {
  id: string;
  name: string;
  path: string;
  position: THREE.Vector3;
  scale: number;
}

export const MONSTER_SPAWNS: MonsterSpawn[] = [
  {
    id: 'alien_1',
    name: 'Alien',
    path: '/models/monsters/Alien.glb',
    position: new THREE.Vector3(12, 0, 20),
    scale: 1.5
  },
  {
    id: 'alpaking_evolved_1',
    name: 'Alpaking Evolved',
    path: '/models/monsters/Alpaking Evolved.glb',
    position: new THREE.Vector3(-25, 0, -10),
    scale: 1.5
  },
  {
    id: 'armabee_evolved_1',
    name: 'Armabee Evolved',
    path: '/models/monsters/Armabee Evolved.glb',
    position: new THREE.Vector3(20, 0, 0),
    scale: 1.5
  },
  {
    id: 'alien_2',
    name: 'Alien',
    path: '/models/monsters/Alien.glb',
    position: new THREE.Vector3(-10, 0, 35),
    scale: 1.5
  }
];

export const TUTORIAL_SPAWNS: MonsterSpawn[] = [
  {
    id: 'tutorial_monster_1',
    name: 'Alpaking Evolved',
    path: '/models/monsters/Alpaking Evolved.glb',
    position: new THREE.Vector3(-15, 0, 5),
    scale: 1.5
  }
];
