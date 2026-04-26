import { TILE_WIDTH, TILE_HEIGHT, COLORS } from '../constants';
import { DieColor } from '../core/types';
import type { Die } from '../core/types';

const HW = TILE_WIDTH / 2;
const HH = TILE_HEIGHT / 2;
const DIE_SCALE = 0.6;
const DHW = HW * DIE_SCALE;
const DHH = HH * DIE_SCALE;
const DIE_HEIGHT = 44;
const DIE_Y_OFFSET = -TILE_HEIGHT * 0.6;

interface DieColors {
  top: string;
  left: string;
  right: string;
  highlight: string;
}

function getDieColors(color: DieColor): DieColors {
  switch (color) {
    case DieColor.White:
      return { top: COLORS.dieWhite, left: COLORS.dieWhiteSide, right: COLORS.dieWhiteDark, highlight: '#ffffff' };
    case DieColor.Red:
      return { top: COLORS.dieRed, left: COLORS.dieRedSide, right: COLORS.dieRedDark, highlight: '#ff8888' };
    case DieColor.Blue:
      return { top: COLORS.dieBlue, left: COLORS.dieBlueSide, right: COLORS.dieBlueDark, highlight: '#88bbff' };
  }
}

function getPipColor(dieColor: DieColor): string {
  return dieColor === DieColor.White ? COLORS.pip : COLORS.pipWhite;
}

function drawPips(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  value: number,
  dieColor: DieColor,
) {
  const pipColor = getPipColor(dieColor);
  const pipR = 4.5;
  const spread = 0.38;
  const positions: Array<{ u: number; v: number }> = [];

  switch (value) {
    case 1:
      positions.push({ u: 0, v: 0 });
      break;
    case 2:
      positions.push({ u: -spread, v: -spread });
      positions.push({ u: spread, v: spread });
      break;
    case 3:
      positions.push({ u: -spread, v: -spread });
      positions.push({ u: 0, v: 0 });
      positions.push({ u: spread, v: spread });
      break;
    case 4:
      positions.push({ u: -spread, v: -spread });
      positions.push({ u: spread, v: -spread });
      positions.push({ u: -spread, v: spread });
      positions.push({ u: spread, v: spread });
      break;
    case 5:
      positions.push({ u: -spread, v: -spread });
      positions.push({ u: spread, v: -spread });
      positions.push({ u: 0, v: 0 });
      positions.push({ u: -spread, v: spread });
      positions.push({ u: spread, v: spread });
      break;
    case 6:
      positions.push({ u: -spread, v: -spread });
      positions.push({ u: -spread, v: 0 });
      positions.push({ u: -spread, v: spread });
      positions.push({ u: spread, v: -spread });
      positions.push({ u: spread, v: 0 });
      positions.push({ u: spread, v: spread });
      break;
  }

  ctx.fillStyle = pipColor;
  for (const p of positions) {
    const px = cx + (p.u - p.v) * DHW;
    const py = cy + (p.u + p.v) * DHH;
    ctx.beginPath();
    ctx.arc(px, py, pipR, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNumberOnTop(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  value: number,
  dieColor: DieColor,
) {
  const textColor = getPipColor(dieColor);
  ctx.save();
  ctx.font = 'bold 22px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Shadow for depth
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillText(`${value}`, cx + 1, cy + 2);
  // Main number
  ctx.fillStyle = textColor;
  ctx.fillText(`${value}`, cx, cy);
  ctx.restore();
}

export function drawDie(ctx: CanvasRenderingContext2D, die: Die, x: number, y: number) {
  const colors = getDieColors(die.color);
  const dy = y + DIE_Y_OFFSET;
  const topY = dy - DIE_HEIGHT;

  // Left face
  ctx.beginPath();
  ctx.moveTo(x - DHW, topY);
  ctx.lineTo(x, topY + DHH);
  ctx.lineTo(x, dy + DHH);
  ctx.lineTo(x - DHW, dy);
  ctx.closePath();
  ctx.fillStyle = colors.left;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Right face
  ctx.beginPath();
  ctx.moveTo(x + DHW, topY);
  ctx.lineTo(x, topY + DHH);
  ctx.lineTo(x, dy + DHH);
  ctx.lineTo(x + DHW, dy);
  ctx.closePath();
  ctx.fillStyle = colors.right;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top face
  ctx.beginPath();
  ctx.moveTo(x, topY - DHH);
  ctx.lineTo(x + DHW, topY);
  ctx.lineTo(x, topY + DHH);
  ctx.lineTo(x - DHW, topY);
  ctx.closePath();
  ctx.fillStyle = colors.top;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Highlight on top face (subtle shine)
  ctx.beginPath();
  ctx.moveTo(x, topY - DHH);
  ctx.lineTo(x + DHW * 0.4, topY - DHH * 0.3);
  ctx.lineTo(x, topY);
  ctx.lineTo(x - DHW * 0.4, topY - DHH * 0.3);
  ctx.closePath();
  ctx.fillStyle = colors.highlight;
  ctx.globalAlpha = 0.15;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Draw pips AND number on top face
  const topValue = die.orientation.top;
  if (topValue >= 1 && topValue <= 6) {
    drawPips(ctx, x, topY, topValue, die.color);
    drawNumberOnTop(ctx, x, topY, topValue, die.color);
  }

  // Pips on left face (west face value)
  drawSidePips(ctx, x, dy, topY, 'left', die.orientation.west, die.color);
  // Pips on right face (east face value)
  drawSidePips(ctx, x, dy, topY, 'right', die.orientation.east, die.color);

  // Red die bomb timer overlay
  if (die.color === DieColor.Red && die.bombTimer !== undefined) {
    ctx.save();
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const timerY = topY - DHH - 12;
    // Glow
    ctx.shadowColor = COLORS.explosion;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(`${die.bombTimer}`, x, timerY);
    ctx.fillStyle = COLORS.explosion;
    ctx.fillText(`${die.bombTimer}`, x, timerY);
    ctx.restore();
  }
}

function drawSidePips(
  ctx: CanvasRenderingContext2D,
  x: number,
  bottomY: number,
  topY: number,
  side: 'left' | 'right',
  value: number,
  dieColor: DieColor,
) {
  if (value < 1 || value > 6) return;
  const pipColor = getPipColor(dieColor);
  const pipR = 3;
  const midY = (topY + bottomY) / 2 + DHH / 2;

  // Center of the side face
  const cx = side === 'left' ? x - DHW / 2 : x + DHW / 2;
  const cy = midY;

  ctx.fillStyle = pipColor;
  ctx.globalAlpha = 0.6;

  // Simplified: just show 1-3 dots vertically
  const count = Math.min(value, 3);
  const spacing = 8;
  const startY = cy - ((count - 1) * spacing) / 2;

  for (let i = 0; i < count; i++) {
    ctx.beginPath();
    ctx.arc(cx, startY + i * spacing, pipR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawEntityShadow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y + 4, DHW * 0.9, DHH * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
