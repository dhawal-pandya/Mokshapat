import { describe, it, expect } from 'vitest';
import { getCellGridPosition, getCellType, OVAL_POSITIONS } from '../utils/boardUtils';

describe('getCellGridPosition', () => {
  it('places cell 1 in the bottom-left area (first row, col 5)', () => {
    const pos = getCellGridPosition(1);
    // Cell 1 is in the bottom main row; gridRow is high (near ROWS), col 5
    expect(pos.gridCol).toBe(5);
    expect(pos.gridRow).toBeGreaterThan(10);
  });

  it('places cell 5 at the leftmost column of the first row', () => {
    const pos = getCellGridPosition(5);
    expect(pos.gridCol).toBe(1);
  });

  it('places cell 285 in the top-row centred layout', () => {
    const pos = getCellGridPosition(285);
    // 285 is in the custom centred rows, gridRow = 1
    expect(pos.gridRow).toBe(1);
  });

  it('places cell 283 at gridRow 1 (topmost)', () => {
    expect(getCellGridPosition(283).gridRow).toBe(1);
  });

  it('places cell 282 at gridRow 2', () => {
    expect(getCellGridPosition(282).gridRow).toBe(2);
  });

  it('returns different positions for adjacent grid cells', () => {
    const p6 = getCellGridPosition(6);
    const p7 = getCellGridPosition(7);
    // 6 and 7 are in the same row but adjacent columns (boustrophedon)
    expect(p6.gridRow).toBe(p7.gridRow);
    expect(p6.gridCol).not.toBe(p7.gridCol);
  });

  it('returns consistent position on repeated calls', () => {
    const a = getCellGridPosition(100);
    const b = getCellGridPosition(100);
    expect(a).toEqual(b);
  });
});

describe('getCellType', () => {
  it('cell 1 is "start"',   () => expect(getCellType(1)).toBe('start'));
  it('cell 236 is "moksha"', () => expect(getCellType(236)).toBe('moksha'));
  it('cell 285 is "final"',  () => expect(getCellType(285)).toBe('final'));
  it('cell 283 is "final"',  () => expect(getCellType(283)).toBe('final'));

  it('ladder-start cells are classified correctly', () => {
    // Cell 3 has a ladder (3→259)
    expect(getCellType(3)).toBe('ladder-start');
  });

  it('snake-head cells are classified correctly', () => {
    // Cell 263 has a snake to महानरक
    expect(getCellType(263)).toBe('snake-head');
  });

  it('dual cells (ladder end AND snake head) are classified as "dual"', () => {
    // Cell 259 is ladder-end (from 3) AND snake-head (259→103)
    expect(getCellType(259)).toBe('dual');
  });

  it('pure ladder-end cell is classified as "ladder-end"', () => {
    // Cell 49 is ladder-end (ladder from 9→49) and NOT a snake head
    expect(getCellType(49)).toBe('ladder-end');
  });

  it('ordinary cells are classified as "normal"', () => {
    // Cell 8 (Grihastha) has no ladder start/end or snake head/tail
    expect(getCellType(8)).toBe('normal');
  });
});

describe('OVAL_POSITIONS', () => {
  it('has exactly 15 positions for cells 234-248', () => {
    expect(OVAL_POSITIONS).toHaveLength(15);
  });

  it('each position has numeric left and top', () => {
    OVAL_POSITIONS.forEach((pos, i) => {
      expect(typeof pos.left, `pos[${i}].left`).toBe('number');
      expect(typeof pos.top,  `pos[${i}].top`).toBe('number');
      expect(isFinite(pos.left), `pos[${i}].left finite`).toBe(true);
      expect(isFinite(pos.top),  `pos[${i}].top finite`).toBe(true);
    });
  });

  it('positions are distributed around an oval (not all at the same point)', () => {
    const lefts = OVAL_POSITIONS.map(p => p.left);
    const uniqueLefts = new globalThis.Set(lefts.map(l => Math.round(l)));
    expect(uniqueLefts.size).toBeGreaterThan(5);
  });
});
