export type Language = 'sanskrit' | 'english';

export const LANGUAGES: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'english',  label: 'English',  nativeLabel: 'English'   },
  { value: 'sanskrit', label: 'Sanskrit', nativeLabel: 'संस्कृतम्' },
];

export type SpecialCell =
  | 'महानरक'
  | 'महानरक-लेफ्ट'
  | 'महानरक-राइट'
  | 'क्षुद्रनरक'
  | 'मरण'
  | 'मृत्यू उर्फ कबर'
  | 'शून्य लोक'
  | 'आत्मपरिभाण लोक'
  | 'बेहस्त लोक';

export type PlayerPosition = number | SpecialCell;

export type CellType =
  | 'normal'
  | 'start'
  | 'ladder-start'
  | 'ladder-end'
  | 'snake-head'
  | 'snake-tail'
  | 'dual'
  | 'moksha'
  | 'special-star'
  | 'final'
  | 'bottom-hell'
  | 'bottom-kshudra'
  | 'bottom-death'
  | 'special-maran'
  | 'special-janma';

export type LadderValue = number | 'शून्य लोक' | 'बेहस्त लोक' | 'आत्मपरिभाण लोक';
export type SnakeValue  = number | SpecialCell;

export type LadderMap = Record<number, LadderValue>;
export type SnakeMap  = Partial<Record<number | string, SnakeValue>>;

export interface GridPos {
  gridRow: number;
  gridCol: number;
}

export interface OvalPos {
  left: number;
  top: number;
}

export interface SvgPoint {
  x: number;
  y: number;
}

export interface LadderPathData {
  rail1: { x1: number; y1: number; x2: number; y2: number };
  rail2: { x1: number; y1: number; x2: number; y2: number };
  rungs: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  color: string;
  key: string;
}

// A naturalistic snake skin: edge/base/belly shades for the body gradient.
export interface SnakeSkin {
  id: string;
  dark: string;   // spine / shaded edge
  base: string;   // mid body
  light: string;  // sunlit top
  belly: string;  // ventral sheen line
}

export interface SnakeHeadGlyph {
  outlineD: string;                                  // almond snout (filled with body)
  eyes: Array<{ cx: number; cy: number; r: number }>;
  glints: Array<{ cx: number; cy: number; r: number }>;
  tongueD: string;                                   // forked flicking tongue
}

// One whole creature: a single snake or a many-headed snake (shared trunk +
// branches). All limbs share one fill so overlaps merge; one drop-shadow on
// the group unifies the silhouette.
export interface SnakeBody {
  key: string;
  skinId: string;
  bodyD: string;     // filled tapered outline (trunk + branches + head snouts)
  bellyD: string;    // belly sheen, stroked light over the fill
  heads: SnakeHeadGlyph[];
}

export interface SvgData {
  ladders: LadderPathData[];
  snakeBodies: SnakeBody[];
  snakeSkins: SnakeSkin[];
  // Head cell (stringified) → centreline points head→tail, for the bite ride.
  snakeRoutes: Record<string, SvgPoint[]>;
  width: number;
  height: number;
}

export interface GameState {
  playerPos: PlayerPosition;
  gameOver: boolean;
  isAnimating: boolean;
  moveLog: string[];
  mrutyuRollCount: number;
  language: Language;
  slVisible: boolean;
  showIntro: boolean;
  autoPlay: boolean;
  highlightedCells: number[];
  searchQuery: string;
  lastDiceValue: number;
  lifeCount: number;
  narakCount: number;
}
