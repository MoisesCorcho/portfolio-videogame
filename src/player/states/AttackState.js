import State from './State';
import { GAME_CONFIG } from '../../config/GameConfig';

export default class AttackState extends State {
  enter() {
    this.player.setVelocityX(0); // Stop moving
    this.player.anims.play('attack1', true);

    // Access scene's attack zone
    const scene = this.player.scene;
    
    // Track which enemies have been hit during this attack
    this.hitEnemies = new Set();
    
    // Position and enable the attack hitbox (closer to player)
    const hitboxX = this.player.flipX ? this.player.x - 14 : this.player.x + 14;
    const hitboxY = this.player.y + 10;
    
    scene.attackZone.setPosition(hitboxX, hitboxY);
    scene.attackZone.body.enable = true;
    
    if (GAME_CONFIG.debug) {
      scene.attackZoneDebug.setPosition(hitboxX, hitboxY);
      scene.attackZoneDebug.setVisible(true);
    }

    this.player.once('animationcomplete', () => {
      this.stateMachine.transition('idle');
    });
  }

  exit() {
    // Disable and hide the attack hitbox when leaving attack state
    const scene = this.player.scene;
    scene.attackZone.body.enable = false;
    
    if (GAME_CONFIG.debug) {
      scene.attackZoneDebug.setVisible(false);
    }
    
    // Clear hit tracking
    this.hitEnemies = null;
  }

  update() {
    // Locked in animation.
    // Could add combo logic here if needed.
  }
  
  // Method to check if an enemy can be damaged
  canDamage(enemy) {
    if (!this.hitEnemies) return false;
    if (this.hitEnemies.has(enemy)) return false;
    this.hitEnemies.add(enemy);
    return true;
  }
}
