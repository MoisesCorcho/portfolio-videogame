import State from './State';

export default class JumpState extends State {
  enter() {
    this.player.setVelocityY(-500); // Jump Force
    this.player.anims.play('jump', true);
  }

  update() {
    const { cursors, keys } = this.player;
    const speed = 160;

    // Air Control
    if (cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // Transition to Fall: When velocity becomes positive (falling down)
    if (this.player.body.velocity.y > 0) {
      this.stateMachine.transition('fall');
    }
  }
}
