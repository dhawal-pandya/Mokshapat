import type { SvgData, LadderPathData, SnakePathData, SvgPoint } from '../types';
import { ladders } from '../data/ladders';
import { snakes, SNAKE_WAYPOINTS } from '../data/snakes';

const LADDER_COLORS = [
  '#2d6b30','#135c9a','#611a73','#197068','#a85c00',
  '#3e4882','#5f4a43','#516169','#536b2d','#9c1443',
  '#2d6b30','#553b83','#ac4c2e','#197068','#5f4a43',
  '#536b2d','#135c9a','#553b83','#2d6b30','#135c9a',
];

const SNAKE_COLORS = [
  '#518f54','#da4d4d','#4479c6','#61a866','#e35e5e',
  '#4b91de','#518f54','#da4d4d','#4479c6','#61a866',
  '#e35e5e','#4b91de','#518f54','#da4d4d','#4479c6',
  '#61a866','#e35e5e','#4b91de','#518f54','#da4d4d',
];

const OFFBOARD_IDS: Record<string, string> = {
  'शून्य लोक':        'cell-shunya',
  'बेहस्त लोक':       'cell-behast',
  'आत्मपरिभाण लोक':  'cell-atma',
  'महानरक':           'cell-mahanaarak-center',
  'महानरक-लेफ्ट':     'cell-mahanaarak-left',
  'महानरक-राइट':      'cell-mahanaarak-right',
  'मृत्यू उर्फ कबर':  'cell-mrutyu',
  'मरण':              'cell-maran',
};

function resolveEl(board: HTMLElement, key: number | string): HTMLElement | null {
  if (typeof key === 'string') {
    const id = OFFBOARD_IDS[key];
    return id ? (board.closest('#board-container') as HTMLElement | null)?.querySelector(`#${id}`) ?? null : null;
  }
  return board.querySelector(`[data-cell="${key}"]`);
}

function cellCenter(
  board: HTMLElement,
  key: number | string,
  boardRect: DOMRect,
  scale: number,
): SvgPoint | null {
  const el = resolveEl(board, key);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    x: (r.left - boardRect.left) / scale + r.width  / scale / 2,
    y: (r.top  - boardRect.top)  / scale + r.height / scale / 2,
  };
}

function edgePoint(
  board: HTMLElement,
  from: number | string,
  toward: number | string,
  boardRect: DOMRect,
  scale: number,
  inset = 0.6,
): SvgPoint | null {
  const c1 = cellCenter(board, from, boardRect, scale);
  const c2 = cellCenter(board, toward, boardRect, scale);
  if (!c1 || !c2) return null;
  const dx = c2.x - c1.x, dy = c2.y - c1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return c1;
  const el = resolveEl(board, from);
  if (!el) return c1;
  const r  = el.getBoundingClientRect();
  const hw = r.width  / scale / 2;
  const hh = r.height / scale / 2;
  const t  = Math.abs(dx) / hw > Math.abs(dy) / hh ? hw / Math.abs(dx) : hh / Math.abs(dy);
  const ti = t * inset;
  return { x: c1.x + dx * ti, y: c1.y + dy * ti };
}

function snakePath(head: SvgPoint, tail: SvgPoint, waypoint?: SvgPoint): string {
  function segmentPath(a: SvgPoint, b: SvgPoint, phaseFlip = false): string {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return '';
    const px = -dy / len, py = dx / len;
    const segs = Math.max(3, Math.round(len / 40));
    const amp  = Math.min(10.5, len * 0.042);
    let d = '';
    for (let i = 1; i <= segs; i++) {
      const t1   = i / segs, tMid = (i - 0.5) / segs;
      const ex   = a.x + dx * t1, ey = a.y + dy * t1;
      const sign = (i % 2 === (phaseFlip ? 0 : 1)) ? 1 : -1;
      const cx1  = a.x + dx * tMid + px * amp * sign;
      const cy1  = a.y + dy * tMid + py * amp * sign;
      d += ` Q ${cx1} ${cy1} ${ex} ${ey}`;
    }
    return d;
  }

  if (waypoint) {
    return `M ${head.x} ${head.y}` + segmentPath(head, waypoint) + segmentPath(waypoint, tail, true);
  }
  return `M ${head.x} ${head.y}` + segmentPath(head, tail);
}

export function computeSvgPaths(
  boardEl: HTMLElement,
  containerEl: HTMLElement,
  scrollWrapEl?: HTMLElement | null,
): SvgData {
  const rawBoardRect = boardEl.getBoundingClientRect();
  const cs = window.getComputedStyle(boardEl);
  const borderLeft   = parseFloat(cs.borderLeftWidth)   || 0;
  const borderTop    = parseFloat(cs.borderTopWidth)    || 0;
  const borderRight  = parseFloat(cs.borderRightWidth)  || 0;
  const borderBottom = parseFloat(cs.borderBottomWidth) || 0;

  // The SVG sits at position:absolute top:0 left:0, which lands at the board's
  // PADDING edge (border-width inside the border-box). Shift the reference so
  // SVG x=0 / y=0 maps to the correct viewport origin.
  const boardRect = {
    left:   rawBoardRect.left + borderLeft,
    top:    rawBoardRect.top  + borderTop,
    right:  rawBoardRect.right,
    bottom: rawBoardRect.bottom,
    width:  rawBoardRect.width,
    height: rawBoardRect.height,
  } as DOMRect;

  // Use the board's PADDING BOX dimensions for the SVG coordinate space.
  // This avoids the circular scrollWidth inflation that happens when the SVG's
  // width attribute feeds back into boardEl.scrollWidth, causing a ~0.79× scale.
  const svgWidth  = boardEl.offsetWidth  - borderLeft - borderRight;
  const svgHeight = boardEl.offsetHeight - borderTop  - borderBottom;

  // The CSS scale() transform is applied to scrollWrapEl, not containerEl.
  // Read it from scrollWrapEl so getBoundingClientRect values (viewport-relative)
  // are correctly divided back to CSS-pixel SVG coordinates.
  const scaleEl = scrollWrapEl ?? containerEl;
  const transform = window.getComputedStyle(scaleEl).transform;
  let scale = 1;
  if (transform && transform !== 'none') {
    const m = new DOMMatrix(transform);
    scale = m.a || 1;
  }

  const ladderPaths: LadderPathData[] = [];
  let li = 0;
  Object.entries(ladders).forEach(([s, e]) => {
    const sNum = Number(s);
    const start = edgePoint(boardEl, sNum, e, boardRect, scale);
    const end   = edgePoint(boardEl, e,    sNum, boardRect, scale);
    if (!start || !end) return;

    const color = LADDER_COLORS[li % LADDER_COLORS.length]!;
    li++;
    const dx = end.x - start.x, dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const px = -dy / len * 2, py = dx / len * 2;
    const rungCount = Math.max(2, Math.round(len / 30));
    const rungs: LadderPathData['rungs'] = [];
    for (let i = 1; i < rungCount; i++) {
      const t = i / rungCount;
      const mx = start.x + dx * t, my = start.y + dy * t;
      rungs.push({ x1: mx + px, y1: my + py, x2: mx - px, y2: my - py });
    }
    ladderPaths.push({
      key: `l-${s}`,
      color,
      rail1: { x1: start.x + px, y1: start.y + py, x2: end.x + px, y2: end.y + py },
      rail2: { x1: start.x - px, y1: start.y - py, x2: end.x - px, y2: end.y - py },
      rungs,
    });
  });

  const snakePaths: SnakePathData[] = [];
  const markerDefs: SvgData['markerDefs'] = [];
  const seenColors = new Set<string>();
  let si = 0;

  Object.entries(snakes).forEach(([h, t]) => {
    const hKey = isNaN(Number(h)) ? h : Number(h);
    const head = edgePoint(boardEl, hKey, t as number | string, boardRect, scale);
    const tail = edgePoint(boardEl, t as number | string, hKey, boardRect, scale);
    if (!head || !tail) return;

    let color: string;
    const redHeads = [129, 106, 72, 60, 37, 23, 11, 44];
    if (redHeads.includes(hKey as number))        color = '#b71c1c';
    else if (typeof t === 'string' && t.includes('महानरक')) color = '#1b5e20';
    else if (t === 1)                              color = '#0d47a1';
    else                                           color = SNAKE_COLORS[si % SNAKE_COLORS.length]!;
    si++;

    const wpKey = typeof hKey === 'number' ? SNAKE_WAYPOINTS[hKey] : undefined;
    let waypoint: SvgPoint | undefined;
    if (wpKey) {
      const c1 = cellCenter(boardEl, wpKey[0], boardRect, scale);
      const c2 = cellCenter(boardEl, wpKey[1], boardRect, scale);
      if (c1 && c2) waypoint = { x: (c1.x + c2.x) / 2, y: (c1.y + c2.y) / 2 };
    }

    const d = snakePath(head, tail, waypoint);
    const headId = `snkhead-${color.replace('#', '')}`;
    const tailId = `snktail-${color.replace('#', '')}`;
    if (!seenColors.has(color)) {
      seenColors.add(color);
      markerDefs.push({ id: headId, type: 'head', color });
      markerDefs.push({ id: tailId, type: 'tail', color });
    }
    snakePaths.push({ key: `s-${h}`, d, color, headMarkerId: headId, tailMarkerId: tailId });
  });

  return {
    ladders: ladderPaths,
    snakes:  snakePaths,
    markerDefs,
    width:  svgWidth,
    height: svgHeight,
  };
}
