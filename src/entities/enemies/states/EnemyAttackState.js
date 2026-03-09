import EnemyState from './EnemyState';

/**
 * Enemy Attack State.
 * Deals damage to the player on contact and plays the attack animation.
 * After the attack cooldown, transitions back to Chase or Idle depending on distance.
 */
export default class EnemyAttackState extends EnemyState {
  /** @param {import('../Enemy').default} enemy */
  enter(enemy) {
    enemy.setVelocityX(0);
    // Slime attack = body slam / contact damage. Play idle as the attack anim.
    // If you later add a dedicated attack row you can swap animKeys.attack here.
    enemy.anims.play(enemy.animKeys.idle, true);

    // Deal damage to player immediately on entering attack state
    if (enemy.scene.player.takeDamage) {
      enemy.scene.player.takeDamage(enemy.damage);
    }

    // Cool-down before next attack
    enemy.attackCooldownTimer = enemy.scene.time.addEvent({
      delay: enemy.attackCooldown,
      callback: () => this._afterAttack(enemy),
      callbackScope: this,
    });
  }

  /** @param {import('../Enemy').default} enemy */
  _afterAttack(enemy) {
    if (!enemy.active || !enemy.stateMachine) return;

    const player = enemy.scene.player;
    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
    if (dist <= enemy.attackRange) {
      // Still in range: attack again
      enemy.stateMachine.transition('attack');
    } else {
      enemy.stateMachine.transition('chase');
    }
  }

  /** @param {import('../Enemy').default} enemy */
  exit(enemy) {
    if (enemy.attackCooldownTimer) {
      enemy.attackCooldownTimer.remove(false);
      enemy.attackCooldownTimer = null;
    }
  }
}
