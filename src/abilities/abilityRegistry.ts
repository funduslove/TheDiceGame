import type {
  Die,
  Direction,
  GameState,
} from '../core/types.ts';
import { DieColor } from '../core/types.ts';

export interface AbilityHandler {
  /**
   * Called immediately after the die is pushed/rolled.
   * Returns the updated game state.
   */
  onPush?(state: GameState, die: Die, direction: Direction): GameState;

  /**
   * Called at the end of each turn (for bomb timers, etc.).
   * Returns the updated game state.
   */
  onTurnEnd?(state: GameState, die: Die): GameState;
}

const registry = new Map<DieColor, AbilityHandler>();

export function registerAbility(color: DieColor, handler: AbilityHandler): void {
  registry.set(color, handler);
}

export function getAbility(color: DieColor): AbilityHandler | undefined {
  return registry.get(color);
}
