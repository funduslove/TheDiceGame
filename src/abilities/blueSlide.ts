import { registerAbility } from './abilityRegistry.ts';
import { rollDie } from '../core/die.ts';
import { getCell, inBounds } from '../core/grid.ts';
import type {
  Die,
  Direction,
  GameState,
} from '../core/types.ts';
import {
  CellType,
  DieColor,
  DIRECTION_DELTA,
  addPos,
  posEqual,
} from '../core/types.ts';

/**
 * Blue die ability: on push, slides forward N tiles where N = top face value
 * at time of push. The die ROLLS for each tile (orientation updates each step).
 * Stops early if it hits a wall, another die, or the edge of the grid.
 */
function onPush(state: GameState, die: Die, direction: Direction): GameState {
  const slideDistance = die.orientation.top;
  const delta = DIRECTION_DELTA[direction];

  let currentDie = die;

  for (let step = 0; step < slideDistance - 1; step++) {
    // -1 because the first push already moved it one tile
    const nextPos = addPos(currentDie.pos, delta);

    // Stop if out of bounds
    if (!inBounds(state.grid, nextPos)) break;

    // Stop if cell is not walkable (wall, void, pit, destructible wall)
    const cell = getCell(state.grid, nextPos);
    if (!cell || cell.type === CellType.Wall || cell.type === CellType.Void || cell.type === CellType.Destructible) break;

    // Stop if another die occupies the target cell
    const blocked = state.dice.some(
      (d) => d.id !== currentDie.id && posEqual(d.pos, nextPos),
    );
    if (blocked) break;

    // Roll the die one tile forward
    currentDie = rollDie(currentDie, direction, nextPos);
  }

  // Replace the die in state with the updated one
  const newDice = state.dice.map((d) =>
    d.id === die.id ? currentDie : d,
  );

  return { ...state, dice: newDice };
}

registerAbility(DieColor.Blue, { onPush });
