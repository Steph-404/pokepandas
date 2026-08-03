import * as THREE from 'three';

export interface MonsterSpawn {
  id: string;
  name: string;
  path: string;
  position: THREE.Vector3;
  scale: number;
}

export const MONSTER_SPAWNS: MonsterSpawn[] = [
  { id: 'alien_1', name: 'Alien', path: '/models/monsters/Alien.glb', position: new THREE.Vector3(15, 0, 15), scale: 1.5 },
  { id: 'alpaking_evolved_1', name: 'Alpaking Evolved', path: '/models/monsters/Alpaking Evolved.glb', position: new THREE.Vector3(-25, 0, -10), scale: 1.5 },
  { id: 'armabee_evolved_1', name: 'Armabee Evolved', path: '/models/monsters/Armabee Evolved.glb', position: new THREE.Vector3(25, 0, 5), scale: 1.5 },
  { id: 'alien_2', name: 'Alien', path: '/models/monsters/Alien.glb', position: new THREE.Vector3(-10, 0, 35), scale: 1.5 },
  { id: 'alpaking_1', name: 'Alpaking', path: '/models/monsters/Alpaking.glb', position: new THREE.Vector3(-30, 0, 20), scale: 1.5 },
  { id: 'alien_3', name: 'Alien', path: '/models/monsters/Alien.glb', position: new THREE.Vector3(30, 0, 25), scale: 1.5 },
  { id: 'armabee_evolved_2', name: 'Armabee Evolved', path: '/models/monsters/Armabee Evolved.glb', position: new THREE.Vector3(-20, 0, 0), scale: 1.5 },
  { id: 'alpaking_2', name: 'Alpaking Evolved', path: '/models/monsters/Alpaking Evolved.glb', position: new THREE.Vector3(5, 0, -25), scale: 1.5 },
  { id: 'armabee_1', name: 'Armabee', path: '/models/monsters/Armabee Evolved.glb', position: new THREE.Vector3(30, 0, -15), scale: 1.5 },
  { id: 'alien_4', name: 'Alien', path: '/models/monsters/Alien.glb', position: new THREE.Vector3(-35, 0, 35), scale: 1.5 }
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
