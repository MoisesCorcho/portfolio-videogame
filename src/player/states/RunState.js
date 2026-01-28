import State from './State';

export default class RunState extends State {
  enter() {
    this.player.anims.play('run', true);
  }

  update() {
    const { cursors, keys } = this.player;
    const speed = 160;

    // Transition to Attack
    if (Phaser.Input.Keyboard.JustDown(keys.j)) {
      this.stateMachine.transition('attack');
      return;
    }

    // Move Logic
    if (cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      // Stopped moving -> Idle
      this.stateMachine.transition('idle');
      return;
    }

    // Transition to Jump
    if (cursors.up.isDown && this.player.body.onFloor()) {
      this.stateMachine.transition('jump');
      return;
    }

    // Transition to Fall (walked off ledge)
    if (!this.player.body.onFloor()) {
      this.stateMachine.transition('fall');
    }
  }
}
