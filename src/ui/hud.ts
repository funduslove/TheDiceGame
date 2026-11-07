import type { GameState } from '../core/types';

export function updateHUD(
  state: GameState,
  levelName: string,
  hint?: string,
): void {
  const turnCountEl = document.getElementById('turn-count');
  if (turnCountEl) {
    turnCountEl.textContent = String(state.turnCount);
  }

  const levelNameEl = document.getElementById('level-name');
  if (levelNameEl) {
    levelNameEl.textContent = levelName;
  }

  const hintEl = document.getElementById('hint');
  if (hintEl) {
    hintEl.textContent = hint ?? '';
  }

  const winOverlay = document.getElementById('win-overlay');
  if (winOverlay) {
    if (state.isComplete) {
      winOverlay.classList.add('show');
    } else {
      winOverlay.classList.remove('show');
    }
  }
}
