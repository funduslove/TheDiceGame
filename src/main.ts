import { Direction, type GameState } from './core/types';
import { GameStateManager } from './core/gameState';
import { processTurn } from './core/turnEngine';
import { render } from './rendering/renderer';
import { setupInput } from './input/inputHandler';
import { LEVELS } from './levels/levelIndex';
import { loadLevel } from './levels/levelLoader';
import { updateHUD } from './ui/hud';

function main() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element #game-canvas not found');
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2d context');
    return;
  }

  let currentLevelIndex = 0;
  let currentState: GameState;
  let stateManager: GameStateManager;

  function loadAndStartLevel(index: number) {
    const levelData = LEVELS[index];
    if (!levelData) {
      console.log('All levels complete!');
      return;
    }
    currentLevelIndex = index;
    currentState = loadLevel(levelData);
    stateManager = new GameStateManager(currentState);
    updateHUD(currentState, levelData.name, levelData.hint);
    render(ctx!, currentState);
  }

  loadAndStartLevel(0);

  setupInput({
    onMove: (direction: Direction) => {
      if (currentState.isComplete) return;
      const result = processTurn(currentState, direction);
      if (result.moved) {
        currentState = result.state;
        stateManager.push(currentState);
        render(ctx!, currentState);
        const levelData = LEVELS[currentLevelIndex]!;
        updateHUD(currentState, levelData.name, levelData.hint);
      }
    },
    onAction: (action) => {
      const levelData = LEVELS[currentLevelIndex]!;
      switch (action) {
        case 'undo': {
          const prev = stateManager.undo();
          if (prev) {
            currentState = prev;
            render(ctx!, currentState);
            updateHUD(currentState, levelData.name, levelData.hint);
          }
          break;
        }
        case 'redo': {
          const next = stateManager.redo();
          if (next) {
            currentState = next;
            render(ctx!, currentState);
            updateHUD(currentState, levelData.name, levelData.hint);
          }
          break;
        }
        case 'reset': {
          currentState = stateManager.reset();
          render(ctx!, currentState);
          updateHUD(currentState, levelData.name, levelData.hint);
          break;
        }
        case 'nextLevel': {
          if (currentState.isComplete) {
            loadAndStartLevel(currentLevelIndex + 1);
          }
          break;
        }
      }
    },
  });
}

main();
