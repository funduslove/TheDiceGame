// === Coordinates ===
export interface GridPos {
  readonly row: number;
  readonly col: number;
}

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export const DIRECTION_DELTA: Record<Direction, GridPos> = {
  [Direction.Up]: { row: -1, col: 0 },
  [Direction.Down]: { row: 1, col: 0 },
  [Direction.Left]: { row: 0, col: -1 },
  [Direction.Right]: { row: 0, col: 1 },
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  [Direction.Up]: Direction.Down,
  [Direction.Down]: Direction.Up,
  [Direction.Left]: Direction.Right,
  [Direction.Right]: Direction.Left,
};

export function addPos(a: GridPos, b: GridPos): GridPos {
  return { row: a.row + b.row, col: a.col + b.col };
}

export function posEqual(a: GridPos, b: GridPos): boolean {
  return a.row === b.row && a.col === b.col;
}

// === Grid ===
export enum CellType {
  Floor = '.',
  Wall = '#',
  Pit = 'P',
  Target = 'T',
  Destructible = 'D',
  Void = ' ',
}

export interface Cell {
  readonly type: CellType;
}

// === Die ===
export enum DieColor {
  White = 'white',
  Red = 'red',
  Blue = 'blue',
}

export interface DieOrientation {
  readonly top: number;
  readonly bottom: number;
  readonly north: number;
  readonly south: number;
  readonly east: number;
  readonly west: number;
}

export interface Die {
  readonly id: string;
  readonly color: DieColor;
  readonly pos: GridPos;
  readonly orientation: DieOrientation;
  readonly bombTimer?: number;
}

// === Player ===
export interface Player {
  readonly pos: GridPos;
}

// === Win Conditions ===
export enum WinConditionType {
  PlayerOnTarget = 'playerOnTarget',
  DieOnTarget = 'dieOnTarget',
  DieValueOnTarget = 'dieValueOnTarget',
  AllDiceOnTargets = 'allDiceOnTargets',
}

export interface WinCondition {
  readonly type: WinConditionType;
  readonly targetPos?: GridPos;
  readonly requiredValue?: number;
}

// === Game State ===
export interface GameState {
  readonly grid: ReadonlyArray<ReadonlyArray<Cell>>;
  readonly player: Player;
  readonly dice: ReadonlyArray<Die>;
  readonly turnCount: number;
  readonly isComplete: boolean;
  readonly levelId: string;
  readonly winConditions: ReadonlyArray<WinCondition>;
}

// === Level Data (JSON format) ===
export interface LevelData {
  readonly id: string;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly cells: string[];
  readonly playerStart: GridPos;
  readonly dice: Array<{
    readonly color: DieColor;
    readonly pos: GridPos;
    readonly initialTop?: number;
  }>;
  readonly winConditions: WinCondition[];
  readonly hint?: string;
}
