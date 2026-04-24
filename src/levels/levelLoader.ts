import {
  type Cell,
  CellType,
  type GameState,
  type LevelData,
} from '../core/types';
import { createDie, resetDieCounter } from '../core/die';

const CELL_CHAR_MAP: Record<string, CellType> = {
  '#': CellType.Wall,
  '.': CellType.Floor,
  T: CellType.Target,
  P: CellType.Pit,
  D: CellType.Destructible,
  ' ': CellType.Void,
};

export function loadLevel(data: LevelData): GameState {
  // Parse cells into grid
  const grid: Cell[][] = [];
  for (let r = 0; r < data.height; r++) {
    const row: Cell[] = [];
    const line = data.cells[r] ?? '';
    for (let c = 0; c < data.width; c++) {
      const ch = line[c] ?? ' ';
      const type = CELL_CHAR_MAP[ch] ?? CellType.Void;
      row.push({ type });
    }
    grid.push(row);
  }

  // Reset die counter for clean IDs each level
  resetDieCounter();

  // Create dice using the real createDie
  const dice = data.dice.map((d) => createDie(d.color, d.pos, d.initialTop));

  return {
    grid,
    player: { pos: data.playerStart },
    dice,
    turnCount: 0,
    isComplete: false,
    levelId: data.id,
    winConditions: data.winConditions,
  };
}
