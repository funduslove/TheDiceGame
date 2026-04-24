import { TILE_WIDTH, TILE_HEIGHT, COLORS } from '../constants';
import { CellType } from '../core/types';

const HW = TILE_WIDTH / 2;  // 32
const HH = TILE_HEIGHT / 2; // 16
const WALL_HEIGHT = 20;

/** Draw a flat isometric diamond at the given screen center. */
function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, fill: string, stroke: string) {
  ctx.beginPath();
  ctx.moveTo(x, y - HH);       // top
  ctx.lineTo(x + HW, y);       // right
  ctx.lineTo(x, y + HH);       // bottom
  ctx.lineTo(x - HW, y);       // left
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawFloor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawDiamond(ctx, x, y, COLORS.floor, COLORS.floorStroke);
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Top face (raised)
  const topY = y - WALL_HEIGHT;
  ctx.beginPath();
  ctx.moveTo(x, topY - HH);
  ctx.lineTo(x + HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x - HW, topY);
  ctx.closePath();
  ctx.fillStyle = COLORS.wallTop;
  ctx.fill();
  ctx.strokeStyle = COLORS.floorStroke;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x - HW, y);
  ctx.closePath();
  ctx.fillStyle = COLORS.wallSide;
  ctx.fill();
  ctx.strokeStyle = COLORS.floorStroke;
  ctx.lineWidth = 1;
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
  ctx.strokeStyle = COLORS.floorStroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawTarget(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Glow effect
  ctx.save();
  ctx.shadowColor = COLORS.targetStroke;
  ctx.shadowBlur = 12;
  drawDiamond(ctx, x, y, COLORS.target, COLORS.targetStroke);
  ctx.restore();

  // Inner diamond accent
  const scale = 0.45;
  ctx.beginPath();
  ctx.moveTo(x, y - HH * scale);
  ctx.lineTo(x + HW * scale, y);
  ctx.lineTo(x, y + HH * scale);
  ctx.lineTo(x - HW * scale, y);
  ctx.closePath();
  ctx.strokeStyle = COLORS.targetStroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawPit(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Dark pit with slight inset appearance
  drawDiamond(ctx, x, y, COLORS.pit, '#1a1a3e');

  // Inner shadow for depth
  const scale = 0.7;
  ctx.beginPath();
  ctx.moveTo(x, y - HH * scale);
  ctx.lineTo(x + HW * scale, y);
  ctx.lineTo(x, y + HH * scale);
  ctx.lineTo(x - HW * scale, y);
  ctx.closePath();
  ctx.fillStyle = '#000008';
  ctx.fill();
}

function drawDestructible(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const topY = y - WALL_HEIGHT * 0.7;

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
  ctx.lineWidth = 1;
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x - HW, y);
  ctx.closePath();
  ctx.fillStyle = '#4a3a2a';
  ctx.fill();
  ctx.strokeStyle = COLORS.destructibleStroke;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + HW, topY);
  ctx.lineTo(x, topY + HH);
  ctx.lineTo(x, y + HH);
  ctx.lineTo(x + HW, y);
  ctx.closePath();
  ctx.fillStyle = '#3a2a1a';
  ctx.fill();
  ctx.strokeStyle = COLORS.destructibleStroke;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Crack marks on top face
  ctx.strokeStyle = '#2a1a0a';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(x - 6, topY - 2);
  ctx.lineTo(x + 2, topY + 4);
  ctx.lineTo(x - 1, topY + 8);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 8, topY - 4);
  ctx.lineTo(x + 3, topY + 1);
  ctx.stroke();
}

/** Draw the appropriate tile at screen position (x, y). */
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
      // Don't draw anything
      break;
  }
}
