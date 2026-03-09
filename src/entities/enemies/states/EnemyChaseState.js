import EnemyState from './EnemyState';

/**
 * Enemy Chase State.
 * The enemy moves towards the player's x position.
 * Transitions to AttackState when close enough, or back to IdleState
 * if the player moves beyond the vision range.
 */
export default class EnemyChaseState extends EnemyState {
  /** @param {import('../Enemy').default} enemy */
  enter(enemy) {
    enemy.anims.play(enemy.animKeys.move, true);
  }

  /** @param {import('../Enemy').default} enemy */
  update(enemy) {
    const player = enemy.scene.player;
    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

    // If player escapes vision range, go back to idle
    if (dist > enemy.visionRange) {
      enemy.stateMachine.transition('idle');
      return;
    }

    // If player is within attack range, attack
    if (dist <= enemy.attackRange) {
      enemy.stateMachine.transition('attack');
      return;
    }

    // Move towards player
    const direction = player.x < enemy.x ? -1 : 1;
    enemy.setVelocityX(enemy.speed * direction);
    enemy.setFlipX(direction === -1);
  }

  /** @param {import('../Enemy').default} enemy */
  exit(enemy) {
    enemy.setVelocityX(0);
  }
}
