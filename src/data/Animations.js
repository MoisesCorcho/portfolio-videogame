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
};
