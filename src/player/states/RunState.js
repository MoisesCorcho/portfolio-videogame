import State from './State';
import { AUDIO } from '../../utils/Constants';

export default class RunState extends State {
  enter() {
    this.player.anims.play('run', true);
    this.stepTimer = 0;
  }

  update() {
    const { cursors, keys } = this.player;
    const speed = 160;

    // Footsteps
    this.stepTimer += this.player.scene.game.loop.delta;
    if (this.stepTimer > 350) {
      // ~3 steps per second
      // Detect material underfoot
      const playerX = this.player.x;
      const playerY = this.player.y + this.player.height / 2 + 2; // Check just below feet

      let sfxKey = AUDIO.SFX.STEP_GRASS; // Default
      let volume = 0.2;

      // Check ground layer first
      const groundLayer = this.player.scene.platforms;
      if (groundLayer) {
        const tile = groundLayer.getTileAtWorldXY(playerX, playerY);
        if (tile && tile.properties && tile.properties.material === 'stone') {
          sfxKey = AUDIO.SFX.STEP_STONE;
          volume = 0.3; // Stone steps often sound clearer
        }
      }

      this.player.scene.audioManager.playSfx(sfxKey, { volume: volume });
      this.stepTimer = 0;
    }

    // Transition to Attack
    if (Phaser.Input.Keyboard.JustDown(keys.j)) {
      this.stateMachine.transition('attack');
      return;
    }
    
    if (Phaser.Input.Keyboard.JustDown(keys.k)) {
      this.stateMachine.transition('critical_attack');
      return;
    }

    if (keys.l.isDown) {
      // Typically going to guard from a run halts the run instantly
      this.stateMachine.transition('guard');
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(keys.space)) {
      const currentTime = this.player.scene.time.now;
      // You must be genuinely moving (not just pressed key for 1ms) and off cooldown
      if (Math.abs(this.player.body.velocity.x) > 50 && currentTime - this.player.lastSlideTime > 1200) {
        this.player.lastSlideTime = currentTime;
        this.stateMachine.transition('slide');
        return;
      }
    }

    // Move Logic
    if (cursors.left.isDown || keys.a.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (cursors.right.isDown || keys.d.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      // Stopped moving -> Idle
      this.stateMachine.transition('idle');
      return;
    }

    // Transition to Jump
    if ((cursors.up.isDown || keys.w.isDown) && this.player.body.onFloor()) {
      this.stateMachine.transition('jump');
      return;
    }

    // Transition to Fall (walked off ledge)
    if (!this.player.body.onFloor() && this.player.body.velocity.y > 10) {
      this.stateMachine.transition('fall');
    }
  }
}
