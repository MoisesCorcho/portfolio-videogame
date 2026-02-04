
import { DUMMY_ANIMS } from '../data/Animations';

export default class Dummy extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene 
   * @param {number} x 
   * @param {number} y 
   * @param {string} texture 
   */
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics config
    this.setImmovable(true);
    // Adjust size if needed, based on 32x32 sprite but maybe purely for hit box
    this.setSize(20, 32); 
    this.setOffset(6, 0);

    // State
    this.isHurt = false;

    // Start idle animation
    this.play(DUMMY_ANIMS.IDLE.key);

    // Listen for animation completion to return to idle
    this.on('animationcomplete', this.onAnimationComplete, this);
  }

  takeDamage() {
    if (this.isHurt) return;

    this.isHurt = true;
    this.play(DUMMY_ANIMS.HURT.key);
    
    // floating text or sound effect here can be added here
  }

  onAnimationComplete(animation) {
    if (animation.key === DUMMY_ANIMS.HURT.key) {
      this.isHurt = false;
      this.play(DUMMY_ANIMS.IDLE.key);
    }
  }
}
