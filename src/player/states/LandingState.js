import State from './State';

export default class LandingState extends State {
  enter() {
    this.player.setVelocityX(0); // Freeze horizontal at start
    this.player.anims.play('landing', true);
    
    // Listen for animation complete to exit
    this.player.once('animationcomplete', () => {
        // Double check we are still in landing state (though FSM prevents conflict usually)
        this.stateMachine.transition('idle');
    });
  }

  update() {
    // Landing state intentionally blocks input until animation completes.
  }
}
