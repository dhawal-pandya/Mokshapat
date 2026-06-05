import type { Language } from '../types';
import { cellNamesSanskrit } from '../data/cellNamesSanskrit';
import { cellNamesEnglish }  from '../data/cellNamesEnglish';

export function getCellNames(lang: Language): Record<number, string> {
  return lang === 'english' ? cellNamesEnglish : cellNamesSanskrit;
}

// Extract English meaning from parentheses: "Manushya (Human)" → "Human"
export function getEnglishMeaning(cellNum: number): string | null {
  const en = cellNamesEnglish[cellNum];
  if (!en) return null;
  const m = en.match(/\(([^)]+)\)/);
  return m?.[1] ?? null;
}

export const LANG_LABELS: Record<Language, { native: string; label: string }> = {
  english:  { native: 'English',   label: 'English'   },
  sanskrit: { native: 'संस्कृतम्', label: 'Sanskrit'  },
};

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  english: {
    ladder: 'Ladder', snake: 'Snake', from: 'from',
    rollDice: '🎲 Roll Dice', reset: '🔄 Reset',
    rollShort: 'Roll', resetShort: '🔄',
    hideSnL: '🪜🐍 Hide', showSnL: '🪜🐍 Show',
    position: 'Position:', rollToBegin: 'Roll to begin!',
    maranText: 'Maran (Death)', janmaText: 'Janmasthan (Start)',
    mahanarakText: 'Mahanarak (Great Hell)',
    kshudraText: 'Kshudranarak (Minor Hell)',
    mrutyuText: 'Mrutyu (Death/Grave)',
    shunyaText: 'Shunya Lok (Void World)',
    atmaText: 'Atmaparibhan Lok',
    behastText: 'Behast Lok (Paradise)',
    ladderTitle: 'Ladders', snakeTitle: 'Snakes',
    startCol: 'Start', endCol: 'End', headCol: 'Head', tailCol: 'Tail',
    searchPlaceholder: '🔍 Search cell number or name…',
    startGame: '🎲 Start Game',
    moksha: '🎊 Moksha! Liberation achieved! 🎊',
    autoOn: '⏸ Auto', autoOff: '▶ Auto',
    livesLabel: 'Lives', narakLabel: 'Narak',
  },
  sanskrit: {
    ladder: 'सोपानम्', snake: 'सर्पः', from: 'तः',
    rollDice: '🎲 पाशं क्षिप', reset: '🔄 पुनः',
    rollShort: 'क्षिप', resetShort: '🔄',
    hideSnL: '🪜🐍 गोपय', showSnL: '🪜🐍 दर्शय',
    position: 'स्थानम्:', rollToBegin: 'पाशं क्षिप्त्वा आरभ',
    maranText: 'मरणम्', janmaText: 'जन्मस्थानम्',
    mahanarakText: 'महानरकः',
    kshudraText: 'क्षुद्रनरकः',
    mrutyuText: 'मृत्युः',
    shunyaText: 'शून्यलोकः',
    atmaText: 'आत्मपरिभाणलोकः',
    behastText: 'बेहस्तलोकः',
    ladderTitle: 'सोपानानि', snakeTitle: 'सर्पाः',
    startCol: 'आदि', endCol: 'अन्त', headCol: 'मुखम्', tailCol: 'पुच्छम्',
    searchPlaceholder: '🔍 गृहसङ्ख्या वा नाम अन्वेष्टुम्…',
    startGame: '🎲 क्रीडाम् आरभ',
    moksha: '🎊 मोक्षः! मुक्तिः प्राप्ता! 🎊',
    autoOn: '⏸ स्वयम्', autoOff: '▶ स्वयम्',
    livesLabel: 'जन्मानि', narakLabel: 'नरकः',
  },
};

export function t(lang: Language, key: string): string {
  return TRANSLATIONS[lang][key] ?? TRANSLATIONS['english'][key] ?? key;
}
