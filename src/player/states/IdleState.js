import State from './State';

export default class IdleState extends State {
  enter() {
    this.player.setVelocityX(0);
    this.player.anims.play('idle', true);
  }

  update() {
    const { cursors, keys } = this.player;

    // Transition to Attack, Critical Attack, Guard
    if (Phaser.Input.Keyboard.JustDown(keys.k)) {
      this.stateMachine.transition('critical_attack');
      return;
    } else if (Phaser.Input.Keyboard.JustDown(keys.j)) {
      this.stateMachine.transition('attack');
      return;
    } else if (keys.l.isDown) {
      this.stateMachine.transition('guard');
      return;
    }

    // Transition to Jump
    if ((cursors.up.isDown || keys.w.isDown) && this.player.body.onFloor()) {
      this.stateMachine.transition('jump');
      return;
    }

    // Transition to Run
    if (
      cursors.left.isDown ||
      cursors.right.isDown ||
      keys.a.isDown ||
      keys.d.isDown
    ) {
      this.stateMachine.transition('run');
      return;
    }

    // Transition to Fall (if platform moves or ground removed)
    if (!this.player.body.onFloor() && this.player.body.velocity.y > 10) {
      this.stateMachine.transition('fall');
    }
  }
}
