import Player from '../player/Player';
import { ASSETS, EVENTS, INTERACTION_TYPES, MAP_LAYERS, OBJECT_NAMES } from '../utils/Constants';
import { MASTER_ANIMATIONS_REGISTRY } from '../data/Animations';
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

    // 2. Create Animations (Animations must exist before sprites use them)
    // Moved before createLevel so objects can find their animations immediately
    this.createEnvironmentAnimations();

    // 3. Create Layout
    this.createLevel();

    // 4. Create Player
    this.createPlayer();

    // 5. Interactables & Objects & Collisions (Handled within createLevel > Dynamic Loading)
    
    // 5. Input

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

    // Dynamic Tileset Loading with Smart Mapping
    const tilesetMapping = {
      'Floor Tiles1': ASSETS.FLOOR_TILES_1,
      'Floor Tiles2': ASSETS.TILES,
      'Decoration': ASSETS.DECORATIONS, 
      'Garden Decorations': ASSETS.GARDEN_DECORATIONS,
      'House Tiles': ASSETS.HOUSE_TILES,
      'Other Tiles1': ASSETS.OTHER_TILES,
      'Pixel Art Furnace and Sawmill': ASSETS.FURNACE,
      'interest_points': ASSETS.INTEREST_POINTS,
      // Map other specific tileset names if needed
    };

    const allTilesets = [];
    const assetValues = Object.values(ASSETS);

    map.tilesets.forEach((tileset) => {
      let assetKey = null;

      // 1. Direct Mapping: Check if tileset name is in our explicit mapping
      if (tilesetMapping[tileset.name]) {
        assetKey = tilesetMapping[tileset.name];
      }

      // 2. Exact Match: Check if tileset name matches a loaded key directly
      if (!assetKey && this.textures.exists(tileset.name)) {
        assetKey = tileset.name;
      }

      // 3. Fuzzy Match: Check if tileset name (often a path) contains a known asset filename
      if (!assetKey) {
        // Extract base filename without extension
        const baseName = tileset.name.split('/').pop().replace(/\.[^/.]+$/, "");
        
        // Check if this base name exists as a loaded texture key
        if (this.textures.exists(baseName)) {
           assetKey = baseName;
        } else {
           // Second try: strict match against ASSETS values
           const foundKey = assetValues.find(key => key === baseName);
           if (foundKey) {
              assetKey = foundKey;
           }
        }
      }

      let ts;
      if (assetKey) {
        ts = map.addTilesetImage(tileset.name, assetKey);
      } else {
        // Fallback: Try using the name itself if it happens to match a key we missed
        ts = map.addTilesetImage(tileset.name);
      }

      if (ts) {
        allTilesets.push(ts);
      } else {
        // Only warn if it's not a trivial/empty tileset
        if (tileset.name) {
             console.warn(`Tileset '${tileset.name}' could not be mapped to an asset key. Object layer rendering might be incomplete.`);
        }
        // Push the raw tileset as a fallback (some image collections might work if implicit)
        allTilesets.push(tileset);
      }
    });

    // INITIALIZE GROUPS
    this.interactables = this.physics.add.staticGroup();
    this.manualCollisions = this.physics.add.staticGroup();
    this.platforms = null;

    // Load Raw Data to respect Tiled Order
    const mapData = this.cache.tilemap.get('level1').data;

    mapData.layers.forEach((layerData) => {
        if (layerData.type === 'tilelayer') {
            // Create Tile Layer
            const layer = map.createLayer(layerData.name, allTilesets, 0, 0);
            
            // Check for Special Layers (Ground)
            if (layer && layerData.name === MAP_LAYERS.GROUND) {
                this.platforms = layer;
                this.platforms.setCollisionBetween(1, 2000);
            }
        } 
        else if (layerData.type === 'objectgroup') {
             // Handle Object Layers
             if (layerData.name === MAP_LAYERS.COLLISIONS) {
                 this.processManualCollisions(layerData.name);
             } else {
                 // General Object Layer (Decorations, Interactables, etc.)
                 this.processObjectLayer(layerData.name);
             }
        }
    });

    if (!this.platforms) {
        console.warn('Ground layer not found or not assigned to this.platforms');
    }
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

  processObjectLayer(layerName) {
    const layer = this.map.getObjectLayer(layerName);
    if (!layer) return;

    // Use Phaser's built-in conversion which handles GIDs and Image Collections automatically
    const createdObjects = this.map.createFromObjects(layerName, {});
    
    createdObjects.forEach((obj) => {
      // Helper to get property (checks Data Manager first, then direct property)
      const getProp = (key) => {
          if (obj.getData && obj.getData(key) !== undefined) return obj.getData(key);
          return null;
      };

      const interactionType = getProp('interactionType');
      const animationKey = getProp('animation');

      // Check for specific "Start" object which is just a point
      if (obj.name === OBJECT_NAMES.START) {
          obj.setVisible(false);
      }
      
      // 2. Handle Animations
      if (animationKey) {
          if (this.anims.exists(animationKey)) {
              obj.play(animationKey);
          } else {
              console.warn(`Animation key not found: ${animationKey}`);
          }
      }

      // 3. Handle Interactions (Physics)
      if (interactionType) {
        this.interactables.add(obj);
        obj.setData('type', interactionType);
      }
    });
  }

  createEnvironmentAnimations() {
    // Scalable system: automatically loads all animations defined in the registry
    MASTER_ANIMATIONS_REGISTRY.forEach(group => {
      const { assetKey, anims } = group;

      Object.values(anims).forEach(anim => {
        // Safety check: ensure animation doesn't already exist
        if (!this.anims.exists(anim.key)) {
          // Generate frames dynamically
          const frames = this.anims.generateFrameNumbers(assetKey, { start: anim.start, end: anim.end });

          if (frames && frames.length > 0) {
            this.anims.create({
              key: anim.key,
              frames: frames,
              frameRate: anim.rate,
              repeat: anim.repeat
            });
          } else {
            console.warn(`[Animation System] Could not create '${anim.key}': Frames ${anim.start}-${anim.end} missing in '${assetKey}'`);
          }
        }
      });
    });
  }

  processManualCollisions(layerName) {
    // this.manualCollisions is already initialized in createLevel
    const collisionsLayer = this.map.getObjectLayer(layerName);
    
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
