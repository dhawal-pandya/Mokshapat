import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, getCellLabel } from '../store/gameStore';

function resetStore() {
  useGameStore.setState({
    playerPos: 0, gameOver: false, isAnimating: false,
    moveLog: [], mrutyuRollCount: 0, lastDiceValue: 0,
    language: 'english', slVisible: true, showIntro: true,
    autoPlay: false, highlightedCells: [], searchQuery: '',
  });
}

describe('getCellLabel', () => {
  it('returns start label for position 0 in English', () => {
    expect(getCellLabel(0, 'english')).toBe('Janmasthan (Start)');
  });

  it('returns start label for position 0 in Sanskrit', () => {
    expect(getCellLabel(0, 'sanskrit')).toBe('जन्मस्थान');
  });

  it('returns cell number and name for numeric position', () => {
    const label = getCellLabel(1, 'sanskrit');
    expect(label).toContain('1');
    expect(label).toContain('मनुष्य');
  });

  it('returns the string directly for special positions', () => {
    expect(getCellLabel('महानरक', 'sanskrit')).toBe('महानरक');
    expect(getCellLabel('मरण',    'english')).toBe('मरण');
  });
});

describe('store actions', () => {
  beforeEach(resetStore);

  it('initial state: player at position 0', () => {
    expect(useGameStore.getState().playerPos).toBe(0);
  });

  it('setLanguage updates language', () => {
    useGameStore.getState().setLanguage('english');
    expect(useGameStore.getState().language).toBe('english');
  });

  it('setSlVisible toggles SVG visibility', () => {
    useGameStore.getState().setSlVisible(false);
    expect(useGameStore.getState().slVisible).toBe(false);
  });

  it('setShowIntro hides the intro', () => {
    useGameStore.getState().setShowIntro(false);
    expect(useGameStore.getState().showIntro).toBe(false);
  });

  it('resetGame clears all game state', () => {
    useGameStore.setState({ playerPos: 50, gameOver: true, moveLog: ['test'] });
    useGameStore.getState().resetGame();
    const s = useGameStore.getState();
    expect(s.playerPos).toBe(0);
    expect(s.gameOver).toBe(false);
    expect(s.moveLog).toHaveLength(0);
    expect(s.lastDiceValue).toBe(0);
  });

  it('setHighlightedCells stores the array', () => {
    useGameStore.getState().setHighlightedCells([10, 20, 30]);
    expect(useGameStore.getState().highlightedCells).toEqual([10, 20, 30]);
  });

  it('clearHighlights empties the array', () => {
    useGameStore.setState({ highlightedCells: [5, 10] });
    useGameStore.getState().clearHighlights();
    expect(useGameStore.getState().highlightedCells).toHaveLength(0);
  });

  it('setSearchQuery stores the query', () => {
    useGameStore.getState().setSearchQuery('मनुष्य');
    expect(useGameStore.getState().searchQuery).toBe('मनुष्य');
  });
});

describe('rollDice basic behaviour', () => {
  beforeEach(resetStore);

  it('does nothing when isAnimating is true', async () => {
    useGameStore.setState({ isAnimating: true });
    await useGameStore.getState().rollDice();
    expect(useGameStore.getState().playerPos).toBe(0);
  });

  it('does nothing when gameOver is true', async () => {
    useGameStore.setState({ gameOver: true });
    await useGameStore.getState().rollDice();
    expect(useGameStore.getState().playerPos).toBe(0);
  });

  it('moves player from position 0 to 1 on first roll', async () => {
    await useGameStore.getState().rollDice();
    expect(useGameStore.getState().playerPos).toBe(1);
  }, 15000);

  it('lastDiceValue is set between 1 and 6 after a roll', async () => {
    await useGameStore.getState().rollDice();
    const val = useGameStore.getState().lastDiceValue;
    expect(val).toBeGreaterThanOrEqual(1);
    expect(val).toBeLessThanOrEqual(6);
  }, 15000);

  it('move log grows after a roll', async () => {
    await useGameStore.getState().rollDice();
    expect(useGameStore.getState().moveLog.length).toBeGreaterThan(0);
  }, 15000);
});
