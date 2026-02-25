import State from './State';
import { AUDIO } from '../../utils/Constants';

export default class LandingState extends State {
  enter() {
    this.player.scene.audioManager.playSfx(AUDIO.SFX.LAND, { volume: 0.5 });
    
    const { cursors, keys } = this.player;

    if (cursors.up.isDown || keys.w.isDown) {
      this.stateMachine.transition('jump');
    } else if (cursors.left.isDown || cursors.right.isDown || keys.a.isDown || keys.d.isDown) {
      this.stateMachine.transition('run');
    } else {
      this.stateMachine.transition('idle');
    }
  }

  update() {
    // No action needed as we instantly transition out
  }
}
