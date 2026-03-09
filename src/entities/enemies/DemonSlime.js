import Enemy from './Enemy';
import { ASSETS, AUDIO } from '../../utils/Constants';

/**
 * DemonSlime boss enemy.
 * Has customized hitbox and animations.
 *
 * Spritesheet layout (166x288 per frame):
 *   Row 0 → Idle   (frames 0-21)
 *   Row 1 → Walk   (frames 22-43)
 *   Row 2 → Attack (frames 44-65)
 *   Row 3 → Hurt   (frames 66-87)
 *   Row 4 → Death  (frames 88-109)
 *
 * @extends Enemy
 */
export default class DemonSlime extends Enemy {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} [width] - Box width from Tiled.
   * @param {number} [height] - Box height from Tiled.
   */
  constructor(scene, x, y, width, height) {
    const stats = {
      maxHealth: 15,
      speed: 45,
      damage: 3,
      visionRange: 350,
      attackRange: 140,
      attackCooldown: 1500,
      attackHitbox: {
        width: 120,
        height: 140,
        offsetX: 100, // Distance from center based on facing direction
        offsetY: 0,
        hitFrame: 10, // Triggers damage at the 12th frame (sword comes down ~frame 12/14)
      }
    };

    const animKeys = {
      idle: 'demon_slime_idle',
      move: 'demon_slime_move',
      attack: 'demon_slime_attack',
      hurt: 'demon_slime_hurt',
      death: 'demon_slime_death',
    };

    super(scene, x, y, ASSETS.DEMON_SLIME, {
      ...stats,
      animKeys,
      attackSfx: AUDIO.SFX.DEMON_SLIME_ATTACK,
      hurtSfx:   AUDIO.SFX.DEMON_SLIME_HURT,
      deathSfx:  AUDIO.SFX.DEMON_SLIME_DEATH,
    });

    const frameWidth = 288;
    const frameHeight = 160;
    
    // Default 1x scale
    this.setScale(1);

    // User requested hitbox: 128x96
    this.body.setSize(128, 96);
    
    // Center it horizontally: (288 - 128) / 2 = 80
    // Align to bottom vertically: 160 - 96 = 64
    this.body.setOffset(80, 64);
    
    // This spritesheet is drawn facing Left naturally
    this.facesLeftByDefault = true;
  }
}
