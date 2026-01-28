# State Machine Refactoring Plan

## Objective

Refactor the current `PlayScene.js` logic, which relies on multiple boolean flags (`isLanding`, `wasOnGround`) and nested `if/else` statements, into a robust **Finite State Machine (FSM)** architecture. This demonstrates architectural scalability and clean code principles fitting for a Senior Developer's portfolio.

## Phase 1: Architecture Setup

We will move the Player logic out of `PlayScene` and into a dedicated `Player` class and a State Machine system.

### 1. New Directory Structure

Create `src/player/` to house all player-related logic.

```
src/
  player/
    Player.js           # The main Player entity (extends Phaser.Physics.Arcade.Sprite)
    PlayerStateMachine.js # The "Brain" handling state transitions
    states/
      State.js          # Base abstract class
      IdleState.js
      RunState.js
      JumpState.js
      FallState.js
      LandingState.js
      AttackState.js
```

### 2. The `PlayerStateMachine` Class

A flexible machine that:

- Holds a reference to the `current_state`.
- Methods: `transition(newStateName)`, `step()` (called every frame).
- Dictionary/Map of available states.

### 3. The `State` Base Class

Defines the contract for all states:

- `enter()`: Logic to run when entering (e.g., play animation).
- `exit()`: Logic to run when leaving (e.g., reset variables).
- `handleInput()`: Check keys and decide if we should transition.

## Phase 2: Implementation of States

We will migrate logic from `PlayScene.update` into these distinct classes.

| State       | Responsibility                                     | Transitions To                                 |
| ----------- | -------------------------------------------------- | ---------------------------------------------- |
| **Idle**    | Play 'idle'. Check for movement/jump/attack.       | Run, Jump, Attack                              |
| **Run**     | Play 'run', move X velocity. Check logic.          | Idle, Jump, Attack, Fall (if walked off ledge) |
| **Jump**    | Play 'jump', set -Y velocity ONCE. Control in air. | Fall, Attack                                   |
| **Fall**    | Play 'fall'. Monitor `onGround`.                   | Landing, Attack                                |
| **Landing** | Play 'landing', freeze X. Wait for anim complete.  | Idle, Run, Jump (cancel), Attack (cancel)      |
| **Attack**  | Play 'attack', freeze X. Wait for anim complete.   | Idle (or previous state if we want complexity) |

## Phase 3: Integration

1.  **Refactor `PlayScene.js`**:
    - Remove direct sprite creation `this.physics.add.sprite`.
    - Instantiate `this.player = new Player(this, x, y)`.
    - In `update()`, call `this.player.update()`.
2.  **Clean Up**: Remove all the old flags (`isLanding`, `wasOnGround`) from `PlayScene`, as the `Player` class will manage its own internal memory.

## Benefits for Portfolio

- **Scalability**: Adding a "Slide" or "Double Jump" becomes creating 1 new file, not hacking a 400-line `update` function.
- **Readability**: Code is strictly segregated. Animation logic lives with Input logic per state.
- **Professionalism**: Shows mastery of Design Patterns (State Pattern).

## Execution Steps

1.  Create `StateMachine` and `State` base classes.
2.  Create `Player` class wrapper.
3.  Implement `Idle` and `Run` states first.
4.  Implement `Jump` and `Fall` states.
5.  Implement `Attack` and `Landing` (Complex states).
6.  Swap `PlayScene` usage.
