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
  BG_DIRT2: 'bg_dirt2',
  BOOKS_FLYING: 'books_flying',
  ALCHEMY_TABLE: 'Terraria_alchemy_table',
  CAMPFIRE: 'campfire_sheet',
  CAMPFIRE_WITH_FOOD: 'campfire_with_food_sheet',
  KEYBOARD: 'custom_keyboard_letters_and_symbols',
  FOX: 'hg_fox',
  DOGGY_BLACK_GOLDEN: 'doggy_black_golden',
  DOGGY_BROWN: 'doggy_brown',
  BLACKSMITH: 'blacksmith',
  PRIESTESS: 'priestess',
  ADVENTURER_05: 'adventurer_05',
  GYPSY: 'gypsy',
  FAIRY: 'fairy',
  ADVENTURER_03: 'adventurer_03',
  ELDER: 'elder',
  VILLAGER_01: 'villager_01',
};

export const AUDIO = {
  MUSIC: {
    NORMAL: 'bgm_normal',
    AUTUMN: 'bgm_autumn',
    WINTER: 'bgm_winter',
  },
  SFX: {
    STEP_GRASS: 'sfx_step_grass',
    STEP_STONE: 'sfx_step_stone',
    JUMP: 'sfx_jump',
    LAND: 'sfx_land',
    ATTACK_SWORD: 'sfx_attack_sword',
    WINDOW_OPEN: 'sfx_window_open',
    WINDOW_CLOSE: 'sfx_window_close',
  },
  ENV: {
    WATERFALL: 'env_waterfall',
    FIRE_CRACKLE: 'env_fire_crackle',
    WIND: 'env_wind',
  },
};


export const INTERACTION_TYPES = {
  PROFILE: 'profile',
  EXPERIENCE: 'experience',
  SINGLE_EXPERIENCE: 'single_experience',
  SKILLS: 'skills',
  EDUCATION: 'education',
  CERTS: 'certs',
  NPC: 'npc',
  SIGN: 'sign',
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
  PLATFORMS: 'Platforms',
  BIOMES: 'Biomes',
};

export const OBJECT_NAMES = {
  START: 'start',
  PROJECTS: 'projects',
  ROCKS: 'rock',
  FENCE: 'fence',
};

export const ENTITY_TYPES = {
  DUMMY: 'dummy',
  NPC: 'npc',
};
