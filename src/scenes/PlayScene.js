import Player from '../player/Player';
import { ASSETS, EVENTS, INTERACTION_TYPES, MAP_LAYERS, OBJECT_NAMES } from '../utils/Constants';
import { GAME_CONFIG } from '../config/GameConfig';
import { openModal } from '../ui/stores/uiStore';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    // 0. Background (Parallax)
    const width = this.scale.width;
    const height = this.scale.height;

    // 1. Background (Parallax with TileSprite)
    const zoom = GAME_CONFIG.zoom;

    const visibleWidth = width / zoom + 2;
    const visibleHeight = height / zoom + 2;

    // 1. Background (Parallax Layers)
    this.createParallaxBackground(width, height, visibleWidth, visibleHeight);

    // 2. Create Layout
    this.createLevel();

    // 3. Create Player
    this.createPlayer();

    // 6. Interactables
    this.createInteractables();

    // 6.5 manual collisions (Slopes)
    this.createManualCollisions();

    // 5. Input
    this.keys = this.input.keyboard.addKeys({
      e: Phaser.Input.Keyboard.KeyCodes.E,
    });

    // Camera follow behavior
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(GAME_CONFIG.zoom);

    if (this.map) {
      this.physics.world.setBounds(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      );
      this.cameras.main.setBounds(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      );
    } else {
      this.physics.world.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
      this.cameras.main.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
    }

    // 7. Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.manualCollisions);
  }

  createParallaxBackground(width, height, visibleWidth, visibleHeight) {
    const layers = [
      { key: ASSETS.BG_LAYER_1, scroll: 0, depth: -12 },
      { key: ASSETS.BG_LAYER_2, scroll: 0.1, depth: -11 },
      { key: ASSETS.BG_LAYER_3, scroll: 0.25, depth: -10 },
    ];

    this.backgrounds = [];

    layers.forEach((layer) => {
      const tex = this.textures.get(layer.key).getSourceImage();
      const scale = visibleHeight / tex.height;

      const bg = this.add
        .tileSprite(
          width / 2,
          height / 2,
          visibleWidth,
          visibleHeight,
          layer.key
        )
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0) // Fix to viewport
        .setTileScale(scale)
        .setDepth(layer.depth);

      this.backgrounds.push({
        sprite: bg,
        ratio: layer.scroll
      });
    });
  }

  createLevel() {
    const map = this.make.tilemap({ 
      key: 'level1',
      tileWidth: 32,
      tileHeight: 32,
    });

    this.map = map;

    const floorTileset = map.addTilesetImage('Floor Tiles1', ASSETS.TILES);
    const decorTileset = map.addTilesetImage('Decoration', ASSETS.DECORATIONS);
    const gardenTileset = map.addTilesetImage('Garden Decorations', ASSETS.GARDEN_DECORATIONS);
    const otherTileset = map.addTilesetImage('Other Tiles1', ASSETS.OTHER_TILES);

    const allTilesets = [floorTileset, decorTileset, gardenTileset, otherTileset];

    // Decoration layer (Background/Props) - No collisions
    map.createLayer(MAP_LAYERS.DECORATION, allTilesets, 0, 0);
    
    // Ground layer (Platforms) - With collisions
    this.platforms = map.createLayer(MAP_LAYERS.GROUND, allTilesets, 0, 0);
    this.platforms.setCollisionBetween(1, 2000); // Increased range to cover all tilesets
  }

  createPlayer() {
    // Find spawn point
    let spawnPoint = null;
    const startLayer = this.map.getObjectLayer(MAP_LAYERS.START);
    const objectsLayer = this.map.getObjectLayer(MAP_LAYERS.OBJECTS);

    if (startLayer && startLayer.objects) {
      spawnPoint = startLayer.objects.find((obj) => obj.name === OBJECT_NAMES.START);
    }
    if (!spawnPoint && objectsLayer && objectsLayer.objects) {
      spawnPoint = objectsLayer.objects.find((obj) => obj.name === OBJECT_NAMES.START);
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

    const objectsLayer = this.map.getObjectLayer(MAP_LAYERS.OBJECTS);
    if (!objectsLayer) return;

    objectsLayer.objects.forEach((obj) => {
      // Get custom properties from Tiled
      const interactionType = obj.properties?.find((p) => p.name === 'interactionType')?.value;
      const assetKey = obj.properties?.find((p) => p.name === 'assetKey')?.value || obj.name;

      if (interactionType) {
        // It's an interactable object (Physics body + Modal trigger)
        const item = this.interactables.create(obj.x, obj.y, assetKey);
        item.setOrigin(0, 1);
        item.setData('type', interactionType);
        item.refreshBody();

        // Apply custom size if defined in Tiled
        if (obj.width && obj.height && (obj.width !== item.width || obj.height !== item.height)) {
          item.setDisplaySize(obj.width, obj.height);
          item.refreshBody();
        }
      } else if (obj.name && obj.name !== '') {
        // It's a decorative object (Static image)
        const img = this.add.image(obj.x, obj.y, assetKey).setOrigin(0, 1);
        
        // Apply custom size if defined in Tiled
        if (obj.width && obj.height && (obj.width !== img.width || obj.height !== img.height)) {
          img.setDisplaySize(obj.width, obj.height);
        }
      }
    });
  }

  createManualCollisions() {
    this.manualCollisions = this.physics.add.staticGroup();
    const collisionsLayer = this.map.getObjectLayer(MAP_LAYERS.COLLISIONS);
    
    if (collisionsLayer && collisionsLayer.objects) {
      console.log(`Checking layer: ${MAP_LAYERS.COLLISIONS}`, collisionsLayer.objects.length, "objects found");
      
      collisionsLayer.objects.forEach((obj, index) => {
        // Handle Tiled points/rectangles with 0 size
        const width = obj.width || 32;
        const height = obj.height || 32;

        if (index === 0) {
          console.log("First Object Debug:", {
            name: obj.name,
            x: obj.x,
            y: obj.y,
            w: obj.width,
            h: obj.height,
            calculatedW: width,
            calculatedH: height
          });
        }

        // Create a zone for the collision
        // In Tiled, (x,y) is top-left. Phaser physics bodies are centered by default.
        const zone = this.add.zone(obj.x + width / 2, obj.y + height / 2, width, height);
        
        // Add physics to the zone (static)
        this.physics.add.existing(zone, true);
        
        // Add to the static group
        this.manualCollisions.add(zone);
      });
    } else {
      console.warn(`Layer not found: ${MAP_LAYERS.COLLISIONS}. Ensure you exported the JSON and named the layer correctly.`);
    }
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

    // Update Parallax
    if (this.backgrounds) {
      this.backgrounds.forEach((bg) => {
        bg.sprite.tilePositionX = (this.cameras.main.scrollX * bg.ratio) / bg.sprite.tileScaleX;
      });
    }

    // Interaction Check
    this.physics.overlap(
      this.player,
      this.interactables,
      this.handleInteraction,
      null,
      this
    );
  }

  triggerModal(type) {
    openModal(type);
  }
}
