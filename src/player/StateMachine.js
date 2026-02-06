export default class StateMachine {
  constructor(initialState, possibleStates, stateArgs = []) {
    this.initialState = initialState;
    this.possibleStates = possibleStates;
    this.stateArgs = stateArgs;
    this.state = null;

    for (const state of Object.values(this.possibleStates)) {
      state.stateMachine = this;
    }
  }

  step() {
    // Only proceed if state is loaded
    if (this.state) {
      this.state.update(...this.stateArgs);
    }
  }

  transition(newState, ...enterArgs) {
    // Call exit on current state if it exists
    if (this.state && this.state.exit) {
      this.state.exit(...this.stateArgs);
    }

    this.state = this.possibleStates[newState];
    this.state.enter(...this.stateArgs, ...enterArgs);
  }
}
