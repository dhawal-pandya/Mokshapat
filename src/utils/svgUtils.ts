import type {
  SvgData, LadderPathData, SvgPoint, SnakeBody, SnakeSkin, SnakeHeadGlyph,
} from '../types';
import { ladders } from '../data/ladders';
import { snakes } from '../data/snakes';

const LADDER_COLORS = [
  '#2d6b30','#135c9a','#611a73','#197068','#a85c00',
  '#3e4882','#5f4a43','#516169','#536b2d','#9c1443',
  '#2d6b30','#553b83','#ac4c2e','#197068','#5f4a43',
  '#536b2d','#135c9a','#553b83','#2d6b30','#135c9a',
];

// Naturalistic snake skins (spine / body / sunlit top / belly sheen).
const SNAKE_SKINS: SnakeSkin[] = [
  { id: 'olive',   dark: '#2f3d18', base: '#56692c', light: '#8a9d4e', belly: '#cdd89a' },
  { id: 'umber',   dark: '#3a2415', base: '#6b452a', light: '#9c6f48', belly: '#d8b894' },
  { id: 'slate',   dark: '#283139', base: '#465661', light: '#74858f', belly: '#b6c4cc' },
  { id: 'moss',    dark: '#1f3a2a', base: '#3c5e45', light: '#67916f', belly: '#aecbb2' },
  { id: 'copper',  dark: '#4a2415', base: '#86472a', light: '#bd7a4e', belly: '#e7b48c' },
  { id: 'viper',   dark: '#33301a', base: '#5f5a2e', light: '#938c4c', belly: '#d4cd92' },
  { id: 'ash',     dark: '#2c2622', base: '#544a42', light: '#857669', belly: '#c4b6a8' },
  { id: 'jade',    dark: '#173a33', base: '#2f5e53', light: '#5a9183', belly: '#a7cdc2' },
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

// A limb = an undulating centreline with a varying half-width, rendered as a
// filled (offset) outline so the body can taper like a real snake.

interface LimbOpts {
  wStart: number;     // half-width at a
  wEnd: number;       // half-width at b
  ampStart: number;   // undulation amplitude near a
  ampEnd: number;     // undulation amplitude near b (≈0 for a calm head)
  phase?: number;
  capStart?: 'flat' | 'point';
  capEnd?: 'flat' | 'point';
  taperFront?: number;  // width reaches wEnd within this leading fraction, then holds
}

interface Limb {
  pts: SvgPoint[];        // centreline samples
  hw: number[];          // half-width per sample
  left: SvgPoint[];
  right: SvgPoint[];
  tangentEnd: SvgPoint;  // unit tangent at b (for head orientation)
}

// Straight spine a → b.
function straightSpine(a: SvgPoint, b: SvgPoint): SvgPoint[] {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const n = Math.max(6, Math.round(len / 9));
  const out: SvgPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return out;
}

// Cubic-Bézier spine — a branch leaves the junction along one direction, then arcs to its head.
function cubicSpine(p0: SvgPoint, c1: SvgPoint, c2: SvgPoint, p3: SvgPoint): SvgPoint[] {
  const chord = Math.hypot(p3.x - p0.x, p3.y - p0.y) +
                Math.hypot(c1.x - p0.x, c1.y - p0.y) +
                Math.hypot(p3.x - c2.x, p3.y - c2.y);
  const n = Math.max(10, Math.round(chord / 9));
  const out: SvgPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    const b0 = u * u * u, b1 = 3 * u * u * t, b2 = 3 * u * t * t, b3 = t * t * t;
    out.push({
      x: b0 * p0.x + b1 * c1.x + b2 * c2.x + b3 * p3.x,
      y: b0 * p0.y + b1 * c1.y + b2 * c2.y + b3 * p3.y,
    });
  }
  return out;
}

// Add undulation + a tapering half-width to a spine and offset it into a filled ribbon.
function buildLimbFromSpine(spine: SvgPoint[], o: LimbOpts): Limb {
  const n = spine.length - 1;
  const cum = [0];
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1]! + Math.hypot(spine[i]!.x - spine[i - 1]!.x, spine[i]!.y - spine[i - 1]!.y));
  const total = cum[n] || 1;
  const waves = Math.max(0.6, total / 150);
  const phase = o.phase ?? 0;

  const pts: SvgPoint[] = [];
  const hw: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = cum[i]! / total;
    const p0 = spine[Math.max(0, i - 1)]!, p1 = spine[Math.min(n, i + 1)]!;
    const tx = p1.x - p0.x, ty = p1.y - p0.y;
    const tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl, ny = tx / tl;                     // spine normal
    const endDamp = Math.sin(t * Math.PI);                 // 0 at both ends
    const amp = lerp(o.ampStart, o.ampEnd, t) * endDamp;
    const off = Math.sin(t * Math.PI * 2 * waves + phase) * amp;
    pts.push({ x: spine[i]!.x + nx * off, y: spine[i]!.y + ny * off });
    const wt = o.taperFront != null ? Math.min(1, t / o.taperFront) : easeInOut(t);
    let w = lerp(o.wStart, o.wEnd, wt);
    if (o.capStart === 'point') w *= Math.min(1, t * 6 + 0.06);
    if (o.capEnd === 'point')   w *= Math.min(1, (1 - t) * 6 + 0.06);
    hw.push(w);
  }

  // Offset edges from the undulated centreline's local normals.
  const left: SvgPoint[] = [], right: SvgPoint[] = [];
  for (let i = 0; i <= n; i++) {
    const p0 = pts[Math.max(0, i - 1)]!, p1 = pts[Math.min(n, i + 1)]!;
    const tx = p1.x - p0.x, ty = p1.y - p0.y;
    const tl = Math.hypot(tx, ty) || 1;
    const lnx = -ty / tl, lny = tx / tl;
    left.push({ x: pts[i]!.x + lnx * hw[i]!, y: pts[i]!.y + lny * hw[i]! });
    right.push({ x: pts[i]!.x - lnx * hw[i]!, y: pts[i]!.y - lny * hw[i]! });
  }
  const pe0 = pts[n - 1]!, pe1 = pts[n]!;
  const tl = Math.hypot(pe1.x - pe0.x, pe1.y - pe0.y) || 1;
  return { pts, hw, left, right, tangentEnd: { x: (pe1.x - pe0.x) / tl, y: (pe1.y - pe0.y) / tl } };
}

function buildLimb(a: SvgPoint, b: SvgPoint, o: LimbOpts): Limb {
  return buildLimbFromSpine(straightSpine(a, b), o);
}

function poly(points: SvgPoint[]): string {
  return points.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

// Closed filled outline for a limb (down the left edge, back up the right).
function limbOutline(l: Limb): string {
  const start = l.left[0]!;
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} ` +
    poly(l.left.slice(1)) + ' ' +
    poly([...l.right].reverse()) + ' Z';
}

// Belly sheen: the centreline, stroked thin and light over the fill.
function limbBelly(l: Limb): string {
  const p0 = l.pts[0]!;
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} ` + poly(l.pts.slice(1));
}

// Almond snout + eyes + forked tongue at the end of a branch/limb.
function makeHeadGlyph(neck: SvgPoint, dir: SvgPoint, neckHW: number): SnakeHeadGlyph {
  const nx = -dir.y, ny = dir.x;                 // normal
  const hw = Math.max(3.2, neckHW * 1.7);        // snout half-width
  const len = hw * 2.6;                          // snout length
  const baseL = { x: neck.x + nx * neckHW, y: neck.y + ny * neckHW };
  const baseR = { x: neck.x - nx * neckHW, y: neck.y - ny * neckHW };
  const tip   = { x: neck.x + dir.x * len, y: neck.y + dir.y * len };
  const bulgeL = { x: neck.x + dir.x * len * 0.42 + nx * hw, y: neck.y + dir.y * len * 0.42 + ny * hw };
  const bulgeR = { x: neck.x + dir.x * len * 0.42 - nx * hw, y: neck.y + dir.y * len * 0.42 - ny * hw };
  const outlineD =
    `M ${baseL.x.toFixed(1)} ${baseL.y.toFixed(1)} ` +
    `Q ${bulgeL.x.toFixed(1)} ${bulgeL.y.toFixed(1)} ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} ` +
    `Q ${bulgeR.x.toFixed(1)} ${bulgeR.y.toFixed(1)} ${baseR.x.toFixed(1)} ${baseR.y.toFixed(1)} Z`;

  const er = Math.max(1.1, hw * 0.26);
  const ex = neck.x + dir.x * len * 0.5, ey = neck.y + dir.y * len * 0.5;
  const eyes = [
    { cx: ex + nx * hw * 0.5, cy: ey + ny * hw * 0.5, r: er },
    { cx: ex - nx * hw * 0.5, cy: ey - ny * hw * 0.5, r: er },
  ];
  const glints = eyes.map(e => ({ cx: e.cx - dir.x * er * 0.3, cy: e.cy - dir.y * er * 0.3, r: er * 0.42 }));

  // Forked tongue flicking from the tip.
  const tl = hw * 1.7, fork = hw * 0.5;
  const mid = { x: tip.x + dir.x * tl * 0.6, y: tip.y + dir.y * tl * 0.6 };
  const f1  = { x: tip.x + dir.x * tl + nx * fork, y: tip.y + dir.y * tl + ny * fork };
  const f2  = { x: tip.x + dir.x * tl - nx * fork, y: tip.y + dir.y * tl - ny * fork };
  const tongueD =
    `M ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L ${mid.x.toFixed(1)} ${mid.y.toFixed(1)} ` +
    `M ${mid.x.toFixed(1)} ${mid.y.toFixed(1)} L ${f1.x.toFixed(1)} ${f1.y.toFixed(1)} ` +
    `M ${mid.x.toFixed(1)} ${mid.y.toFixed(1)} L ${f2.x.toFixed(1)} ${f2.y.toFixed(1)}`;

  return { outlineD, eyes, glints, tongueD };
}

// Like edgePoint, but aims at a free point (e.g. a branch junction) instead of
// another cell — used to anchor a tree-snake's trunk/branches on a cell edge.
function edgeToward(
  board: HTMLElement,
  from: number | string,
  target: SvgPoint,
  boardRect: DOMRect,
  scale: number,
  inset = 0.6,
): SvgPoint | null {
  const c1 = cellCenter(board, from, boardRect, scale);
  if (!c1) return null;
  const dx = target.x - c1.x, dy = target.y - c1.y;
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

  const snakeBodies: SnakeBody[] = [];
  const usedSkins = new Map<string, SnakeSkin>();
  // Per-head centreline (head → tail) for the token's slither-down ride when bitten.
  const snakeRoutes: Record<string, SvgPoint[]> = {};
  let gi = 0;

  // Group snakes by shared tail → each group is one or more many-headed snakes
  // (a shared trunk branching out to every head).
  const groups = new Map<string, { tail: number | string; heads: (number | string)[] }>();
  Object.entries(snakes).forEach(([h, t]) => {
    const hKey = isNaN(Number(h)) ? h : Number(h);
    const key  = String(t);
    let g = groups.get(key);
    if (!g) { g = { tail: t as number | string, heads: [] }; groups.set(key, g); }
    g.heads.push(hKey);
  });

  const TRUNK_HW = 7.2;   // half-width of the shared body at the junction
  const TAIL_HW  = 1.3;   // taper to a point at the tail tip
  const NECK_HW  = 2.7;   // narrow neck just behind each head

  groups.forEach(({ tail, heads }, key) => {
    const skin = SNAKE_SKINS[gi++ % SNAKE_SKINS.length]!;

    const tailCenter = cellCenter(boardEl, tail, boardRect, scale);
    if (!tailCenter) return;

    const headInfos = heads
      .map(h => {
        const c = cellCenter(boardEl, h, boardRect, scale);
        return c ? { key: h, c, dist: Math.hypot(c.x - tailCenter.x, c.y - tailCenter.y) } : null;
      })
      .filter((p): p is { key: number | string; c: SvgPoint; dist: number } => p !== null)
      .sort((a, b) => a.dist - b.dist);
    if (headInfos.length === 0) return;

    // ~1 sub-snake per 4 heads, so a junction never sits above its own heads.
    const single  = headInfos.length === 1;
    const jFactor = single ? 0.52 : 0.85;   // junction position tail → heads
    const k       = Math.min(3, Math.max(1, Math.round(headInfos.length / 4)));
    const per     = Math.ceil(headInfos.length / k);
    const clusters: (typeof headInfos)[] = [];
    for (let i = 0; i < headInfos.length; i += per) clusters.push(headInfos.slice(i, i + per));

    clusters.forEach((cluster, ci) => {
      const centroid = {
        x: cluster.reduce((s, p) => s + p.c.x, 0) / cluster.length,
        y: cluster.reduce((s, p) => s + p.c.y, 0) / cluster.length,
      };
      const minDist = cluster[0]!.dist;
      const dirLen  = Math.hypot(centroid.x - tailCenter.x, centroid.y - tailCenter.y) || 1;
      const jDist   = minDist * jFactor;
      const junction = {
        x: tailCenter.x + (centroid.x - tailCenter.x) / dirLen * jDist,
        y: tailCenter.y + (centroid.y - tailCenter.y) / dirLen * jDist,
      };

      const limbs: Limb[] = [];
      const headGlyphs: SnakeHeadGlyph[] = [];

      // Thinner bodies for shorter snakes (≈full width past ~210px).
      const widthScale = (len: number) => Math.max(0.4, Math.min(1, len / 210));

      // Trunk flow direction (tail → junction); branches depart along this.
      const trunkLen = Math.hypot(junction.x - tailCenter.x, junction.y - tailCenter.y) || 1;
      const Dx = (junction.x - tailCenter.x) / trunkLen;
      const Dy = (junction.y - tailCenter.y) / trunkLen;

      // Half-width at the junction; every limb starts here so the split is seamless.
      const jHW = TRUNK_HW * widthScale(trunkLen);

      // Shared trunk: junction (fat) → tail tip (point).
      const tailEdge = edgeToward(boardEl, tail, junction, boardRect, scale, 0.5);
      let trunkPts: SvgPoint[] = [];
      if (tailEdge) {
        const trunk = buildLimb(junction, tailEdge, {
          wStart: jHW, wEnd: TAIL_HW * Math.max(widthScale(trunkLen), 0.6),
          ampStart: 6, ampEnd: 5, capEnd: 'point',
        });
        trunkPts = trunk.pts;   // junction → tail
        limbs.push(trunk);
      }

      // Branches depart along the trunk direction, then arc to the head
      // (bigger turn → longer departure → more curl).
      cluster.forEach(({ key: hKey }, i) => {
        const headEdge = edgeToward(boardEl, hKey, junction, boardRect, scale, 0.62);
        if (!headEdge) return;
        const vx = headEdge.x - junction.x, vy = headEdge.y - junction.y;
        const vlen = Math.hypot(vx, vy) || 1;
        const turn = Math.acos(Math.max(-1, Math.min(1, (Dx * vx + Dy * vy) / vlen))) / Math.PI; // 0..1
        const depart = vlen * (0.4 + 0.45 * turn);
        const c1 = { x: junction.x + Dx * depart, y: junction.y + Dy * depart };
        const ax = headEdge.x - c1.x, ay = headEdge.y - c1.y;
        const alen = Math.hypot(ax, ay) || 1;
        const c2 = { x: headEdge.x - (ax / alen) * vlen * 0.3, y: headEdge.y - (ay / alen) * vlen * 0.3 };

        // Neck thins for short branches; base stays at jHW for a seamless split.
        const sc = widthScale(vlen);
        const neckHW = NECK_HW * Math.max(sc, 0.7);
        const br = buildLimbFromSpine(cubicSpine(junction, c1, c2, headEdge), {
          wStart: jHW, wEnd: Math.min(neckHW, jHW), ampStart: 3.6 * sc, ampEnd: 1.2 * sc, phase: i * 1.7,
          // Multi-head branches neck down fast; a lone snake tapers full-length.
          ...(single ? {} : { taperFront: 0.3 }),
        });
        limbs.push(br);
        headGlyphs.push(makeHeadGlyph(headEdge, br.tangentEnd, Math.min(neckHW, jHW)));

        // Route the player rides when bitten here: head → junction → tail.
        snakeRoutes[String(hKey)] = [...br.pts].reverse().concat(trunkPts);
      });

      if (limbs.length === 0) return;
      usedSkins.set(skin.id, skin);
      const bodyD =
        limbs.map(limbOutline).join(' ') + ' ' +
        headGlyphs.map(h => h.outlineD).join(' ');
      const bellyD = limbs.map(limbBelly).join(' ');
      snakeBodies.push({ key: `s-${key}-c${ci}`, skinId: skin.id, bodyD, bellyD, heads: headGlyphs });
    });
  });

  return {
    ladders: ladderPaths,
    snakeBodies,
    snakeSkins: [...usedSkins.values()],
    snakeRoutes,
    width:  svgWidth,
    height: svgHeight,
  };
}
