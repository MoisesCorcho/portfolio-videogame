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
    if (this.stepTimer > 350) { // ~3 steps per second
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
    if (!this.player.body.onFloor()) {
      this.stateMachine.transition('fall');
    }
  }
}
