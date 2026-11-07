import { registerAbility } from './abilityRegistry.ts';
import { destroyCell } from '../core/grid.ts';
import type {
  Die,
  Direction,
  GameState,
  GridPos,
} from '../core/types.ts';
import { DieColor, posEqual } from '../core/types.ts';

/**
 * Red die ability:
 * - onPush: set bombTimer = top face value
 * - onTurnEnd: decrement timer. At 0: explode in + pattern,
 *   destroying destructible walls and removing dice in the blast.
 */

function onPush(state: GameState, die: Die, _direction: Direction): GameState {
  const timer = die.orientation.top;
  const newDice = state.dice.map((d) =>
    d.id === die.id ? { ...d, bombTimer: timer } : d,
  );
  return { ...state, dice: newDice };
}

function onTurnEnd(state: GameState, die: Die): GameState {
  if (die.bombTimer === undefined) return state;

  const newTimer = die.bombTimer - 1;

  if (newTimer > 0) {
    // Just decrement the timer
    const newDice = state.dice.map((d) =>
      d.id === die.id ? { ...d, bombTimer: newTimer } : d,
    );
    return { ...state, dice: newDice };
  }

  // Timer hit 0: EXPLODE
  return detonate(state, die);
}

function detonate(state: GameState, die: Die): GameState {
  const blastRange = die.orientation.top;
  const blastCells: GridPos[] = [];

  // + pattern: extend in 4 cardinal directions from die position
  const deltas: GridPos[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  for (const delta of deltas) {
    for (let dist = 1; dist <= blastRange; dist++) {
      blastCells.push({
        row: die.pos.row + delta.row * dist,
        col: die.pos.col + delta.col * dist,
      });
    }
  }
  // Include the die's own cell
  blastCells.push(die.pos);

  // Destroy destructible walls in blast range
  let grid = state.grid;
  for (const pos of blastCells) {
    grid = destroyCell(grid, pos);
  }

  // Remove dice in blast range (including the exploding die itself)
  const newDice = state.dice.filter((d) => {
    return !blastCells.some((bp) => posEqual(bp, d.pos));
  });

  return { ...state, grid, dice: newDice };
}

registerAbility(DieColor.Red, { onPush, onTurnEnd });
