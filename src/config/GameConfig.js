export const GAME_CONFIG = {
  width: 960,  // 960/3 = 320px viewport (clean multiple of 24)
  height: 576, // 576/3 = 192px viewport (24 * 8 tiles)
  gravity: 1000,
  bgColor: '#5c94fc', // Classic Mario sky blue
  zoom: 3, // Integer zoom for pixel-perfect rendering
  worldWidth: 3200, // Larger world for exploration
  worldHeight: 600, // 25 tiles high (24 * 25)
  debug: import.meta.env.DEV, // Enable debug in dev mode
};
