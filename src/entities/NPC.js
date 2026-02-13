import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  /**
   * Creates an NPC instance.
   * @param {Phaser.Scene} scene - The scene this NPC belongs to.
   * @param {number} x - The x coordinate.
   * @param {number} y - The y coordinate.
   * @param {string} texture - The texture key.
   * @param {string} [initialAnim] - Optional initial animation to play.
   */
  constructor(scene, x, y, texture, initialAnim) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);

    // Default Physics config
    this.body.setSize(32, 32); 
    this.body.setOffset(0, 0);

    // Play initial animation if provided
    if (initialAnim) {
      this.play(initialAnim);
    }

    // Movement properties
    this.moveSpeed = 50;
    this.moveRange = 100;
    this.startX = x;
    this.direction = 1; // 1 for right, -1 for left
    this.canMove = true;
    
    // Internal state
    this.moveTimer = 0;
  }

  /**
   * Updates the NPC state.
   * @param {number} time - Current time.
   * @param {number} delta - Delta time since last frame.
   */
  update(time, delta) {
    if (!this.canMove) return;

    this.patrolBehavior();
  }

  /**
   * Handles the NPC's patrol movement logic.
   * Moves back and forth within a defined range.
   */
  patrolBehavior() {
    // Simple side-to-side patrol
    this.setVelocityX(this.moveSpeed * this.direction);

    // Flip sprite based on direction
    this.setFlipX(this.direction < 0);

    // Turn around at limits
    if (this.x > this.startX + this.moveRange) {
      this.direction = -1;
    } else if (this.x < this.startX - this.moveRange) {
      this.direction = 1;
    }
  }
}
