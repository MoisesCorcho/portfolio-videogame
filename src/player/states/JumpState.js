import State from './State';
import { AUDIO } from '../../utils/Constants';

export default class JumpState extends State {
  enter() {
    this.player.setVelocityY(-500); // Jump Force
    this.player.scene.audioManager.playSfx(AUDIO.SFX.JUMP, { volume: 0.4 });
    this.player.anims.play('jump', true);
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

    // Transition to Fall: When velocity becomes positive (falling down)
    if (this.player.body.velocity.y > 0) {
      this.stateMachine.transition('fall');
    }
  }
}
