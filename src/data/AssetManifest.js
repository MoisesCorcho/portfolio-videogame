import { ASSETS } from '../utils/Constants';
import { SPRITE_CONFIG } from './Animations';

export const ASSET_MANIFEST = [
  // Environment
  { type: 'image', key: ASSETS.SKY, path: 'assets/legacyFantasy/backgound/Background.png' },
  { type: 'image', key: ASSETS.TREE_GREEN, path: 'assets/legacyFantasy/Trees/Green-Tree.png' },
  { type: 'image', key: ASSETS.TREE_RED, path: 'assets/legacyFantasy/Trees/Red-Tree.png' },
  { type: 'image', key: ASSETS.TREE_YELLOW, path: 'assets/legacyFantasy/Trees/Yellow-Tree.png' },
  { type: 'image', key: ASSETS.TREE_DARK, path: 'assets/legacyFantasy/Trees/Dark-Tree.png' },
  { type: 'image', key: ASSETS.TREE_GOLDEN, path: 'assets/legacyFantasy/Trees/Golden-Tree.png' },

  // Characters
  { 
    type: 'spritesheet', 
    key: ASSETS.PLAYER, 
    path: 'assets/character/char_blue.png', 
    config: SPRITE_CONFIG.PLAYER 
  },

  // Decorations
  { type: 'image', key: ASSETS.SIGN, path: 'assets/decorations/sign.png' },
  { type: 'image', key: ASSETS.SHOP, path: 'assets/decorations/shop.png' },
  { type: 'image', key: ASSETS.LAMP, path: 'assets/decorations/lamp.png' },
  { type: 'image', key: ASSETS.LARGE_TENT, path: 'assets/decorations/large_tent.png' },
  
  { type: 'image', key: ASSETS.FENCE_1, path: 'assets/decorations/fence_1.png' },
  { type: 'image', key: ASSETS.FENCE_2, path: 'assets/decorations/fence_2.png' },
  { type: 'image', key: ASSETS.ROCK_1, path: 'assets/decorations/rock_1.png' },
  { type: 'image', key: ASSETS.ROCK_2, path: 'assets/decorations/rock_2.png' },
  { type: 'image', key: ASSETS.ROCK_3, path: 'assets/decorations/rock_3.png' },

  // Tilesets & Maps
  { 
    type: 'spritesheet', 
    key: ASSETS.TILES, 
    path: 'assets/tilesets/oak_woods_tileset.png', 
    config: SPRITE_CONFIG.TILES 
  },
  { 
    type: 'tilemapTiledJSON', 
    key: ASSETS.LEVEL_1_MAP, 
    path: ASSETS.LEVEL_1_JSON // Note: Constants currently holds the path for JSON, we can reuse it or refactor later
  },
];
