import State from './State';

export default class IdleState extends State {
  enter() {
    this.player.setVelocityX(0);
    this.player.anims.play('idle', true);
  }

  update() {
    const { cursors, keys } = this.player;

    // Transition to Attack
    if (Phaser.Input.Keyboard.JustDown(keys.j)) {
      this.stateMachine.transition('attack');
      return;
    }

    // Transition to Jump
    if (cursors.up.isDown && this.player.body.onFloor()) {
      this.stateMachine.transition('jump');
      return;
    }

    // Transition to Run
    if (cursors.left.isDown || cursors.right.isDown) {
      this.stateMachine.transition('run');
      return;
    }

    // Transition to Fall (if platform moves or ground removed)
    if (!this.player.body.onFloor()) {
        this.stateMachine.transition('fall');
    }
  }
}
