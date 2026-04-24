import { TILE_WIDTH, TILE_HEIGHT, COLORS } from '../constants';
import type { GameState, Die } from '../core/types';
import { CellType } from '../core/types';
import { gridToScreen } from './isoMath';
import type { ScreenPos } from './isoMath';
import { drawTile } from './tileSprites';
import { drawDie, drawEntityShadow } from './dieSprites';
import type { AnimationManager } from './animations';

export interface Camera {
  readonly offsetX: number;
  readonly offsetY: number;
}

interface DrawableEntity {
  readonly sortKey: number; // row + col for depth sorting
  draw(ctx: CanvasRenderingContext2D): void;
}

/** Main render function: draws the full game scene. */
export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  camera?: Camera,
  animations?: AnimationManager,
) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  // Translate so the grid is centered on the canvas
  const rows = state.grid.length;
  const cols = rows > 0 ? (state.grid[0]?.length ?? 0) : 0;
  const centerRow = (rows - 1) / 2;
  const centerCol = (cols - 1) / 2;
  const gridCenter = gridToScreen({ row: centerRow, col: centerCol });

  const camX = camera?.offsetX ?? 0;
  const camY = camera?.offsetY ?? 0;
  ctx.translate(
    canvas.width / 2 - gridCenter.x + camX,
    canvas.height / 2 - gridCenter.y + camY,
  );

  // --- Draw tiles in depth order (row + col ascending) ---
  const tileOrder: Array<{ row: number; col: number; sortKey: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tileOrder.push({ row: r, col: c, sortKey: r + c });
    }
  }
  tileOrder.sort((a, b) => a.sortKey - b.sortKey);

  for (const t of tileOrder) {
    const row = state.grid[t.row];
    const cell = row?.[t.col];
    if (!cell || cell.type === CellType.Void) continue;
    const screen = gridToScreen({ row: t.row, col: t.col });
    drawTile(ctx, cell.type, screen.x, screen.y);
  }

  // --- Collect entities and sort by depth ---
  const entities: DrawableEntity[] = [];

  // Player
  const playerPos = state.player.pos;
  let playerScreen: ScreenPos;
  if (animations) {
    const animPos = animations.getAnimatedPos('player');
    playerScreen = animPos ?? gridToScreen(playerPos);
  } else {
    playerScreen = gridToScreen(playerPos);
  }
  const playerSortKey = playerPos.row + playerPos.col;
  entities.push({
    sortKey: playerSortKey,
    draw: (c) => drawPlayer(c, playerScreen.x, playerScreen.y),
  });

  // Dice
  for (const die of state.dice) {
    let dieScreen: ScreenPos;
    if (animations) {
      const animPos = animations.getAnimatedPos(die.id);
      dieScreen = animPos ?? gridToScreen(die.pos);
    } else {
      dieScreen = gridToScreen(die.pos);
    }
    const dieSortKey = die.pos.row + die.pos.col;
    entities.push({
      sortKey: dieSortKey,
      draw: (c) => {
        drawEntityShadow(c, dieScreen.x, dieScreen.y);
        drawDie(c, die, dieScreen.x, dieScreen.y);
      },
    });
  }

  // Sort entities back-to-front
  entities.sort((a, b) => a.sortKey - b.sortKey);

  for (const entity of entities) {
    entity.draw(ctx);
  }

  ctx.restore();
}

/** Draw the player as a colored diamond/circle shape. */
function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const radius = 10;
  const yOffset = -TILE_HEIGHT; // raise player above tile like dice

  // Shadow
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y + 2, radius * 1.2, radius * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body - diamond shape
  const dy = y + yOffset;
  const hw = 10;
  const hh = 14;

  ctx.beginPath();
  ctx.moveTo(x, dy - hh);
  ctx.lineTo(x + hw, dy);
  ctx.lineTo(x, dy + hh);
  ctx.lineTo(x - hw, dy);
  ctx.closePath();
  ctx.fillStyle = COLORS.player;
  ctx.fill();
  ctx.strokeStyle = COLORS.playerStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Highlight on upper portion
  ctx.beginPath();
  ctx.moveTo(x, dy - hh);
  ctx.lineTo(x + hw * 0.5, dy - hh * 0.3);
  ctx.lineTo(x, dy);
  ctx.lineTo(x - hw * 0.5, dy - hh * 0.3);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fill();
}
