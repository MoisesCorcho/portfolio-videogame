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
 * Dynamically discovers all PNG files in the decorations directory.
 * Uses Vite's import.meta.glob with eager loading to scan the file system at build time.
 * 
 * @constant
 * @type {Object.<string, string>}
 */
const decorationFiles = import.meta.glob('../../public/assets/decorations/**/*.png', { 
  eager: true, 
  as: 'url' 
});

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
  const cleanPath = filePath.replace(/^(\.\.\/|assets\/)decorations\//, '');
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
const dynamicDecorations = Object.keys(decorationFiles).map(viteFilePath => {
  const tiledKey = getTiledKey(viteFilePath);
  const phaserPath = getPhaserPath(viteFilePath);
  const cleanKey = extractKey(viteFilePath);
  
  return {
    type: 'image',
    key: cleanKey,
    path: phaserPath,
    _tiledKey: tiledKey
  };
});

/**
 * Statically defined assets requiring specific configurations or manual control.
 * Includes environment backgrounds, character spritesheets, tilesets, and tilemaps.
 * 
 * @constant
 * @type {AssetManifestEntry[]}
 */
const STATIC_ASSETS = [
  { type: 'image', key: ASSETS.SKY, path: 'assets/legacyFantasy/backgound/Background.png' },
  { type: 'image', key: ASSETS.BG_LAYER_1, path: 'assets/background/background_layer_1.png' },
  { type: 'image', key: ASSETS.BG_LAYER_2, path: 'assets/background/background_layer_2.png' },
  { type: 'image', key: ASSETS.BG_LAYER_3, path: 'assets/background/background_layer_3.png' },
  { type: 'image', key: ASSETS.FLOOR_TILES_1, path: 'assets/GandalfHardcore/Floor Tiles1.png' },

  { 
    type: 'spritesheet', 
    key: ASSETS.PLAYER, 
    path: 'assets/character/char_blue.png', 
    config: SPRITE_CONFIG.PLAYER 
  },

  { type: 'image', key: ASSETS.ROCK_2, path: 'assets/decorations/rock_2.png' },
  { type: 'image', key: ASSETS.ROCK_3, path: 'assets/decorations/rock_3.png' },
  
  { type: 'image', key: 'tree1', path: 'assets/GandalfHardcore/Photoshop/tree1.png' },
  { type: 'image', key: 'tree2', path: 'assets/GandalfHardcore/Photoshop/tree2.png' },
  { type: 'image', key: 'cut_tree', path: 'assets/GandalfHardcore/Photoshop/cut_tree.png' },
  { type: 'image', key: 'cut_tree_2', path: 'assets/GandalfHardcore/Photoshop/cut_tree_2.png' },
  { type: 'image', key: 'cut_tree_3', path: 'assets/GandalfHardcore/Photoshop/cut_tree_3.png' },
  { type: 'image', key: 'medium_tree', path: 'assets/GandalfHardcore/Photoshop/medium_tree.png' },
  { type: 'image', key: 'tree_base', path: 'assets/GandalfHardcore/Photoshop/tree_base.png' },
  { type: 'image', key: 'tree_tip', path: 'assets/GandalfHardcore/Photoshop/tree_tip.png' },

  
  { type: 'image', key: 'Campfire sheet', path: 'assets/GandalfHardcore/Animated Sprites/Campfire sheet.png' },
  { type: 'image', key: 'Campfire with food sheet', path: 'assets/GandalfHardcore/Animated Sprites/Campfire with food sheet.png' },
  { type: 'image', key: 'GandalfHardcore Animated Water Tiles', path: 'assets/GandalfHardcore/Animated Sprites/GandalfHardcore Animated Water Tiles.png' },

  { 
    type: 'spritesheet', 
    key: ASSETS.FURNACE, 
    path: 'assets/GandalfHardcore/Pixel Art Furnace and Sawmill.png', 
    config: SPRITE_CONFIG.FURNACE 
  },
  { 
    type: 'spritesheet', 
    key: ASSETS.INTEREST_POINTS, 
    path: 'assets/decorations/interest_points.png', 
    config: SPRITE_CONFIG.INTEREST_POINTS 
  },

  { 
    type: 'image', 
    key: ASSETS.TILES, 
    path: 'assets/GandalfHardcore/Floor Tiles2.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.DECORATIONS, 
    path: 'assets/GandalfHardcore/Decor.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.GARDEN_DECORATIONS, 
    path: 'assets/GandalfHardcore/Garden Decorations.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.OTHER_TILES, 
    path: 'assets/GandalfHardcore/Other Tiles1.png' 
  },
  { 
    type: 'image', 
    key: ASSETS.HOUSE_TILES, 
    path: 'assets/GandalfHardcore/House Tiles.png' 
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
  ...dynamicDecorations,
  ...dynamicDecorations.map(asset => ({
    type: 'image',
    key: asset._tiledKey,
    path: asset.path
  }))
];
