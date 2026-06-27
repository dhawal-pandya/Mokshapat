import { create } from 'zustand';
import type { GameState, PlayerPosition, Language } from '../types';
import { gameLadders, ladderToOffboard } from '../data/ladders';
import { gameSnakes, snakeToHell }       from '../data/snakes';
import {
  playLadderSound,
  playSnakeSound,
  playAchievementSound,
  playWinningSound,
} from '../utils/audioUtils';
import { getCellNames } from '../utils/langUtils';

const MAHANARAK_POS = ['महानरक', 'महानरक-लेफ्ट', 'महानरक-राइट'] as PlayerPosition[];
const WIN_CELLS     = [283, 284, 285];
const ACH_CELLS     = [236, 243, 247];

interface GameActions {
  setLanguage:         (lang: Language) => void;
  setSlVisible:        (v: boolean) => void;
  setShowIntro:        (v: boolean) => void;
  setAutoPlay:         (v: boolean) => void;
  setSearchQuery:      (q: string) => void;
  setHighlightedCells: (cells: number[]) => void;
  clearHighlights:     () => void;
  rollDice:            () => Promise<void>;
  resetGame:           () => void;
}

export type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()((set, get) => ({
  // ---- initial state ----
  playerPos:        0,
  gameOver:         false,
  isAnimating:      false,
  moveLog:          [],
  mrutyuRollCount:  0,
  language:         'english',
  slVisible:        true,
  showIntro:        true,
  autoPlay:         false,
  highlightedCells: [],
  searchQuery:      '',
  lastDiceValue:    0,
  lifeCount:        0,
  narakCount:       0,

  // ---- actions ----
  setLanguage:         (lang)  => set({ language: lang }),
  setSlVisible:        (v)     => set({ slVisible: v }),
  setShowIntro:        (v)     => set({ showIntro: v }),
  setAutoPlay:         (v)     => set({ autoPlay: v }),
  setSearchQuery:      (q)     => set({ searchQuery: q }),
  setHighlightedCells: (cells) => set({ highlightedCells: cells }),
  clearHighlights:     ()      => set({ highlightedCells: [] }),

  resetGame: () => set({
    playerPos: 0, gameOver: false, isAnimating: false,
    moveLog: [], mrutyuRollCount: 0, lastDiceValue: 0, autoPlay: false,
    lifeCount: 0, narakCount: 0,
  }),

  rollDice: async () => {
    const s = get();
    if (s.gameOver || s.isAnimating) return;
    set({ isAnimating: true });

    // Brief tumble — 4 random faces while 3D dice spins, then settle
    for (let i = 0; i < 4; i++) {
      set({ lastDiceValue: Math.floor(Math.random() * 6) + 1 });
      await delay(45);
    }
    const roll = Math.floor(Math.random() * 6) + 1;
    set({ lastDiceValue: roll });
    const names = getCellNames(get().language);
    const cellTag = (n: number) => `${n} ${names[n] ?? ''}`.trim();

    let { playerPos } = get();

    // ---- Special-position rules ----
    if (MAHANARAK_POS.includes(playerPos)) {
      set({ playerPos: 'क्षुद्रनरक' });
      addLog(get, set, `🎲 ${roll} → क्षुद्रनरक`);
      set({ isAnimating: false }); return;
    }
    if (playerPos === 'क्षुद्रनरक') {
      set({ playerPos: 0 });
      addLog(get, set, `🎲 ${roll} → जन्मस्थान`);
      set({ isAnimating: false }); return;
    }
    if (playerPos === 'मरण') {
      set({ playerPos: 0 });
      addLog(get, set, `🎲 ${roll} → जन्मस्थान (escaped)`);
      set({ isAnimating: false }); return;
    }
    if (playerPos === 'मृत्यू उर्फ कबर') {
      const count = get().mrutyuRollCount + 1;
      if (count < 4) {
        addLog(get, set, `🎲 ${roll} → मृत्यू (${count}/3)`);
        set({ mrutyuRollCount: count, isAnimating: false });
      } else {
        set({ mrutyuRollCount: 0, playerPos: 'महानरक-राइट', narakCount: get().narakCount + 1 });
        addLog(get, set, `🎲 ${roll} → महानरक`);
        set({ isAnimating: false });
      }
      return;
    }
    if (typeof playerPos === 'string') {
      addLog(get, set, `🎲 ${roll} → जन्मस्थान`);
      set({ playerPos: 0, isAnimating: false }); return;
    }

    // ---- Enter board from janmasthan ----
    if (playerPos === 0) {
      set({ playerPos: 1, lifeCount: get().lifeCount + 1 });
      addLog(get, set, `🎲 ${roll} → ${cellTag(1)}`);
      await checkLanding(get, set);
      set({ isAnimating: false }); return;
    }

    // ---- Normal move ----
    const newPos = playerPos + roll;
    if (newPos > 285) {
      addLog(get, set, `🎲 ${roll} → too high, stay at ${cellTag(playerPos)}`);
      set({ isAnimating: false }); return;
    }

    for (let step = playerPos + 1; step <= newPos; step++) {
      await delay(350);
      set({ playerPos: step });
    }
    addLog(get, set, `🎲 ${roll} → ${cellTag(newPos)}`);

    const landed = get().playerPos as number;

    if (WIN_CELLS.includes(landed)) {
      playWinningSound();
      if (landed === 285) set({ gameOver: true });
      if (landed !== 285) await checkLanding(get, set);
      set({ isAnimating: false }); return;
    }
    if (ACH_CELLS.includes(landed)) playAchievementSound();
    await checkLanding(get, set);
    set({ isAnimating: false });
  },
}));

// ---- helpers ----
type Get = () => GameStore;
type Set = (partial: Partial<GameState>) => void;

const MAHANARAK_SET = new Set(['महानरक', 'महानरक-लेफ्ट', 'महानरक-राइट']);

function hellCountPatch(get: Get, dest: string): Partial<GameState> {
  if (MAHANARAK_SET.has(dest) || dest === 'मृत्यू उर्फ कबर') return { narakCount: get().narakCount + 1 };
  return {};
}

function addLog(get: Get, set: Set, msg: string) {
  const log = [msg, ...get().moveLog];
  set({ moveLog: log });
}

async function checkLanding(get: Get, set: Set) {
  const pos = get().playerPos;
  if (typeof pos !== 'number') return;

  if (gameLadders[pos]) {
    const dest = gameLadders[pos]!;
    await delay(700);
    playLadderSound();
    addLog(get, set, `🪜 ${pos}→${dest}`);
    set({ playerPos: dest });
    await delay(1640);
    if (dest === 285) { set({ gameOver: true }); return; }
    await checkChainedSnake(get, set);
    return;
  }
  if (ladderToOffboard[pos]) {
    const dest = ladderToOffboard[pos]!;
    await delay(700);
    playLadderSound();
    addLog(get, set, `🪜 ${pos}→${dest}`);
    set({ playerPos: dest as PlayerPosition });
    const stayOffboard = ['बेहस्त लोक', 'शून्य लोक', 'आत्मपरिभाण लोक'];
    if (!stayOffboard.includes(dest)) {
      set({ playerPos: 0 });
    } else {
      const hellDest = snakeToHell[dest];
      if (hellDest) {
        await delay(700);
        playSnakeSound();
        addLog(get, set, `🐍 ${dest}→${hellDest}`);
        set({ playerPos: hellDest as PlayerPosition, ...hellCountPatch(get, hellDest) });
        await delay(1640);
      }
    }
    return;
  }
  if (gameSnakes[pos]) {
    const dest = gameSnakes[pos]!;
    await delay(700);
    playSnakeSound();
    addLog(get, set, `🐍 ${pos}→${dest}`);
    set({ playerPos: dest });
    await delay(1640);
    await checkChainedSnake(get, set);
    return;
  }
  const hellDest = snakeToHell[pos];
  if (hellDest) {
    await delay(700);
    playSnakeSound();
    addLog(get, set, `🐍 ${pos}→${hellDest}`);
    set({ playerPos: hellDest as PlayerPosition, ...hellCountPatch(get, hellDest) });
    await delay(1640);
  }
}

async function checkChainedSnake(get: Get, set: Set) {
  if (get().gameOver) return;
  const pos = get().playerPos;
  if (typeof pos !== 'number') return;

  if (gameSnakes[pos]) {
    const dest = gameSnakes[pos]!;
    await delay(2800);
    playSnakeSound();
    addLog(get, set, `🐍 ${pos}→${dest}`);
    set({ playerPos: dest });
    await delay(1640);
    await checkChainedSnake(get, set);
    return;
  }
  const hellDest = snakeToHell[pos];
  if (hellDest) {
    await delay(2800);
    playSnakeSound();
    addLog(get, set, `🐍 ${pos}→${hellDest}`);
    set({ playerPos: hellDest as PlayerPosition, ...hellCountPatch(get, hellDest) });
    await delay(1640);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}


export function getCellLabel(pos: PlayerPosition, lang: Language): string {
  const names = getCellNames(lang);
  if (pos === 0) return lang === 'english' ? 'Janmasthan (Start)' : 'जन्मस्थान';
  if (typeof pos === 'string') return pos;
  return names[pos] ? `${pos} — ${names[pos]}` : `${pos}`;
}
