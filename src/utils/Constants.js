/**
 * Global Constants for the Game
 * This centralized file prevents magic strings and makes refactoring easier.
 */

export const SCENES = {
  PRELOADER: 'Preloader',
  PLAY: 'PlayScene',
};

export const ASSETS = {
  // Environment - Background Layers (6 layers per biome)
  // Normal Biome
  BG_NORMAL_CASTLE: 'bg_normal_castle',
  BG_NORMAL_LAYER_1: 'bg_normal_layer_1',
  BG_NORMAL_LAYER_2: 'bg_normal_layer_2',
  BG_NORMAL_LAYER_3: 'bg_normal_layer_3',
  BG_NORMAL_LAYER_4: 'bg_normal_layer_4',
  BG_NORMAL_LAYER_5: 'bg_normal_layer_5',
  // Autumn Biome
  BG_AUTUMN_CASTLE: 'bg_autumn_castle',
  BG_AUTUMN_LAYER_1: 'bg_autumn_layer_1',
  BG_AUTUMN_LAYER_2: 'bg_autumn_layer_2',
  BG_AUTUMN_LAYER_3: 'bg_autumn_layer_3',
  BG_AUTUMN_LAYER_4: 'bg_autumn_layer_4',
  BG_AUTUMN_LAYER_5: 'bg_autumn_layer_5',
  // Winter Biome
  BG_WINTER_CASTLE: 'bg_winter_castle',
  BG_WINTER_LAYER_1: 'bg_winter_layer_1',
  BG_WINTER_LAYER_2: 'bg_winter_layer_2',
  BG_WINTER_LAYER_3: 'bg_winter_layer_3',
  BG_WINTER_LAYER_4: 'bg_winter_layer_4',
  BG_WINTER_LAYER_5: 'bg_winter_layer_5',
  DECORATIONS: 'decorations_tileset',
  GARDEN_DECORATIONS: 'garden_decorations',
  OTHER_TILES: 'other_tiles',
  OTHER_TILES_2: 'other_tiles2',
  FLOOR_TILES_1: 'floor_tiles_1',
  HOUSE_TILES: 'house_tiles',

  // Characters
  PLAYER: 'player',

  // Tiles & Maps
  TILES: 'tiles',
  LEVEL_1_MAP: 'level1',
  LEVEL_1_JSON: 'assets/maps/level1.json', // Path for preloader

  // Objects
  FURNACE: 'furnace',
  INTEREST_POINTS: 'interest_point',
  DUMMY: 'dummy',
  BEWITCHING_TABLE: 'Terraria_bewitching_table',
  UNIVERSAL_PYLON: 'Terraria_universal_pylon',
  SNOW_PYLON: 'Terraria_snow_pylon',
  OCEAN_PYLON: 'Terraria_ocean_pylon',
  JUNGLE_PYLON: 'Terraria_jungle_pylon',
  HALLOW_PYLON: 'Terraria_hallow_pylon',
  FOREST_PYLON: 'Terraria_forest_pylon',
  DESERT_PYLON: 'Terraria_desert_pylon',
  CAVERN_PYLON: 'Terraria_cavern_pylon',
  MUSHROOM_PYLON: 'Terraria_mushroom_pylon',
};

export const INTERACTION_TYPES = {
  PROFILE: 'profile',
  EXPERIENCE: 'experience',
  SINGLE_EXPERIENCE: 'single_experience',
  SKILLS: 'skills',
  EDUCATION: 'education',
};

export const EVENTS = {
  OPEN_MODAL: 'open-modal',
};

export const MAP_LAYERS = {
  GROUND: 'Ground',
  DECORATION: 'Decoration',
  OBJECTS: 'Objects',
  START: 'Start',
  COLLISIONS: 'Collisions',
};

export const OBJECT_NAMES = {
  START: 'start',
  PROJECTS: 'projects',
  ROCKS: 'rock',
  FENCE: 'fence',
};

export const ENTITY_TYPES = {
  DUMMY: 'dummy',
};
