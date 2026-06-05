import { describe, it, expect } from 'vitest';
import {
  ladders, ladderStarts, ladderEnds, gameLadders, ladderToOffboard,
} from '../data/ladders';
import {
  snakes, snakeHeads, snakeTails, gameSnakes, snakeToHell,
} from '../data/snakes';

describe('ladders data', () => {
  it('has 73 ladders total', () => {
    expect(Object.keys(ladders)).toHaveLength(73);
  });

  it('key ladder 3 → 259 is correct', () => {
    expect(ladders[3]).toBe(259);
  });

  it('key ladder 280 → 285 (near-win ladder) exists', () => {
    expect(ladders[280]).toBe(285);
  });

  it('offboard ladder 38 → बेहस्त लोक', () => {
    expect(ladderToOffboard[38]).toBe('बेहस्त लोक');
  });

  it('offboard ladder 33 → शून्य लोक', () => {
    expect(ladderToOffboard[33]).toBe('शून्य लोक');
  });

  it('offboard ladder 55 → आत्मपरिभाण लोक', () => {
    expect(ladderToOffboard[55]).toBe('आत्मपरिभाण लोक');
  });

  it('ladderStarts contains all numeric ladder start cells', () => {
    expect(ladderStarts.has(3)).toBe(true);
    expect(ladderStarts.has(280)).toBe(true);
  });

  it('ladderEnds contains ladder destination cells', () => {
    expect(ladderEnds.has(259)).toBe(true);
    expect(ladderEnds.has(285)).toBe(true);
  });

  it('gameLadders only contains numeric destinations', () => {
    Object.values(gameLadders).forEach(v => {
      expect(typeof v).toBe('number');
    });
  });

  it('all gameLadder destinations are within board range 1-285', () => {
    Object.values(gameLadders).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(285);
    });
  });
});

describe('snakes data', () => {
  it('cell 11 snake goes to मरण', () => {
    expect(snakes[11]).toBe('मरण');
  });

  it('cell 259 snake goes to 103', () => {
    expect(snakes[259]).toBe(103);
  });

  it('cell 263 snake goes to महानरक', () => {
    expect(snakes[263]).toBe('महानरक');
  });

  it('snakeToHell maps include महानरक variants', () => {
    // Cell 263 → महानरक
    expect(snakeToHell[263]).toBe('महानरक');
  });

  it('gameSnakes only contains numeric destinations', () => {
    Object.values(gameSnakes).forEach(v => {
      expect(typeof v).toBe('number');
    });
  });

  it('all gameSnake destinations are within 1-285', () => {
    Object.values(gameSnakes).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(285);
    });
  });

  it('snakeHeads set contains cell 263', () => {
    expect(snakeHeads.has(263)).toBe(true);
  });

  it('snakeTails set contains cell 103 (tail of 259→103)', () => {
    expect(snakeTails.has(103)).toBe(true);
  });

  it('offboard snake: बेहस्त लोक → मृत्यू उर्फ कबर', () => {
    expect(snakes['बेहस्त लोक']).toBe('मृत्यू उर्फ कबर');
  });
});

describe('snake/ladder consistency', () => {
  it('no ladder start is the same as the board start cell (1)', () => {
    expect(ladderStarts.has(1)).toBe(false);
  });

  it('no ladder leads back to itself', () => {
    Object.entries(ladders).forEach(([s, e]) => {
      if (typeof e === 'number') expect(Number(s)).not.toBe(e);
    });
  });

  it('no snake leads back to itself', () => {
    Object.entries(snakes).forEach(([h, t]) => {
      if (typeof t === 'number') expect(Number(h)).not.toBe(t);
    });
  });

  it('all ladders lead upward (destination > start) for numeric destinations', () => {
    Object.entries(gameLadders).forEach(([s, e]) => {
      expect(e, `ladder ${s}→${e} should go up`).toBeGreaterThan(Number(s));
    });
  });

  it('most on-board snakes lead to lower cell numbers (254→256 is the one exception)', () => {
    // Snake 254→256 goes to a *higher* cell number (both are darkness-hell realms;
    // 256 represents deeper suffering, not positional reversal).
    const exceptions = new globalThis.Set([254]);
    Object.entries(gameSnakes).forEach(([h, t]) => {
      if (!exceptions.has(Number(h))) {
        expect(t, `snake ${h}→${t} should go down`).toBeLessThan(Number(h));
      }
    });
    // The one exception goes up
    expect(gameSnakes[254]).toBeGreaterThan(254);
  });
});
