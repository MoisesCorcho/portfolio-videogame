import Player from '../player/Player';
import NPC from '../entities/NPC';
import Dummy from '../entities/Dummy';
import Slime from '../entities/enemies/Slime';
import DemonSlime from '../entities/enemies/DemonSlime';
import AudioManager from '../utils/AudioManager';
import {
  ASSETS,
  AUDIO,
  EVENTS,
  INTERACTION_TYPES,
  MAP_LAYERS,
  OBJECT_NAMES,
  ENTITY_TYPES,
  SCENES,
} from '../utils/Constants';
import { MASTER_ANIMATIONS_REGISTRY } from '../data/Animations';
import { GAME_CONFIG } from '../config/GameConfig';
import { closeModal, uiStore } from '../ui/stores/uiStore';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';

const DIALOGUE_CLOSE_RANGE = 150;

/**
 * Level 2 / Boss Scene
 * Simplified version of PlayScene focused on combat and enemies.
 */
export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super('Level2Scene');
  }

  preload() {
    this.load.scenePlugin(
      'animatedTiles',
      AnimatedTiles,
      'animatedTiles',
      'animatedTiles'
    );
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const zoom = GAME_CONFIG.zoom;
    const visibleWidth = width / zoom + 2;
    const visibleHeight = height / zoom + 2;

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

    // Physics group for all enemies. runChildUpdate delegates update() each frame.
    this.enemies = this.physics.add.group({
      runChildUpdate: true,
    });

    this.currentInteractingNPC = null;
    this.currentInteractable = null;

    // Attack Hitbox
    this.attackZone = this.add.zone(0, 0, 25, 25);
    this.physics.add.existing(this.attackZone);
    this.attackZone.body.setAllowGravity(false);
    this.attackZone.body.moves = false;
    this.attackZone.body.enable = false;

    // Debug: Visible representation of the attack zone
    this.attackZoneDebug = this.add.rectangle(0, 0, 25, 25, 0xff0000, 0.4);
    this.attackZoneDebug.setVisible(false);

    // Optional: Background. Currently reusing normal biome bg for simplicity,
    // you can customize this as needed.
    this.createParallaxBackground(width, height, visibleWidth, visibleHeight);
    
    // Load Animations & the new Map
    this.createEnvironmentAnimations();
    this.createLevel();

    if (this.sys.animatedTiles && this.map) {
      this.sys.animatedTiles.init(this.map);
    }

    this.createPlayer();

    // Input
    this.keys = this.input.keyboard.addKeys({
      e: Phaser.Input.Keyboard.KeyCodes.E,
      j: Phaser.Input.Keyboard.KeyCodes.J,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      s: Phaser.Input.Keyboard.KeyCodes.S,
    });

    // Camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(0, 32); 
    this.cameras.main.setZoom(GAME_CONFIG.zoom);

    if (this.map) {
      this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    } else {
      this.physics.world.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
      this.cameras.main.setBounds(0, 0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight);
    }

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.manualCollisions);
    this.oneWayCollider = this.physics.add.collider(
      this.player,
      this.oneWayPlatforms
    );

    this.physics.add.collider(this.dummies, this.platforms);
    this.physics.add.collider(this.dummies, this.manualCollisions);
    this.physics.add.collider(this.npcs, this.platforms);
    this.physics.add.collider(this.npcs, this.manualCollisions);

    // Enemy collisions with the world
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.manualCollisions);

    // Player's attack zone hits enemies
    this.physics.add.overlap(this.attackZone, this.enemies, (_zone, enemy) => {
      const attackState = this.player.stateMachine.state;
      if (attackState?.canDamage?.(enemy)) {
        
        // Determine knockback force based on attack type.
        // AttackState ('J') applies normal knockback.
        // CriticalAttackState ('K') applies heavy knockback.
        let force = 80; // Default generic hit
        
        // Use constructor name or state name to differentiate
        if (attackState.constructor.name === 'CriticalAttackState') {
          force = 150;
        } else if (attackState.constructor.name === 'AttackState') {
          // You could also add comboStep logic here to scale knockback for consecutive hits
          force = 80;
        }

        // Pass 1 damage, the calculated force, and the player's X as the damage source. 
        enemy.takeDamage(1, force, this.player.x);
      }
    });

    // Enemies deal contact damage to the player
    this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => {
      if (this.player.takeDamage) {
        // Handled inside EnemyAttackState; overlap here is just a safety guard
      }
    });

    // Distance checks
    this.events.on('update', () => {
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

    // Attacks
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

    // Fade in when scene starts
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Launch the HUD overlay; pass this scene's key so UIScene knows whose events to listen to
    this.scene.launch(SCENES.UI, { parentScene: SCENES.LEVEL2 });

    // Tear down the HUD when this scene stops to prevent stale listeners
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.stop(SCENES.UI);
    });
  }

  createParallaxBackground(width, height, visibleWidth, visibleHeight) {
    const layers = [
      { key: ASSETS.BG_NORMAL_LAYER_5, scroll: 0.2, depth: -16 },
      { key: ASSETS.BG_NORMAL_CASTLE, scroll: 0, depth: -15 },
      { key: ASSETS.BG_NORMAL_LAYER_4, scroll: 0.15, depth: -14 },
      { key: ASSETS.BG_NORMAL_LAYER_3, scroll: 0.1, depth: -13 },
      { key: ASSETS.BG_NORMAL_LAYER_2, scroll: 0.05, depth: -12 },
      { key: ASSETS.BG_NORMAL_LAYER_1, scroll: 0, depth: -11 },
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
        .setDepth(layer.depth)
        .setAlpha(1);

      this.backgrounds.push({
        sprite: bg,
        ratio: layer.scroll,
      });
    });
  }

  createEnvironmentAnimations() {
    MASTER_ANIMATIONS_REGISTRY.forEach((group) => {
      const { assetKey, anims } = group;
      Object.values(anims).forEach((anim) => {
        if (!this.anims.exists(anim.key)) {
          let frames;
          if (anim.frames) {
            frames = this.anims.generateFrameNumbers(assetKey, { frames: anim.frames });
          } else {
            frames = this.anims.generateFrameNumbers(assetKey, { start: anim.start, end: anim.end });
          }

          if (frames && frames.length > 0) {
            this.anims.create({
              key: anim.key,
              frames: frames,
              frameRate: anim.rate,
              repeat: anim.repeat,
            });
          }
        }
      });
    });
  }

  createLevel() {
    // Load the LEVEL 2 Map
    const map = this.make.tilemap({
      key: ASSETS.LEVEL_2_MAP,
      tileWidth: 32,
      tileHeight: 32,
    });

    this.map = map;

    // Load tilesets. You might need to adjust these to match exactly what you use in level2.json
    const tilesetMapping = {
      'Floor Tiles1': ASSETS.FLOOR_TILES_1,
      'floor_tiles2': ASSETS.TILES,
      Decoration: ASSETS.DECORATIONS,
      'Garden Decorations': ASSETS.GARDEN_DECORATIONS,
      'House Tiles': ASSETS.HOUSE_TILES,
      'Other Tiles1': ASSETS.OTHER_TILES,
      other_tiles2: ASSETS.OTHER_TILES_2,
      'Pixel Art Furnace and Sawmill': ASSETS.FURNACE,
      interest_points: ASSETS.INTEREST_POINTS,
      training_dummy: ASSETS.DUMMY,
      bg_dirt2: ASSETS.BG_DIRT2,
    };

    const allTilesets = [];
    const assetValues = Object.values(ASSETS);

    map.tilesets.forEach((tileset) => {
      let assetKey = null;

      if (tilesetMapping[tileset.name]) {
        assetKey = tilesetMapping[tileset.name];
      }
      if (!assetKey && this.textures.exists(tileset.name)) {
        assetKey = tileset.name;
      }
      if (!assetKey) {
        const baseName = tileset.name.split('/').pop().replace(/\.[^/.]+$/, '');
        if (this.textures.exists(baseName)) {
          assetKey = baseName;
        } else {
          const allKeys = this.textures.getTextureKeys();
          const match = allKeys.find((key) => key.endsWith('_' + baseName) || key === baseName);
          if (match) {
            assetKey = match;
          } else {
            const foundValue = assetValues.find((val) => val === baseName);
            if (foundValue) assetKey = foundValue;
          }
        }
      }

      let ts;
      if (assetKey) {
        ts = map.addTilesetImage(tileset.name, assetKey);
      } else {
        ts = map.addTilesetImage(tileset.name);
      }
      if (ts) {
        allTilesets.push(ts);
      } else {
        if (tileset.name) console.warn(`[Level2Scene] Tileset '${tileset.name}' could not be mapped.`);
        allTilesets.push(tileset);
      }
    });

    this.interactables = this.physics.add.staticGroup();
    this.manualCollisions = this.physics.add.staticGroup();
    this.oneWayPlatforms = this.physics.add.staticGroup();
    this.platforms = null;

    try {
      const mapData = this.cache.tilemap.get(ASSETS.LEVEL_2_MAP).data;
      if (!mapData || !mapData.layers) return;

      mapData.layers.forEach((layerData) => {
        if (layerData.type === 'tilelayer') {
          const layer = map.createLayer(layerData.name, allTilesets, 0, 0);
          if (layer && layerData.name === MAP_LAYERS.GROUND) {
            this.platforms = layer;
            this.platforms.setCollisionBetween(1, 2000);
          }
        } else if (layerData.type === 'objectgroup') {
          if (layerData.name === MAP_LAYERS.COLLISIONS) {
            this.processManualCollisions(layerData.name);
          } else if (layerData.name === MAP_LAYERS.PLATFORMS) {
            this.processOneWayPlatforms(layerData.name);
          } else if (layerData.name === 'Audio') {
             // Optional logic
          } else {
            this.processObjectLayer(layerData.name);
          }
        }
      });
    } catch (e) {
      console.warn('Level 2 Map not loaded yet or cache missing.', e);
    }
  }

  processObjectLayer(layerName) {
    const layer = this.map.getObjectLayer(layerName);
    if (!layer) return;

    const createdObjects = this.map.createFromObjects(layerName, {});

    createdObjects.forEach((obj) => {
      const getProp = (key) => obj.getData && obj.getData(key) !== undefined ? obj.getData(key) : null;

      const interactionType = getProp('interactionType');
      const entityType = getProp('entity');

      if (obj.name === OBJECT_NAMES.START) {
        obj.setVisible(false);
      }

      if (entityType === ENTITY_TYPES.DUMMY) {
        const dummy = this.dummies.get(obj.x, obj.y, ASSETS.DUMMY);
        if (dummy) dummy.setDepth(10);
        obj.destroy();
        return;
      }

      // Spawn demon slime boss
      if (entityType === ENTITY_TYPES.DEMON_SLIME || obj.type === 'demon_slime' || obj.name === 'demon_slime') {
        // Immediately hide the Phaser tile-preview sprite so it never renders as a frame artifact
        obj.setVisible(false).setActive(false);

        const w = obj.displayWidth;
        const h = obj.displayHeight;

        // For gid tile objects, createFromObjects gives x/y relative to the object's origin.
        // Tiled sets the origin of `gid` objects to the bottom-left corner (0, 1).
        const spawnX = obj.x + w / 2;
        const spawnY = obj.y - h / 2;

        const boss = new DemonSlime(this, spawnX, spawnY, w, h);
        this.enemies.add(boss, true);
        obj.destroy();
        return;
      }

      // Spawn slime enemies — the 'variant' Tiled property controls color (blue/green/red)
      if (entityType === ENTITY_TYPES.SLIME) {
        const variant = getProp('variant') ?? 'blue';

        // Immediately hide the Phaser tile-preview sprite so it never renders as a frame artifact
        obj.setVisible(false).setActive(false);

        const w = obj.displayWidth;
        const h = obj.displayHeight;

        // For gid tile objects, createFromObjects gives x/y relative to the object's origin.
        // Tiled sets the origin of `gid` objects to the bottom-left corner (0, 1).
        // Therefore, obj.x is the LEFT edge, and obj.y is the BOTTOM edge.
        const spawnX = obj.x + w / 2;
        const spawnY = obj.y - h / 2;

        const slime = new Slime(this, spawnX, spawnY, w, h, variant);
        this.enemies.add(slime, true);
        obj.destroy();
        return;
      }

      if (interactionType) {
        this.interactables.add(obj);
        obj.setData('type', interactionType);
        
        // Handle Teleport properties specifically
        if (interactionType === INTERACTION_TYPES.TELEPORT) {
          const targetScene = getProp('targetScene');
          if (targetScene) obj.setData('targetScene', targetScene);
        }
      }
    });
  }

  processManualCollisions(layerName) {
    const layer = this.map.getObjectLayer(layerName);
    if (!layer || !layer.objects) return;

    layer.objects.forEach((obj) => {
      const width = obj.width || 32;
      const height = obj.height || 32;
      const zone = this.add.zone(obj.x + width / 2, obj.y + height / 2, width, height);
      this.physics.add.existing(zone, true);
      this.manualCollisions.add(zone);
    });
  }

  processOneWayPlatforms(layerName) {
    const layer = this.map.getObjectLayer(layerName);
    if (!layer || !layer.objects) return;

    layer.objects.forEach((obj) => {
      const width = obj.width || 32;
      const height = obj.height || 32;
      const zone = this.add.zone(obj.x + width / 2, obj.y + height / 2, width, height);
      this.physics.add.existing(zone, true);
      zone.body.checkCollision.down = false;
      zone.body.checkCollision.left = false;
      zone.body.checkCollision.right = false;
      zone.body.checkCollision.up = true;
      this.oneWayPlatforms.add(zone);
    });
  }

  createPlayer() {
    let spawnPoint = null;
    const startLayer = this.map.getObjectLayer(MAP_LAYERS.START);
    
    if (startLayer && startLayer.objects) {
      spawnPoint = startLayer.objects.find(obj => obj.name === OBJECT_NAMES.START);
    }

    let spawnX = 100;
    let spawnY = 550;

    if (spawnPoint) {
      spawnX = spawnPoint.x;
      spawnY = spawnPoint.y;
    }

    this.player = new Player(this, spawnX, spawnY);
  }

  update(time, delta) {
    this.player.update(time, delta);

    if (this.currentBiome) {
      this.backgrounds.forEach((bg) => {
        bg.sprite.tilePositionX += bg.ratio;
      });
    } else {
        this.backgrounds.forEach((bg) => {
            bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratio;
        });
    }

    // Teleportation Logic
    this.physics.overlap(this.player, this.interactables, (player, interactable) => {
      if (interactable.getData('type') === INTERACTION_TYPES.TELEPORT) {
        const targetScene = interactable.getData('targetScene') || 'PlayScene';

        // Check for 'E' key press to teleport
        if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
            if (interactable.getData('triggered')) return;
            interactable.setData('triggered', true); 
            
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start(targetScene);
            });
        }
      }
    });

  }
}
