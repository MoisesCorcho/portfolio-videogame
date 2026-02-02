export const PLAYER_ANIMS = {
  IDLE: { key: 'idle', start: 0, end: 5, rate: 8, repeat: -1 },
  RUN: { key: 'run', start: 16, end: 23, rate: 10, repeat: -1 },
  JUMP: { key: 'jump', start: 24, end: 31, rate: 10, repeat: 0 },
  FALL: { key: 'fall', start: 32, end: 37, rate: 10, repeat: 0 },
  LANDING: { key: 'landing', start: 38, end: 39, rate: 8, repeat: 0 },
  ATTACK: { key: 'attack1', start: 8, end: 13, rate: 12, repeat: 0 },
};

export const SPRITE_CONFIG = {
  PLAYER: { frameWidth: 56, frameHeight: 56 },
  TILES: { frameWidth: 24, frameHeight: 24 },
  FURNACE: { frameWidth: 64, frameHeight: 64 },
  INTEREST_POINTS: { frameWidth: 32, frameHeight: 32 },
};

// --- Animation Groups ---

export const FURNACE_ANIMS = {
  BURN: { key: 'furnace_burn', start: 0, end: 5, rate: 10, repeat: -1 },
  SAWMILL: { key: 'sawmill_work', start: 6, end: 11, rate: 10, repeat: -1 },
};

export const INTEREST_ANIMS = {
  STAR: { key: 'interest_point', start: 40, end: 44, rate: 7, repeat: -1 },
};

import { ASSETS } from '../utils/Constants';

export const MASTER_ANIMATIONS_REGISTRY = [
  { assetKey: ASSETS.FURNACE, anims: FURNACE_ANIMS },
  { assetKey: ASSETS.INTEREST_POINTS, anims: INTEREST_ANIMS },
];

