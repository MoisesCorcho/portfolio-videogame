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
    // 1. Background

    // Sky Main (Fixed)
    // Camera is zoomed 2.5x
    const zoom = 2.5; 
    
    // The camera sees a "world" window smaller than the screen resolution.
    const visibleWidth = width / zoom;
    const visibleHeight = height / zoom;
    
    const skyTex = this.textures.get('sky_main').getSourceImage();
    const skyScale = Math.max(visibleWidth / skyTex.width, visibleHeight / skyTex.height);

    // Use TileSprite to ensure coverage and easier scaling
    // Position at width/2, height/2 (center of screen) but relative to camera (ScrollFactor 0)
    this.add.tileSprite(width / 2, height / 2, visibleWidth, visibleHeight, 'sky_main')
        .setScrollFactor(0)
        .setTileScale(skyScale) // Scale the TILE, not the sprite, usually better but here sprite scale works if ScrollFactor is 0
        .setDepth(-10);

    // 2. Create Layout
    this.createLevel();

    // 3. Create Player
    this.createPlayer();

    // 6. Interactables
    this.createInteractables();

    // 5. Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
        e: Phaser.Input.Keyboard.KeyCodes.E,
        j: Phaser.Input.Keyboard.KeyCodes.J
    });

    // Camera follow behavior
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2.5); 

    // Set bounds to match the map size if map exists
    if (this.map) {
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    } else {
        this.physics.world.setBounds(0, 0, 2400, 800);
        this.cameras.main.setBounds(0, 0, 2400, 600);
    }

    // 7. Collisions (Must be called AFTER creating level and player)
    this.physics.add.collider(this.player, this.platforms);
    
    this.wasOnGround = false;
  }

  createLevel() {
    // Create the map
    const map = this.make.tilemap({ key: 'level1' });
    this.map = map;

    // Add tileset image
    // Ensure the key 'oak_woods_tileset' matches the JSON tileset name
    const tileset = map.addTilesetImage('oak_woods_tileset', 'tiles');

    // Create the Ground layer
    // 'Ground' must match the layer name in Tiled
    const platforms = map.createLayer('Ground', tileset, 0, 0);

    // Set collisions
    // Use a wide range to ensure all visible tiles collide
    platforms.setCollisionBetween(1, 1000);

    // Manual Debug: visualizes collision tiles
    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // platforms.renderDebug(debugGraphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Orange for colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    this.platforms = platforms;
  }

  createPlayer() {
    // Find spawn point from 'Start' layer or 'Objects' layer
    let spawnPoint = null;
    const startLayer = this.map.getObjectLayer('Start');
    const objectsLayer = this.map.getObjectLayer('Objects');

    if (startLayer && startLayer.objects) {
        spawnPoint = startLayer.objects.find(obj => obj.name === 'start');
    }
    
    // If not found in Start layer, try Objects layer
    if (!spawnPoint && objectsLayer && objectsLayer.objects) {
        spawnPoint = objectsLayer.objects.find(obj => obj.name === 'start');
    }
    
    let spawnX = 100;
    let spawnY = 550;

    if (spawnPoint) {
        spawnX = spawnPoint.x;
        spawnY = spawnPoint.y;
    }

    // Add player sprite
    this.player = this.physics.add.sprite(spawnX, spawnY, 'player');
    this.player.setDepth(10); // Ensure player is in front of decorations

    // PhysicsProperties
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(20, 30);
    this.player.body.setOffset(18, 26);

    this.player.play('idle');
  }

  createInteractables() {
    this.interactables = this.physics.add.staticGroup();
    
    const objectsLayer = this.map.getObjectLayer('Objects');
    if (!objectsLayer) return;

    objectsLayer.objects.forEach(obj => {
        // Tiled objects normally anchor bottom-left (0,1) for tiles, but points are (0.5,0.5).
        // We adjusted Phaser sprites to match.
        
        if (obj.name === 'shop') {
            const shop = this.interactables.create(obj.x, obj.y, 'shop');
            shop.setOrigin(0, 1); 
            shop.setData('type', 'profile'); // Changed to profile
            shop.refreshBody();
        } 
        else if (obj.name === 'skills' || obj.name === 'sign') { 
            const sign = this.interactables.create(obj.x, obj.y, 'sign');
            sign.setOrigin(0, 1);
            sign.setData('type', 'skills');
            sign.refreshBody();
        }
        else if (obj.name === 'projects') {
             // Remap projects to experience or keep as unused?
             // Let's use it for Experience if found
            const sign = this.interactables.create(obj.x, obj.y, 'sign');
            sign.setOrigin(0, 1);
            sign.setData('type', 'experience');
            sign.refreshBody();
        }
        else if (obj.name === 'lamp') {
            // Make lamp interactable for Education
            const lamp = this.interactables.create(obj.x, obj.y, 'lamp');
            lamp.setOrigin(0, 1);
            lamp.setData('type', 'education');
            lamp.refreshBody();
        }
        else if (obj.name === 'large_tent') {
             // Large tent -> Experience
             const tent = this.interactables.create(obj.x, obj.y, 'large_tent');
             tent.setOrigin(0, 1);
             tent.setData('type', 'experience');
             tent.refreshBody();
             
             if (obj.width && obj.height) {
                 tent.setDisplaySize(obj.width, obj.height);
             }
        }
        else if (obj.name.startsWith('rock') || obj.name.startsWith('fence')) {
            // Generic visual props
            const img = this.add.image(obj.x, obj.y, obj.name).setOrigin(0, 1);
            
            if (obj.width && obj.height) {
                img.setDisplaySize(obj.width, obj.height);
            }
        }
    });
  }

  handleInteraction(player, interactable) {
    if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
        const type = interactable.getData('type');
        this.triggerModal(type);
    }
  }

  update() {
    const speed = 160;
    const jumpForce = -500;
    
    // Check if player is touching ground (platforms) OR blocked by world bounds (floor)
    const onGround = this.player.body.touching.down || this.player.body.blocked.down;

    // Detect landing
    if (onGround && !this.wasOnGround) {
        // Force landing animation regardless of previous speed
        this.player.anims.play('landing', true);
        this.isLanding = true;
        this.player.setVelocityX(0); // Stop momentum
        this.player.once('animationcomplete', () => {
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === 'landing') {
                this.isLanding = false;
            }
        });
    }
    this.wasOnGround = onGround; // Store for next frame

    // 0. Attack Input
    if (Phaser.Input.Keyboard.JustDown(this.keys.j)) {
        this.player.anims.play('attack1', true);
        this.isLanding = false; // Cancel landing
        this.player.once('animationcomplete', () => {
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === 'attack1') {
                this.player.anims.play('idle', true);
            }
        });
    }

    // Don't interrupt attack animation if it's playing
    if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === 'attack1' && this.player.anims.isPlaying) {
        this.player.setVelocityX(0); // Stop moving while attacking
        return;
    }

    // 1. Horizontal Movement
    // Block movement if currently landing
    if (this.isLanding) {
        this.player.setVelocityX(0);
    } else {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }
    }

    // 2. Jumping Input
    if (this.cursors.up.isDown && onGround) {
      this.player.setVelocityY(jumpForce);
      this.isLanding = false; // Jump cancels landing
    }

    // 3. Animation Control
    if (this.isLanding && this.player.anims.currentAnim && this.player.anims.currentAnim.key === 'landing' && this.player.anims.isPlaying) {
        // Allow landing to play out if valid
    } else {
        if (!onGround) {
            // In Air
            if (this.player.body.velocity.y < 0) {
                this.player.anims.play('jump', true);
            } else {
                this.player.anims.play('fall', true);
            }
        } else {
            // On Ground
            if (this.player.body.velocity.x !== 0) {
                this.player.anims.play('run', true);
            } else {
                this.player.anims.play('idle', true);
            }
        }
    }

    // Interaction Check
    this.physics.overlap(this.player, this.interactables, this.handleInteraction, null, this);
  }

  triggerModal(type) {
    // Avoid spamming events while holding key
    // A cooldown or check if paused would be good, but game pauses on open, so simple dispatch is fine.
    const event = new CustomEvent('open-modal', { detail: { type: type } });
    window.dispatchEvent(event);
  }
}
