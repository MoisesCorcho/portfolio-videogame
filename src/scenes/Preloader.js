import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
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
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    // Load Assets
    
    // Legacy Fantasy Assets
    this.load.image('sky_main', 'assets/legacyFantasy/backgound/Background.png');
    this.load.image('tree_green', 'assets/legacyFantasy/Trees/Green-Tree.png');
    this.load.image('tree_red', 'assets/legacyFantasy/Trees/Red-Tree.png');
    this.load.image('tree_yellow', 'assets/legacyFantasy/Trees/Yellow-Tree.png');
    this.load.image('tree_dark', 'assets/legacyFantasy/Trees/Dark-Tree.png');
    this.load.image('tree_golden', 'assets/legacyFantasy/Trees/Golden-Tree.png');
    
    // Character (Assuming 32x32, we verify later)
    // Common free assets are often 48x48 or 50x37. I'll load it as a static image first to debug or 
    // better yet, standard Oak Woods char is often a large sheet. Let's load as spritesheet with a guess.
    // If it fails, Phaser usually warns or shows it just wrong.
    this.load.spritesheet('player', 'assets/character/char_blue.png', { 
        frameWidth: 56, 
        frameHeight: 56 
    });

    // Decorations
    this.load.image('sign', 'assets/decorations/sign.png');
    this.load.image('shop', 'assets/decorations/shop.png');
    
    this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');

    // Load tileset as spritesheet to pick individual tiles
    // Oak Woods is typically 24x24
    this.load.spritesheet('tiles', 'assets/tilesets/oak_woods_tileset.png', {
        frameWidth: 24,
        frameHeight: 24
    });

    // Decor
    this.load.image('fence_1', 'assets/decorations/fence_1.png');
    this.load.image('fence_2', 'assets/decorations/fence_2.png');
    this.load.image('rock_1', 'assets/decorations/rock_1.png');
    this.load.image('rock_2', 'assets/decorations/rock_2.png');
    this.load.image('rock_1', 'assets/decorations/rock_1.png');
    this.load.image('rock_2', 'assets/decorations/rock_2.png');
    this.load.image('rock_3', 'assets/decorations/rock_3.png');
    this.load.image('lamp', 'assets/decorations/lamp.png');
    this.load.image('large_tent', 'assets/decorations/large_tent.png');
  }

  create() {
    this.createAnimations();
    // Start the main game scene
    this.scene.start('PlayScene');
  }

  createAnimations() {
    // Basic animations
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }), // Jump up / Peak
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('player', { start: 32, end: 37 }), // Falling down (trimmed last 2 frames)
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'landing',
        frames: this.anims.generateFrameNumbers('player', { start: 38, end: 39 }), 
        frameRate: 8, // Slower to make it visible
        repeat: 0
    });

    this.anims.create({
        key: 'attack1',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 13 }), // Row 2 (0-indexed logic: 8 sprites per row)
        frameRate: 12,
        repeat: 0
    });
  }
}
