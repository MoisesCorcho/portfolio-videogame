import Player from '../player/Player';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    // 0. Background (Parallax)
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Background (Parallax with TileSprite)
    // Camera is zoomed 2.5x
    const zoom = 2.5; 
    
    const visibleWidth = width / zoom;
    const visibleHeight = height / zoom;
    
    const skyTex = this.textures.get('sky_main').getSourceImage();
    const skyScale = Math.max(visibleWidth / skyTex.width, visibleHeight / skyTex.height);

    this.add.tileSprite(width / 2, height / 2, visibleWidth, visibleHeight, 'sky_main')
        .setScrollFactor(0)
        .setTileScale(skyScale) 
        .setDepth(-10);

    // 2. Create Layout
    this.createLevel();

    // 3. Create Player (Refactored)
    this.createPlayer();

    // 6. Interactables
    this.createInteractables();

    // 5. Input (Still needed for Interaction check 'E', but player movement is in Player class)
    // We can keep 'keys' here for scene-level inputs if any, but Player handles its own movement inputs.
    this.keys = this.input.keyboard.addKeys({
        e: Phaser.Input.Keyboard.KeyCodes.E
    });

    // Camera follow behavior
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2.5); 

    if (this.map) {
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    } else {
        this.physics.world.setBounds(0, 0, 2400, 800);
        this.cameras.main.setBounds(0, 0, 2400, 600);
    }

    // 7. Collisions
    this.physics.add.collider(this.player, this.platforms);
  }

  createLevel() {
    const map = this.make.tilemap({ key: 'level1' });
    this.map = map;

    const tileset = map.addTilesetImage('oak_woods_tileset', 'tiles');
    const platforms = map.createLayer('Ground', tileset, 0, 0);
    platforms.setCollisionBetween(1, 1000);

    this.platforms = platforms;
  }

  createPlayer() {
    // Find spawn point
    let spawnPoint = null;
    const startLayer = this.map.getObjectLayer('Start');
    const objectsLayer = this.map.getObjectLayer('Objects');

    if (startLayer && startLayer.objects) {
        spawnPoint = startLayer.objects.find(obj => obj.name === 'start');
    }
    if (!spawnPoint && objectsLayer && objectsLayer.objects) {
        spawnPoint = objectsLayer.objects.find(obj => obj.name === 'start');
    }
    
    let spawnX = 100;
    let spawnY = 550;

    if (spawnPoint) {
        spawnX = spawnPoint.x;
        spawnY = spawnPoint.y;
    }

    // Instantiate State Machine Player
    this.player = new Player(this, spawnX, spawnY);
  }

  createInteractables() {
    this.interactables = this.physics.add.staticGroup();
    
    const objectsLayer = this.map.getObjectLayer('Objects');
    if (!objectsLayer) return;

    objectsLayer.objects.forEach(obj => {
        if (obj.name === 'shop') {
            const shop = this.interactables.create(obj.x, obj.y, 'shop');
            shop.setOrigin(0, 1); 
            shop.setData('type', 'profile'); 
            shop.refreshBody();
        } 
        else if (obj.name === 'skills' || obj.name === 'sign') { 
            const sign = this.interactables.create(obj.x, obj.y, 'sign');
            sign.setOrigin(0, 1);
            sign.setData('type', 'skills');
            sign.refreshBody();
        }
        else if (obj.name === 'projects') {
            const sign = this.interactables.create(obj.x, obj.y, 'sign');
            sign.setOrigin(0, 1);
            sign.setData('type', 'experience');
            sign.refreshBody();
        }
        else if (obj.name === 'lamp') {
            const lamp = this.interactables.create(obj.x, obj.y, 'lamp');
            lamp.setOrigin(0, 1);
            lamp.setData('type', 'education');
            lamp.refreshBody();
        }
        else if (obj.name === 'large_tent') {
             const tent = this.interactables.create(obj.x, obj.y, 'large_tent');
             tent.setOrigin(0, 1);
             tent.setData('type', 'experience');
             tent.refreshBody();
             
             if (obj.width && obj.height) {
                 tent.setDisplaySize(obj.width, obj.height);
             }
        }
        else if (obj.name.startsWith('rock') || obj.name.startsWith('fence')) {
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
    // Update Player State Machine
    this.player.update();

    // Interaction Check
    this.physics.overlap(this.player, this.interactables, this.handleInteraction, null, this);
  }

  triggerModal(type) {
    const event = new CustomEvent('open-modal', { detail: { type: type } });
    window.dispatchEvent(event);
  }
}
