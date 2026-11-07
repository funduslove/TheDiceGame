import { TILE_WIDTH, TILE_HEIGHT, COLORS } from '../constants';
import { CellType } from '../core/types';

const HW = TILE_WIDTH / 2;
const HH = TILE_HEIGHT / 2;
const WALL_HEIGHT = 40;

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fill: string,
  stroke: string,
  lineWidth = 1.5,
) {
  ctx.beginPath();
  ctx.moveTo(x, y - HH);
  ctx.lineTo(x + HW, y);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x - HW, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawFloor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawDiamond(ctx, x, y, COLORS.floor, COLORS.floorStroke);

  // Subtle inner highlight for stone texture
  ctx.beginPath();
  ctx.moveTo(x, y - HH + 4);
  ctx.lineTo(x + HW - 6, y);
  ctx.lineTo(x, y + HH - 4);
  ctx.lineTo(x - HW + 6, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.floorLight;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Grid lines
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.moveTo(x - HW * 0.5, y - HH * 0.5);
  ctx.lineTo(x + HW * 0.5, y + HH * 0.5);
  ctx.moveTo(x + HW * 0.5, y - HH * 0.5);
  ctx.lineTo(x - HW * 0.5, y + HH * 0.5);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const topY = y - WALL_HEIGHT;

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x - HW, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.wallSide;
  ctx.fill();
  ctx.strokeStyle = COLORS.wallStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x + HW, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.wall;
  ctx.fill();
  ctx.strokeStyle = COLORS.wallStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top face
  ctx.beginPath();
  ctx.moveTo(x, topY - HH);
  ctx.lineTo(x + HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x - HW, topY);
  ctx.closePath();
  ctx.fillStyle = COLORS.wallTop;
  ctx.fill();
  ctx.strokeStyle = COLORS.wallStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Brick lines on left face
  ctx.strokeStyle = COLORS.wallStroke;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.4;
  const brickH = WALL_HEIGHT / 3;
  for (let i = 1; i < 3; i++) {
    const by = topY + i * brickH;
    ctx.beginPath();
    ctx.moveTo(x - HW, by - brickH * 0.5);
    ctx.lineTo(x, by + HH - brickH * 0.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawTarget(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Glow
  ctx.save();
  ctx.shadowColor = COLORS.targetGlow;
  ctx.shadowBlur = 20;
  drawDiamond(ctx, x, y, COLORS.target, COLORS.targetStroke, 2);
  ctx.restore();

  // Lighter inner diamond
  const s = 0.6;
  ctx.beginPath();
  ctx.moveTo(x, y - HH * s);
  ctx.lineTo(x + HW * s, y);
  ctx.lineTo(x, y + HH * s);
  ctx.lineTo(x - HW * s, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.targetLight;
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Star/diamond marker in center
  const ms = 0.25;
  ctx.beginPath();
  ctx.moveTo(x, y - HH * ms);
  ctx.lineTo(x + HW * ms, y);
  ctx.lineTo(x, y + HH * ms);
  ctx.lineTo(x - HW * ms, y);
  ctx.closePath();
  ctx.strokeStyle = COLORS.targetStroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPit(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawDiamond(ctx, x, y, COLORS.pit, COLORS.pitStroke, 2);

  // Inner dark void
  const s = 0.65;
  ctx.beginPath();
  ctx.moveTo(x, y - HH * s);
  ctx.lineTo(x + HW * s, y);
  ctx.lineTo(x, y + HH * s);
  ctx.lineTo(x - HW * s, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.pitInner;
  ctx.fill();

  // Depth lines
  ctx.strokeStyle = '#3a2818';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  const ds = 0.45;
  ctx.beginPath();
  ctx.moveTo(x - HW * ds, y);
  ctx.lineTo(x - HW * ds * 0.8, y + 6);
  ctx.moveTo(x + HW * ds, y);
  ctx.lineTo(x + HW * ds * 0.8, y + 6);
  ctx.moveTo(x, y + HH * ds);
  ctx.lineTo(x, y + HH * ds + 6);
  ctx.moveTo(x, y - HH * ds);
  ctx.lineTo(x, y - HH * ds + 6);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawDestructible(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const h = WALL_HEIGHT * 0.65;
  const topY = y - h;

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x - HW, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.destructibleDark;
  ctx.fill();
  ctx.strokeStyle = COLORS.destructibleStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x + HW, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.destructibleSide;
  ctx.fill();
  ctx.strokeStyle = COLORS.destructibleStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top face
  ctx.beginPath();
  ctx.moveTo(x, topY - HH);
  ctx.lineTo(x + HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x - HW, topY);
  ctx.closePath();
  ctx.fillStyle = COLORS.destructible;
  ctx.fill();
  ctx.strokeStyle = COLORS.destructibleStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cracks on top
  ctx.strokeStyle = COLORS.destructibleStroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 14, topY - 4);
  ctx.lineTo(x + 4, topY + 8);
  ctx.lineTo(x - 2, topY + 16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 16, topY - 6);
  ctx.lineTo(x + 6, topY + 2);
  ctx.stroke();

  // Crack on left face
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(x - HW * 0.6, topY + h * 0.3);
  ctx.lineTo(x - HW * 0.3, topY + h * 0.5);
  ctx.lineTo(x - HW * 0.5, topY + h * 0.7);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawTile(ctx: CanvasRenderingContext2D, cellType: CellType, x: number, y: number) {
  switch (cellType) {
    case CellType.Floor:
      drawFloor(ctx, x, y);
      break;
    case CellType.Wall:
      drawWall(ctx, x, y);
      break;
    case CellType.Target:
      drawTarget(ctx, x, y);
      break;
    case CellType.Pit:
      drawPit(ctx, x, y);
      break;
    case CellType.Destructible:
      drawDestructible(ctx, x, y);
      break;
    case CellType.Void:
      break;
  }
}
