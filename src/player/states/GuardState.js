import State from './State';

export default class GuardState extends State {
  enter() {
    this.player.setVelocityX(0); // Stop moving
    // Optional: add a SFX here if needed like AUDIO.SFX.SHIELD_UP
    this.player.anims.play('shield', true);
  }

  update() {
    const { keys } = this.player;

    // As long as L is held down we guard, otherwise we return to idle.
    if (!keys.l.isDown) {
      this.stateMachine.transition('idle');
    }
  }

  exit() {
    // Optional cleanup
  }
}
