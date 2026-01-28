import { ASSETS, SCENES } from '../utils/Constants';
import { PLAYER_ANIMS } from '../data/Animations';
import { ASSET_MANIFEST } from '../data/AssetManifest';

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

    // -- Load Assets from Manifest --
    ASSET_MANIFEST.forEach((asset) => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, asset.config);
      } else if (asset.type === 'tilemapTiledJSON') {
        this.load.tilemapTiledJSON(asset.key, asset.path);
      } else {
        // Default to image
        this.load.image(asset.key, asset.path);
      }
    });
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
