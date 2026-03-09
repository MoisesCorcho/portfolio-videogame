import State from './State';
import { PLAYER_ANIMS } from '../../data/Animations';

/**
 * Player Dead State.
 * Plays the death animation (rows 6 + 7) and freezes all input permanently
 * until the scene is restarted. This is a terminal state.
 *
 * The scene is responsible for deciding what happens after death
 * (respawn, game-over screen, etc.) by listening to the 'player-dead' event.
 */
export default class DeadState extends State {
  enter() {
    // Halt all movement and disable physics interactions
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);
    this.player.body.setAllowGravity(false);

    this.player.anims.play(PLAYER_ANIMS.DEAD.key, true);

    // Emit a scene-level event so the scene can react (respawn, game-over, etc.)
    this.scene.events.emit('player-dead');
  }

  // No update() — this is a terminal state; no inputs are processed.
  update() {}
}
