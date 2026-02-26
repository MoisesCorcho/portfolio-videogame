import State from './State';
import { GAME_CONFIG } from '../../config/GameConfig';
import { AUDIO } from '../../utils/Constants';

export default class AttackState extends State {
  enter() {
    this.player.setVelocityX(0); // Stop moving
    this.player.scene.audioManager.playSfx(AUDIO.SFX.ATTACK_SWORD, {
      volume: 0.5,
    });
    this.player.anims.play('attack1', true);

    // Access scene's attack zone
    const scene = this.player.scene;

    this.comboStep = 1;
    this.comboBuffered = false;
    this.startComboStep(this.comboStep);

    // Store listener reference for cleanup in exit()
    this.onAnimComplete = () => {
      if (this.comboStep === 1 && this.comboBuffered) {
        this.comboStep = 2;
        this.comboBuffered = false;
        this.startComboStep(this.comboStep);
      } else {
        this.stateMachine.transition('idle');
      }
    };
    this.player.on('animationcomplete', this.onAnimComplete);
  }

  startComboStep(step) {
    const scene = this.player.scene;
    
    // Clear the set so the new attack hits again
    this.hitEnemies = new Set();
    
    if (step === 1) {
      this.player.anims.play('attack1', true);
    } else if (step === 2) {
      this.player.scene.audioManager.playSfx(AUDIO.SFX.ATTACK_SWORD, { volume: 0.5 });
      this.player.anims.play('attack2', true);
    }

    // Adjust hitbox depending on the step, can be improved later
    const hitboxX = this.player.flipX ? this.player.x - 14 : this.player.x + 14;
    const hitboxY = this.player.y + 10;
    
    scene.attackZone.body.reset(hitboxX, hitboxY);
    scene.attackZone.body.enable = true;

    if (GAME_CONFIG.debug) {
      scene.attackZoneDebug.setPosition(hitboxX, hitboxY);
      scene.attackZoneDebug.setVisible(true);
    }
  }

  exit() {
    // Disable and hide the attack hitbox when leaving attack state
    const scene = this.player.scene;
    scene.attackZone.body.enable = false;

    if (GAME_CONFIG.debug) {
      scene.attackZoneDebug.setVisible(false);
    }

    // Remove animation listener to prevent zombie transitions if state was interrupted
    if (this.onAnimComplete) {
      this.player.off('animationcomplete', this.onAnimComplete);
      this.onAnimComplete = null;
    }

    // Clear hit tracking
    this.hitEnemies = null;
  }

  update() {
    const { keys } = this.player;
    
    // Buffer input for combo if we are at step 1
    if (this.comboStep === 1 && Phaser.Input.Keyboard.JustDown(keys.j)) {
      this.comboBuffered = true;
    }

    // Failsafe: If animation finishes or stops for any reason, return to idle
    if (!this.player.anims.isPlaying) {
      this.stateMachine.transition('idle');
    }
  }

  // Method to check if an enemy can be damaged
  canDamage(enemy) {
    if (!this.hitEnemies) return false;
    if (this.hitEnemies.has(enemy)) return false;
    this.hitEnemies.add(enemy);
    return true;
  }
}
