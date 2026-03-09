import Phaser from 'phaser';
import StateMachine from '../../player/StateMachine';
import EnemyIdleState from './states/EnemyIdleState';
import EnemyChaseState from './states/EnemyChaseState';
import EnemyAttackState from './states/EnemyAttackState';
import EnemyHurtState from './states/EnemyHurtState';
import EnemyDeadState from './states/EnemyDeadState';

/**
 * @typedef {Object} EnemyConfig
 * @property {number} maxHealth - Maximum HP.
 * @property {number} speed     - Movement speed in px/s.
 * @property {number} damage    - Damage dealt to the player per hit.
 * @property {number} visionRange  - Distance (px) at which the enemy starts chasing the player.
 * @property {number} attackRange  - Distance (px) at which the enemy can attack the player.
 * @property {number} attackCooldown - Milliseconds between attacks.
 * @property {object} [attackHitbox] - Configuration for attack hitbox {width, height, offsetX, offsetY, hitFrame}.
 * @property {{ idle: string, move: string, death: string }} animKeys - Animation key names.
 */

/**
 * Abstract base class for all enemy entities.
 * Handles physics setup, the state machine lifecycle, and damage logic.
 * Concrete enemy classes (e.g. Slime) extend this and pass an EnemyConfig.
 *
 * @abstract
 * @extends Phaser.Physics.Arcade.Sprite
 */
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} texture
   * @param {EnemyConfig} config
   */
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    /** @type {number} */
    this.maxHealth = config.maxHealth;
    /** @type {number} */
    this.health = config.maxHealth;
    /** @type {number} */
    this.speed = config.speed;
    /** @type {number} */
    this.damage = config.damage;
    /** @type {number} */
    this.visionRange = config.visionRange;
    /** @type {number} */
    this.attackRange = config.attackRange;
    /** @type {number} */
    this.attackCooldown = config.attackCooldown ?? 1000;
    /** @type {{ idle: string, move: string, death: string }} */
    this.animKeys = config.animKeys;

    /** @type {Phaser.Time.TimerEvent|null} */
    this.attackCooldownTimer = null;

    /** @type {object|null} */
    this.attackHitboxConfig = config.attackHitbox || null;

    /** @type {string|null} */
    this.attackSfx = config.attackSfx || null;
    /** @type {string|null} */
    this.hurtSfx = config.hurtSfx || null;
    /** @type {string|null} */
    this.deathSfx = config.deathSfx || null;

    /** @type {boolean} */
    this.facesLeftByDefault = false;

    // Physics defaults – subclasses can override after calling super()
    this.body.setGravityY(300);
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    // FSM – stateArgs = [enemy] so each state receives the enemy instance
    this.stateMachine = new StateMachine(
      'idle',
      {
        idle:   new EnemyIdleState(this),
        chase:  new EnemyChaseState(this),
        attack: new EnemyAttackState(this),
        hurt:   new EnemyHurtState(this),
        dead:   new EnemyDeadState(this),
      },
      [this]
    );

    this.stateMachine.transition('idle');
  }

  /**
   * Apply damage to the enemy.
   * Guards against double-hits while already in a terminal/hurt state.
   *
   * @param {number} amount - Amount of damage to apply.
   * @param {number} [knockbackForce=0] - Magnitude of the knockback.
   * @param {number} [sourceX] - X coordinate of the attacker to determine knockback direction.
   */
  takeDamage(amount, knockbackForce = 0, sourceX = null) {
    const currentStateName = Object.keys(this.stateMachine.possibleStates).find(
      key => this.stateMachine.possibleStates[key] === this.stateMachine.state
    );

    // Ignore hits while dying or already in hurt state
    if (currentStateName === 'dead' || currentStateName === 'hurt') return;

    this.health = Math.max(0, this.health - amount);
    
    // Store knockback data for the Hurt state to use
    this.lastKnockbackForce = knockbackForce;
    this.lastAttackerX = sourceX;

    this.stateMachine.transition('hurt');
  }

  /**
   * Called every frame by the scene or physics group.
   * Delegates updates to the active FSM state.
   *
   * @param {number} time
   * @param {number} delta
   */
  update(time, delta) {
    this.stateMachine.step();
  }

  /**
   * Automatically flips the character sprite to look at the player's current position.
   */
  facePlayer() {
    if (!this.scene || !this.scene.player) return;
    const direction = this.scene.player.x < this.x ? -1 : 1;
    const focusLeft = direction === -1;
    
    // If the sprite naturally faces left, flipX=true makes it face right.
    // Если naturally faces right, flipX=true makes it face left.
    this.setFlipX(this.facesLeftByDefault ? !focusLeft : focusLeft);
  }
}
