export const GAME_CONFIG = {
  width: 1024, // 1024/2 = 512px o 1024/4 = 256px
  height: 576,
  gravity: 1000,
  bgColor: '#5c94fc', // Classic Mario sky blue
  zoom: 3, // Integer zoom for pixel-perfect rendering
  worldWidth: 3200, // Larger world for exploration
  worldHeight: 600, // 25 tiles high (24 * 25)
  debug: import.meta.env.DEV, // Enable debug in dev mode
};
