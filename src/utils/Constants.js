/**
 * Global Constants for the Game
 * This centralized file prevents magic strings and makes refactoring easier.
 */

export const SCENES = {
  PRELOADER: 'Preloader',
  PLAY: 'PlayScene',
};

export const ASSETS = {
  // Environment
  SKY: 'sky_main',
  TREE_GREEN: 'tree_green',
  TREE_RED: 'tree_red',
  TREE_YELLOW: 'tree_yellow',
  TREE_DARK: 'tree_dark',
  TREE_GOLDEN: 'tree_golden',

  // Characters
  PLAYER: 'player',

  // Tiles & Maps
  TILES: 'tiles',
  LEVEL_1_MAP: 'level1',
  LEVEL_1_JSON: 'assets/maps/level1.json', // Path for preloader

  // Objects
  SHOP: 'shop',
  SIGN: 'sign',
  LAMP: 'lamp',
  LARGE_TENT: 'large_tent',
};

export const INTERACTION_TYPES = {
  PROFILE: 'profile',
  EXPERIENCE: 'experience',
  SKILLS: 'skills',
  EDUCATION: 'education',
};

export const EVENTS = {
  OPEN_MODAL: 'open-modal',
};
