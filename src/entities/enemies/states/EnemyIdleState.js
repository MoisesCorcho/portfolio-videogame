import EnemyState from './EnemyState';

/**
 * Enemy Idle State.
 * The enemy stands still and continuously checks its distance to the player.
 * Transitions to ChaseState once the player enters the enemy's vision range.
 */
export default class EnemyIdleState extends EnemyState {
  /** @param {import('../Enemy').default} enemy */
  enter(enemy) {
    enemy.setVelocityX(0);
    enemy.anims.play(enemy.animKeys.idle, true);
  }

  /** @param {import('../Enemy').default} enemy */
  update(enemy) {
    const dist = Phaser.Math.Distance.Between(
      enemy.x, enemy.y,
      enemy.scene.player.x, enemy.scene.player.y
    );

    if (dist <= enemy.visionRange) {
      enemy.stateMachine.transition('chase');
    } else {
      enemy.facePlayer();
    }
  }
}
