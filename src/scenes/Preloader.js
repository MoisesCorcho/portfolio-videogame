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
    this.load.image('bg1', 'assets/background/background_layer_1.png');
    this.load.image('bg2', 'assets/background/background_layer_2.png');
    this.load.image('bg3', 'assets/background/background_layer_3.png');
    
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
    this.load.image('lamp', 'assets/decorations/lamp.png');
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
        frames: this.anims.generateFrameNumbers('player', { start: 24, end: 29 }), // Next row
        frameRate: 10,
        repeat: 0
    });
  }
}
