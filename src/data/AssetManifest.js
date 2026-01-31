import { ASSETS } from '../utils/Constants';
import { SPRITE_CONFIG } from './Animations';

export const ASSET_MANIFEST = [
  // Environment
  { type: 'image', key: ASSETS.SKY, path: 'assets/legacyFantasy/backgound/Background.png' },
  { type: 'image', key: ASSETS.BG_LAYER_1, path: 'assets/background/background_layer_1.png' },
  { type: 'image', key: ASSETS.BG_LAYER_2, path: 'assets/background/background_layer_2.png' },
  { type: 'image', key: ASSETS.BG_LAYER_3, path: 'assets/background/background_layer_3.png' },

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
    type: 'image', 
    key: ASSETS.TILES, 
    path: 'assets/GandalfHardcore/Floor Tiles1.png' 
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
    type: 'tilemapTiledJSON', 
    key: ASSETS.LEVEL_1_MAP, 
    path: ASSETS.LEVEL_1_JSON 
  },
];
