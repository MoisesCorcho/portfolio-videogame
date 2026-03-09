import EnemyState from './EnemyState';
import { AUDIO } from '../../../utils/Constants';

/**
 * Enemy Hurt State.
 * Plays a flash/tint effect and briefly interrupts the enemy.
 * Transitions to DeadState if health reaches 0, otherwise back to Chase.
 */
export default class EnemyHurtState extends EnemyState {
  /** @param {import('../Enemy').default} enemy */
  enter(enemy) {
    const hurtSfx = enemy.hurtSfx ?? AUDIO.SFX.SLIME_IMPACT;
    enemy.scene.audioManager.playSfx(hurtSfx, { volume: 0.6 });
    // Determine knockback direction
    const force = enemy.lastKnockbackForce || 50; // Fallback to 50 if 0
    let dirX = 1;
    
    // If we know where the attack came from, get pushed away
    if (enemy.lastAttackerX !== undefined && enemy.lastAttackerX !== null) {
      dirX = enemy.x > enemy.lastAttackerX ? 1 : -1;
    } else {
      // Fallback: get pushed opposite to the direction we are currently facing
      const isFacingRight = enemy.facesLeftByDefault ? enemy.flipX : !enemy.flipX;
      dirX = isFacingRight ? -1 : 1;
    }

    enemy.setVelocityX(force * dirX);
    
    // Slight vertical pop to make the hit feel impactful
    if (enemy.body.onFloor()) {
      enemy.setVelocityY(-100);
    }

    // Visual feedback: red flash
    enemy.setTint(0xff4444);
    if (enemy.animKeys.hurt) {
      enemy.anims.play(enemy.animKeys.hurt, true);
    }
    
    enemy.scene.time.delayedCall(120, () => {
      if (enemy.active) enemy.clearTint();
    });

    // Brief stun
    enemy.scene.time.delayedCall(250, () => {
      if (!enemy.active || !enemy.stateMachine) return;
      if (enemy.health <= 0) {
        enemy.stateMachine.transition('dead');
      } else {
        enemy.stateMachine.transition('chase');
      }
    });
  }
}
