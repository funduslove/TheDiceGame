import { Direction } from '../core/types';

export type ActionType = 'undo' | 'redo' | 'reset' | 'nextLevel';

export interface InputCallbacks {
  onMove: (direction: Direction) => void;
  onAction: (action: ActionType) => void;
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
  w: Direction.Up,
  W: Direction.Up,
  a: Direction.Left,
  A: Direction.Left,
  s: Direction.Down,
  S: Direction.Down,
  d: Direction.Right,
  D: Direction.Right,
};

const KEY_TO_ACTION: Record<string, ActionType> = {
  z: 'undo',
  Z: 'undo',
  y: 'redo',
  Y: 'redo',
  r: 'reset',
  R: 'reset',
  Enter: 'nextLevel',
  ' ': 'nextLevel',
};

export function setupInput(callbacks: InputCallbacks): () => void {
  const handler = (e: KeyboardEvent) => {
    const dir = KEY_TO_DIRECTION[e.key];
    if (dir) {
      e.preventDefault();
      callbacks.onMove(dir);
      return;
    }

    const action = KEY_TO_ACTION[e.key];
    if (action) {
      e.preventDefault();
      callbacks.onAction(action);
    }
  };

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
