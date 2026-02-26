import State from './State';

export default class SlideState extends State {
  enter() {
    // Determine slide direction
    const direction = this.player.flipX ? -1 : 1;
    const slideSpeed = 300; // Faster than run speed

    this.player.setVelocityX(slideSpeed * direction);
    
    // Play a suitable sound, reusing jump or dash if available
    // this.player.scene.audioManager.playSfx(AUDIO.SFX.DASH, { volume: 0.5 });
    
    this.player.anims.play('slide', true);

    this.onAnimComplete = () => {
      this.stateMachine.transition('idle');
    };
    this.player.once('animationcomplete', this.onAnimComplete);
  }

  exit() {
    if (this.onAnimComplete) {
      this.player.off('animationcomplete', this.onAnimComplete);
      this.onAnimComplete = null;
    }
  }

  update() {
    // Keep sliding speed constant during the animation
    const direction = this.player.flipX ? -1 : 1;
    this.player.setVelocityX(200 * direction);

    // Failsafe
    if (!this.player.anims.isPlaying) {
      this.stateMachine.transition('idle');
    }
    
    // Transition to Fall if sliding off a ledge
    if (!this.player.body.onFloor() && this.player.body.velocity.y > 10) {
      this.stateMachine.transition('fall');
    }
  }
}
