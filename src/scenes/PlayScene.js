import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    // 0. Background (Parallax)
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Background (Parallax with TileSprite)
    // 1. Background (Disabled for now)
    // const bg1Tex = this.textures.get('bg1').getSourceImage();
    // const bg1ScaleX = width / bg1Tex.width;
    // const bg1ScaleY = height / bg1Tex.height;

    // this.bg1 = this.add.tileSprite(0, 0, width, height, 'bg1')
    //     .setOrigin(0, 0)
    //     .setScrollFactor(0)
    //     .setTileScale(bg1ScaleX, bg1ScaleY);
        
    // const bg2Tex = this.textures.get('bg2').getSourceImage();
    // const bg2ScaleX = width / bg2Tex.width;
    // const bg2ScaleY = height / bg2Tex.height;

    // this.bg2 = this.add.tileSprite(0, 0, width, height, 'bg2')
    //     .setOrigin(0, 0)
    //     .setScrollFactor(0)
    //     .setTileScale(bg2ScaleX, bg2ScaleY);
        
    // const bg3Tex = this.textures.get('bg3').getSourceImage();
    // const bg3ScaleX = width / bg3Tex.width;
    // const bg3ScaleY = height / bg3Tex.height;

    // this.bg3 = this.add.tileSprite(0, 0, width, height, 'bg3')
    //     .setOrigin(0, 0)
    //     .setScrollFactor(0)
    //     .setTileScale(bg3ScaleX, bg3ScaleY);

    // 2. Create Layout
    this.createLevel();

    // 3. Create Player
    this.createPlayer();

    // 4. Collisions
    this.physics.add.collider(this.player, this.platforms);

    // 5. Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // 6. Interactables
    this.createInteractables();

    // Camera follow
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 2400, 600);
    this.cameras.main.setZoom(2.5); // Zoomed in closer for pixel art look
  }

  createLevel() {
    this.platforms = this.physics.add.staticGroup();

    // 1. Continuous Ground (Base Floor)
    // Spans the entire world width
    this.createPlatform(0, 2400, 580);

    // 2. Elevated Platforms (Floating or Steps)
    // Platform 1 (Low)
    this.createPlatform(600, 900, 490);

    // Platform 2 (High - requiring jump)
    this.createPlatform(1000, 1500, 420);

    // Platform 3 (Higher/Farther)
    this.createPlatform(1700, 2000, 350);

    // Decorations
    this.add.image(200, 595 - 14, 'fence_1').setOrigin(0.5, 1);
    this.add.image(400, 595 - 14, 'fence_2').setOrigin(0.5, 1);
    
    // Props on platforms
    this.add.image(750, 450, 'lamp').setOrigin(0.5, 1);
    this.add.image(1200, 320, 'rock_1').setOrigin(0.5, 1);
  }

  createPlatform(startX, endX, y) {
    const tileWidth = 24;
    for (let x = startX; x < endX; x += tileWidth) {
        const tile = this.platforms.create(x, y, 'tiles', 2);
        tile.setOrigin(0, 0);
        tile.refreshBody();
        
        // Add minimal "soil" look below (one layer deep)
        this.add.image(x, y + 24, 'tiles', 26).setOrigin(0, 0);
    }
  }

  createPlayer() {
    // Add player sprite
    this.player = this.physics.add.sprite(100, 550, 'player');

    // Physics properties
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    
    this.player.body.setSize(20, 30);
    this.player.body.setOffset(18, 26);

    this.player.play('idle');
    
    this.physics.world.setBounds(0, 0, 2400, 800);
  }

  createInteractables() {
    this.interactables = this.physics.add.staticGroup();
    
    // About Me (Shop) - On Ground
    const aboutShop = this.interactables.create(300, 580, 'shop');
    aboutShop.setOrigin(0.5, 1); 
    aboutShop.setData('type', 'about');
    aboutShop.refreshBody();
    
    // Skills (Sign) - On Platform 1
    const skillsSign = this.interactables.create(730, 490, 'sign');
    skillsSign.setOrigin(0.5, 1);
    skillsSign.setData('type', 'skills');
    skillsSign.refreshBody();

    // Projects (Sign) - On Platform 2
    const projectsSign = this.interactables.create(1300, 320, 'sign');
    projectsSign.setOrigin(0.5, 1);
    projectsSign.setData('type', 'projects');
    projectsSign.refreshBody();
  }

  handleInteraction(player, interactable) {
    if (this.cursors.up.isDown) {
        const type = interactable.getData('type');
        this.triggerModal(type);
    }
  }

  update() {
    const speed = 160;
    const jumpForce = -500;
    
    const onGround = this.player.body.touching.down;

    // 1. Horizontal Movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // 2. Jumping Input
    if (this.cursors.up.isDown && onGround) {
      this.player.setVelocityY(jumpForce);
    }

    // 3. Animation Control
    if (!onGround) {
        // In Air
        this.player.anims.play('jump', true);
    } else {
        // On Ground
        if (this.player.body.velocity.x !== 0) {
            this.player.anims.play('run', true);
        } else {
            this.player.anims.play('idle', true);
        }
    }

    // Interaction Check
    this.physics.overlap(this.player, this.interactables, this.handleInteraction, null, this);
    
    // Parallax: Scroll texture inside the fixed container (Disabled)
    // if (this.bg1) this.bg1.tilePositionX = this.cameras.main.scrollX * 0.1; 
    // if (this.bg2) this.bg2.tilePositionX = this.cameras.main.scrollX * 0.5;
    // if (this.bg3) this.bg3.tilePositionX = this.cameras.main.scrollX * 0.8;
  }

  triggerModal(type) {
    // Avoid spamming events while holding key
    // A cooldown or check if paused would be good, but game pauses on open, so simple dispatch is fine.
    const event = new CustomEvent('open-modal', { detail: { type: type } });
    window.dispatchEvent(event);
  }
}
