/**
 * @fileoverview Asset manifest and dynamic asset loading system.
 * This module uses Vite's import.meta.glob to automatically discover and register
 * decoration assets, while maintaining manual definitions for assets requiring
 * specific configurations (spritesheets, tilemaps, etc.).
 */

import { ASSETS } from '../utils/Constants';
import { SPRITE_CONFIG } from './Animations';

/**
 * @typedef {Object} AssetManifestEntry
 * @property {string} type - Asset type ('image', 'spritesheet', 'tilemapTiledJSON')
 * @property {string} key - Unique identifier for the asset in Phaser's cache
 * @property {string} path - File path relative to the public directory
 * @property {Object} [config] - Optional spritesheet configuration (frameWidth, frameHeight)
 * @property {string} [_tiledKey] - Internal property for Tiled map compatibility
 */

/**
 * Dynamically discovers all PNG files in the decorations and sprites directories.
 * Uses Vite's import.meta.glob with eager loading to scan the file system at build time.
 * 
 * @constant
 * @type {Object.<string, string>}
 */
const dynamicFiles = import.meta.glob([
  '../../public/assets/decorations/**/*.png',
  '../../public/assets/sprites/**/*.png'
]);

/**
 * Converts a Vite file path to a Tiled-compatible relative path.
 * Tiled maps reference assets relative to the map file location.
 * 
 * @param {string} viteFilePath - Vite-generated file path (e.g., "../../public/assets/decorations/...")
 * @returns {string} Tiled-compatible path (e.g., "../decorations/...")
 * 
 * @example
 * getTiledKey("../../public/assets/decorations/GH/Decoration/img.png")
 * // Returns: "../decorations/GH/Decoration/img.png"
 */
function getTiledKey(viteFilePath) {
  const match = viteFilePath.match(/assets\/(.+)/);
  if (match) {
    return '../' + match[1];
  }
  return viteFilePath;
}

/**
 * Converts a Vite file path to a Phaser-compatible asset path.
 * Phaser loads assets relative to the public directory root.
 * 
 * @param {string} viteFilePath - Vite-generated file path (e.g., "../../public/assets/decorations/...")
 * @returns {string} Phaser-compatible path (e.g., "assets/decorations/...")
 * 
 * @example
 * getPhaserPath("../../public/assets/decorations/GH/Decoration/img.png")
 * // Returns: "assets/decorations/GH/Decoration/img.png"
 */
function getPhaserPath(viteFilePath) {
  const match = viteFilePath.match(/assets\/(.+)/);
  if (match) {
    return 'assets/' + match[1];
  }
  return viteFilePath;
}

/**
 * Extracts a unique asset key from a file path by including folder structure.
 * This prevents naming collisions when multiple files have the same filename
 * but exist in different directories (e.g., "sign.png" in different folders).
 * 
 * @param {string} filePath - File path to process
 * @returns {string} Unique key with folder structure (e.g., "GH_Decoration_bookshelf")
 * 
 * @example
 * extractKey("../decorations/GH/Decoration/bookshelf.png")
 * // Returns: "GH_Decoration_bookshelf"
 * 
 * extractKey("../decorations/Terraria/Decorations/sign.png")
 * // Returns: "Terraria_Decorations_sign"
 */
function extractKey(filePath) {
  // Remove common prefixes while preserving the subfolder structure
  const cleanPath = filePath.replace(/^(\.\.\/|assets\/|..\/..\/public\/assets\/)(decorations|sprites)\//, '');
  return cleanPath.replace(/\//g, '_').replace('.png', '');
}

/**
 * Dynamically generated asset entries from discovered decoration files.
 * Each entry includes both a simple key for Phaser code usage and a Tiled-compatible
 * key for map file references.
 * 
 * @constant
 * @type {AssetManifestEntry[]}
 */
const dynamicAssets = Object.keys(dynamicFiles)
  .map(viteFilePath => {
    const tiledKey = getTiledKey(viteFilePath);
    const phaserPath = getPhaserPath(viteFilePath);
    const cleanKey = extractKey(viteFilePath);
    
    return {
      type: 'image',
      key: cleanKey,
      path: phaserPath,
      _tiledKey: tiledKey
    };
  })
  .filter(asset => !Object.values(ASSETS).includes(asset.key));

/**
 * Statically defined assets requiring specific configurations or manual control.
 * Includes environment backgrounds, character spritesheets, tilesets, and tilemaps.
 * 
 * @constant
 * @type {AssetManifestEntry[]}
 */
const STATIC_ASSETS = [
  // Normal Biome Backgrounds (6 layers)
  { type: 'image', key: ASSETS.BG_NORMAL_CASTLE, path: 'assets/background/GH/Normal/castle.png' },
  { type: 'image', key: ASSETS.BG_NORMAL_LAYER_1, path: 'assets/background/GH/Normal/layer_1.png' },
  { type: 'image', key: ASSETS.BG_NORMAL_LAYER_2, path: 'assets/background/GH/Normal/layer_2.png' },
  { type: 'image', key: ASSETS.BG_NORMAL_LAYER_3, path: 'assets/background/GH/Normal/layer_3.png' },
  { type: 'image', key: ASSETS.BG_NORMAL_LAYER_4, path: 'assets/background/GH/Normal/layer_4.png' },
  { type: 'image', key: ASSETS.BG_NORMAL_LAYER_5, path: 'assets/background/GH/Normal/layer_5.png' },
  
  // Autumn Biome Backgrounds (6 layers)
  { type: 'image', key: ASSETS.BG_AUTUMN_CASTLE, path: 'assets/background/GH/Autumn/castle_autumn.png' },
  { type: 'image', key: ASSETS.BG_AUTUMN_LAYER_1, path: 'assets/background/GH/Autumn/layer_1.png' },
  { type: 'image', key: ASSETS.BG_AUTUMN_LAYER_2, path: 'assets/background/GH/Autumn/layer_2.png' },
  { type: 'image', key: ASSETS.BG_AUTUMN_LAYER_3, path: 'assets/background/GH/Autumn/layer_3.png' },
  { type: 'image', key: ASSETS.BG_AUTUMN_LAYER_4, path: 'assets/background/GH/Autumn/layer_4.png' },
  { type: 'image', key: ASSETS.BG_AUTUMN_LAYER_5, path: 'assets/background/GH/Autumn/layer_5.png' },
  
  // Winter Biome Backgrounds (6 layers)
  { type: 'image', key: ASSETS.BG_WINTER_CASTLE, path: 'assets/background/GH/Winter/castle_winter.png' },
  { type: 'image', key: ASSETS.BG_WINTER_LAYER_1, path: 'assets/background/GH/Winter/layer_1.png' },
  { type: 'image', key: ASSETS.BG_WINTER_LAYER_2, path: 'assets/background/GH/Winter/layer_2.png' },
  { type: 'image', key: ASSETS.BG_WINTER_LAYER_3, path: 'assets/background/GH/Winter/layer_3.png' },
  { type: 'image', key: ASSETS.BG_WINTER_LAYER_4, path: 'assets/background/GH/Winter/layer_4.png' },
  { type: 'image', key: ASSETS.BG_WINTER_LAYER_5, path: 'assets/background/GH/Winter/layer_5.png' },
  
  { type: 'image', key: ASSETS.FLOOR_TILES_1, path: 'assets/tilesets/GH/floor_tiles1.png' },

  { 
    type: 'spritesheet', 
    key: ASSETS.PLAYER, 
    path: 'assets/character/char_blue.png', 
    config: SPRITE_CONFIG.PLAYER 
  },
  
  { type: 'image', key: 'tree1', path: 'assets/decorations/GH/pine1.png' },
  { type: 'image', key: 'tree2', path: 'assets/decorations/GH/pine2.png' },
  { type: 'image', key: 'cut_tree', path: 'assets/decorations/GH/cut_tree.png' },
  { type: 'image', key: 'cut_tree_2', path: 'assets/decorations/GH/cut_tree_2.png' },
  { type: 'image', key: 'cut_tree_3', path: 'assets/decorations/GH/cut_tree_3.png' },
  { type: 'image', key: 'medium_tree', path: 'assets/decorations/GH/medium_tree.png' },
  { type: 'image', key: 'tree_base', path: 'assets/decorations/GH/tree_base.png' },
  { type: 'image', key: 'tree_tip', path: 'assets/decorations/GH/tree_tip.png' },

  
  { type: 'image', key: 'campfire_sheet', path: 'assets/sprites/GH/campfire_sheet.png' },
  { type: 'image', key: 'campfire_with_food_sheet', path: 'assets/sprites/GH/campfire_with_food_sheet.png' },
  { type: 'image', key: 'animated_water_tiles', path: 'assets/sprites/GH/animated_water_tiles.png' },

  { 
    type: 'spritesheet', 
    key: ASSETS.FURNACE, 
    path: 'assets/sprites/GH/furnace_and_sawmill.png', 
    config: SPRITE_CONFIG.FURNACE 
  },
  { 
    type: 'spritesheet', 
    key: ASSETS.INTEREST_POINTS, 
    path: 'assets/sprites/custom/interest_points.png', 
    config: SPRITE_CONFIG.INTEREST_POINTS 
  },
  { 
    type: 'spritesheet', 
    key: ASSETS.DUMMY, 
    path: 'assets/sprites/custom/training_dummy_v2.png', 
    config: SPRITE_CONFIG.DUMMY 
  },
  { 
    type: 'spritesheet', 
    key: ASSETS.BEWITCHING_TABLE, 
    path: 'assets/sprites/Terraria/bewitching_table.png', 
    config: SPRITE_CONFIG.BEWITCHING_TABLE 
  },
  { 
    type: 'spritesheet', 
    key: ASSETS.UNIVERSAL_PYLON, 
    path: 'assets/sprites/Terraria/universal_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/universal_pylon.png', path: 'assets/sprites/Terraria/universal_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.SNOW_PYLON, 
    path: 'assets/sprites/Terraria/snow_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/snow_pylon.png', path: 'assets/sprites/Terraria/snow_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.OCEAN_PYLON, 
    path: 'assets/sprites/Terraria/ocean_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/ocean_pylon.png', path: 'assets/sprites/Terraria/ocean_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.JUNGLE_PYLON, 
    path: 'assets/sprites/Terraria/jungle_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/jungle_pylon.png', path: 'assets/sprites/Terraria/jungle_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.HALLOW_PYLON, 
    path: 'assets/sprites/Terraria/hallow_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/hallow_pylon.png', path: 'assets/sprites/Terraria/hallow_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.FOREST_PYLON, 
    path: 'assets/sprites/Terraria/forest_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/forest_pylon.png', path: 'assets/sprites/Terraria/forest_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.DESERT_PYLON, 
    path: 'assets/sprites/Terraria/desert_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/desert_pylon.png', path: 'assets/sprites/Terraria/desert_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.CAVERN_PYLON, 
    path: 'assets/sprites/Terraria/cavern_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/cavern_pylon.png', path: 'assets/sprites/Terraria/cavern_pylon.png', config: SPRITE_CONFIG.PYLONS },
  { 
    type: 'spritesheet', 
    key: ASSETS.MUSHROOM_PYLON, 
    path: 'assets/sprites/Terraria/mushroom_pylon.png', 
    config: SPRITE_CONFIG.PYLONS 
  },
  { type: 'spritesheet', key: '../sprites/Terraria/mushroom_pylon.png', path: 'assets/sprites/Terraria/mushroom_pylon.png', config: SPRITE_CONFIG.PYLONS },

  { 
    type: 'image', 
    key: ASSETS.TILES, 
    path: 'assets/tilesets/GH/floor_tiles2.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.OTHER_TILES, 
    path: 'assets/tilesets/GH/other_tiles1.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.OTHER_TILES_2, 
    path: 'assets/tilesets/GH/other_tiles2.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.BG_DIRT2, 
    path: 'assets/tilesets/GH/bg_dirt2.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.HOUSE_TILES, 
    path: 'assets/tilesets/GH/house_tiles.png' 
  },
  { 
    type: 'tilemapTiledJSON', 
    key: ASSETS.LEVEL_1_MAP, 
    path: ASSETS.LEVEL_1_JSON 
  },
];

/**
 * Complete asset manifest combining static and dynamic assets.
 * 
 * This manifest merges manually defined assets with auto-discovered decoration assets.
 * For each dynamic decoration, two entries are created:
 * 1. Simple key for Phaser code (e.g., "bookshelf")
 * 2. Tiled-compatible key for map references (e.g., "../decorations/GH/Decoration/bookshelf.png")
 * 
 * @constant
 * @type {AssetManifestEntry[]}
 * @example
 * // Simple Phaser usage
 * this.add.image(0, 0, 'GH_Decoration_bookshelf');
 * 
 * // Tiled automatically references using "../decorations/GH/Decoration/bookshelf.png"
 * // which also resolves to the same asset
 */
export const ASSET_MANIFEST = [
  ...STATIC_ASSETS,
  ...dynamicAssets,
  ...dynamicAssets.map(asset => ({
    type: 'image',
    key: asset._tiledKey,
    path: asset.path
  }))
];
