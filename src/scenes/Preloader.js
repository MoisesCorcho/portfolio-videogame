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

    // Create placeholder assets using Graphics
    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    // 1. Player Sprite (Red Box)
    const playerGraphics = this.make.graphics();
    playerGraphics.fillStyle(0xff0000);
    playerGraphics.fillRect(0, 0, 32, 32);
    playerGraphics.generateTexture('player', 32, 32);

    // 2. Ground/Platform Tile (Green Box)
    const groundGraphics = this.make.graphics();
    groundGraphics.fillStyle(0x00ff00);
    groundGraphics.fillRect(0, 0, 32, 32);
    groundGraphics.generateTexture('ground', 32, 32);

    // 3. Sky/Background (Blue Box - Optional, can use color)
    // 4. Interactive Block (Gold Box)
    const blockGraphics = this.make.graphics();
    blockGraphics.fillStyle(0xffcc00);
    blockGraphics.fillRect(0, 0, 32, 32);
    // Add a question mark?
    blockGraphics.fillStyle(0x000000);
    blockGraphics.fillRect(10, 10, 12, 12);
    blockGraphics.generateTexture('block', 32, 32);
  }

  create() {
    // Start the main game scene
    this.scene.start('PlayScene');
  }
}
