import type { Language } from '../../types';
import { useGameStore } from '../../store/gameStore';

const OPTIONS: { value: Language; label: string; short: string }[] = [
  { value: 'english',  label: 'English',   short: 'E'  },
  { value: 'sanskrit', label: 'संस्कृत', short: 'स'  },
];

export function LanguageDropdown() {
  const language    = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);

  return (
    <div
      role="group"
      aria-label="Select language"
      className={[
        'inline-flex rounded-full',
        'border-2 border-brown-500',
        'bg-parchment-400 overflow-hidden',
        'shadow-md text-[13px] font-bold',
      ].join(' ')}
    >
      {OPTIONS.map((opt, i) => {
        const active = language === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setLanguage(opt.value)}
            aria-pressed={active}
            className={[
              'px-3 py-1.5 cursor-pointer transition-all duration-200 outline-none',
              i === 0 ? '' : 'border-l-2 border-brown-500',
              active
                ? 'bg-saddle text-parchment-100 shadow-inner'
                : 'text-brown-700 hover:bg-parchment-300',
            ].join(' ')}
          >
            <span className="max-[480px]:hidden">{opt.label}</span>
            <span className="hidden max-[480px]:inline">{opt.short}</span>
          </button>
        );
      })}
    </div>
  );
}
