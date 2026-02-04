/**
 * @fileoverview Main gameplay scene managing the game world, player, and interactions.
 * Handles level creation, parallax backgrounds, physics, and player interactions.
 */

import Player from '../player/Player';
import Dummy from '../entities/Dummy';
import { ASSETS, EVENTS, INTERACTION_TYPES, MAP_LAYERS, OBJECT_NAMES, ENTITY_TYPES } from '../utils/Constants';
import { MASTER_ANIMATIONS_REGISTRY } from '../data/Animations';
import { GAME_CONFIG } from '../config/GameConfig';
import { openModal } from '../ui/stores/uiStore';

/**
 * Main play scene where the gameplay takes place.
 * Manages the game world, player character, parallax backgrounds, physics,
 * and interactive elements loaded from Tiled maps.
 * 
 * @extends Phaser.Scene
 */
export default class PlayScene extends Phaser.Scene {
  /**
   * Creates the play scene instance.
   */
  constructor() {
    super('PlayScene');
  }

  /**
   * Initializes the game scene by setting up backgrounds, level, player, physics, and camera.
   * Automatically called by Phaser when the scene starts.
   */
  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const zoom = GAME_CONFIG.zoom;
    const visibleWidth = width / zoom + 2;
    const visibleHeight = height / zoom + 2;

    // Physics groups
    this.dummies = this.physics.add.group({
      classType: Dummy,
      runChildUpdate: true,
      allowGravity: false,
      immovable: true
    });
    
    // Persistent Attack Zone (reused) - smaller hitbox for precision
    this.attackZone = this.add.zone(0, 0, 25, 25);
    this.physics.add.existing(this.attackZone);
    this.attackZone.body.setAllowGravity(false);
    this.attackZone.body.moves = false; // It shouldn't move by physics
    this.attackZone.body.enable = false; // Disable until attack

    // Debug: Visible representation of the attack zone
    this.attackZoneDebug = this.add.rectangle(0, 0, 25, 25, 0xff0000, 0.4);
    this.attackZoneDebug.setVisible(false);

    this.createParallaxBackground(width, height, visibleWidth, visibleHeight);
    this.createEnvironmentAnimations();
    this.createLevel();
    this.createPlayer();

    this.keys = this.input.keyboard.addKeys({
      e: Phaser.Input.Keyboard.KeyCodes.E,
      j: Phaser.Input.Keyboard.KeyCodes.J,
    });

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

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.manualCollisions);
    
    // Dummy collisions
    this.physics.add.collider(this.dummies, this.platforms);
    this.physics.add.collider(this.dummies, this.manualCollisions);
  }

  /**
   * Creates a multi-layer parallax background using TileSprites.\n   * Each layer scrolls at a different rate to create depth perception,
   * with backgrounds fixed to the viewport via setScrollFactor(0).\n   * \n   * @param {number} width - Canvas width in pixels\n   * @param {number} height - Canvas height in pixels\n   * @param {number} visibleWidth - Visible width accounting for zoom\   * @param {number} visibleHeight - Visible height accounting for zoom
   * @private
   */
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
        .setScrollFactor(0)
        .setTileScale(scale)
        .setDepth(layer.depth);

      this.backgrounds.push({
        sprite: bg,
        ratio: layer.scroll
      });
    });
  }

  /**
   * Loads and initializes the game level from the Tiled tilemap.
   * Handles tileset mapping using a multi-tier fallback strategy to ensure
   * compatibility between Tiled map references and Phaser's texture cache.
   * Creates all tile layers and processes object layers for interactive elements.
   * 
   * @private
   */
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
      'training_dummy': ASSETS.DUMMY,
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

  /**
   * Creates and initializes the player character.
   * Sets up physics properties, spawn position, and interaction mechanics.
   * 
   * @private
   */
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

    this.player = new Player(this, spawnX, spawnY);
  }

  /**
   * Processes a Tiled object layer to create interactive game objects.
   * Automatically creates sprites from object definitions and configures
   * their animations and interaction properties based on custom Tiled properties.
   * 
   * @param {string} layerName - Name of the object layer to process
   * @private
   */
  processObjectLayer(layerName) {
    const layer = this.map.getObjectLayer(layerName);
    if (!layer) return;

    const createdObjects = this.map.createFromObjects(layerName, {});
    
    createdObjects.forEach((obj) => {
      const getProp = (key) => {
          if (obj.getData && obj.getData(key) !== undefined) return obj.getData(key);
          return null;
      };

      const interactionType = getProp('interactionType');
      const animationKey = getProp('animation');
      const entityType = getProp('entity');

      if (obj.name === OBJECT_NAMES.START) {
          obj.setVisible(false);
      }
      
      // 1. Handle Special Entities (like Dummy)
      if (entityType === ENTITY_TYPES.DUMMY) {
        // Spawn a real Dummy entity at this location
        const dummy = this.dummies.get(obj.x, obj.y, ASSETS.DUMMY);
        if (dummy) {
          dummy.setDepth(10);
        }
        // Destroy the placeholder object from Tiled
        obj.destroy();
        return; // Skip further processing for this object
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

  /**
   * Creates and plays animations for environment objects like furnaces and sawmills.
   * Iterates through the master animations registry and starts animations
   * for all registered sprites in the scene.
   * 
   * @private
   */
  createEnvironmentAnimations() {
    MASTER_ANIMATIONS_REGISTRY.forEach(group => {
      const { assetKey, anims } = group;

      Object.values(anims).forEach(anim => {
        if (!this.anims.exists(anim.key)) {
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

  /**
   * Processes manual collision objects from a Tiled object layer.
   * Creates invisible physics bodies for custom collision shapes defined in Tiled,
   * enabling precise collision boundaries beyond standard tile collisions.
   * 
   * @param {string} layerName - Name of the object layer containing collision shapes
   * @private
   */
  processManualCollisions(layerName) {
    const collisionsLayer = this.map.getObjectLayer(layerName);
    
    if (collisionsLayer && collisionsLayer.objects) {
      
      collisionsLayer.objects.forEach((obj, index) => {
        // Handle Tiled points/rectangles with 0 size
        const width = obj.width || 32;
        const height = obj.height || 32;

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

  /**
   * Handles player interaction with interactable objects.
   * Triggered when the player presses the interaction key near an interactive object.
   * Dispatches interaction events based on the object's interaction type.
   * 
   * @param {Phaser.GameObjects.Sprite} player - The player character
   * @param {Phaser.GameObjects.Sprite} interactable - The interactive object
   * @private
   */
  handleInteraction(player, interactable) {
    if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
      const type = interactable.getData('type');
      this.triggerModal(type);
    }
  }

  /**
   * Updates the scene every frame.
   * Handles parallax scrolling animation for background layers.
   * Automatically called by Phaser on each tick.
   */
  update() {
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

    // Continuous attack hitbox overlap check (enabled/disabled by AttackState)
    this.physics.overlap(this.attackZone, this.dummies, (zone, dummy) => {
      // Check if this is an attack state and if this enemy hasn't been hit yet
      const attackState = this.player.stateMachine.state;
      if (attackState && attackState.canDamage && attackState.canDamage(dummy)) {
        dummy.takeDamage();
      }
    });
  }

  /**
   * Triggers a UI modal of the specified type.
   * 
   * @param {string} type - Type of modal to display
   * @private
   */
  triggerModal(type) {
    openModal(type);
  }
}
