import Phaser from 'phaser'; // Import Phaser to extend Sprite
import StateMachine from './StateMachine';
import IdleState from './states/IdleState';
import RunState from './states/RunState';
import JumpState from './states/JumpState';
import FallState from './states/FallState';
import LandingState from './states/LandingState';
import AttackState from './states/AttackState';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics setup
    this.setBounce(0.1);
    this.setCollideWorldBounds(true);
    this.body.setSize(20, 30);
    this.body.setOffset(18, 26);
    this.setDepth(10);

    // Input init
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      e: Phaser.Input.Keyboard.KeyCodes.E,
      j: Phaser.Input.Keyboard.KeyCodes.J,
    });

    // Valid States
    this.states = {
      idle: new IdleState(scene, this),
      run: new RunState(scene, this),
      jump: new JumpState(scene, this),
      fall: new FallState(scene, this),
      landing: new LandingState(scene, this),
      attack: new AttackState(scene, this),
    };

    // Initialize State Machine
    this.stateMachine = new StateMachine('idle', this.states, [scene, this]);
    this.stateMachine.transition('idle');
  }

  update() {
    this.stateMachine.step();
  }
}
