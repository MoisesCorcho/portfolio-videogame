import State from './State';
import { PLAYER_ANIMS } from '../../data/Animations';

/**
 * Player Hurt State.
 * Plays a brief hit-reaction animation, flashes the sprite red,
 * and transitions back to Idle once the animation completes.
 * While hurt the player cannot attack or move (input is ignored),
 * providing a brief invincibility / stun window.
 */
export default class HurtState extends State {
  enter() {
    this.player.setVelocityX(0);

    // Visual feedback: red tint flash
    this.player.setTint(0xff4444);
    this.scene.time.delayedCall(150, () => {
      if (this.player.active) this.player.clearTint();
    });

    this.player.anims.play(PLAYER_ANIMS.HURT.key, true);

    // Return to idle once the hurt animation finishes
    this.onAnimComplete = (anim) => {
      if (anim.key === PLAYER_ANIMS.HURT.key) {
        this.stateMachine.transition('idle');
      }
    };
    this.player.once('animationcomplete', this.onAnimComplete, this);
  }

  exit() {
    this.player.off('animationcomplete', this.onAnimComplete, this);
    this.onAnimComplete = null;
  }
}
