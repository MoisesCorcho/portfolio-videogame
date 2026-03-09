import Phaser from 'phaser'; // Import Phaser to extend Sprite
import StateMachine from './StateMachine';
import IdleState from './states/IdleState';
import RunState from './states/RunState';
import JumpState from './states/JumpState';
import FallState from './states/FallState';
import LandingState from './states/LandingState';
import AttackState from './states/AttackState';
import CriticalAttackState from './states/CriticalAttackState';
import SlideState from './states/SlideState';
import GuardState from './states/GuardState';
import HurtState from './states/HurtState';
import DeadState from './states/DeadState';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics setup
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.body.setSize(20, 30);
    this.body.setOffset(18, 26);
    this.setDepth(10);

    // Input init
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      e: Phaser.Input.Keyboard.KeyCodes.E,
      j: Phaser.Input.Keyboard.KeyCodes.J,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      k: Phaser.Input.Keyboard.KeyCodes.K,
      l: Phaser.Input.Keyboard.KeyCodes.L,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // Valid States
    this.states = {
      idle:            new IdleState(scene, this),
      run:             new RunState(scene, this),
      jump:            new JumpState(scene, this),
      fall:            new FallState(scene, this),
      landing:         new LandingState(scene, this),
      attack:          new AttackState(scene, this),
      critical_attack: new CriticalAttackState(scene, this),
      slide:           new SlideState(scene, this),
      guard:           new GuardState(scene, this),
      hurt:            new HurtState(scene, this),
      dead:            new DeadState(scene, this),
    };

    // For tracking combo state or other time-based variables
    this.lastSlideTime = 0;

    // Player stats
    this.maxHealth = 5;
    this.health = 5;

    // Initialize State Machine
    this.stateMachine = new StateMachine('idle', this.states, [scene, this]);
    this.stateMachine.transition('idle');
  }

  /**
   * Applies damage to the player.
   * Guards against hits while already hurt or dead.
   *
   * @param {number} [amount=1]
   */
  takeDamage(amount = 1) {
    const currentKey = Object.keys(this.stateMachine.possibleStates).find(
      (k) => this.stateMachine.possibleStates[k] === this.stateMachine.state
    );
    if (currentKey === 'hurt' || currentKey === 'dead') return;

    this.health = Math.max(0, this.health - amount);

    // Notify the UI layer so the HUD updates independently of the game world
    this.scene.events.emit('player-health-changed', this.health, this.maxHealth);

    if (this.health <= 0) {
      this.stateMachine.transition('dead');
    } else {
      this.stateMachine.transition('hurt');
    }
  }

  update() {
    this.stateMachine.step();
    // this.handleStepUp();
  }

  /**
   * Allows the player to "step up" small obstacles (stairs, rocks)
   * while running without stopping horizontal momentum.
   */
  handleStepUp() {
    const body = this.body;

    // Only handle if on floor and blocked by a wall
    if (!body.blocked.none && body.onFloor()) {
      const isBlocked = body.blocked.left || body.blocked.right;
      const isMovingX = Math.abs(body.velocity.x) > 0;

      if (isBlocked && isMovingX) {
        // Attempt to "lift" the player by a few pixels to clear the step
        const stepHeight = 6;
        this.y -= stepHeight;
      }
    }
  }
}
