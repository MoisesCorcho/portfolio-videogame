/**
 * @fileoverview Animation configurations and sprite definitions for the game.
 * This module centralizes all animation frame data and spritesheet configurations
 * used throughout the game, ensuring consistency and maintainability.
 */

/**
 * @typedef {Object} AnimationConfig
 * @property {string} key - Unique identifier for the animation
 * @property {number} [start] - Starting frame index in the spritesheet
 * @property {number} [end] - Ending frame index in the spritesheet
 * @property {number[]} [frames] - Specific frame indices (overrides start/end)
 * @property {number} rate - Frame rate (frames per second)
 * @property {number} repeat - Number of times to repeat animation (-1 for infinite loop)
 */

/**
 * Player character animation configurations.
 * Each animation defines frame ranges and playback settings for character movement.
 *
 * @type {Object.<string, AnimationConfig>}
 */
export const PLAYER_ANIMS = {
  IDLE: { key: 'idle', start: 0, end: 5, rate: 8, repeat: -1 },
  RUN: { key: 'run', start: 16, end: 23, rate: 10, repeat: -1 },
  JUMP: { key: 'jump', start: 24, end: 31, rate: 10, repeat: 0 },
  FALL: { key: 'fall', start: 32, end: 37, rate: 10, repeat: 0 },
  LANDING: { key: 'landing', start: 38, end: 39, rate: 8, repeat: 0 },
  ATTACK: { key: 'attack1', start: 8, end: 13, rate: 12, repeat: 0 },
};

/**
 * @typedef {Object} SpriteSheetConfig
 * @property {number} frameWidth - Width of each frame in pixels
 * @property {number} frameHeight - Height of each frame in pixels
 */

/**
 * Spritesheet frame configurations for all sprite-based assets.
 * Defines the dimensions for slicing spritesheets into individual frames.
 *
 * @type {Object.<string, SpriteSheetConfig>}
 */
export const SPRITE_CONFIG = {
  PLAYER: { frameWidth: 56, frameHeight: 56 },
  TILES: { frameWidth: 24, frameHeight: 24 },
  FURNACE: { frameWidth: 64, frameHeight: 64 },
  INTEREST_POINTS: { frameWidth: 32, frameHeight: 32 },
  DUMMY: { frameWidth: 32, frameHeight: 32 },
  BEWITCHING_TABLE: { frameWidth: 48, frameHeight: 48 },
  PYLONS: { frameWidth: 48, frameHeight: 68 },
  BOOKS_FLYING: { frameWidth: 51, frameHeight: 44 },
  ALCHEMY_TABLE: { frameWidth: 48, frameHeight: 48 },
  CAMPFIRE: { frameWidth: 32, frameHeight: 32 },
  KEYBOARD: { frameWidth: 16, frameHeight: 16 },
  BLACKSMITH: { frameWidth: 34, frameHeight: 34 },
  PRIESTESS: { frameWidth: 32, frameHeight: 32 },
  ADVENTURER_05: { frameWidth: 32, frameHeight: 32 },
  GYPSY: { frameWidth: 34, frameHeight: 34 },
  FAIRY: { frameWidth: 32, frameHeight: 32 },
  ADVENTURER_03: { frameWidth: 32, frameHeight: 32 },
  ELDER: { frameWidth: 32, frameHeight: 32 },
  VILLAGER_01: { frameWidth: 34, frameHeight: 34 },
  QUEST_MARKER: { frameWidth: 32, frameHeight: 32 },
};

/**
 * Furnace and sawmill animation configurations.
 *
 * @type {Object.<string, AnimationConfig>}
 */
export const FURNACE_ANIMS = {
  BURN: { key: 'furnace_burn', start: 0, end: 5, rate: 10, repeat: -1 },
  SAWMILL: { key: 'sawmill_work', start: 6, end: 11, rate: 10, repeat: -1 },
};

export const BLACKSMITH_ANIMS = {
  WORK: { key: 'blacksmith_work', start: 0, end: 4, rate: 10, repeat: -1 },
};

/**
 * Interactive point of interest animation configurations.
 *
 * @type {Object.<string, AnimationConfig>}
 */
export const INTEREST_ANIMS = {
  STAR: { key: 'interest_point', start: 40, end: 44, rate: 7, repeat: -1 },
};

/**
 * Bewitching Table animation configurations.
 *
 * @type {Object.<string, AnimationConfig>}
 */
export const BEWITCHING_TABLE_ANIMS = {
  IDLE: {
    key: 'bewitching_table_idle',
    start: 0,
    end: 7,
    rate: 10,
    repeat: -1,
  },
};

/**
 * Pylon animation configurations.
 */
export const UNIVERSAL_PYLON_ANIMS = {
  IDLE: { key: 'universal_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const SNOW_PYLON_ANIMS = {
  IDLE: { key: 'snow_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const OCEAN_PYLON_ANIMS = {
  IDLE: { key: 'ocean_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const JUNGLE_PYLON_ANIMS = {
  IDLE: { key: 'jungle_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const HALLOW_PYLON_ANIMS = {
  IDLE: { key: 'hallow_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const FOREST_PYLON_ANIMS = {
  IDLE: { key: 'forest_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const DESERT_PYLON_ANIMS = {
  IDLE: { key: 'desert_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const CAVERN_PYLON_ANIMS = {
  IDLE: { key: 'cavern_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const MUSHROOM_PYLON_ANIMS = {
  IDLE: { key: 'mushroom_pylon_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const ALCHEMY_TABLE_ANIMS = {
  IDLE: { key: 'alchemy_table_idle', start: 0, end: 7, rate: 10, repeat: -1 },
};
export const BOOKS_FLYING_ANIMS = {
  FLY_1: { key: 'books_flying_1', start: 0, end: 4, rate: 10, repeat: -1 },
  FLY_2: { key: 'books_flying_2', start: 15, end: 19, rate: 10, repeat: -1 },
};
export const CAMPFIRE_ANIMS = {
  IDLE: { key: 'campfire_idle', start: 0, end: 39, rate: 10, repeat: -1 },
};
export const CAMPFIRE_WITH_FOOD_ANIMS = {
  IDLE: {
    key: 'campfire_with_food_idle',
    start: 0,
    end: 39,
    rate: 10,
    repeat: -1,
  },
};

/**
 * Keyboard animation configurations.
 */
export const KEYBOARD_ANIMS = {
  PRESS_W: { key: 'keyboard_w_press', frames: [38, 94], rate: 2, repeat: -1 },
  PRESS_A: { key: 'keyboard_a_press', frames: [16, 72], rate: 2, repeat: -1 },
  PRESS_S: { key: 'keyboard_s_press', frames: [34, 90], rate: 2, repeat: -1 },
  PRESS_D: { key: 'keyboard_d_press', frames: [19, 75], rate: 2, repeat: -1 },
  PRESS_J: { key: 'keyboard_j_press', frames: [25, 81], rate: 2, repeat: -1 },
  PRESS_E: { key: 'keyboard_e_press', frames: [20, 76], rate: 2, repeat: -1 },
};

/**
 * Training Dummy animation configurations.
 *
 * @type {Object.<string, AnimationConfig>}
 */
export const DUMMY_ANIMS = {
  IDLE: { key: 'dummy_idle', start: 0, end: 0, rate: 1, repeat: -1 },
  HURT: { key: 'dummy_hurt', start: 1, end: 4, rate: 10, repeat: 0 },
};

/**
 * NPC Animations
 */
export const NPC_ANIMS = {
  FOX_IDLE: { key: 'fox_idle', start: 0, end: 4, rate: 8, repeat: -1 },
  FOX_RUN: { key: 'fox_run', start: 6, end: 11, rate: 10, repeat: -1 },
};

export const DOGGY_ANIMS = {
  IDLE: { key: 'doggy_idle', start: 0, end: 4, rate: 8, repeat: -1 },
  RUN: { key: 'doggy_run', start: 6, end: 11, rate: 10, repeat: -1 },
};

export const PRIESTESS_ANIMS = {
  IDLE: { key: 'priestess_idle', start: 0, end: 4, rate: 8, repeat: -1 },
};

export const ADVENTURER_ANIMS = {
  IDLE: { key: 'adventurer_idle', start: 0, end: 3, rate: 8, repeat: -1 },
};

export const GYPSY_ANIMS = {
  IDLE: { key: 'gypsy_idle', start: 0, end: 4, rate: 8, repeat: -1 },
};

export const FAIRY_ANIMS = {
  IDLE: { key: 'fairy_idle', start: 0, end: 3, rate: 8, repeat: -1 },
};

export const ADVENTURER_03_ANIMS = {
  IDLE: { key: 'adventurer_03_idle', start: 0, end: 3, rate: 8, repeat: -1 },
};

export const ELDER_ANIMS = {
  IDLE: { key: 'elder_idle', start: 0, end: 3, rate: 8, repeat: -1 },
};

export const VILLAGER_01_ANIMS = {
  IDLE: { key: 'villager_01_idle', start: 0, end: 4, rate: 8, repeat: -1 },
};

export const QUEST_MARKER_ANIMS = {
  QUESTION: { key: 'quest_marker_question', start: 0, end: 15, rate: 8, repeat: -1 },
  EXCLAMATION: { key: 'quest_marker_exclamation', start: 16, end: 31, rate: 8, repeat: -1 },
};

import { ASSETS } from '../utils/Constants';

/**
 * @typedef {Object} AnimationRegistryEntry
 * @property {string} assetKey - Asset key from ASSETS constants
 * @property {Object.<string, AnimationConfig>} anims - Animation configurations for this asset
 */

/**
 * Master registry mapping environment assets to their animation configurations.
 * Used by the scene to automatically create animations for all registered sprites.
 *
 * @type {AnimationRegistryEntry[]}
 */
export const MASTER_ANIMATIONS_REGISTRY = [
  { assetKey: ASSETS.FURNACE, anims: FURNACE_ANIMS },
  { assetKey: ASSETS.INTEREST_POINTS, anims: INTEREST_ANIMS },
  { assetKey: ASSETS.DUMMY, anims: DUMMY_ANIMS },
  { assetKey: ASSETS.BEWITCHING_TABLE, anims: BEWITCHING_TABLE_ANIMS },
  { assetKey: ASSETS.UNIVERSAL_PYLON, anims: UNIVERSAL_PYLON_ANIMS },
  { assetKey: ASSETS.SNOW_PYLON, anims: SNOW_PYLON_ANIMS },
  { assetKey: ASSETS.OCEAN_PYLON, anims: OCEAN_PYLON_ANIMS },
  { assetKey: ASSETS.JUNGLE_PYLON, anims: JUNGLE_PYLON_ANIMS },
  { assetKey: ASSETS.HALLOW_PYLON, anims: HALLOW_PYLON_ANIMS },
  { assetKey: ASSETS.FOREST_PYLON, anims: FOREST_PYLON_ANIMS },
  { assetKey: ASSETS.DESERT_PYLON, anims: DESERT_PYLON_ANIMS },
  { assetKey: ASSETS.CAVERN_PYLON, anims: CAVERN_PYLON_ANIMS },
  { assetKey: ASSETS.MUSHROOM_PYLON, anims: MUSHROOM_PYLON_ANIMS },
  { assetKey: ASSETS.BOOKS_FLYING, anims: BOOKS_FLYING_ANIMS },
  { assetKey: ASSETS.ALCHEMY_TABLE, anims: ALCHEMY_TABLE_ANIMS },
  { assetKey: ASSETS.CAMPFIRE, anims: CAMPFIRE_ANIMS },
  { assetKey: ASSETS.CAMPFIRE_WITH_FOOD, anims: CAMPFIRE_WITH_FOOD_ANIMS },
  { assetKey: ASSETS.KEYBOARD, anims: KEYBOARD_ANIMS },
  // NPC Animations
  { assetKey: ASSETS.FOX, anims: NPC_ANIMS },
  { assetKey: ASSETS.DOGGY_BLACK_GOLDEN, anims: DOGGY_ANIMS },
  { assetKey: ASSETS.DOGGY_BROWN, anims: DOGGY_ANIMS },
  { assetKey: ASSETS.BLACKSMITH, anims: BLACKSMITH_ANIMS },
  { assetKey: ASSETS.PRIESTESS, anims: PRIESTESS_ANIMS },
  { assetKey: ASSETS.ADVENTURER_05, anims: ADVENTURER_ANIMS },
  { assetKey: ASSETS.GYPSY, anims: GYPSY_ANIMS },
  { assetKey: ASSETS.FAIRY, anims: FAIRY_ANIMS },
  { assetKey: ASSETS.ADVENTURER_03, anims: ADVENTURER_03_ANIMS },
  { assetKey: ASSETS.ELDER, anims: ELDER_ANIMS },
  { assetKey: ASSETS.VILLAGER_01, anims: VILLAGER_01_ANIMS },
  { assetKey: ASSETS.QUEST_MARKER, anims: QUEST_MARKER_ANIMS },
];
