import type { GridPos, Player } from './types.ts';

export function createPlayer(pos: GridPos): Player {
  return { pos };
}

export function movePlayer(player: Player, newPos: GridPos): Player {
  return { pos: newPos };
}
