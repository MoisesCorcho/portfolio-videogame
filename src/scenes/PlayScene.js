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
    const map = this.make.tilemap({ key: 'level1' });
    this.map = map;

    const tileset = map.addTilesetImage('oak_woods_tileset', 'tiles');
    const platforms = map.createLayer(MAP_LAYERS.GROUND, tileset, 0, 0);
    platforms.setCollisionBetween(1, 1000);

    this.platforms = platforms;
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
      if (obj.name === ASSETS.SHOP) {
        const shop = this.interactables.create(obj.x, obj.y, ASSETS.SHOP);
        shop.setOrigin(0, 1);
        shop.setData('type', INTERACTION_TYPES.PROFILE);
        shop.refreshBody();
      } else if (obj.name === ASSETS.SKILLS || obj.name === ASSETS.SIGN) {
        const sign = this.interactables.create(obj.x, obj.y, ASSETS.SIGN);
        sign.setOrigin(0, 1);
        sign.setData('type', INTERACTION_TYPES.SKILLS);
        sign.refreshBody();
      } else if (obj.name === OBJECT_NAMES.PROJECTS) {
        const sign = this.interactables.create(obj.x, obj.y, ASSETS.SIGN);
        sign.setOrigin(0, 1);
        sign.setData('type', INTERACTION_TYPES.EXPERIENCE);
        sign.refreshBody();
      } else if (obj.name === ASSETS.LAMP) {
        const lamp = this.interactables.create(obj.x, obj.y, ASSETS.LAMP);
        lamp.setOrigin(0, 1);
        lamp.setData('type', INTERACTION_TYPES.EDUCATION);
        lamp.refreshBody();
      } else if (obj.name === ASSETS.LARGE_TENT) {
        const tent = this.interactables.create(obj.x, obj.y, ASSETS.LARGE_TENT);
        tent.setOrigin(0, 1);
        tent.setData('type', INTERACTION_TYPES.EXPERIENCE);
        tent.refreshBody();

        if (obj.width && obj.height) {
          tent.setDisplaySize(obj.width, obj.height);
        }
      } else if (obj.name.startsWith(OBJECT_NAMES.ROCKS) || obj.name.startsWith(OBJECT_NAMES.FENCE)) {
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
