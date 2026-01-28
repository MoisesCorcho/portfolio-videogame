import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import PlayScene from './scenes/PlayScene';
import UIManager from './managers/UIManager';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#5c94fc', // Classic Mario sky blue
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE, // Switch to RESIZE as per previous intent for full screen
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true, // Enable debug for development
    },
  },
  scene: [Preloader, PlayScene],
};

const game = new Phaser.Game(config);

// Initialize UI Manager
new UIManager(game);
