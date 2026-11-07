import { TILE_WIDTH, TILE_HEIGHT } from '../constants';
import type { GridPos } from '../core/types';

export interface ScreenPos {
  readonly x: number;
  readonly y: number;
}

/** Convert grid coordinates to isometric screen position. */
export function gridToScreen(pos: GridPos): ScreenPos {
  return {
    x: (pos.col - pos.row) * (TILE_WIDTH / 2),
    y: (pos.col + pos.row) * (TILE_HEIGHT / 2),
  };
}

/** Convert screen coordinates back to grid position (rounded). */
export function screenToGrid(screen: ScreenPos): GridPos {
  const halfW = TILE_WIDTH / 2;
  const halfH = TILE_HEIGHT / 2;
  const col = (screen.x / halfW + screen.y / halfH) / 2;
  const row = (screen.y / halfH - screen.x / halfW) / 2;
  return { row: Math.round(row), col: Math.round(col) };
}

/** Lerp between two screen positions. */
export function lerpScreen(a: ScreenPos, b: ScreenPos, t: number): ScreenPos {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}
