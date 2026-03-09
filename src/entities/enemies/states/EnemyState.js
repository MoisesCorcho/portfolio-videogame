/**
 * Base state class for all Enemy Finite State Machine states.
 * All specific enemy states must extend this class.
 *
 * @class EnemyState
 */
export default class EnemyState {
  /**
   * @param {import('../Enemy').default} enemy - The enemy instance that owns this state.
   */
  constructor(enemy) {
    this.enemy = enemy;
    this.scene = enemy.scene;
  }

  /**
   * Called when the FSM transitions INTO this state.
   * @param {import('../Enemy').default} enemy
   */
  enter(enemy) {}

  /**
   * Called every frame while this state is active.
   * @param {import('../Enemy').default} enemy
   * @param {number} time - Total elapsed time.
   * @param {number} delta - Delta time since last frame in ms.
   */
  update(enemy, time, delta) {}

  /**
   * Called when the FSM transitions OUT of this state.
   * @param {import('../Enemy').default} enemy
   */
  exit(enemy) {}
}
