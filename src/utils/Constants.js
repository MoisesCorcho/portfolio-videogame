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
  SKY: 'sky_main', // Keeping this if needed, or deprecate later
  BG_LAYER_1: 'bg_layer_1',
  BG_LAYER_2: 'bg_layer_2',
  BG_LAYER_3: 'bg_layer_3',
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
  FENCE_1: 'fence_1',
  FENCE_2: 'fence_2',
  ROCK_1: 'rock_1',
  ROCK_2: 'rock_2',
  ROCK_3: 'rock_3',
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

export const MAP_LAYERS = {
  GROUND: 'Ground',
  OBJECTS: 'Objects',
  START: 'Start',
};

export const OBJECT_NAMES = {
  START: 'start',
  PROJECTS: 'projects',
  ROCKS: 'rock',
  FENCE: 'fence',
};
