/**
 * @fileoverview UIScene - Persistent HUD scene rendered on top of gameplay scenes.
 *
 * Runs in parallel with Level2Scene (and optionally PlayScene) via `scene.launch()`.
 * Listens for the 'player-health-changed' event emitted by the Player when it takes
 * damage, and updates the health bar visuals accordingly.
 *
 * Architecture:
 *  - Uses a Geometry Mask: the red bar image is drawn full-width but masked by a
 *    Graphics rectangle whose width is proportional to current HP. This way the
 *    pixel art texture is never distorted -- only revealed/hidden.
 *  - A Phaser Tween animates the mask width smoothly so the bar drains over time,
 *    not snapping.
 *  - The scene is camera-fixed (scrollFactor 0 on all objects) so it always sits
 *    atop the viewport regardless of camera movement in the game scene.
 *
 * @extends Phaser.Scene
 */

import Phaser from 'phaser';
import { ASSETS, SCENES } from '../utils/Constants';

/**
 * Horizontal/vertical position of the HP widget anchor (top-left of the hp_bar frame).
 * Tweak these to move the entire HUD.
 */
const HUD_X = 10;
const HUD_Y = 10;

/**
 * Scale factor applied uniformly to every HUD element.
 */
const HUD_SCALE = 1.5;

/**
 * Pixel offset of the red orb fill RELATIVE to the hp_bar frame's top-left corner,
 * measured in source (unscaled) pixels.
 *
 * hp_bar.png is 116×64. The circular orb cutout starts at roughly (2, 3) in the source.
 * red_bar.png is 56×54 and fills the orb completely at 1x scale.
 */
const RED_OFFSET_X = 4;
const RED_OFFSET_Y = 4;

export default class UIScene extends Phaser.Scene {
  constructor() {
    super(SCENES.UI);
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  /**
   * Phaser calls init() BEFORE create(), passing data from scene.launch(key, data).
   * This is the correct place to capture cross-scene data, NOT settings.data.
   * @param {{ parentScene?: string }} data
   */
  init(data) {
    this._parentScene = data?.parentScene ?? null;
  }

  create() {
    this._setupHealthBar();
    this._listenToParent(this._parentScene);
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  /**
   * Builds the layered HUD widget:
   *   1. Red orb fill  (clipped by an ellipse mask — preserves orb shape)
   *   2. hp_bar frame  (drawn on top, hides fill overflow and adds decoration)
   */
  _setupHealthBar() {
    const redX = HUD_X + RED_OFFSET_X * HUD_SCALE;
    const redY = HUD_Y + RED_OFFSET_Y * HUD_SCALE;

    // -- Red orb fill --
    this._redBar = this.add.image(redX, redY, ASSETS.UI_RED_BAR)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(10)
      .setScale(HUD_SCALE);

    // Use scaled dimensions for the mask
    this._scaledW = this._redBar.displayWidth;
    this._scaledH = this._redBar.displayHeight;

    // Ellipse mask — matches the circular orb shape; no rectangular clipping artifacts
    this._maskGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    this._drawMask(1);
    this._redBar.setMask(this._maskGraphics.createGeometryMask());

    // -- Decorative frame (drawn ABOVE so its edges cover the fill overflow) --
    this._frame = this.add.image(HUD_X, HUD_Y, ASSETS.UI_HP_BAR)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(11)
      .setScale(HUD_SCALE);
  }

  /**
   * Redraws the ellipse mask proportional to `ratio` (0..1).
   * The ellipse covers the full orb at ratio=1 and shrinks horizontally toward 0.
   * Using an ellipse avoids rectangular clipping that would show sharp cut edges on a circle.
   *
   * @param {number} ratio - HP ratio in range [0,1]
   */
  _drawMask(ratio) {
    const clampedRatio = Phaser.Math.Clamp(ratio, 0, 1);
    const redX = HUD_X + RED_OFFSET_X * HUD_SCALE;
    const redY = HUD_Y + RED_OFFSET_Y * HUD_SCALE;

    this._maskGraphics.clear();
    this._maskGraphics.fillStyle(0xffffff);

    // Clip with a rectangle that shrinks horizontally as HP drops.
    // The frame image's overlapping border will naturally hide the straight cut edge.
    this._maskGraphics.fillRect(
      redX,
      redY,
      this._scaledW * clampedRatio,
      this._scaledH
    );
  }

  /**
   * Subscribes to the parent gameplay scene's event bus.
   * The UIScene stays alive independently from gameplay scenes but needs to listen
   * to their events via scene-to-scene event relaying.
   *
   * @param {string} [parentSceneKey] - Key of the launching scene
   */
  _listenToParent(parentSceneKey) {
    if (!parentSceneKey) return;

    const wireScene = (sceneKey) => {
      const target = this.scene.get(sceneKey);
      if (!target) return;

      // Remove any previous listener to avoid duplicates on scene restart
      target.events.off('player-health-changed', this._onHealthChanged, this);
      target.events.on('player-health-changed', this._onHealthChanged, this);
    };

    // Wire immediately since the parent scene is already running when UIScene starts
    wireScene(parentSceneKey);

    // Re-wire if the parent scene restarts (Phaser emits 'start' on the scene's own events)
    this.events.on(Phaser.Scenes.Events.DESTROY, () => {
      const target = this.scene.get(parentSceneKey);
      if (target) {
        target.events.off('player-health-changed', this._onHealthChanged, this);
      }
    });
  }

  /**
   * Callback for the 'player-health-changed' event.
   * Animates the mask width from its current value to the new target ratio.
   *
   * @param {number} currentHP
   * @param {number} maxHP
   */
  _onHealthChanged(currentHP, maxHP) {
    const targetRatio = maxHP > 0 ? currentHP / maxHP : 0;

    // Kill any in-flight tween to avoid conflicts
    if (this._barTween) {
      this._barTween.stop();
    }

    // Derive the starting ratio from the current mask width
    const startRatio = this._currentRatio ?? 1;
    const proxy = { ratio: startRatio };

    this._barTween = this.tweens.add({
      targets: proxy,
      ratio: targetRatio,
      duration: 350,
      ease: 'Sine.easeOut',
      onUpdate: () => {
        this._drawMask(proxy.ratio);
        this._currentRatio = proxy.ratio;
      },
      onComplete: () => {
        this._currentRatio = targetRatio;
      },
    });
  }
}
