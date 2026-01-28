export default class StateMachine {
  constructor(initialState, possibleStates, stateArgs = []) {
    this.initialState = initialState;
    this.possibleStates = possibleStates;
    this.stateArgs = stateArgs;
    this.state = null;

    // States instances are deferred until actually needed or initialized here?
    // Let's create instances for all states to keep them persistent (optional)
    // For simplicity, we step() the current state.
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
    this.state = this.possibleStates[newState];
    this.state.enter(...this.stateArgs, ...enterArgs);
  }
}
