/**
 * @fileoverview Asset preloading scene for the game.
 * Handles loading all game assets before transitioning to the main play scene.
 */

import { ASSETS, SCENES } from '../utils/Constants';
import { PLAYER_ANIMS } from '../data/Animations';
import { ASSET_MANIFEST } from '../data/AssetManifest';

/**
 * Preloader scene responsible for loading all game assets and creating player animations.
 * This scene displays a loading indicator while assets are being fetched,
 * then automatically transitions to the main game scene once complete.
 *
 * @extends Phaser.Scene
 */
export default class Preloader extends Phaser.Scene {
  /**
   * Creates the preloader scene instance.
   */
  constructor() {
    super(SCENES.PRELOADER);
  }

  /**
   * Loads all game assets defined in the asset manifest.
   * Displays a centered "Loading..." text while assets are being fetched.
   * Automatically called by Phaser before create().
   */
  preload() {
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

    ASSET_MANIFEST.forEach((asset) => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, asset.config);
      } else if (asset.type === 'tilemapTiledJSON') {
        this.load.tilemapTiledJSON(asset.key, asset.path);
      } else if (asset.type === 'audio') {
        this.load.audio(asset.key, asset.path);
      } else {
        this.load.image(asset.key, asset.path);
      }

    });
  }

  /**
   * Initializes player animations and transitions to the main game scene.
   * Automatically called by Phaser after all assets have finished loading.
   */
  create() {
    this.createAnimations();
    this.scene.start(SCENES.PLAY);
  }

  /**
   * Creates all player character animations from the PLAYER_ANIMS configuration.
   * Generates frame-based animations using the loaded player spritesheet.
   *
   * @private
   */
  createAnimations() {
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
