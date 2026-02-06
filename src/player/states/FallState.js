import State from './State';

export default class FallState extends State {
  enter() {
    this.player.anims.play('fall', true);
  }

  update() {
    const { cursors, keys } = this.player;
    const speed = 160;

    // Air Control
    if (cursors.left.isDown || keys.a.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (cursors.right.isDown || keys.d.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // Transition to Landing
    if (this.player.body.onFloor()) {
      this.stateMachine.transition('landing');
    }
  }
}
