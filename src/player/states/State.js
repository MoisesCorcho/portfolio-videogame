export default class State {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
  }

  enter() {
    // Override in subclasses
  }

  update() {
    // Override in subclasses
  }

  exit() {
    // Override in subclasses
  }
}
