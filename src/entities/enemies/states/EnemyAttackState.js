import EnemyState from './EnemyState';

/**
 * Enemy Attack State.
 * Deals damage to the player on contact and plays the attack animation.
 * After the attack cooldown, transitions back to Chase or Idle depending on distance.
 */
export default class EnemyAttackState extends EnemyState {
  /** @param {import('../Enemy').default} enemy */
  enter(enemy) {
    enemy.setVelocityX(0);
    enemy.facePlayer();
    
    enemy.hasAttackedThisCycle = false;

    // Play attack animation if it exists, otherwise fallback to idle.
    if (enemy.animKeys.attack) {
      if (enemy.attackSfx) {
        enemy.scene.audioManager.playSfx(enemy.attackSfx, { volume: 0.8 });
      }
      enemy.anims.play(enemy.animKeys.attack, true);
      
      // Listen for the precise frame to deal damage
      this.onAnimUpdate = (anim, frame) => {
        if (anim.key === enemy.animKeys.attack && !enemy.hasAttackedThisCycle) {
          const hitFrame = enemy.attackHitboxConfig ? enemy.attackHitboxConfig.hitFrame : Math.floor(anim.frames.length / 2);
          if (frame.index >= hitFrame) {
            enemy.hasAttackedThisCycle = true;
            this.executeAttackHitbox(enemy);
          }
        }
      };
      
      enemy.on('animationupdate', this.onAnimUpdate);
    } else {
      // Slime attack fallback = body slam / contact damage. Play idle as the attack anim.
      enemy.anims.play(enemy.animKeys.idle, true);
      
      // Delay fallback damage slightly
      enemy.scene.time.delayedCall(200, () => {
        if (enemy.active && !enemy.hasAttackedThisCycle) {
            enemy.hasAttackedThisCycle = true;
            this.executeAttackHitbox(enemy);
        }
      });
    }

    // Cool-down before next attack
    enemy.attackCooldownTimer = enemy.scene.time.addEvent({
      delay: enemy.attackCooldown,
      callback: () => this._afterAttack(enemy),
      callbackScope: this,
    });
  }

  /** @param {import('../Enemy').default} enemy */
  executeAttackHitbox(enemy) {
    if (!enemy.active || !enemy.scene || !enemy.scene.player) return;

    const player = enemy.scene.player;
    const config = enemy.attackHitboxConfig || { width: 40, height: 40, offsetX: 20, offsetY: 0 };
    
    // Determine the direction the enemy is facing right now
    const isFacingRight = enemy.facesLeftByDefault ? enemy.flipX : !enemy.flipX;
    
    // Calculate where the hitbox should be placed
    const hitX = isFacingRight ? enemy.x + config.offsetX : enemy.x - config.offsetX;
    const hitY = enemy.y + config.offsetY;
    
    const hitBox = new Phaser.Geom.Rectangle(
      hitX - config.width / 2, 
      hitY - config.height / 2, 
      config.width, 
      config.height
    );
    
    const playerBounds = new Phaser.Geom.Rectangle(player.body.x, player.body.y, player.body.width, player.body.height);
    
    if (Phaser.Geom.Intersects.RectangleToRectangle(hitBox, playerBounds)) {
      if (player.takeDamage) {
        player.takeDamage(enemy.damage);
      }
    }
  }

  /** @param {import('../Enemy').default} enemy */
  _afterAttack(enemy) {
    if (!enemy.active || !enemy.stateMachine) return;

    const player = enemy.scene.player;
    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
    if (dist <= enemy.attackRange) {
      // Still in range: attack again
      enemy.stateMachine.transition('attack');
    } else {
      enemy.stateMachine.transition('chase');
    }
  }

  /** @param {import('../Enemy').default} enemy */
  exit(enemy) {
    if (this.onAnimUpdate) {
      enemy.off('animationupdate', this.onAnimUpdate);
      this.onAnimUpdate = null;
    }
    
    if (enemy.attackCooldownTimer) {
      enemy.attackCooldownTimer.remove(false);
      enemy.attackCooldownTimer = null;
    }
  }
}

