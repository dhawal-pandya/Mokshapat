import type { SnakeMap } from '../types';

export const snakes: SnakeMap = {
  263:"महानरक", 259:103, 256:"महानरक", 254:256,
  251:1,   249:178, 248:154, 244:"महानरक",
  242:183, 240:"महानरक-लेफ्ट", 235:151, 234:151,
  229:1,   216:1,   214:67,  209:1,
  206:"महानरक", 203:1, 194:"महानरक-लेफ्ट", 187:"महानरक-राइट",
  182:"महानरक", 180:"महानरक", 171:"महानरक-लेफ्ट", 164:67,
  155:2,   147:77,  146:56,  144:26,
  141:"महानरक", 139:85, 137:"महानरक-राइट", 135:50,
  129:106, 125:"महानरक-लेफ्ट", 119:"महानरक", 117:"महानरक",
  115:"महानरक-राइट", 111:"महानरक-राइट", 108:"महानरक", 106:72,
  103:"महानरक-लेफ्ट", 96:"महानरक", 91:65, 88:"महानरक-राइट",
  84:"महानरक", 80:12,  77:26,  72:60,
  70:4,    64:"महानरक-राइट", 60:37,  58:"महानरक",
  52:11,   48:"महानरक", 46:1,   44:14,
  42:19,   40:"महानरक-राइट", 37:23,  31:26,
  26:"महानरक-लेफ्ट", 23:11,  21:12,  17:15,
  11:"मरण",
  "आत्मपरिभाण लोक":"महानरक-लेफ्ट",
  "शून्य लोक":"महानरक-लेफ्ट",
  "बेहस्त लोक":"मृत्यू उर्फ कबर",
};

export const snakeHeads = new Set(
  Object.keys(snakes)
    .map(Number)
    .filter(n => !isNaN(n))
);

export const snakeTails = new Set<number>();
(Object.values(snakes) as (number | string)[]).forEach(v => {
  if (typeof v === 'number') snakeTails.add(v);
});

export const snakeTailFrom: Record<number, number[]> = {};
Object.entries(snakes).forEach(([h, t]) => {
  if (typeof t === 'number') {
    if (!snakeTailFrom[t]) snakeTailFrom[t] = [];
    snakeTailFrom[t]!.push(Number(h));
  }
});

// Only numeric-to-numeric snakes for game movement
export const gameSnakes: Record<number, number> = {};
Object.entries(snakes).forEach(([k, v]) => {
  const kn = Number(k);
  if (!isNaN(kn) && typeof v === 'number') gameSnakes[kn] = v;
});

// Snakes with string (off-board) destinations
export const snakeToHell: Record<number | string, string> = {};
Object.entries(snakes).forEach(([k, v]) => {
  if (typeof v === 'string') {
    const kn = Number(k);
    snakeToHell[isNaN(kn) ? k : kn] = v;
  }
});

export const SNAKE_WAYPOINTS: Record<number, [number, number]> = {
  263: [215, 216],
  244: [179, 180],
  180: [155, 156],
  108: [107, 108],
  84:  [23, 24],
};
