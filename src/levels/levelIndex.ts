import { DieColor, type LevelData, WinConditionType } from '../core/types';

const level01: LevelData = {
  id: 'level-01',
  name: 'First Steps',
  width: 5,
  height: 5,
  cells: [
    '#####',
    '#...#',
    '#...#',
    '#...#',
    '###T#',
  ],
  playerStart: { row: 2, col: 2 },
  dice: [],
  winConditions: [
    { type: WinConditionType.PlayerOnTarget, targetPos: { row: 4, col: 3 } },
  ],
  hint: 'Use arrow keys or WASD to move. Reach the green target tile.',
};

const level02: LevelData = {
  id: 'level-02',
  name: 'Push It',
  width: 6,
  height: 6,
  cells: [
    '######',
    '#....#',
    '#....#',
    '#....#',
    '#...T#',
    '######',
  ],
  playerStart: { row: 2, col: 1 },
  dice: [
    { color: DieColor.White, pos: { row: 3, col: 2 } },
  ],
  winConditions: [
    { type: WinConditionType.DieOnTarget, targetPos: { row: 4, col: 4 } },
  ],
  hint: 'Walk into the die to push it. Get it onto the target.',
};

const level03: LevelData = {
  id: 'level-03',
  name: 'Roll Call',
  width: 7,
  height: 5,
  cells: [
    '#######',
    '#.....#',
    '#.....#',
    '#.....#',
    '####T##',
  ],
  playerStart: { row: 1, col: 2 },
  dice: [
    { color: DieColor.White, pos: { row: 3, col: 2 } },
  ],
  winConditions: [
    {
      type: WinConditionType.DieValueOnTarget,
      targetPos: { row: 4, col: 4 },
      requiredValue: 3,
    },
  ],
  hint: 'The die rolls as you push it. Land on the target with 3 showing on top.',
};

const level04: LevelData = {
  id: 'level-04',
  name: 'Demolition',
  width: 7,
  height: 7,
  cells: [
    '  ###  ',
    ' ##.## ',
    '##.D.##',
    '#.....#',
    '##.D.##',
    ' ##.## ',
    '  #T#  ',
  ],
  playerStart: { row: 3, col: 1 },
  dice: [
    { color: DieColor.Red, pos: { row: 3, col: 3 }, initialTop: 3 },
  ],
  winConditions: [
    { type: WinConditionType.PlayerOnTarget, targetPos: { row: 6, col: 3 } },
  ],
  hint: 'Red dice are bombs! Push them into destructible walls to clear a path.',
};

const level05: LevelData = {
  id: 'level-05',
  name: 'Icy Slide',
  width: 8,
  height: 5,
  cells: [
    '########',
    '#......#',
    '#..PPP.#',
    '#......#',
    '#####T##',
  ],
  playerStart: { row: 1, col: 1 },
  dice: [
    { color: DieColor.Blue, pos: { row: 1, col: 3 } },
  ],
  winConditions: [
    { type: WinConditionType.DieOnTarget, targetPos: { row: 4, col: 5 } },
  ],
  hint: 'Blue dice slide until they hit something. Use the walls to guide it.',
};

export const LEVELS: readonly LevelData[] = [
  level01,
  level02,
  level03,
  level04,
  level05,
];
