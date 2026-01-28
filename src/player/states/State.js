/**
 * Base State class for the Finite State Machine (FSM).
 * All specific player states (Idle, Run, Jump, etc.) should extend this class.
 * It provides the structure for handling entering, updating, and exiting states,
 * allowing for organized and modular player behavior logic.
 */
export default class State {
  /**
   * Initializes the state instance.
   * This is called once when the state is created by the StateMachine.
   *
   * @param {Phaser.Scene} scene - The Phaser scene instance the player belongs to.
   * @param {Player} player - The player sprite instance that this state controls.
   */
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
  }

  /**
   * Called automatically by the StateMachine when transitioning INTO this state.
   * Use this method to set up the state, such as playing a specific animation,
   * playing a sound effect, resetting timers, or setting initial physics velocities.
   */
  enter() {
    // Override in subclasses
  }

  /**
   * Called every frame (typically 60 times per second) while this state is active.
   * Use this method to handle continuous logic such as:
   * - Checking for user input (keyboard presses).
   * - Updating physics (velocity, movement).
   * - Checking conditions for transitioning to other states (e.g., if velocity > 0, go to Run).
   */
  update() {
    // Override in subclasses
  }

  /**
   * Called automatically by the StateMachine when transitioning OUT of this state.
   * Use this method to clean up any temporary data or effects created by this state.
   * For example, stopping a specific sound loop or resetting a specific flag.
   */
  exit() {
    // Override in subclasses
  }
}
