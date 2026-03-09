import EnemyState from './EnemyState';

/**
 * Enemy Dead State.
 * Plays the death animation then destroys the enemy game object.
 * This is a terminal state — no transitions back out of it.
 */
export default class EnemyDeadState extends EnemyState {
  /** @param {import('../Enemy').default} enemy */
  enter(enemy) {
    enemy.setVelocityX(0);
    enemy.body.enable = false; // Disable physics so nothing else can interact with it

    enemy.anims.play(enemy.animKeys.death, true);

    // Fade out and destroy after the animation finishes
    enemy.once('animationcomplete', () => {
      enemy.scene.tweens.add({
        targets: enemy,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          enemy.destroy();
        },
      });
    });
  }
}
