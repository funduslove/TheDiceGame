import type {
  Die,
  DieColor,
  DieOrientation,
  GridPos,
} from './types.ts';
import { Direction } from './types.ts';

/**
 * Standard die orientation: top=1, bottom=6, north=2, south=5, east=3, west=4.
 * Opposite faces always sum to 7.
 */
export const DEFAULT_ORIENTATION: DieOrientation = {
  top: 1,
  bottom: 6,
  north: 2,
  south: 5,
  east: 3,
  west: 4,
};

/**
 * Roll the die one tile in the given direction.
 *
 * Up (north): die tips forward.
 *   top -> north, south -> top, bottom -> south, north -> bottom.
 *   east/west unchanged.
 *
 * Down (south): reverse of Up.
 *   top -> south, north -> top, bottom -> north, south -> bottom.
 *
 * Left (west): die tips left.
 *   top -> west, east -> top, bottom -> east, west -> bottom.
 *
 * Right (east): die tips right.
 *   top -> east, west -> top, bottom -> west, east -> bottom.
 */
export function rollOrientation(o: DieOrientation, dir: Direction): DieOrientation {
  switch (dir) {
    case Direction.Up:
      return { top: o.south, bottom: o.north, north: o.top, south: o.bottom, east: o.east, west: o.west };
    case Direction.Down:
      return { top: o.north, bottom: o.south, north: o.bottom, south: o.top, east: o.east, west: o.west };
    case Direction.Left:
      return { top: o.east, bottom: o.west, north: o.north, south: o.south, east: o.bottom, west: o.top };
    case Direction.Right:
      return { top: o.west, bottom: o.east, north: o.north, south: o.south, east: o.top, west: o.bottom };
  }
}

/**
 * Rotate the default orientation until the desired face is on top.
 * Returns a valid DieOrientation with opposites summing to 7.
 */
export function orientWithTopFace(topFace: number): DieOrientation {
  // We try sequences of rolls from default orientation to get the desired top.
  // Since there are only 6 possible top faces, a small lookup suffices.
  const rotations: Record<number, Direction[]> = {
    1: [],                              // default top = 1
    6: [Direction.Up, Direction.Up],    // flip 180: top=1->north, south=5->top, then again top=5->north, south=6->top => top=6
    2: [Direction.Down],               // tip backward: north(2)->top
    5: [Direction.Up],                 // tip forward: south(5)->top
    3: [Direction.Left],               // tip left: east(3)->top
    4: [Direction.Right],              // tip right: west(4)->top
  };

  const dirs = rotations[topFace];
  if (!dirs) return DEFAULT_ORIENTATION;

  let o = DEFAULT_ORIENTATION;
  for (const d of dirs) {
    o = rollOrientation(o, d);
  }
  return o;
}

let dieCounter = 0;

export function createDie(
  color: DieColor,
  pos: GridPos,
  initialTop?: number,
): Die {
  const orientation = initialTop ? orientWithTopFace(initialTop) : DEFAULT_ORIENTATION;
  return {
    id: `die-${dieCounter++}`,
    color,
    pos,
    orientation,
  };
}

/**
 * Roll a die one tile in the given direction.
 * Returns a new Die with updated position and orientation.
 */
export function rollDie(die: Die, dir: Direction, newPos: GridPos): Die {
  return {
    ...die,
    pos: newPos,
    orientation: rollOrientation(die.orientation, dir),
  };
}

export function resetDieCounter(): void {
  dieCounter = 0;
}
