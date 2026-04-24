import type {
  Cell,
  GameState,
  GridPos,
  LevelData,
} from './types.ts';
import { CellType } from './types.ts';
import { createDie, resetDieCounter } from './die.ts';

const CELL_CHAR_MAP: Record<string, CellType> = {
  '#': CellType.Wall,
  '.': CellType.Floor,
  T: CellType.Target,
  P: CellType.Pit,
  D: CellType.Destructible,
  ' ': CellType.Void,
};

export function createGrid(level: LevelData): ReadonlyArray<ReadonlyArray<Cell>> {
  const rows: Cell[][] = [];
  for (let r = 0; r < level.height; r++) {
    const row: Cell[] = [];
    const line = level.cells[r] ?? '';
    for (let c = 0; c < level.width; c++) {
      const ch = line[c] ?? ' ';
      const type = CELL_CHAR_MAP[ch] ?? CellType.Void;
      row.push({ type });
    }
    rows.push(row);
  }
  return rows;
}

export function inBounds(grid: ReadonlyArray<ReadonlyArray<Cell>>, pos: GridPos): boolean {
  const firstRow = grid[0];
  if (!firstRow) return false;
  return pos.row >= 0 && pos.row < grid.length && pos.col >= 0 && pos.col < firstRow.length;
}

export function getCell(
  grid: ReadonlyArray<ReadonlyArray<Cell>>,
  pos: GridPos,
): Cell | undefined {
  if (!inBounds(grid, pos)) return undefined;
  return grid[pos.row]![pos.col];
}

export function isWalkable(
  grid: ReadonlyArray<ReadonlyArray<Cell>>,
  pos: GridPos,
): boolean {
  const cell = getCell(grid, pos);
  if (!cell) return false;
  return (
    cell.type === CellType.Floor ||
    cell.type === CellType.Target
  );
}

export function destroyCell(
  grid: ReadonlyArray<ReadonlyArray<Cell>>,
  pos: GridPos,
): ReadonlyArray<ReadonlyArray<Cell>> {
  const cell = getCell(grid, pos);
  if (!cell || cell.type !== CellType.Destructible) return grid;
  return grid.map((row, r) =>
    r === pos.row
      ? row.map((c, col) => (col === pos.col ? { type: CellType.Floor } : c))
      : row,
  );
}

export function createInitialGameState(level: LevelData): GameState {
  resetDieCounter();
  const grid = createGrid(level);
  return {
    grid,
    player: { pos: level.playerStart },
    dice: level.dice.map((d) => createDie(d.color, d.pos, d.initialTop)),
    turnCount: 0,
    isComplete: false,
    levelId: level.id,
    winConditions: level.winConditions,
  };
}
