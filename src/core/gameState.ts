import type { GameState } from './types.ts';

export class GameStateManager {
  private history: GameState[];
  private currentIndex: number;

  constructor(initialState: GameState) {
    this.history = [initialState];
    this.currentIndex = 0;
  }

  get current(): GameState {
    return this.history[this.currentIndex]!;
  }

  get canUndo(): boolean {
    return this.currentIndex > 0;
  }

  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  get moveCount(): number {
    return this.currentIndex;
  }

  push(state: GameState): void {
    // Discard any future states when pushing a new one (after undo)
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
  }

  undo(): GameState | undefined {
    if (!this.canUndo) return undefined;
    this.currentIndex--;
    return this.current;
  }

  redo(): GameState | undefined {
    if (!this.canRedo) return undefined;
    this.currentIndex++;
    return this.current;
  }

  reset(): GameState {
    this.currentIndex = 0;
    this.history = [this.history[0]!];
    return this.current;
  }
}
