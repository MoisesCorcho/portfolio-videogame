import State from './State';
import { GAME_CONFIG } from '../../config/GameConfig';
import { AUDIO } from '../../utils/Constants';

export default class CriticalAttackState extends State {
  enter() {
    this.player.setVelocityX(0); // Stop moving
    // Reusing the normal attack sound, or we can use another if available
    this.player.scene.audioManager.playSfx(AUDIO.SFX.ATTACK_SWORD, {
      volume: 0.6,
      rate: 0.8 // slightly deeper sound for a heavier attack
    });
    this.player.anims.play('critical_attack', true);

    const scene = this.player.scene;
    this.hitEnemies = new Set();

    // The critical attack hitbox can be slightly larger or positioned differently
    const hitboxX = this.player.flipX ? this.player.x - 18 : this.player.x + 18;
    const hitboxY = this.player.y + 10;
    
    // Instead of reusing attackZone, we can temporarily scale it or just use it as is
    // Assuming we use it as is for now:
    scene.attackZone.body.reset(hitboxX, hitboxY);
    // You could scale the hitbox here if you needed a bigger area for the critical attack
    scene.attackZone.body.setSize(scene.attackZone.width * 1.5, scene.attackZone.height * 1.2);
    scene.attackZone.body.enable = true;

    if (GAME_CONFIG.debug) {
      scene.attackZoneDebug.setPosition(hitboxX, hitboxY);
      // Update debug rect size as well
      scene.attackZoneDebug.setSize(scene.attackZone.width * 1.5, scene.attackZone.height * 1.2);
      scene.attackZoneDebug.setVisible(true);
    }

    this.onAnimComplete = () => {
      this.stateMachine.transition('idle');
    };
    this.player.once('animationcomplete', this.onAnimComplete);
  }

  exit() {
    const scene = this.player.scene;
    scene.attackZone.body.enable = false;
    
    // Reset hitbox size back to normal
    scene.attackZone.body.setSize(scene.attackZone.width / 1.5, scene.attackZone.height / 1.2);

    if (GAME_CONFIG.debug) {
      scene.attackZoneDebug.setVisible(false);
      scene.attackZoneDebug.setSize(scene.attackZone.width, scene.attackZone.height);
    }

    if (this.onAnimComplete) {
      this.player.off('animationcomplete', this.onAnimComplete);
      this.onAnimComplete = null;
    }

    this.hitEnemies = null;
  }

  update() {
    // If animation finishes or stops for any reason, return to idle
    if (!this.player.anims.isPlaying) {
      this.stateMachine.transition('idle');
    }
  }

  // Same logic as standard attack
  canDamage(enemy) {
    if (!this.hitEnemies) return false;
    if (this.hitEnemies.has(enemy)) return false;
    this.hitEnemies.add(enemy);
    return true;
  }
}
