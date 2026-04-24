import { TILE_WIDTH, TILE_HEIGHT, COLORS } from '../constants';
import { DieColor } from '../core/types';
import type { Die } from '../core/types';

const HW = TILE_WIDTH / 2;  // 32
const HH = TILE_HEIGHT / 2; // 16
const DIE_SCALE = 0.55;
const DHW = HW * DIE_SCALE;   // die half-width
const DHH = HH * DIE_SCALE;   // die half-height
const DIE_HEIGHT = 22;        // 3D extrusion height
const DIE_Y_OFFSET = -TILE_HEIGHT; // raise die above tile

interface DieColors {
  top: string;
  left: string;
  right: string;
}

function getDieColors(color: DieColor): DieColors {
  switch (color) {
    case DieColor.White:
      return { top: COLORS.dieWhite, left: COLORS.dieWhiteSide, right: COLORS.dieWhiteDark };
    case DieColor.Red:
      return { top: COLORS.dieRed, left: COLORS.dieRedSide, right: COLORS.dieRedDark };
    case DieColor.Blue:
      return { top: COLORS.dieBlue, left: COLORS.dieBlueSide, right: COLORS.dieBlueDark };
  }
}

function getPipColor(dieColor: DieColor): string {
  return dieColor === DieColor.White ? COLORS.pip : COLORS.pipWhite;
}

/**
 * Draw pips on the top (diamond) face of the die.
 * The top face is a diamond centered at (cx, cy) with half-widths DHW, DHH.
 * We place pips within this diamond using isometric-aware positions.
 */
function drawPips(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  value: number,
  dieColor: DieColor,
) {
  const pipColor = getPipColor(dieColor);
  const pipR = 2.5;

  // Define pip positions on the isometric top face
  // Use a coordinate system where (0,0) is center, mapped to iso
  // "u" goes along top-right edge, "v" goes along top-left edge
  const spread = 0.45;
  const positions: Array<{ u: number; v: number }> = [];

  // Standard die pip layouts
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
    // Convert u,v to isometric screen offset
    const px = cx + (p.u - p.v) * DHW;
    const py = cy + (p.u + p.v) * DHH;
    ctx.beginPath();
    ctx.arc(px, py, pipR, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draw a 3D isometric die at screen position (x, y).
 * x, y is the tile center; the die is raised above it.
 */
export function drawDie(ctx: CanvasRenderingContext2D, die: Die, x: number, y: number) {
  const colors = getDieColors(die.color);
  const dy = y + DIE_Y_OFFSET;
  const topY = dy - DIE_HEIGHT;

  // Left face (parallelogram)
  ctx.beginPath();
  ctx.moveTo(x - DHW, topY);
  ctx.lineTo(x, topY + DHH);
  ctx.lineTo(x, dy + DHH);
  ctx.lineTo(x - DHW, dy);
  ctx.closePath();
  ctx.fillStyle = colors.left;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 0.75;
  ctx.stroke();

  // Right face (parallelogram)
  ctx.beginPath();
  ctx.moveTo(x + DHW, topY);
  ctx.lineTo(x, topY + DHH);
  ctx.lineTo(x, dy + DHH);
  ctx.lineTo(x + DHW, dy);
  ctx.closePath();
  ctx.fillStyle = colors.right;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 0.75;
  ctx.stroke();

  // Top face (diamond)
  ctx.beginPath();
  ctx.moveTo(x, topY - DHH);
  ctx.lineTo(x + DHW, topY);
  ctx.lineTo(x, topY + DHH);
  ctx.lineTo(x - DHW, topY);
  ctx.closePath();
  ctx.fillStyle = colors.top;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 0.75;
  ctx.stroke();

  // Draw pips on the top face
  const topValue = die.orientation.top;
  if (topValue >= 1 && topValue <= 6) {
    drawPips(ctx, x, topY, topValue, die.color);
  }

  // For red dice, show bomb timer overlay
  if (die.color === DieColor.Red && die.bombTimer !== undefined) {
    ctx.save();
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Dark outline for readability
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.strokeText(`${die.bombTimer}`, x, topY - DHH - 6);
    ctx.fillStyle = COLORS.explosion;
    ctx.fillText(`${die.bombTimer}`, x, topY - DHH - 6);
    ctx.restore();
  }
}

/** Draw a shadow under an entity at screen position (x, y). */
export function drawEntityShadow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, y + 2, DHW * 0.8, DHH * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
