import { describe, it, expect } from 'vitest';
import { getCellNames, getEnglishMeaning, t } from '../utils/langUtils';
import { cellNamesSanskrit } from '../data/cellNamesSanskrit';
import { cellNamesEnglish }  from '../data/cellNamesEnglish';

describe('getCellNames', () => {
  it('returns Sanskrit names for "sanskrit"', () => {
    const names = getCellNames('sanskrit');
    expect(names[1]).toBe('मनुष्य');
    expect(names[236]).toBe('मोक्ष');
  });

  it('returns English names for "english"', () => {
    const names = getCellNames('english');
    expect(names[1]).toMatch(/Manushya/i);
  });

  it('both language maps cover all 285 cells', () => {
    for (const lang of ['english', 'sanskrit'] as const) {
      const names = getCellNames(lang);
      for (let i = 1; i <= 285; i++) {
        expect(names[i], `${lang} cell ${i}`).toBeTruthy();
      }
    }
  });
});

describe('getEnglishMeaning', () => {
  it('extracts meaning from parentheses', () => {
    expect(getEnglishMeaning(1)).toBe('Human');
  });

  it('returns null when no parenthesised meaning', () => {
    expect(getEnglishMeaning(150)).toBeNull();
  });
});

describe('t()', () => {
  it('returns correct English translation', () => {
    expect(t('english', 'rollDice')).toBe('🎲 Roll Dice');
  });

  it('returns correct Sanskrit translation', () => {
    expect(t('sanskrit', 'rollDice')).toBe('🎲 पाशं क्षिप');
  });

  it('falls back to key for unknown key', () => {
    expect(t('english', 'nonexistent_key')).toBe('nonexistent_key');
  });

  it('hideSnL and showSnL present in both languages', () => {
    for (const lang of ['english', 'sanskrit'] as const) {
      expect(t(lang, 'hideSnL')).toBeTruthy();
      expect(t(lang, 'showSnL')).toBeTruthy();
    }
  });

  it('autoOn and autoOff present in both languages', () => {
    for (const lang of ['english', 'sanskrit'] as const) {
      expect(t(lang, 'autoOn')).toBeTruthy();
      expect(t(lang, 'autoOff')).toBeTruthy();
    }
  });
});

describe('data file integrity', () => {
  it('cellNamesSanskrit covers 1-285', () => {
    for (let i = 1; i <= 285; i++) expect(cellNamesSanskrit[i], `cell ${i}`).toBeTruthy();
  });

  it('cellNamesEnglish covers 1-285', () => {
    for (let i = 1; i <= 285; i++) expect(cellNamesEnglish[i], `cell ${i}`).toBeTruthy();
  });
});
