import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import PlayScene from './scenes/PlayScene';
import App from './ui/App.svelte';

import { GAME_CONFIG } from './config/GameConfig';

const config = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  parent: 'game-container',
  backgroundColor: GAME_CONFIG.bgColor,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GAME_CONFIG.gravity },
      debug: GAME_CONFIG.debug,
    },
  },
  scene: [Preloader, PlayScene],
};

const game = new Phaser.Game(config);
window.gameInstance = game; // Expose for Svelte to resume

import { mount } from 'svelte';

// Mount Svelte UI
const target = document.getElementById('ui-layer');
if (target) {
  mount(App, { target });
}
const app = target ? mount : null;

export default app;
