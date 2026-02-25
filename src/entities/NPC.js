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

    // Movement properties — patrol is OFF by default.
    // Set canMove = true via Tiled custom property for NPCs that should patrol.
    this.moveSpeed = 50;
    this.moveRange = 100;
    this.startX = x;
    this.direction = 1; // 1 for right, -1 for left
    this.canMove = false; // <-- Default: stationary

    // Dialogue properties
    this.dialogueId = null;       // Set from Tiled custom property
    this.phraseIndex = 0;         // Tracks which phrase to show next

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

  /**
   * Returns the next phrase for this NPC and advances the index.
   * @param {Object} dialogueData - The dialogue entry from NPC_DIALOGUES.
   * @returns {{ name: string, phrase: string }} The NPC name and current phrase.
   */
  getNextPhrase(dialogueData) {
    if (!dialogueData || !dialogueData.phrases || dialogueData.phrases.length === 0) {
      return { name: 'NPC', phrase: '...' };
    }

    const phrase = dialogueData.phrases[this.phraseIndex];
    this.phraseIndex = (this.phraseIndex + 1) % dialogueData.phrases.length;

    return { name: dialogueData.name, phrase };
  }
}
