import {
  useRef, useLayoutEffect, useState, useEffect, useCallback,
  type CSSProperties, type RefObject,
} from 'react';
import clsx from 'clsx';
import { useGameStore } from '../../store/gameStore';
import { getCellNames, getEnglishMeaning } from '../../utils/langUtils';
import {
  getCellGridPosition, getCellType, OVAL_POSITIONS,
  BOARD_WIDTH, CELL_W, CELL_H,
} from '../../utils/boardUtils';
import { computeSvgPaths } from '../../utils/svgUtils';
import { ladders, ladderEndFrom } from '../../data/ladders';
import { snakes, snakeTailFrom } from '../../data/snakes';
import { t, getCellNames as _getCellNames } from '../../utils/langUtils';
import { getCellLabel } from '../../store/gameStore';
import type { SvgData, CellType as TCellType } from '../../types';
void _getCellNames;

const CELL_TYPE_CLASS: Record<TCellType, string> = {
  normal:         'cell-normal',
  start:          'cell-start',
  'ladder-start': 'cell-ladder-start',
  'ladder-end':   'cell-ladder-end',
  'snake-head':   'cell-snake-head',
  'snake-tail':   'cell-snake-tail',
  dual:           'cell-dual',
  moksha:         'cell-moksha cell-glow',
  'special-star': 'cell-special-star',
  final:          'cell-final cell-glow',
  'bottom-hell':  'cell-bottom-hell',
  'bottom-kshudra': 'cell-bottom-kshudra',
  'bottom-death': 'cell-bottom-death',
  'special-maran': 'cell-special-maran',
  'special-janma': 'cell-special-janma',
};

// ---- Tooltip ----
function TooltipContent({ num }: { num: number }) {
  const { language } = useGameStore();
  const names = getCellNames(language);
  const ladderDest = ladders[num];
  const snakeDest  = (snakes as Record<number, unknown>)[num];
  const fromLadders = ladderEndFrom[num] ?? [];
  const fromSnakes  = snakeTailFrom[num] ?? [];
  const meaning = language !== 'english' ? getEnglishMeaning(num) : null;

  return (
    <div className="cell-tooltip">
      <span className="text-saddle font-bold">{num}</span>{' '}
      <span className="text-brown-800">{names[num]}</span>
      {meaning && <span className="text-[10px] text-gray-500 ml-1">({meaning})</span>}
      {ladderDest !== undefined && (
        <div className="text-green-700 mt-0.5">
          🪜 → {typeof ladderDest === 'number' ? `${ladderDest} — ${names[ladderDest]}` : String(ladderDest)}
        </div>
      )}
      {snakeDest !== undefined && (
        <div className="text-red-700 mt-0.5">
          🐍 → {typeof snakeDest === 'number' ? `${snakeDest} — ${names[snakeDest as number]}` : String(snakeDest)}
        </div>
      )}
      {fromLadders.map(s => (
        <div key={s} className="text-green-700">🪜 from: {s} — {names[s]}</div>
      ))}
      {fromSnakes.map(h => (
        <div key={h} className="text-red-700">🐍 from: {h} — {names[h]}</div>
      ))}
    </div>
  );
}

// ---- Single board cell ----
interface BoardCellProps {
  num: number;
  style?: CSSProperties;
  isOval?: boolean;
}

function BoardCell({ num, style, isOval }: BoardCellProps) {
  const { language, highlightedCells, playerPos, setHighlightedCells, searchQuery } = useGameStore();
  const names    = getCellNames(language);
  const cellType = getCellType(num);

  const isHighlighted = highlightedCells.includes(num);
  const isPlayerHere  = playerPos === num;
  const dim = searchQuery.trim()
    ? !names[num]?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !String(num).includes(searchQuery)
    : false;

  const ladderDest = ladders[num];
  const snakeDest  = (snakes as Record<number, unknown>)[num];
  let arrowTag: React.ReactNode = null;
  if (ladderDest !== undefined) {
    arrowTag = (
      <span className="arrow-tag text-[7px] font-bold absolute bottom-0.5 right-0.5 rounded-sm px-px" style={{ color: '#a5d6a7' }}>
        ▲{typeof ladderDest === 'number' ? ladderDest : '✦'}
      </span>
    );
  }
  if (snakeDest !== undefined) {
    arrowTag = (
      <>
        {arrowTag}
        <span
          className={clsx('arrow-tag text-[7px] font-bold absolute bottom-0.5 rounded-sm px-px', ladderDest !== undefined ? 'left-0.5' : 'right-0.5')}
          style={{ color: '#ef9a9a' }}
        >
          ▼{typeof snakeDest === 'number' ? snakeDest : '☠'}
        </span>
      </>
    );
  }

  function handleClick() {
    const connected: number[] = [num];
    if (typeof ladderDest === 'number') connected.push(ladderDest);
    if (typeof snakeDest  === 'number') connected.push(snakeDest as number);
    (ladderEndFrom[num] ?? []).forEach(s => connected.push(s));
    (snakeTailFrom[num] ?? []).forEach(h => connected.push(h));
    setHighlightedCells([...new globalThis.Set(connected)]);
  }

  const wh = { width: CELL_W, height: CELL_H };

  return (
    <div
      data-cell={num}
      className={clsx(
        'cell',
        CELL_TYPE_CLASS[cellType],
        isHighlighted && 'cell-highlight',
        isPlayerHere  && 'cell-player-here',
        isOval        && 'oval-cell absolute z-[5]',
      )}
      style={{
        ...(isOval ? { ...wh, ...style } : { gridRow: getCellGridPosition(num).gridRow, gridColumn: getCellGridPosition(num).gridCol }),
        opacity: dim ? 0.2 : 1,
        transition: 'opacity 0.2s',
      }}
      onClick={handleClick}
    >
      <span className="num relative z-[12] text-[11px] font-bold text-[#222] leading-none">{num}</span>
      <span className="cell-name">{names[num]}</span>
      {arrowTag}
      <TooltipContent num={num} />
    </div>
  );
}

// ---- SVG overlay ----
function SnakeLadderSvg({ data, visible }: { data: SvgData; visible: boolean }) {
  if (!visible) return null;
  return (
    <svg
      id="sl-svg"
      width={data.width}
      height={data.height}
      viewBox={`0 0 ${data.width} ${data.height}`}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}
    >
      <defs>
        {data.markerDefs.map(m => (
          m.type === 'head' ? (
            <marker key={m.id} id={m.id} viewBox="0 0 16 12" refX="1" refY="6" markerWidth="10" markerHeight="8" orient="auto">
              <path d="M 0 6 L 10 1 L 8 6 L 10 11 Z" fill={m.color} fillOpacity="0.9" />
              <circle cx="6" cy="3.5" r="1" fill="#fff" />
              <circle cx="6" cy="8.5" r="1" fill="#fff" />
              <path d="M 0 6 L -3 4 M 0 6 L -3 8" stroke="#d32f2f" strokeWidth="0.8" fill="none" />
            </marker>
          ) : (
            <marker key={m.id} id={m.id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="4" orient="auto">
              <path d="M 0 2 Q 5 5 10 5 Q 5 5 0 8 Z" fill={m.color} fillOpacity="0.8" />
            </marker>
          )
        ))}
      </defs>

      {/* Ladders */}
      <g>
        {data.ladders.map(l => (
          <g key={l.key}>
            <line {...l.rail1} stroke={l.color} strokeWidth="0.8" strokeOpacity="0.7" />
            <line {...l.rail2} stroke={l.color} strokeWidth="0.8" strokeOpacity="0.7" />
            {l.rungs.map((r, i) => (
              <line key={i} {...r} stroke={l.color} strokeWidth="0.6" strokeOpacity="0.6" />
            ))}
          </g>
        ))}
      </g>

      {/* Snakes */}
      <g>
        {data.snakes.map(s => (
          <path
            key={s.key}
            d={s.d}
            stroke={s.color}
            strokeWidth="3"
            strokeOpacity="0.8"
            fill="none"
            markerStart={`url(#${s.headMarkerId})`}
            markerEnd={`url(#${s.tailMarkerId})`}
          />
        ))}
      </g>
    </svg>
  );
}

// ---- Cell-position helpers (scroll-independent) ----
//
// getBoundingClientRect() returns viewport-relative coords that shift while
// scrollIntoView is animating. Using offsetLeft/offsetTop traversal instead
// gives layout-stable positions unaffected by any in-progress scroll.
//
// For cells inside the board the traversal terminates at `board`.
// For off-board special cells (महानरक, etc.) that live in board-container we
// fall back to getBoundingClientRect after the scroll animation has settled —
// these cells are only visited once, not in rapid step-by-step loops, so the
// race condition doesn't apply.
function cellOffsetInsideBoard(
  el: HTMLElement,
  board: HTMLElement,
): { x: number; y: number } | null {
  let x = 0, y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== board) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const p = node.offsetParent as HTMLElement | null;
    if (!p) return null;   // reached the document root without hitting board
    node = p;
  }
  return node === board ? { x, y } : null;
}

// ---- Player token ----
function PlayerToken({ boardRef, containerRef }: { boardRef: React.RefObject<HTMLDivElement | null>; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const playerPos = useGameStore(s => s.playerPos);
  const [style, setStyle] = useState<CSSProperties>({ display: 'none' });

  useLayoutEffect(() => {
    if (!boardRef.current) return;
    const board = boardRef.current;

    let el: HTMLElement | null = null;
    if (playerPos === 0) {
      el = document.getElementById('cell-janma');
    } else if (typeof playerPos === 'string') {
      const map: Record<string, string> = {
        'महानरक':          'cell-mahanaarak-center',
        'महानरक-लेफ्ट':    'cell-mahanaarak-left',
        'महानरक-राइट':     'cell-mahanaarak-right',
        'क्षुद्रनरक':      'cell-kshudranarak',
        'मरण':             'cell-maran',
        'मृत्यू उर्फ कबर': 'cell-mrutyu',
        'शून्य लोक':       'cell-shunya',
        'आत्मपरिभाण लोक':  'cell-atma',
        'बेहस्त लोक':      'cell-behast',
      };
      const id = map[playerPos];
      el = id ? document.getElementById(id) : null;
    } else {
      el = board.querySelector(`[data-cell="${playerPos}"]`);
    }

    if (!el) { setStyle({ display: 'none' }); return; }

    // Prefer scroll-independent offsetLeft/offsetTop when the cell is inside board.
    // Fall back to getBoundingClientRect for off-board special cells.
    const off = cellOffsetInsideBoard(el, board);
    let x: number, y: number;
    if (off) {
      x = off.x + el.offsetWidth  / 2 - 11;
      y = off.y + el.offsetHeight / 2 - 11;
    } else {
      const boardRect = board.getBoundingClientRect();
      const cs = window.getComputedStyle(board);
      const bL = parseFloat(cs.borderLeftWidth) || 0;
      const bT = parseFloat(cs.borderTopWidth)  || 0;
      const r = el.getBoundingClientRect();
      x = (r.left - boardRect.left - bL) + r.width  / 2 - 11;
      y = (r.top  - boardRect.top  - bT) + r.height / 2 - 11;
    }
    setStyle({ display: 'block', left: x, top: y });
  }, [playerPos, boardRef, containerRef]);

  if (style.display === 'none') return null;
  return (
    <div
      className="player-token"
      style={style}
      aria-label="Player position"
    >
      ♟
    </div>
  );
}

// ---- Floating dice panel (follows player) ----
const SPECIAL_ID_MAP: Record<string, string> = {
  'महानरक':          'cell-mahanaarak-center',
  'महानरक-लेफ्ट':    'cell-mahanaarak-left',
  'महानरक-राइट':     'cell-mahanaarak-right',
  'क्षुद्रनरक':      'cell-kshudranarak',
  'मरण':             'cell-maran',
  'मृत्यू उर्फ कबर': 'cell-mrutyu',
  'शून्य लोक':       'cell-shunya',
  'आत्मपरिभाण लोक':  'cell-atma',
  'बेहस्त लोक':      'cell-behast',
};

function FloatingDicePanel({
  boardRef,
  containerRef,
}: {
  boardRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const {
    playerPos, isAnimating, gameOver, lastDiceValue, moveLog,
    language, autoPlay, setAutoPlay, rollDice, resetGame,
  } = useGameStore();

  const [panelStyle, setPanelStyle] = useState<CSSProperties>({
    position: 'absolute', top: 20, left: 20,
  });

  // Position the panel near (but not on top of) the player cell.
  // Uses offsetLeft/offsetTop to avoid getBoundingClientRect mid-scroll races.
  useLayoutEffect(() => {
    if (!boardRef.current) return;
    const board = boardRef.current;
    const cs = window.getComputedStyle(board);
    const bL = parseFloat(cs.borderLeftWidth)  || 0;
    const bT = parseFloat(cs.borderTopWidth)   || 0;
    const bR = parseFloat(cs.borderRightWidth) || 0;
    const bB = parseFloat(cs.borderBottomWidth)|| 0;
    const boardW = board.offsetWidth  - bL - bR;
    const boardH = board.offsetHeight - bT - bB;

    let el: HTMLElement | null = null;
    if (playerPos === 0) {
      el = document.getElementById('cell-janma');
    } else if (typeof playerPos === 'string') {
      const id = SPECIAL_ID_MAP[playerPos];
      el = id ? document.getElementById(id) : null;
    } else {
      el = board.querySelector(`[data-cell="${playerPos}"]`);
    }
    if (!el) return;

    const off = cellOffsetInsideBoard(el, board);
    let cellCX: number, cellCY: number, cellH: number;
    if (off) {
      cellCX = off.x + el.offsetWidth  / 2;
      cellCY = off.y + el.offsetHeight / 2;
      cellH  = el.offsetHeight;
    } else {
      // Off-board fallback
      const boardRect = board.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      cellCX = (r.left - boardRect.left - bL) + r.width  / 2;
      cellCY = (r.top  - boardRect.top  - bT) + r.height / 2;
      cellH  = r.height;
    }

    const PANEL_W = 148, PANEL_H = 190, MARGIN = 10;
    let px = cellCX - PANEL_W / 2;
    let py = cellCY + cellH / 2 + MARGIN;
    if (py + PANEL_H > boardH - 30) py = cellCY - cellH / 2 - PANEL_H - MARGIN;
    if (py < MARGIN) py = MARGIN;
    px = Math.max(MARGIN, Math.min(boardW - PANEL_W - MARGIN, px));

    setPanelStyle({ position: 'absolute', left: px, top: py });
  }, [playerPos, boardRef, containerRef]);

  // Autoplay timer: fires 3 s after each move completes
  useEffect(() => {
    if (!autoPlay || isAnimating || gameOver) return;
    const id = setTimeout(() => void rollDice(), 1000);
    return () => clearTimeout(id);
  }, [autoPlay, isAnimating, gameOver, playerPos, rollDice]);

  const label = getCellLabel(playerPos, language);
  const lastLog = moveLog[0] ?? t(language, 'rollToBegin');

  return (
    <div
      id="floating-dice-panel"
      style={panelStyle}
      className={autoPlay ? 'autoplay-active' : ''}
    >
      {/* Roll button */}
      <button
        onClick={() => void rollDice()}
        disabled={isAnimating || gameOver}
        className={[
          'w-full py-2 px-3 text-[14px] font-bold rounded-lg',
          'bg-gradient-to-br from-parchment-400 to-parchment-500',
          'border-2 border-brown-500 text-brown-700',
          'shadow-md transition-all duration-200',
          'hover:enabled:scale-[1.03] hover:enabled:from-parchment-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        🎲 {t(language, 'rollShort')}
      </button>

      {/* Autoplay toggle */}
      <button
        onClick={() => setAutoPlay(!autoPlay)}
        disabled={gameOver}
        className={[
          'w-full py-1.5 px-3 text-[12px] font-bold rounded-lg',
          'border-2 transition-all duration-200',
          autoPlay
            ? 'bg-green-100 border-green-600 text-green-800'
            : 'bg-brown-500/15 border-brown-500 text-brown-700',
          'hover:enabled:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        {autoPlay ? t(language, 'autoOn') : t(language, 'autoOff')}
      </button>

      {/* Countdown bar (only when autoplay is on and waiting) */}
      {autoPlay && !isAnimating && !gameOver && (
        <div className="countdown-track w-full">
          <div key={`${String(playerPos)}-${lastDiceValue}`} className="countdown-fill" />
        </div>
      )}

      {/* Status */}
      <div className="text-center w-full">
        <div className="text-[11px] font-bold text-saddle truncate">{label}</div>
        <div className={[
          'text-[10px] mt-0.5 truncate',
          lastLog.includes('🪜') ? 'text-green-700' :
          lastLog.includes('🐍') ? 'text-red-700' : 'text-brown-600',
        ].join(' ')}>
          {lastLog}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => void resetGame()}
        className="text-[10px] text-brown-500 hover:text-brown-700 underline"
      >
        {t(language, 'resetShort')} Reset
      </button>
    </div>
  );
}

// ---- Offboard side cells ----
interface OffboardSideCellProps {
  id: string;
  top: number;
  side: 'left' | 'right';
  name: string;
  sub: string;
  arrow: string;
  snakeTo: string;
  ladderFrom: string;
}

function OffboardSideCell({ id, top, side, name, sub, arrow, snakeTo, ladderFrom }: OffboardSideCellProps) {
  const cls = side === 'right'
    ? 'bg-gradient-to-br from-[#8fbc8f] to-[#6b8e6b] border-2 border-[#4a7c4a] text-[#2d4a2d]'
    : side === 'left' && id.includes('shunya')
    ? 'bg-gradient-to-br from-[#a0a0c8] to-[#8080a0] border-2 border-[#606080] text-[#303050]'
    : 'bg-gradient-to-br from-[#8fbc8f] to-[#6b8e6b] border-2 border-[#4a7c4a] text-[#2d4a2d]';

  const connectorSide = side === 'right' ? { right: '100%', width: 16 } : { left: '100%', width: 12 };

  return (
    <div
      id={id}
      className={`offboard-side-cell ${cls}`}
      style={{
        top,
        ...(side === 'right' ? { left: 'calc(100% + 10px)' } : { left: -115 }),
      }}
    >
      <div
        className="offboard-connector"
        style={{ ...connectorSide, top: '50%' }}
      />
      <span className="text-[11px] font-bold leading-[1.2] text-center">{name}</span>
      <span className="text-[8px] opacity-70 leading-[1.1]">{sub}</span>
      <span className="text-[9px] opacity-60 mt-0.5">{arrow}</span>
      <div className="cell-tooltip">
        <span className="text-brown-800 font-bold">{name}</span>
        <div className="text-green-700">🪜 Ladder from: {ladderFrom}</div>
        <div className="text-red-700">🐍 Snake to: {snakeTo}</div>
      </div>
    </div>
  );
}

// ---- Bottom special cells ----
interface BottomCellProps {
  id: string;
  gridCol: number;
  name: string;
  typeClass: string;
  label?: string;
  tooltipContent?: string;
}

function BottomCell({ id, gridCol, name, typeClass, label, tooltipContent }: BottomCellProps) {
  return (
    <div
      id={id}
      className={`cell ${typeClass}`}
      style={{ gridRow: 35, gridColumn: gridCol }}
    >
      {label && <span className="num text-[9px] opacity-70">{label}</span>}
      <span className="cell-name font-bold text-[11px]">{name}</span>
      {tooltipContent && (
        <div className="cell-tooltip">
          <span className="text-brown-800 font-bold">{name}</span>
          <div className="text-red-700" dangerouslySetInnerHTML={{ __html: tooltipContent }} />
        </div>
      )}
    </div>
  );
}

// Natural full width of the board section: board(1102) + offboard clearance(2×120)
const BOARD_SECTION_W = 1102 + 240;

// ---- Main Board ----
export function Board() {
  const boardRef     = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollWrapRef = useRef<HTMLDivElement | null>(null);
  const { language, slVisible, clearHighlights } = useGameStore();
  const [boardScale, setBoardScale]       = useState(1);
  const [boardNaturalH, setBoardNaturalH] = useState(0);
  const [svgData, setSvgData] = useState<SvgData | null>(null);

  const computeSvg = useCallback(() => {
    if (!boardRef.current || !containerRef.current) return;
    const data = computeSvgPaths(boardRef.current, containerRef.current);
    setSvgData(data);
  }, []);

  // Recompute SVG after board renders / language changes.
  // Two rAF + 150ms ensures cells are painted and fonts are loaded before measuring.
  useLayoutEffect(() => {
    let raf1: number, raf2: number, timer: ReturnType<typeof setTimeout>;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        timer = setTimeout(computeSvg, 150);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, [language, computeSvg]);

  // Recompute on resize
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(computeSvg, 150);
    };
    window.addEventListener('resize', handler);
    return () => { window.removeEventListener('resize', handler); clearTimeout(timer); };
  }, [computeSvg]);

  // Scale the board section to fit the available width — no internal scrollbar.
  // Uses a ResizeObserver on the scroll wrapper so it reacts to window resizes
  // and sidebar/zoom changes without needing a window.resize handler.
  useEffect(() => {
    const el = scrollWrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      const available = el.parentElement?.clientWidth ?? el.clientWidth;
      setBoardScale(Math.min(1, available / BOARD_SECTION_W));
      // Capture natural height BEFORE scale is applied for the margin correction.
      // Force scale to 1 momentarily so scrollHeight isn't already compressed.
      const prevTransform = el.style.transform;
      el.style.transform = 'none';
      setBoardNaturalH(el.scrollHeight);
      el.style.transform = prevTransform;
    });
    obs.observe(el.parentElement ?? el);
    return () => obs.disconnect();
  }, []);

  // Capture the natural height once on first render (after SVG and cells are painted).
  // This gives an accurate base for the marginBottom compensation at any zoom level.
  useEffect(() => {
    const el = scrollWrapRef.current;
    if (!el || boardNaturalH > 0) return;
    const timer = setTimeout(() => setBoardNaturalH(el.scrollHeight), 300);
    return () => clearTimeout(timer);
  }, [boardNaturalH]);

  // Recompute SVG when scale changes (getBoundingClientRect is scale-aware)
  useEffect(() => {
    const timer = setTimeout(computeSvg, 60);
    return () => clearTimeout(timer);
  }, [boardScale, computeSvg]);

  // Clear highlights on click outside
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('.cell') && !(e.target as HTMLElement).closest('.info-panel')) {
        clearHighlights();
      }
    }
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [clearHighlights]);

  // Sorted grid cells (not oval)
  const gridCells    = Array.from({ length: 285 }, (_, i) => i + 1).filter(n => n < 234 || n > 248);
  const ovalCells    = Array.from({ length: 15 }, (_, i) => i + 234);

  // Force content-box sizing so BOARD_WIDTH means the content/grid area,
  // matching the original HTML which didn't use Tailwind's border-box reset.
  const boardStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(12, ${CELL_W}px)`,
    gridTemplateRows: `repeat(35, ${CELL_H}px)`,
    gap: '2px',
    width: BOARD_WIDTH,
    boxSizing: 'content-box',
    position: 'relative',
    overflow: 'visible',
  };

  return (
    <div
      id="board-scroll"
      ref={scrollWrapRef}
      className="pb-2.5"
      style={{
        // Scale down to fit viewport — no horizontal scroll.
        // transform-origin top-center means the board stays centred as it shrinks.
        ...(boardScale < 1 ? {
          transform: `scale(${boardScale})`,
          transformOrigin: 'top center',
          // Compensate for height: scaled element still occupies its natural height
          // in the layout flow. Negative margin-bottom pulls subsequent content up.
          // Use the measured natural pixel height, not a width-percentage.
          // At any zoom level: missing height = naturalH × (1 - scale).
          marginBottom: boardNaturalH
            ? `${-Math.round(boardNaturalH * (1 - boardScale))}px`
            : `-${Math.round((1 - boardScale) * 2400)}px`,
        } : {}),
      }}
    >

      <div
        id="board-container"
        ref={containerRef}
        style={{ position: 'relative', margin: '0 120px', width: BOARD_WIDTH + 6 }}
      >
        {/* Board grid */}
        <div
          id="board"
          ref={boardRef}
          data-lang={language}
          className="board-bg border-[4px] border-brown-500 rounded-[8px] p-[4px] shadow-[inset_0_0_30px_rgba(139,69,19,0.2),0_4px_20px_rgba(0,0,0,0.3)]"
          style={boardStyle}
        >
          {/* Grid cells */}
          {gridCells.map(n => <BoardCell key={n} num={n} />)}

          {/* Oval cells */}
          {ovalCells.map((n, i) => (
            <BoardCell
              key={n}
              num={n}
              isOval
              style={{ left: OVAL_POSITIONS[i]!.left, top: OVAL_POSITIONS[i]!.top }}
            />
          ))}

          {/* Harihar Kshetra label — centred inside the oval ring */}
          <div
            style={{
              position: 'absolute',
              left: 4 + 539,      // padding(4) + half grid width(539) = ovalCX
              top:  603,          // ovalCY
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              pointerEvents: 'none',
              textAlign: 'center',
            }}
          >
            <div style={{
              background: 'linear-gradient(145deg, rgba(244,228,193,0.92), rgba(212,188,132,0.92))',
              border: '2px double #8b5a2b',
              borderRadius: 8,
              padding: '10px 16px',
              boxShadow: '0 2px 12px rgba(139,90,43,0.35)',
            }}>
              <div style={{ fontSize: 15, fontWeight: 'bold', color: '#5d3a1a', lineHeight: 1.3 }}>
                हरिहर क्षेत्र
              </div>
              <div style={{ fontSize: 11, color: '#8b5a2b', marginTop: 2, letterSpacing: '0.04em' }}>
                Harihar Kshetra
              </div>
              <div style={{ fontSize: 9, color: '#a07040', marginTop: 3, lineHeight: 1.4 }}>
                ॐ नमः शिवाय · ॐ नमो विष्णवे
              </div>
            </div>
          </div>

          {/* Janmasthan & Maran (row 34) */}
          <div id="cell-janma" className="cell cell-special-janma" style={{ gridRow: 34, gridColumn: 6 }}>
            <span className="cell-name font-bold text-[11px] text-[#01579b]">जन्मस्थान</span>
          </div>
          <div id="cell-maran" className="cell cell-special-maran" style={{ gridRow: 34, gridColumn: 7 }}>
            <span className="cell-name font-bold text-[12px] text-[#880e4f]">मरण</span>
          </div>

          {/* Bottom hell row (row 35) */}
          <BottomCell id="cell-mahanaarak-left"   gridCol={1}  name="महानरक"           typeClass="cell-bottom-hell"    label="0a" />
          <BottomCell id="cell-kshudranarak"      gridCol={6}  name="क्षुद्रनरक"        typeClass="cell-bottom-kshudra" />
          <BottomCell id="cell-mahanaarak-center" gridCol={7}  name="महानरक"           typeClass="cell-bottom-hell"    label="0b" />
          <BottomCell id="cell-mrutyu"            gridCol={11} name="मृत्यू उर्फ कबर"  typeClass="cell-bottom-death"  />
          <BottomCell id="cell-mahanaarak-right"  gridCol={12} name="महानरक"           typeClass="cell-bottom-hell"    label="0c" />

          {/* SVG overlay */}
          {svgData && <SnakeLadderSvg data={svgData} visible={slVisible} />}

          {/* Player token */}
          <PlayerToken boardRef={boardRef} containerRef={containerRef} />

          {/* Floating dice panel — lives inside #board so it scrolls with it */}
          <FloatingDicePanel boardRef={boardRef} containerRef={containerRef} />
        </div>

        {/* Offboard side cells */}
        <OffboardSideCell
          id="cell-behast" top={1444} side="right"
          name="बेहस्त लोक" sub="Paradise" arrow="🪜 ← 38"
          ladderFrom="38" snakeTo="मृत्यू उर्फ कबर"
        />
        <OffboardSideCell
          id="cell-atma" top={1444} side="left"
          name="आत्मपरिभाण लोक" sub="Self-realization" arrow="🪜 ← 55"
          ladderFrom="55" snakeTo="महानरक"
        />
        <OffboardSideCell
          id="cell-shunya" top={1564} side="left"
          name="शून्य लोक" sub="Void World" arrow="🪜 ← 33"
          ladderFrom="33" snakeTo="महानरक"
        />
      </div>
    </div>
  );
}
