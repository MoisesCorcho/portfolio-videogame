import { ASSETS } from '../utils/Constants';
import { SPRITE_CONFIG } from './Animations';

// ============================================================================
// DYNAMIC ASSET LOADING
// ============================================================================

/**
 * Dynamically load all PNG files from the decorations directory.
 * Uses Vite's import.meta.glob to scan relative to this file.
 * Path is relative from src/data/ to public/assets/decorations/
 */
const decorationFiles = import.meta.glob('../../public/assets/decorations/**/*.png', { 
  eager: true, 
  as: 'url' 
});

/**
 * Normalize file paths to match Tiled's expected keys.
 * Converts: ../../public/assets/decorations/GH/Decoration/img.png
 * To: ../decorations/GH/Decoration/img.png (relative to maps folder)
 */
function getTiledKey(viteFilePath) {
  const match = viteFilePath.match(/assets\/(.+)/);
  if (match) {
    return '../' + match[1];
  }
  return viteFilePath;
}

/**
 * Get Phaser-compatible path (relative to public folder)
 * Converts: ../../public/assets/decorations/GH/Decoration/img.png
 * To: assets/decorations/GH/Decoration/img.png
 */
function getPhaserPath(viteFilePath) {
  const match = viteFilePath.match(/assets\/(.+)/);
  if (match) {
    return 'assets/' + match[1];
  }
  return viteFilePath;
}

/**
 * Extract a clean key from the file path (filename without extension).
 * Converts: ../decorations/GH/Decoration/bookshelf.png
 * To: bookshelf
 */
/**
 * Extract a clean key from the file path.
 * To avoid collisions (like multiple 'sign.png' in different folders),
 * we include the parent folder in the key.
 * Converts: ../decorations/GH/Decoration/bookshelf.png
 * To: GH_Decoration_bookshelf
 */
function extractKey(filePath) {
  // Remove the initial '../' or 'assets/' parts to get a clean relative structure
  const cleanPath = filePath.replace(/^(\.\.\/|assets\/)decorations\//, '');
  
  // Replace slashes with underscores and remove extension
  return cleanPath.replace(/\//g, '_').replace('.png', '');
}

/**
 * Generate dynamic asset entries from discovered files.
 */
const dynamicDecorations = Object.keys(decorationFiles).map(viteFilePath => {
  const tiledKey = getTiledKey(viteFilePath);
  const phaserPath = getPhaserPath(viteFilePath);
  const cleanKey = extractKey(viteFilePath);
  
  return {
    type: 'image',
    key: cleanKey,           // Simple key like "bookshelf"
    path: phaserPath,        // Phaser path: "assets/decorations/..."
    _tiledKey: tiledKey      // Tiled key: "../decorations/..."
  };
});


// ============================================================================
// STATIC ASSET MANIFEST (Core assets with specific configurations)
// ============================================================================

const STATIC_ASSETS = [
  // Environment
  { type: 'image', key: ASSETS.SKY, path: 'assets/legacyFantasy/backgound/Background.png' },
  { type: 'image', key: ASSETS.BG_LAYER_1, path: 'assets/background/background_layer_1.png' },
  { type: 'image', key: ASSETS.BG_LAYER_2, path: 'assets/background/background_layer_2.png' },
  { type: 'image', key: ASSETS.BG_LAYER_3, path: 'assets/background/background_layer_3.png' },
  { type: 'image', key: ASSETS.FLOOR_TILES_1, path: 'assets/GandalfHardcore/Floor Tiles1.png' },

  // Characters
  { 
    type: 'spritesheet', 
    key: ASSETS.PLAYER, 
    path: 'assets/character/char_blue.png', 
    config: SPRITE_CONFIG.PLAYER 
  },

  { type: 'image', key: ASSETS.ROCK_2, path: 'assets/decorations/rock_2.png' },
  { type: 'image', key: ASSETS.ROCK_3, path: 'assets/decorations/rock_3.png' },
  

  // GandalfHardcore / Photoshop (Image Collection Assets)
  { type: 'image', key: 'tree1', path: 'assets/GandalfHardcore/Photoshop/tree1.png' },
  { type: 'image', key: 'tree2', path: 'assets/GandalfHardcore/Photoshop/tree2.png' },
  { type: 'image', key: 'cut_tree', path: 'assets/GandalfHardcore/Photoshop/cut_tree.png' },
  { type: 'image', key: 'cut_tree_2', path: 'assets/GandalfHardcore/Photoshop/cut_tree_2.png' },
  { type: 'image', key: 'cut_tree_3', path: 'assets/GandalfHardcore/Photoshop/cut_tree_3.png' },
  { type: 'image', key: 'medium_tree', path: 'assets/GandalfHardcore/Photoshop/medium_tree.png' },
  { type: 'image', key: 'tree_base', path: 'assets/GandalfHardcore/Photoshop/tree_base.png' },
  { type: 'image', key: 'tree_tip', path: 'assets/GandalfHardcore/Photoshop/tree_tip.png' },

  // NOTE: All assets in 'assets/decorations/GH/Decoration' are now auto-loaded via import.meta.glob
  // No need to manually register them here anymore!

  
  // Animated Sprites (loaded as images for tilesets)
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

  // Tilesets & Maps
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

// ============================================================================
// EXPORT MERGED MANIFEST
// ============================================================================

/**
 * Merge static and dynamic assets.
 * Static assets take precedence over dynamic ones to allow manual overrides.
 * 
 * Additionally, register Tiled-style path keys (e.g., "../decorations/...") 
 * that point to the same Phaser paths.
 */
export const ASSET_MANIFEST = [
  ...STATIC_ASSETS,
  ...dynamicDecorations,
  // Register Tiled-style keys as aliases pointing to the same Phaser paths
  ...dynamicDecorations.map(asset => ({
    type: 'image',
    key: asset._tiledKey,      // Tiled key: "../decorations/..."
    path: asset.path           // Same Phaser path: "assets/decorations/..."
  }))
];
