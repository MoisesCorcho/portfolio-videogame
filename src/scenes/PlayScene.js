import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    // 1. Create Layout
    this.createLevel();

    // 2. Create Player
    this.createPlayer();

    // 3. Collisions
    this.physics.add.collider(this.player, this.platforms);

    // 4. Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // 5. Interactables
    this.createInteractables();

    // Camera follow
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 2000, 600); // Expanded world width
  }

  createLevel() {
    // Static Group for Physics
    this.platforms = this.physics.add.staticGroup();

    // Ground floor (repeated)
    for (let x = 0; x < 2000; x += 32) {
      this.platforms.create(x + 16, 584, 'ground');
    }

    // Some platforms
    this.platforms.create(400, 450, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
  }

  createPlayer() {
    // Add player sprite
    // x, y, texture
    this.player = this.physics.add.sprite(100, 450, 'player');

    // Physics properties
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(false); // Let him fall off or expand bounds
    this.player.setCollideWorldBounds(true);
    
    // Bounds restricted to world size?
    this.physics.world.setBounds(0, 0, 2000, 600);
  }

  update() {
    const speed = 160;
    const jumpForce = -330;

    // Horizontal Movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    // Jumping
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(jumpForce);
    }

    // Interaction Check
    this.physics.overlap(this.player, this.interactables, this.handleInteraction, null, this);
  }

  createInteractables() {
    this.interactables = this.physics.add.staticGroup();
    
    // About Me (x=300)
    const aboutBlock = this.interactables.create(300, 350, 'block');
    aboutBlock.setData('type', 'about');
    
    // Skills (x=600)
    const skillsBlock = this.interactables.create(600, 350, 'block');
    skillsBlock.setData('type', 'skills');

    // Projects (x=900)
    const projectsBlock = this.interactables.create(900, 350, 'block');
    projectsBlock.setData('type', 'projects');
  }

  handleInteraction(player, interactable) {
    // If player presses UP while overlapping
    if (this.cursors.up.isDown) {
        const type = interactable.getData('type');
        this.triggerModal(type);
    }
  }

  triggerModal(type) {
    // Avoid spamming events while holding key
    // A cooldown or check if paused would be good, but game pauses on open, so simple dispatch is fine.
    const event = new CustomEvent('open-modal', { detail: { type: type } });
    window.dispatchEvent(event);
  }
}
