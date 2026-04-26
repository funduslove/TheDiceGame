import { TILE_HEIGHT, COLORS } from '../constants';
import type { GameState } from '../core/types';
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
  readonly sortKey: number;
  draw(ctx: CanvasRenderingContext2D): void;
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  camera?: Camera,
  animations?: AnimationManager,
) {
  const canvas = ctx.canvas;

  // Warm background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  const rows = state.grid.length;
  const cols = rows > 0 ? (state.grid[0]?.length ?? 0) : 0;
  const centerRow = (rows - 1) / 2;
  const centerCol = (cols - 1) / 2;
  const gridCenter = gridToScreen({ row: centerRow, col: centerCol });

  const camX = camera?.offsetX ?? 0;
  const camY = camera?.offsetY ?? 0;
  ctx.translate(
    canvas.width / 2 - gridCenter.x + camX,
    canvas.height / 2 - gridCenter.y + camY - 20,
  );

  // Draw tiles back-to-front
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

  // Entities sorted by depth
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
  entities.push({
    sortKey: playerPos.row + playerPos.col,
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
    entities.push({
      sortKey: die.pos.row + die.pos.col,
      draw: (c) => {
        drawEntityShadow(c, dieScreen.x, dieScreen.y);
        drawDie(c, die, dieScreen.x, dieScreen.y);
      },
    });
  }

  entities.sort((a, b) => a.sortKey - b.sortKey);
  for (const entity of entities) {
    entity.draw(ctx);
  }

  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const baseY = y - TILE_HEIGHT * 0.5;

  // Shadow on ground
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body (rounded rectangle shape)
  const bodyW = 14;
  const bodyH = 22;
  const bodyY = baseY - bodyH;

  // Legs
  ctx.fillStyle = COLORS.playerDark;
  ctx.fillRect(x - 6, baseY - 6, 4, 8);
  ctx.fillRect(x + 2, baseY - 6, 4, 8);

  // Body
  ctx.beginPath();
  roundedRect(ctx, x - bodyW / 2, bodyY, bodyW, bodyH, 4);
  ctx.fillStyle = COLORS.player;
  ctx.fill();
  ctx.strokeStyle = COLORS.playerStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Body highlight
  ctx.beginPath();
  roundedRect(ctx, x - bodyW / 2 + 2, bodyY + 2, bodyW / 2 - 2, bodyH - 8, 2);
  ctx.fillStyle = COLORS.playerLight;
  ctx.globalAlpha = 0.25;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Head
  const headR = 10;
  const headY = bodyY - headR + 2;
  ctx.beginPath();
  ctx.arc(x, headY, headR, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.playerSkin;
  ctx.fill();
  ctx.strokeStyle = COLORS.playerStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Hair
  ctx.beginPath();
  ctx.arc(x, headY - 2, headR, Math.PI * 1.1, Math.PI * 1.9);
  ctx.fillStyle = COLORS.playerHair;
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x - 3.5, headY, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 3.5, headY, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#885544';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, headY + 2, 3, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // Arms
  ctx.strokeStyle = COLORS.playerDark;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  // Left arm
  ctx.beginPath();
  ctx.moveTo(x - bodyW / 2, bodyY + 6);
  ctx.lineTo(x - bodyW / 2 - 6, bodyY + 16);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(x + bodyW / 2, bodyY + 6);
  ctx.lineTo(x + bodyW / 2 + 6, bodyY + 16);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
