import { getAbility } from '../abilities/abilityRegistry.ts';
// Import ability modules for side-effect registration
import '../abilities/redBomb.ts';
import '../abilities/blueSlide.ts';

import { rollDie } from './die.ts';
import { getCell, inBounds, isWalkable } from './grid.ts';
import type {
  Die,
  GameState,
  WinCondition,
} from './types.ts';
import {
  CellType,
  Direction,
  DIRECTION_DELTA,
  WinConditionType,
  addPos,
  posEqual,
} from './types.ts';

export interface TurnResult {
  readonly state: GameState;
  readonly moved: boolean;
}

/**
 * Process a single turn:
 * 1. Validate move (target cell must be walkable or have a pushable die)
 * 2. If die present at target, push/roll it
 * 3. Trigger onPush ability for pushed die
 * 4. Move player to target cell
 * 5. Tick bomb timers (onTurnEnd for all dice)
 * 6. Check win conditions
 */
export function processTurn(state: GameState, direction: Direction): TurnResult {
  if (state.isComplete) return { state, moved: false };

  const delta = DIRECTION_DELTA[direction];
  const targetPos = addPos(state.player.pos, delta);

  // Check bounds
  if (!inBounds(state.grid, targetPos)) return { state, moved: false };

  // Check for die at target position
  const dieAtTarget = state.dice.find((d) => posEqual(d.pos, targetPos));

  if (dieAtTarget) {
    // Try to push the die
    const pushResult = tryPushDie(state, dieAtTarget, direction);
    if (!pushResult) return { state, moved: false };
    state = pushResult;
  } else {
    // No die - target must be walkable
    if (!isWalkable(state.grid, targetPos)) return { state, moved: false };
  }

  // Move player
  state = {
    ...state,
    player: { pos: targetPos },
    turnCount: state.turnCount + 1,
  };

  // Tick bomb timers (onTurnEnd for all dice)
  state = tickTurnEnd(state);

  // Check win conditions
  const isComplete = checkWinConditions(state);
  if (isComplete) {
    state = { ...state, isComplete: true };
  }

  return { state, moved: true };
}

function tryPushDie(state: GameState, die: Die, direction: Direction): GameState | null {
  const delta = DIRECTION_DELTA[direction];
  const pushTarget = addPos(die.pos, delta);

  // Die destination must be in bounds
  if (!inBounds(state.grid, pushTarget)) return null;

  const targetCell = getCell(state.grid, pushTarget);
  if (!targetCell) return null;

  // Die can be pushed onto floor, target, or pit
  if (
    targetCell.type !== CellType.Floor &&
    targetCell.type !== CellType.Target &&
    targetCell.type !== CellType.Pit
  ) {
    return null;
  }

  // Can't push into another die
  const blocked = state.dice.some((d) => d.id !== die.id && posEqual(d.pos, pushTarget));
  if (blocked) return null;

  // Roll the die
  const rolledDie = rollDie(die, direction, pushTarget);

  // If pushed into a pit, remove the die
  if (targetCell.type === CellType.Pit) {
    const newDice = state.dice.filter((d) => d.id !== die.id);
    return { ...state, dice: newDice };
  }

  // Update die in state
  let newState: GameState = {
    ...state,
    dice: state.dice.map((d) => (d.id === die.id ? rolledDie : d)),
  };

  // Trigger onPush ability
  const ability = getAbility(rolledDie.color);
  if (ability?.onPush) {
    // Find the updated die in newState
    const updatedDie = newState.dice.find((d) => d.id === die.id);
    if (updatedDie) {
      newState = ability.onPush(newState, updatedDie, direction);
    }
  }

  return newState;
}

function tickTurnEnd(state: GameState): GameState {
  // Process onTurnEnd for each die (iterate over a snapshot to handle removals)
  const diceSnapshot = [...state.dice];
  for (const die of diceSnapshot) {
    // Die may have been removed by a previous detonation this tick
    const current = state.dice.find((d) => d.id === die.id);
    if (!current) continue;

    const ability = getAbility(current.color);
    if (ability?.onTurnEnd) {
      state = ability.onTurnEnd(state, current);
    }
  }
  return state;
}

function checkWinConditions(state: GameState): boolean {
  return state.winConditions.every((wc) => evaluateCondition(state, wc));
}

function evaluateCondition(state: GameState, wc: WinCondition): boolean {
  switch (wc.type) {
    case WinConditionType.PlayerOnTarget: {
      if (!wc.targetPos) return false;
      const cell = getCell(state.grid, wc.targetPos);
      return !!cell && cell.type === CellType.Target && posEqual(state.player.pos, wc.targetPos);
    }

    case WinConditionType.DieOnTarget: {
      if (!wc.targetPos) return false;
      return state.dice.some((d) => posEqual(d.pos, wc.targetPos!));
    }

    case WinConditionType.DieValueOnTarget: {
      if (!wc.targetPos || wc.requiredValue === undefined) return false;
      return state.dice.some(
        (d) =>
          posEqual(d.pos, wc.targetPos!) &&
          d.orientation.top === wc.requiredValue,
      );
    }

    case WinConditionType.AllDiceOnTargets: {
      return state.dice.every((d) => {
        const cell = getCell(state.grid, d.pos);
        return !!cell && cell.type === CellType.Target;
      });
    }

    default:
      return false;
  }
}
