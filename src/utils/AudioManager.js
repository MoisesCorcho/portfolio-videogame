/**
 * @fileoverview Manages all audio operations including music, SFX, and spatial audio.
 * Implements a singleton pattern to ensure only one audio manager exists.
 */

import { GAME_CONFIG } from '../config/GameConfig';

export default class AudioManager {
  constructor(scene) {
    if (AudioManager.instance) {
      return AudioManager.instance;
    }

    this.scene = scene;
    this.currentMusic = null;
    this.currentMusicKey = null;
    this.sfxVolume = 0.5;
    this.musicVolume = 0.3;
    
    // Store spatial sounds { id: { sound, sourceOb } }
    this.spatialSounds = new Map();

    AudioManager.instance = this;
  }

  /**
   * Plays a background music track with a cross-fade effect.
   * @param {string} key - The key of the music to play.
   * @param {number} [fadeDuration=1000] - Duration of the cross-fade in ms.
   * @param {number} [targetVolume] - Optional specific volume for this track. Defaults to this.musicVolume.
   */
  playMusic(key, fadeDuration = 1000, targetVolume = null) {
    if (this.currentMusicKey === key) return;

    const volume = targetVolume !== null ? targetVolume : this.musicVolume;

    const newMusic = this.scene.sound.add(key, {
      volume: 0,
      loop: true,
    });

    newMusic.play();
    this.scene.tweens.add({
      targets: newMusic,
      volume: volume,
      duration: fadeDuration,
    });

    if (this.currentMusic) {
      const trackToStop = this.currentMusic; // Capture reference to the old track
      
      // Stop any existing fade-in/out tweens on the track we are about to stop
      this.scene.tweens.killTweensOf(trackToStop);

      this.scene.tweens.add({
        targets: trackToStop,
        volume: 0,
        duration: fadeDuration,
        onComplete: () => {
          if (trackToStop && trackToStop.duration) { 
             trackToStop.stop();
             trackToStop.destroy();
          }
        },
      });
    }

    this.currentMusic = newMusic;
    this.currentMusicKey = key;
  }

  /**
   * Sets the global music volume.
   * @param {number} volume - Volume level (0 to 1).
   */
  setMusicVolume(volume) {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    if (this.currentMusic) {
      this.currentMusic.setVolume(this.musicVolume);
    }
  }

  /**
   * Plays a one-shot sound effect.
   * @param {string} key - The key of the sound effect.
   * @param {Object} [config] - Optional Phaser sound config.
   */
  playSfx(key, config = {}) {
    this.scene.sound.play(key, {
      volume: this.sfxVolume,
      ...config,
    });
  }

  /**
   * Registers a spatial sound source.
   * @param {string} id - Unique ID for the sound source.
   * @param {string} key - Audio asset key.
   * @param {Phaser.Math.Vector2} sourceObj - Object with x, y properties (source of sound).
   * @param {number} radius - Max distance to hear the sound.
   * @param {number} maxVolume - Maximum volume at the source.
   */
  addSpatialSound(id, key, sourceObj, radius = 300, maxVolume = 0.5) {
    if (!this.scene.sound.get(key)) {
        // Create the sound if it doesn't exist instance
         const sound = this.scene.sound.add(key, {
            volume: 0,
            loop: true,
        });
        sound.play();
        this.spatialSounds.set(id, { sound, sourceObj, radius, maxVolume });
    }
  }

  /**
   * Updates volume of spatial sounds based on player position.
   * @param {Phaser.GameObjects.Sprite} player - The player entity.
   */
  updateSpatialSounds(player) {
    this.spatialSounds.forEach((item) => {
      const dist = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        item.sourceObj.x,
        item.sourceObj.y
      );

      if (dist < item.radius) {
        // Calculate volume based on distance (linear falloff)
        const volume = item.maxVolume * (1 - dist / item.radius);
        item.sound.setVolume(Math.max(0, volume));
        
        // Simple panning (optional)
        const pan = Phaser.Math.Clamp((item.sourceObj.x - player.x) / item.radius, -1, 1);
        // item.sound.setPan(pan); // Uncomment if stereo panning is desired
      } else {
        item.sound.setVolume(0);
      }
    });
  }
}
