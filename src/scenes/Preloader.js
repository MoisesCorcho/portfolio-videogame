/**
 * @fileoverview Asset preloading scene for the game.
 * Handles loading all game assets before transitioning to the main play scene.
 */

import { ASSETS, SCENES } from '../utils/Constants';
import { PLAYER_ANIMS } from '../data/Animations';
import { ASSET_MANIFEST } from '../data/AssetManifest';

/**
 * Preloader scene responsible for loading all game assets and creating player animations.
 * Displays a professional pixel art loading screen while assets are fetched,
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
   * Builds the pixel art loading screen and loads all game assets.
   * Automatically called by Phaser before create().
   */
  preload() {
    const width = this.cameras.main.width;   // 1024
    const height = this.cameras.main.height; // 576
    const cx = width / 2;                    // 512
    const sy = 200;                          // sword center y

    // ─── Background ──────────────────────────────────────────────────────────
    this.add.rectangle(cx, height / 2, width, height, 0x0d0d1e).setDepth(0);

    // Stars — random 1×1 or 2×2 white/near-white pixels at varying alpha
    const starGfx = this.add.graphics().setDepth(1);
    for (let i = 0; i < 60; i++) {
      const sx = Phaser.Math.Between(0, width);
      const starY = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(0, 1) === 0 ? 1 : 2;
      const alpha = Phaser.Math.FloatBetween(0.3, 1.0);
      const tints = [0xffffff, 0xddddff, 0xffeedd, 0xeeeeff];
      const color = tints[Phaser.Math.Between(0, tints.length - 1)];
      starGfx.fillStyle(color, alpha);
      starGfx.fillRect(sx, starY, size, size);
    }

    // Scanlines — 1px horizontal lines every 4px at very low alpha
    const scanGfx = this.add.graphics().setDepth(2);
    scanGfx.fillStyle(0x000000, 0.08);
    for (let y = 0; y < height; y += 4) {
      scanGfx.fillRect(0, y, width, 1);
    }

    // ─── Sword (pixel art via Graphics) ──────────────────────────────────────
    const swordGfx = this.add.graphics().setDepth(3);

    // Subtle golden glow behind the sword
    swordGfx.fillStyle(0xffcc00, 0.06);
    swordGfx.fillCircle(cx, sy, 60);

    // Tip  — 4×8, centered at (cx, sy-68)
    swordGfx.fillStyle(0xffffff, 1);
    swordGfx.fillRect(cx - 2, sy - 72, 4, 8);

    // Blade — 8×60, starting from (cx-4, sy-60)
    swordGfx.fillStyle(0xdddddd, 1);
    swordGfx.fillRect(cx - 4, sy - 60, 8, 60);

    // Crossguard — 32×6, centered at (cx, sy+14)
    swordGfx.fillStyle(0xc0c0c0, 1);
    swordGfx.fillRect(cx - 16, sy + 11, 32, 6);

    // Handle — 8×24, centered at (cx, sy+30)
    swordGfx.fillStyle(0x8b4513, 1);
    swordGfx.fillRect(cx - 4, sy + 18, 8, 24);

    // Pommel — 8×8, centered at (cx, sy+44)
    swordGfx.fillStyle(0xffcc00, 1);
    swordGfx.fillRect(cx - 4, sy + 40, 8, 8);

    // ─── Spinner (8 orbiting squares) ────────────────────────────────────────
    const spinnerGfx = this.add.graphics().setDepth(4);
    const spinnerRadius = 42;
    const dotCount = 8;
    let spinAngle = 0;

    const drawSpinner = () => {
      spinnerGfx.clear();
      for (let i = 0; i < dotCount; i++) {
        const angle = Phaser.Math.DegToRad(spinAngle + (360 / dotCount) * i);
        const dx = cx + Math.cos(angle) * spinnerRadius;
        const dy = sy + Math.sin(angle) * spinnerRadius;
        // Front dot (i=0) is fully opaque, back dot fades to 0.1
        const alpha = 1.0 - (i / dotCount) * 0.9;
        spinnerGfx.fillStyle(0xffcc00, alpha);
        spinnerGfx.fillRect(dx - 2, dy - 2, 4, 4);
      }
    };

    drawSpinner();

    this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        spinAngle = (spinAngle + 3) % 360;
        drawSpinner();
      },
    });

    // ─── Title section ────────────────────────────────────────────────────────
    const titleY = 290;
    const fontFamily = "'Press Start 2P', monospace";

    const pixelText = this.add
      .text(cx, titleY, "THE DEVELOPER'S", {
        fontFamily,
        fontSize: '18px',
        color: '#ffdd00',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(5);

    this.tweens.add({
      targets: pixelText,
      alpha: { from: 0.8, to: 1.0 },
      yoyo: true,
      duration: 800,
      repeat: -1,
    });

    this.add
      .text(cx, titleY + 32, 'JOURNEY', {
        fontFamily,
        fontSize: '26px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0)
      .setDepth(5);

    // ─── Progress bar ─────────────────────────────────────────────────────────
    const barY = 390;
    const barMaxW = 400;
    const barH = 24;
    const barX = cx - barMaxW / 2; // left edge of the fill area

    // Outer border — 404×28
    this.add
      .rectangle(cx, barY, barMaxW + 4, barH + 4, 0xffffff)
      .setOrigin(0.5, 0)
      .setDepth(5);

    // Inner background — 400×24
    this.add
      .rectangle(cx, barY + 2, barMaxW, barH, 0x1a1a2e)
      .setOrigin(0.5, 0)
      .setDepth(6);

    // Progress fill — starts at width 0
    const fillRect = this.add
      .rectangle(barX, barY + 2, 0, barH, 0x00e676)
      .setOrigin(0, 0)
      .setDepth(7);

    // Shimmer overlay — matches fill width, 1/3 height, lighter green
    const shimmerRect = this.add
      .rectangle(barX, barY + 2, 0, Math.floor(barH / 3), 0x80ffb0)
      .setOrigin(0, 0)
      .setAlpha(0.3)
      .setDepth(8);

    // ─── Text labels ──────────────────────────────────────────────────────────
    const percentText = this.add
      .text(cx, barY + barH + 4 + 14, '0%', {
        fontFamily,
        fontSize: '10px',
        color: '#aaaaaa',
      })
      .setOrigin(0.5, 0)
      .setDepth(5);

    const statusText = this.add
      .text(cx, barY + barH + 4 + 14 + 18, 'LOADING...', {
        fontFamily,
        fontSize: '7px',
        color: '#555577',
      })
      .setOrigin(0.5, 0)
      .setDepth(5);

    // ─── Load event listeners ─────────────────────────────────────────────────
    this.load.on('progress', (value) => {
      const fillW = Math.floor(barMaxW * value);
      fillRect.width = fillW;
      shimmerRect.width = fillW;
      percentText.setText(Math.floor(value * 100) + '%');
    });

    this.load.on('fileprogress', (file) => {
      const key = file.key.length > 24 ? file.key.substring(0, 24) : file.key;
      statusText.setText(key.toUpperCase());
    });

    this.load.on('complete', () => {
      percentText.setText('100%');
      statusText.setText('► READY!');
      this.tweens.add({
        targets: pixelText,
        alpha: 1.0,
        duration: 200,
      });
    });

    // ─── Corner decorations ───────────────────────────────────────────────────
    const cornerGfx = this.add.graphics().setDepth(9);
    cornerGfx.lineStyle(3, 0xffcc00, 0.6);
    const cLen = 20;

    // Top-left
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(8, 8, 8 + cLen, 8));
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(8, 8, 8, 8 + cLen));

    // Top-right
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(width - 8, 8, width - 8 - cLen, 8));
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(width - 8, 8, width - 8, 8 + cLen));

    // Bottom-left
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(8, height - 8, 8 + cLen, height - 8));
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(8, height - 8, 8, height - 8 - cLen));

    // Bottom-right
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(width - 8, height - 8, width - 8 - cLen, height - 8));
    cornerGfx.strokeLineShape(new Phaser.Geom.Line(width - 8, height - 8, width - 8, height - 8 - cLen));

    // ─── Asset loading ────────────────────────────────────────────────────────
    ASSET_MANIFEST.forEach((asset) => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, asset.config);
      } else if (asset.type === 'tilemapTiledJSON') {
        this.load.tilemapTiledJSON(asset.key, asset.path);
      } else if (asset.type === 'audio') {
        this.load.audio(asset.key, asset.path);
      } else if (asset.type === 'atlas') {
        this.load.atlas(asset.key, asset.path, asset.jsonPath);
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
      const textureKey = anim.assetKey || ASSETS.PLAYER;
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(textureKey, {
          start: anim.start,
          end: anim.end,
        }),
        frameRate: anim.rate,
        repeat: anim.repeat,
      });
    });
  }
}
