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

    // Use body.reset() to force the physics body to teleport to the new position
    // This ensures the physics body matches the visual debug box and player position
    scene.attackZone.body.reset(hitboxX, hitboxY);
    scene.attackZone.body.enable = true;

    if (GAME_CONFIG.debug) {
      scene.attackZoneDebug.setPosition(hitboxX, hitboxY);
      scene.attackZoneDebug.setVisible(true);
    }

    // Store listener reference for cleanup in exit()
    this.onAnimComplete = () => {
      this.stateMachine.transition('idle');
    };
    this.player.once('animationcomplete', this.onAnimComplete);
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
