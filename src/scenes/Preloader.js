import Phaser from 'phaser';
import { ASSETS, SCENES } from '../utils/Constants';

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

    // Character (Assuming 32x32, we verify later)
    // Common free assets are often 48x48 or 50x37. I'll load it as a static image first to debug or
    // better yet, standard Oak Woods char is often a large sheet. Let's load as spritesheet with a guess.
    // If it fails, Phaser usually warns or shows it just wrong.
    this.load.spritesheet(ASSETS.PLAYER, 'assets/character/char_blue.png', {
      frameWidth: 56,
      frameHeight: 56,
    });

    // Decorations
    this.load.image(ASSETS.SIGN, 'assets/decorations/sign.png');
    this.load.image(ASSETS.SHOP, 'assets/decorations/shop.png');

    this.load.tilemapTiledJSON(ASSETS.LEVEL_1_MAP, ASSETS.LEVEL_1_JSON);

    // Load tileset as spritesheet to pick individual tiles
    // Oak Woods is typically 24x24
    this.load.spritesheet(
      ASSETS.TILES,
      'assets/tilesets/oak_woods_tileset.png',
      {
        frameWidth: 24,
        frameHeight: 24,
      }
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
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(ASSETS.PLAYER, {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers(ASSETS.PLAYER, {
        start: 16,
        end: 23,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers(ASSETS.PLAYER, {
        start: 24,
        end: 31,
      }), // Jump up / Peak
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNumbers(ASSETS.PLAYER, {
        start: 32,
        end: 37,
      }), // Falling down (trimmed last 2 frames)
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'landing',
      frames: this.anims.generateFrameNumbers(ASSETS.PLAYER, {
        start: 38,
        end: 39,
      }),
      frameRate: 8, // Slower to make it visible
      repeat: 0,
    });

    this.anims.create({
      key: 'attack1',
      frames: this.anims.generateFrameNumbers(ASSETS.PLAYER, {
        start: 8,
        end: 13,
      }), // Row 2 (0-indexed logic: 8 sprites per row)
      frameRate: 12,
      repeat: 0,
    });
  }
}
