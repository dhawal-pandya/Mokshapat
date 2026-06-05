import type { GridPos, OvalPos, CellType } from '../types';
import { ladderStarts, ladderEnds } from '../data/ladders';
import { snakeHeads, snakeTails } from '../data/snakes';

export const COLS       = 12;
export const ROWS       = 24;
export const CELL_W     = 88;
export const CELL_H     = 58;
export const CELL_GAP   = 2;
export const BOARD_PAD  = 4;
export const FIRST_ROW  = 5;  // cells 1-5 in the bottom row

const SPECIAL_STARS = new Set([237, 243, 247]);

export function getCellGridPosition(num: number): GridPos {
  // Custom centred layout for cells 249-285 (above the oval ring)
  if (num >= 249 && num <= 285) {
    const customRows = [
      { start: 283, end: 285, gridRow: 1,  count: 3  },
      { start: 282, end: 282, gridRow: 2,  count: 1  },
      { start: 272, end: 281, gridRow: 3,  count: 10 },
      { start: 267, end: 271, gridRow: 4,  count: 5  },
      { start: 261, end: 266, gridRow: 5,  count: 6  },
      { start: 249, end: 260, gridRow: 6,  count: 12 },
    ] as const;
    for (const r of customRows) {
      if (num >= r.start && num <= r.end) {
        const posInRow  = num - r.start;
        const startCol  = Math.floor((COLS - r.count) / 2) + 1;
        return { gridRow: r.gridRow, gridCol: startCol + (r.count - 1 - posInRow) };
      }
    }
  }

  let row: number, col: number;
  if (num <= FIRST_ROW) {
    row = 1;
    const posInRow = num - 1;
    col = 4 - posInRow;
  } else {
    const adj = num - FIRST_ROW;
    row = 1 + Math.ceil(adj / COLS);
    const posInRow = (adj - 1) % COLS;
    const isReversed = row % 2 !== 0;
    col = isReversed ? COLS - 1 - posInRow : posInRow;
  }

  const displayRow = ROWS - row;
  let gridRow = displayRow + 1;
  if (gridRow >= 5) gridRow += 10;
  return { gridRow, gridCol: col + 1 };
}

export function getCellType(num: number): CellType {
  if (num === 1)   return 'start';
  if (num === 236) return 'moksha';
  if (num >= 283 && num <= 285) return 'final';
  if (SPECIAL_STARS.has(num))   return 'special-star';

  const isLadderEnd   = ladderEnds.has(num);
  const isSnakeHead   = snakeHeads.has(num);
  const isLadderStart = ladderStarts.has(num);
  const isSnakeTail   = snakeTails.has(num);

  if (isLadderEnd && isSnakeHead) return 'dual';
  if (isLadderStart)  return 'ladder-start';
  if (isSnakeHead)    return 'snake-head';
  if (isLadderEnd)    return 'ladder-end';
  if (isSnakeTail)    return 'snake-tail';
  return 'normal';
}

// Precomputed oval positions for cells 234-248
export const OVAL_POSITIONS: OvalPos[] = (() => {
  const totalOval = 15;
  const ovalBW = COLS * CELL_W + (COLS - 1) * CELL_GAP;    // 1078
  const ovalCX = BOARD_PAD + ovalBW / 2;                    // 543
  const ovalCY = 603;
  const ovalA  = ovalBW * 0.42;
  const ovalB  = 160;

  const NSAMP = 2000;
  const arcLens = [0];
  for (let i = 1; i <= NSAMP; i++) {
    const t0  = (i - 1) / NSAMP * 2 * Math.PI;
    const t1  = i       / NSAMP * 2 * Math.PI;
    const tm  = (t0 + t1) / 2;
    const dx  = -ovalA * Math.sin(tm) * (t1 - t0);
    const dy  =  ovalB * Math.cos(tm) * (t1 - t0);
    arcLens.push(arcLens[arcLens.length - 1]! + Math.sqrt(dx * dx + dy * dy));
  }
  const totalArc   = arcLens[NSAMP]!;
  const startOffset = -Math.PI / 6;

  const positions: OvalPos[] = [];
  for (let j = 0; j < totalOval; j++) {
    const targetArc = j * totalArc / totalOval;
    let k = 0;
    while (k < NSAMP && arcLens[k + 1]! < targetArc) k++;
    const frac  = (k < NSAMP) ? (targetArc - arcLens[k]!) / (arcLens[k + 1]! - arcLens[k]! || 1) : 0;
    const angle = startOffset - (k + frac) / NSAMP * 2 * Math.PI;
    const px    = ovalCX + ovalA * Math.cos(angle);
    const py    = ovalCY - ovalB * Math.sin(angle);
    positions.push({ left: px - CELL_W / 2, top: py - CELL_H / 2 });
  }
  return positions;
})();

// Board total rendered height (35 rows × (58px + 2px gap) + 2×4px padding)
export const BOARD_HEIGHT = 35 * (CELL_H + CELL_GAP) - CELL_GAP + BOARD_PAD * 2;
export const BOARD_WIDTH  = COLS * (CELL_W + CELL_GAP) - CELL_GAP + BOARD_PAD * 2;
