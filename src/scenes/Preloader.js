import { ASSETS, SCENES } from '../utils/Constants';
import { PLAYER_ANIMS, SPRITE_CONFIG } from '../data/Animations';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SCENES.PRELOADER);
  }

  preload() {
    // Show loading text
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    // Load Assets

    // Legacy Fantasy Assets
    this.load.image(
      ASSETS.SKY,
      'assets/legacyFantasy/backgound/Background.png'
    );
    this.load.image(
      ASSETS.TREE_GREEN,
      'assets/legacyFantasy/Trees/Green-Tree.png'
    );
    this.load.image(ASSETS.TREE_RED, 'assets/legacyFantasy/Trees/Red-Tree.png');
    this.load.image(
      ASSETS.TREE_YELLOW,
      'assets/legacyFantasy/Trees/Yellow-Tree.png'
    );
    this.load.image(
      ASSETS.TREE_DARK,
      'assets/legacyFantasy/Trees/Dark-Tree.png'
    );
    this.load.image(
      ASSETS.TREE_GOLDEN,
      'assets/legacyFantasy/Trees/Golden-Tree.png'
    );

    // Character
    this.load.spritesheet(ASSETS.PLAYER, 'assets/character/char_blue.png', SPRITE_CONFIG.PLAYER);

    // Decorations
    this.load.image(ASSETS.SIGN, 'assets/decorations/sign.png');
    this.load.image(ASSETS.SHOP, 'assets/decorations/shop.png');

    this.load.tilemapTiledJSON(ASSETS.LEVEL_1_MAP, ASSETS.LEVEL_1_JSON);

    // Load tileset
    this.load.spritesheet(
      ASSETS.TILES,
      'assets/tilesets/oak_woods_tileset.png',
      SPRITE_CONFIG.TILES
    );

    // Decor
    this.load.image('fence_1', 'assets/decorations/fence_1.png');
    this.load.image('fence_2', 'assets/decorations/fence_2.png');
    this.load.image('rock_1', 'assets/decorations/rock_1.png');
    this.load.image('rock_2', 'assets/decorations/rock_2.png');
    this.load.image('rock_3', 'assets/decorations/rock_3.png');
    this.load.image(ASSETS.LAMP, 'assets/decorations/lamp.png');
    this.load.image(ASSETS.LARGE_TENT, 'assets/decorations/large_tent.png');
  }

  create() {
    this.createAnimations();
    // Start the main game scene
    this.scene.start(SCENES.PLAY);
  }

  createAnimations() {
    // Basic animations
    // Helper to create animations
    Object.values(PLAYER_ANIMS).forEach((anim) => {
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(ASSETS.PLAYER, {
          start: anim.start,
          end: anim.end,
        }),
        frameRate: anim.rate,
        repeat: anim.repeat,
      });
    });
  }
}
