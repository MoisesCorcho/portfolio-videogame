/**
 * @fileoverview Main gameplay scene managing the game world, player, and interactions.
 * Handles level creation, parallax backgrounds, physics, and player interactions.
 */

import Player from '../player/Player';
import NPC from '../entities/NPC';
import Dummy from '../entities/Dummy';
import AudioManager from '../utils/AudioManager';
import {
  ASSETS,
  AUDIO,
  EVENTS,
  INTERACTION_TYPES,
  MAP_LAYERS,
  OBJECT_NAMES,
  ENTITY_TYPES,
} from '../utils/Constants';
import { MASTER_ANIMATIONS_REGISTRY } from '../data/Animations';
import { NPC_DIALOGUES } from '../data/Dialogues';
import { GAME_CONFIG } from '../config/GameConfig';
import { openModal, closeModal, uiStore } from '../ui/stores/uiStore';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';

// No module variable needed, we use window for HMR persistence

/**
 * Main play scene where the gameplay takes place.
 * Manages the game world, player character, parallax backgrounds, physics,
 * and interactive elements loaded from Tiled maps.
 *
 * @extends Phaser.Scene
 */
// Minimum distance to keep dialogue open
const DIALOGUE_CLOSE_RANGE = 150;

export default class PlayScene extends Phaser.Scene {
  /**
   * Creates the play scene instance.
   */
  constructor() {
    super('PlayScene');
  }

  /**
   * Preloads the animated tiles plugin.
   */
  preload() {
    this.load.scenePlugin(
      'animatedTiles',
      AnimatedTiles,
      'animatedTiles',
      'animatedTiles'
    );
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
    this.audioManager = new AudioManager(this);
    this.dummies = this.physics.add.group({
      classType: Dummy,
      runChildUpdate: true,
      allowGravity: false,
      immovable: true,
    });

    this.npcs = this.physics.add.group({
      classType: NPC,
      runChildUpdate: true,
    });
    this.currentInteractingNPC = null;
    this.currentInteractable = null;

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
    
    // Initialize animated tiles plugin
    if (this.sys.animatedTiles) {
      this.sys.animatedTiles.init(this.map);
    } else {
      console.warn('AnimatedTiles plugin not loaded');
    }

    this.createPlayer();

    this.keys = this.input.keyboard.addKeys({
      e: Phaser.Input.Keyboard.KeyCodes.E,
      j: Phaser.Input.Keyboard.KeyCodes.J,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      s: Phaser.Input.Keyboard.KeyCodes.S,
    });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(0, 32); // Shows ~64px of ground below player
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
      this.physics.world.setBounds(
        0,
        0,
        GAME_CONFIG.worldWidth,
        GAME_CONFIG.worldHeight
      );
      this.cameras.main.setBounds(
        0,
        0,
        GAME_CONFIG.worldWidth,
        GAME_CONFIG.worldHeight
      );
    }
    
    // Create Snow Emitter (Initially stopped)
    this.createSnowEmitter();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.manualCollisions);
    this.oneWayCollider = this.physics.add.collider(
      this.player,
      this.oneWayPlatforms
    );

    // Dummy collisions
    this.physics.add.collider(this.dummies, this.platforms);
    this.physics.add.collider(this.dummies, this.manualCollisions);

    // NPC collisions
    this.physics.add.collider(this.npcs, this.platforms);
    this.physics.add.collider(this.npcs, this.manualCollisions);

    // Check distance to current interacting objects (runs every frame via event)
    this.events.on('update', () => {
      // NPC Distance Check
      if (this.currentInteractingNPC) {
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.currentInteractingNPC.x,
          this.currentInteractingNPC.y
        );
        if (dist > DIALOGUE_CLOSE_RANGE) {
          closeModal();
          this.currentInteractingNPC = null;
        }
      }

      // Interactable Distance Check
      if (this.currentInteractable) {
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.currentInteractable.x,
          this.currentInteractable.y
        );
        if (dist > DIALOGUE_CLOSE_RANGE) {
          closeModal();
          this.currentInteractable = null;
        }
      }
    });

    // Continuous attack hitbox overlap check (enabled/disabled by AttackState)
    this.physics.add.overlap(this.attackZone, this.dummies, (zone, dummy) => {
      const attackState = this.player.stateMachine.state;
      if (
        attackState &&
        attackState.canDamage &&
        attackState.canDamage(dummy)
      ) {
        dummy.takeDamage();
      }
    });

    // Subscribe to UI state to play window sounds (ONCE, in create)
    if (window.__UI_STORE_UNSUBSCRIBE__) {
      window.__UI_STORE_UNSUBSCRIBE__();
    }

    let wasOpen = false;
    window.__UI_STORE_UNSUBSCRIBE__ = uiStore.subscribe((state) => {
      const isOpening = state.isOpen && !wasOpen;
      const isClosing = !state.isOpen && wasOpen;
      wasOpen = state.isOpen;

      try {
        if (isOpening) {
          this.sound.play(AUDIO.SFX.WINDOW_OPEN, { loop: false });
        } else if (isClosing) {
          this.sound.play(AUDIO.SFX.WINDOW_CLOSE, { loop: false });
        }
      } catch (err) {
        console.warn('[PlayScene] Audio playback failed:', err);
      }
    });

    // Clean up subscription when scene shuts down
    this.events.on('shutdown', () => {
      if (window.__UI_STORE_UNSUBSCRIBE__) {
        window.__UI_STORE_UNSUBSCRIBE__();
        window.__UI_STORE_UNSUBSCRIBE__ = null;
      }
    });
  }

  /**
   * Initializes the particle emitter for the snow effect.
   * Attached to the camera to ensure it covers the screen.
   * @private
   */
  createSnowEmitter() {
    this.snowEmitter = this.add.particles(0, 0, ASSETS.PARTICLE_SNOW, {
      x: { min: 0, max: this.scale.width / GAME_CONFIG.zoom + 100 },
      y: -50,
      lifespan: 3000,
      speedY: { min: 80, max: 150 },
      speedX: { min: -30, max: 30 },
      scale: { min: 0.2, max: 0.7 },
      alpha: { start: 0.6, end: 0 },
      quantity: 1,
      frequency: 50,
      emitting: false,
    });
    // Lock emitter to camera
    this.snowEmitter.setScrollFactor(0);
    this.snowEmitter.setDepth(100); // Ensures it renders above most elements
  }

  /**
   * Biome zone thresholds based on player X position.
   * Each zone defines the background layers to use for that biome.
   */
  static BIOME_ZONES = [
    {
      name: 'normal',
      thresholdX: 0,
      layers: [
        ASSETS.BG_NORMAL_LAYER_5, // Furthest back
        ASSETS.BG_NORMAL_CASTLE,
        ASSETS.BG_NORMAL_LAYER_4,
        ASSETS.BG_NORMAL_LAYER_3,
        ASSETS.BG_NORMAL_LAYER_2,
        ASSETS.BG_NORMAL_LAYER_1, // Closest to camera
      ],
    },
    {
      name: 'autumn',
      thresholdX: 1200,
      layers: [
        ASSETS.BG_AUTUMN_LAYER_5, // Furthest back
        ASSETS.BG_AUTUMN_CASTLE,
        ASSETS.BG_AUTUMN_LAYER_4,
        ASSETS.BG_AUTUMN_LAYER_3,
        ASSETS.BG_AUTUMN_LAYER_2,
        ASSETS.BG_AUTUMN_LAYER_1, // Closest to camera
      ],
    },
    {
      name: 'winter',
      thresholdX: 2400,
      layers: [
        ASSETS.BG_WINTER_LAYER_5, // Furthest back
        ASSETS.BG_WINTER_CASTLE,
        ASSETS.BG_WINTER_LAYER_4,
        ASSETS.BG_WINTER_LAYER_3,
        ASSETS.BG_WINTER_LAYER_2,
        ASSETS.BG_WINTER_LAYER_1, // Closest to camera
      ],
    },
  ];

  /**
   * Creates a multi-layer parallax background using TileSprites.\n   * Each layer scrolls at a different rate to create depth perception,
   * with backgrounds fixed to the viewport via setScrollFactor(0).\n   *
   * @param {number} width - Canvas width in pixels\n   * @param {number} height - Canvas height in pixels
   * @param {number} visibleWidth - Visible width accounting for zoom
   * @param {number} visibleHeight - Visible height accounting for zoom
   * @private
   */
  createParallaxBackground(width, height, visibleWidth, visibleHeight) {
    // Define 6 layers: layer_5 (furthest) to castle to layer_1 (closest)
    const layers = [
      { key: ASSETS.BG_NORMAL_LAYER_5, scroll: 0.2, depth: -16 }, // Furthest back (reduced from 0.4)
      { key: ASSETS.BG_NORMAL_CASTLE, scroll: 0, depth: -15 },
      { key: ASSETS.BG_NORMAL_LAYER_4, scroll: 0.15, depth: -14 }, // Reduced from 0.3
      { key: ASSETS.BG_NORMAL_LAYER_3, scroll: 0.1, depth: -13 }, // Reduced from 0.2
      { key: ASSETS.BG_NORMAL_LAYER_2, scroll: 0.05, depth: -12 }, // Reduced from 0.1
      { key: ASSETS.BG_NORMAL_LAYER_1, scroll: 0, depth: -11 }, // Closest to camera
    ];

    this.backgrounds = [];
    this.currentBiome = null; // Track current biome - Start null to force initial update

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
        .setDepth(layer.depth)
        .setAlpha(1); // Ensure all layers are visible from start

      this.backgrounds.push({
        sprite: bg,
        ratio: layer.scroll,
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
      Decoration: ASSETS.DECORATIONS,
      'Garden Decorations': ASSETS.GARDEN_DECORATIONS,
      'House Tiles': ASSETS.HOUSE_TILES,
      'Other Tiles1': ASSETS.OTHER_TILES,
      other_tiles2: ASSETS.OTHER_TILES_2,
      'Pixel Art Furnace and Sawmill': ASSETS.FURNACE,
      interest_points: ASSETS.INTEREST_POINTS,
      training_dummy: ASSETS.DUMMY,
      bg_dirt2: ASSETS.BG_DIRT2,
      campfire_sheet: ASSETS.CAMPFIRE,
      campfire_with_food_sheet: ASSETS.CAMPFIRE_WITH_FOOD,
      keyboard_letters_and_symbols: ASSETS.KEYBOARD,
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
        const baseName = tileset.name
          .split('/')
          .pop()
          .replace(/\.[^/.]+$/, '');

        // Exact match
        if (this.textures.exists(baseName)) {
          assetKey = baseName;
        } else {
          // Search for a key that contains the base name (e.g., "Terraria_bewitching_table" matches "bewitching_table")
          const allKeys = this.textures.getTextureKeys();
          const match = allKeys.find(
            (key) => key.endsWith('_' + baseName) || key === baseName
          );
          if (match) {
            assetKey = match;
          } else {
            // Second try: strict match against ASSETS values
            const foundValue = assetValues.find((val) => val === baseName);
            if (foundValue) {
              assetKey = foundValue;
            }
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
          console.warn(
            `Tileset '${tileset.name}' could not be mapped to an asset key. Object layer rendering might be incomplete.`
          );
        }
        // Push the raw tileset as a fallback (some image collections might work if implicit)
        allTilesets.push(tileset);
      }
    });

    // INITIALIZE GROUPS
    this.interactables = this.physics.add.staticGroup();
    this.manualCollisions = this.physics.add.staticGroup();
    this.oneWayPlatforms = this.physics.add.staticGroup();
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
      } else if (layerData.type === 'objectgroup') {
        // Handle Object Layers
        if (layerData.name === MAP_LAYERS.COLLISIONS) {
          this.processManualCollisions(layerData.name);
        } else if (layerData.name === MAP_LAYERS.PLATFORMS) {
          this.processOneWayPlatforms(layerData.name);
        } else if (layerData.name === MAP_LAYERS.BIOMES) {
          this.processBiomeLayer(layerData.name);
        } else if (layerData.name === MAP_LAYERS.INDOORS) {
          this.processIndoorZones(layerData.name);
        } else if (layerData.name === 'Audio') {
          this.processAudioLayer(layerData.name);
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
      spawnPoint = startLayer.objects.find(
        (obj) => obj.name === OBJECT_NAMES.START
      );
    }
    if (!spawnPoint && objectsLayer && objectsLayer.objects) {
      spawnPoint = objectsLayer.objects.find(
        (obj) => obj.name === OBJECT_NAMES.START
      );
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
        if (obj.getData && obj.getData(key) !== undefined)
          return obj.getData(key);
        return null;
      };

      const interactionType = getProp('interactionType');
      const animationKey = getProp('animation');
      const entityType = getProp('entity');

      if (obj.name === OBJECT_NAMES.START) {
        obj.setVisible(false);
      }

      // 1. Handle Spatial Audio FIRST (so it applies to NPCs/Dummies before they return)
      const soundKey = getProp('sound');
      if (soundKey) {
        let finalKey = soundKey;
        if (AUDIO.ENV[soundKey.toUpperCase()]) {
          finalKey = AUDIO.ENV[soundKey.toUpperCase()];
        }
        const radius = parseFloat(getProp('radius') ?? 300);
        const maxVolume = parseFloat(getProp('volume') ?? 0.5);

        // Optional custom ID for the sound, else use obj.id
        const objId = obj.id || Phaser.Math.Between(10000, 99999);
        
        this.audioManager.addSpatialSound(
          `spatial_${objId}`,
          finalKey,
          { x: obj.x, y: obj.y },
          radius,
          maxVolume
        );
      }

      // 2. Handle Special Entities (like Dummy)
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

      // Handle NPCs
      if (entityType && entityType.toLowerCase() === ENTITY_TYPES.NPC) {
        // Determine texture: explicit property is preferred
        let textureKey = getProp('texture');
        const initialAnim = getProp('initialAnim'); // Can be null/undefined

        // Fallback or derive from animation
        if (!textureKey) {
           if (initialAnim) {
             // If initialAnim is provided, we can rely on it to set the correct texture/frame.
             // No need to warn; the animation will handle the visual representation.
           } else {
             console.warn(`[PlayScene] NPC at ${obj.x},${obj.y} missing 'texture' property and no 'initialAnim'. Using tile texture: ${obj.texture ? obj.texture.key : 'unknown'}`);
             if (obj.texture) textureKey = obj.texture.key;
           }
        }

        const npc = this.npcs.get(obj.x, obj.y, textureKey, initialAnim);
        if (npc) {
           // Copy dimensions from Tiled object
           if (obj.displayWidth && obj.displayHeight) {
             npc.setDisplaySize(obj.displayWidth, obj.displayHeight);
           }

           // Apply custom movement properties
           const canMove = getProp('canMove');
           if (canMove !== null) npc.canMove = canMove === true || canMove === 'true';

           const moveRange = getProp('moveRange');
           if (moveRange !== null) npc.moveRange = parseFloat(moveRange);
           
           const moveSpeed = getProp('moveSpeed');
           if (moveSpeed !== null) npc.moveSpeed = parseFloat(moveSpeed);

           // Apply dialogue properties
           const dialogueId = getProp('dialogueId');
           if (dialogueId) npc.dialogueId = dialogueId;
        }
        obj.destroy();
        return;
      }

      // 2. Handle Animations
      if (animationKey) {
        let finalKey = animationKey;

        // Smart resolve for shared names like "pylon_idle"
        // This makes the system scalable: many pylons can use the same Tiled property
        if (animationKey === 'pylon_idle' && obj.texture) {
          // Extract variant (e.g. "forest" from "Terraria_forest_pylon" or "../sprites/Terraria/forest_pylon.png")
          const textureName = obj.texture.key
            .replace('Terraria_', '')
            .replace('../sprites/Terraria/', '')
            .replace('.png', '');
          const candidateKey = `${textureName}_idle`;
          if (this.anims.exists(candidateKey)) {
            finalKey = candidateKey;
          }
        }

        if (this.anims.exists(finalKey)) {
          obj.play(finalKey);
        } else {
          console.warn(`Animation key not found: ${finalKey}`);
        }
      }

      // 4. Handle Interactions (Physics)
      if (interactionType) {
        this.interactables.add(obj);
        obj.setData('type', interactionType);

        // Store custom ID if present (for single_experience, etc.)
        const customId = obj.properties?.find((p) => p.name === 'id')?.value;
        if (customId) {
          obj.setData('id', customId);
        }

        // Store custom text if present (for signs, etc.)
        const customText = obj.properties?.find((p) => p.name === 'text')?.value;
        if (customText) {
          obj.setData('text', customText);
        }
      }
    });

  }

  /**
   * Processes the Audio object layer from Tiled.
   * Extracts spatial audio data without creating visual sprites.
   * @param {string} layerName - Name of the audio layer
   * @private
   */
  processAudioLayer(layerName) {
    const audioLayer = this.map.getObjectLayer(layerName);
    if (audioLayer && audioLayer.objects) {
      audioLayer.objects.forEach((obj) => {
        // Custom properties from Tiled: sound (string), loop (bool), radius (float), volume (float)
        const soundKey = obj.properties?.find((p) => p.name === 'sound')?.value;
        const loop = obj.properties?.find((p) => p.name === 'loop')?.value ?? true;
        const radius = obj.properties?.find((p) => p.name === 'radius')?.value ?? 300;
        const maxVolume = obj.properties?.find((p) => p.name === 'volume')?.value ?? 0.5;

        if (soundKey) {
           let finalKey = soundKey;
           if (AUDIO.ENV[soundKey.toUpperCase()]) {
             finalKey = AUDIO.ENV[soundKey.toUpperCase()];
           }

           this.audioManager.addSpatialSound(
             `spatial_${obj.id}`, 
             finalKey, 
             { x: obj.x, y: obj.y },
             radius,
             maxVolume
           );
        }
      });
    }
  }

  /**
   * Creates and plays animations for environment objects like furnaces and sawmills.
   * Iterates through the master animations registry and starts animations
   * for all registered sprites in the scene.
   *
   * @private
   */
  createEnvironmentAnimations() {
    MASTER_ANIMATIONS_REGISTRY.forEach((group) => {
      const { assetKey, anims } = group;

      Object.values(anims).forEach((anim) => {
        if (!this.anims.exists(anim.key)) {
          let frames;
          if (anim.frames) {
            frames = this.anims.generateFrameNumbers(assetKey, {
              frames: anim.frames,
            });
          } else {
            frames = this.anims.generateFrameNumbers(assetKey, {
              start: anim.start,
              end: anim.end,
            });
          }

          if (frames && frames.length > 0) {
            this.anims.create({
              key: anim.key,
              frames: frames,
              frameRate: anim.rate,
              repeat: anim.repeat,
            });
          } else {
            console.warn(
              `[Animation System] Could not create '${anim.key}': Frames ${anim.start}-${anim.end} missing in '${assetKey}'`
            );
          }
        }
      });
    });
  }

  /**
   * Processes one-way platforms from a Tiled object layer.
   * Creates physics bodies that only collide from the top down,
   * allowing the player to jump through them from below.
   *
   * @param {string} layerName - Name of the object layer containing platforms
   * @private
   */
  processOneWayPlatforms(layerName) {
    const layer = this.map.getObjectLayer(layerName);
    if (!layer || !layer.objects) return;

    layer.objects.forEach((obj) => {
      const width = obj.width || 32;
      const height = obj.height || 32;

      const zone = this.add.zone(
        obj.x + width / 2,
        obj.y + height / 2,
        width,
        height
      );
      this.physics.add.existing(zone, true);

      // Configure for one-way collision: only collide from the TOP
      zone.body.checkCollision.down = false;
      zone.body.checkCollision.left = false;
      zone.body.checkCollision.right = false;
      zone.body.checkCollision.up = true;

      this.oneWayPlatforms.add(zone);
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
        const zone = this.add.zone(
          obj.x + width / 2,
          obj.y + height / 2,
          width,
          height
        );

        // Add physics to the zone (static)
        this.physics.add.existing(zone, true);

        // Add to the static group
        this.manualCollisions.add(zone);
      });
    } else {
      console.warn(
        `Layer not found: ${MAP_LAYERS.COLLISIONS}. Ensure you exported the JSON and named the layer correctly.`
      );
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
      const id = interactable.getData('id');
      const text = interactable.getData('text');
      this.triggerModal(type, id, text);
      this.currentInteractable = interactable;
    }
  }

  /**
   * Triggers a UI modal of the specified type.
   *
   * @param {string} type - Type of modal to display
   * @param {string} [id] - Optional ID to pass as data (e.g., experience ID)
   * @param {string} [text] - Optional text to pass as data (e.g., for signs)
   * @private
   */
  triggerModal(type, id = null, text = null) {
    let data = null;
    if (id !== null || text !== null) {
      data = {};
      if (id !== null) data.id = id;
      if (text !== null) data.text = text;
    }
    openModal(type, data);
  }

  /**
   * Updates the scene every frame.
   * Handles parallax scrolling animation for background layers.
   * Automatically called by Phaser on each tick.
   */
  update() {
    this.player.update();
    this.audioManager.updateSpatialSounds(this.player);

    // Update Parallax
    if (this.backgrounds) {
      this.backgrounds.forEach((bg) => {
        bg.sprite.tilePositionX =
          (this.cameras.main.scrollX * bg.ratio) / bg.sprite.tileScaleX;
      });
    }

    // Check for biome zone changes
    this.updateBiome();
    this.updateWeatherEffects();

    // One-way platform dropdown logic
    if (
      (this.keys.down.isDown || this.keys.s.isDown) &&
      this.player.body.touching.down
    ) {
      // Check if player is on a one-way platform
      const isOnOneWay = this.oneWayPlatforms.getChildren().some((platform) => {
        return Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          platform.getBounds()
        );
      });

      if (isOnOneWay) {
        this.oneWayCollider.active = false;
        this.time.delayedCall(250, () => {
          this.oneWayCollider.active = true;
        });
      }
    }

    // Interaction Check (interactables)
    this.physics.overlap(
      this.player,
      this.interactables,
      this.handleInteraction,
      null,
      this
    );

    // NPC Interaction Check
    this.physics.overlap(
      this.player,
      this.npcs,
      this.handleNPCInteraction,
      null,
      this
    );

  }

  /**
   * Processes the Biomes object layer from Tiled.
   * Parses rectangle objects with a 'biome' custom property.
   * @private
   */
  processBiomeLayer(layerName) {
    const objectLayer = this.map.getObjectLayer(layerName);
    if (!objectLayer || !objectLayer.objects) return;

    this.biomeZones = [];

    objectLayer.objects.forEach((obj) => {
      const biomeName = obj.properties?.find((p) => p.name === 'biome')?.value;
      if (biomeName) {
        this.biomeZones.push({
          x: obj.x,
          y: obj.y,
          width: obj.width,
          height: obj.height,
          biomeName: biomeName,
        });
      }
    });

    // Fallback: If no biomes are defined in Tiled, generate from legacy BIOME_ZONES
    if (this.biomeZones.length === 0 && this.map) {
      const mapHeight = this.map.heightInPixels;
      PlayScene.BIOME_ZONES.forEach((zone) => {
        const xThreshold = zone.thresholdX ?? zone.threshold ?? 0;
        const yThreshold = zone.thresholdY ?? 0;

        // Generate a large rectangle from the threshold to the edge of the map
        this.biomeZones.push({
          x: xThreshold,
          y: yThreshold,
          width: this.map.widthInPixels - xThreshold,
          height: mapHeight - yThreshold,
          biomeName: zone.name,
          layers: zone.layers, // Store layers for direct lookup
        });
      });
    }
  }

  /**
   * Checks player position and updates biome backgrounds if entering a new zone.
   * Uses fade transitions for smooth visual changes between biomes.
   * @private
   */
  updateBiome() {
    if (!this.player || !this.backgrounds || !this.biomeZones) return;

    // Find the current zone based on player position overlapping biome rectangles
    const currentZone = this.biomeZones.find((zone) => {
      const playerCenterX = this.player.x;
      const playerCenterY = this.player.y;

      return (
        playerCenterX >= zone.x &&
        playerCenterX <= zone.x + zone.width &&
        playerCenterY >= zone.y &&
        playerCenterY <= zone.y + zone.height
      );
    });

    if (!currentZone || currentZone.biomeName === this.currentBiome) return;

    // Biome has changed, transition backgrounds
    this.currentBiome = currentZone.biomeName;

    // Fade out current backgrounds
    this.tweens.add({
      targets: this.backgrounds.map((bg) => bg.sprite),
      alpha: 0,
      duration: 500,
      onComplete: () => {
        // Get layers array: either from fallback zone or lookup from BIOME_ZONES
        const layers =
          currentZone.layers ||
          PlayScene.BIOME_ZONES.find((z) => z.name === currentZone.biomeName)
            ?.layers;

        if (!layers) {
          console.warn(
            `No background layers found for biome: ${currentZone.biomeName}`
          );
          return;
        }

        // Change textures to new biome
        this.backgrounds.forEach((bg, index) => {
          const newTexture = layers[index];
          bg.sprite.setTexture(newTexture);
        });

        // Fade in new backgrounds
        this.tweens.add({
          targets: this.backgrounds.map((bg) => bg.sprite),
          alpha: 1,
          duration: 500,
        });
      },
    });

    // Play new biome music
    const currentBiomeUpper = currentZone.biomeName.toUpperCase();
    
    // Check if the key exists in our AUDIO constants, otherwise don't play
    const audioConst = AUDIO.MUSIC[currentBiomeUpper];
    
    if (audioConst) {
      // Define specific volumes for biomes (default to 0.5 if not set)
      const BIOME_VOLUMES = {
        NORMAL: 0.3,
        AUTUMN: 0.7,
        WINTER: 0.3,
      };
      
      const volume = BIOME_VOLUMES[currentBiomeUpper] ?? 0.3;
      this.audioManager.playMusic(audioConst, 1000, volume);
    }
  }

  /**
   * Processes the Indoors object layer from Tiled.
   * Parses rectangles defining areas where weather (like snow) should be hidden.
   * @private
   */
  processIndoorZones(layerName) {
    const objectLayer = this.map.getObjectLayer(layerName);
    this.indoorZones = [];
    if (!objectLayer || !objectLayer.objects) return;

    objectLayer.objects.forEach((obj) => {
      this.indoorZones.push({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
      });
    });
  }

  /**
   * Updates weather effects like snow based on current biome and indoor status.
   * @private
   */
  updateWeatherEffects() {
    if (!this.snowEmitter) return;

    let isIndoors = false;
    if (this.indoorZones && this.indoorZones.length > 0) {
      isIndoors = this.indoorZones.some((zone) => {
        const px = this.player.x;
        const py = this.player.y;
        return (
          px >= zone.x &&
          px <= zone.x + zone.width &&
          py >= zone.y &&
          py <= zone.y + zone.height
        );
      });
    }

    if (this.currentBiome === 'winter' && !isIndoors) {
      if (!this.snowEmitter.emitting) {
        this.snowEmitter.start();
      }
    } else {
      if (this.snowEmitter.emitting) {
        this.snowEmitter.stop();
      }
    }
  }

  /**
   * Handles NPC interaction when the player overlaps with an NPC.
   * @param {Phaser.GameObjects.Sprite} player
   * @param {NPC} npc
   * @private
   */
  handleNPCInteraction(player, npc) {
    if (!npc.dialogueId) return;
    if (!Phaser.Input.Keyboard.JustDown(this.keys.e)) return;

    const dialogueData = NPC_DIALOGUES[npc.dialogueId];
    if (!dialogueData) {
      console.warn(`[PlayScene] No dialogue found for id: ${npc.dialogueId}`);
      return;
    }

    const { name, phrase } = npc.getNextPhrase(dialogueData);
    openModal(INTERACTION_TYPES.NPC, { name, phrase });
    this.currentInteractingNPC = npc;
  }


}
