import Enemy from './Enemy';
import { ASSETS } from '../../utils/Constants';

/**
 * Slime enemy – a slow melee enemy that chases the player on sight.
 *
 * Supported variants: blue, green, red (controlled by the `variant` parameter).
 * The variant determines which preloaded spritesheet texture is used.
 *
 * Spritesheet layout (32x32 per frame):
 *   Row 0 → Idle   (frames 0-n)
 *   Row 1 → Move   (frames n-m)
 *   Row 2 → Death  (frames m-k)
 *
 * @extends Enemy
 */
export default class Slime extends Enemy {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} [width] - Desired width from Tiled.
   * @param {number} [height] - Desired height from Tiled.
   * @param {'blue'|'green'|'red'} [variant='blue'] - Slime color variant.
   */
  constructor(scene, x, y, width, height, variant = 'blue') {
    const texture = Slime.textureForVariant(variant);
    const animKeys = Slime.animKeysForVariant(variant);
    const stats = Slime.statsForVariant(variant);

    super(scene, x, y, texture, {
      ...stats,
      animKeys,
    });

    // --- Scale: set via native setScale so Phaser's physics body auto-derives world size ---
    const frameSize = 32; // spritesheet native frame size
    const scaleX = width  ? width  / frameSize : 1;
    const scaleY = height ? height / frameSize : 1;

    this.setScale(scaleX, scaleY);

    this.body.setSize(20, 16);
    this.body.setOffset(6, 16);
  }

  /**
   * Maps a variant name to its ASSETS constant.
   * @param {'blue'|'green'|'red'} variant
   * @returns {string}
   */
  static textureForVariant(variant) {
    const map = {
      blue:  ASSETS.SLIME_BLUE,
      green: ASSETS.SLIME_GREEN,
      red:   ASSETS.SLIME_RED,
    };
    return map[variant] ?? ASSETS.SLIME_BLUE;
  }

  /**
   * Returns the set of animation keys for this variant,
   * so each variant plays its own registered animations.
   * @param {'blue'|'green'|'red'} variant
   * @returns {{ idle: string, move: string, death: string }}
   */
  static animKeysForVariant(variant) {
    return {
      idle:  `slime_${variant}_idle`,
      move:  `slime_${variant}_move`,
      death: `slime_${variant}_death`,
    };
  }

  /**
   * Returns the base stats for the given slime variant.
   * Green is weak, blue is medium, red is strong.
   * @param {'blue'|'green'|'red'} variant
   * @returns {import('./Enemy').EnemyConfig}
   */
  static statsForVariant(variant) {
    // Note: animKeys is intentionally omitted here as it's merged in the constructor
    const stats = {
      green: {
        maxHealth: 2,
        speed: 35,
        damage: 1,
        visionRange: 150,
        attackRange: 24,
        attackCooldown: 1200, // Slower attack
      },
      blue: {
        maxHealth: 3,
        speed: 50,
        damage: 2,
        visionRange: 200,
        attackRange: 24,
        attackCooldown: 900,
      },
      red: {
        maxHealth: 5,
        speed: 65,
        damage: 3,
        visionRange: 250,
        attackRange: 28,
        attackCooldown: 700, // Faster attack
      },
    };

    return stats[variant] ?? stats.blue;
  }
}
