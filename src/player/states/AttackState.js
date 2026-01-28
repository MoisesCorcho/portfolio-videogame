import State from './State';

export default class AttackState extends State {
  enter() {
    this.player.setVelocityX(0); // Stop moving
    this.player.anims.play('attack1', true);

    this.player.once('animationcomplete', () => {
      this.stateMachine.transition('idle');
    });
  }

  update() {
    // Locked in animation.
    // Could add combo logic here if needed.
  }
}
