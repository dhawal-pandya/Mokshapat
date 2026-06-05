import { useGameStore } from '../../store/gameStore';
import { Button }           from '../atoms/Button';
import { LanguageDropdown } from '../atoms/LanguageDropdown';
import { t }                from '../../utils/langUtils';

export function GamePanel() {
  const { language, slVisible, setSlVisible, resetGame,
          searchQuery, setSearchQuery } = useGameStore();

  return (
    <div className={[
      'bg-gradient-to-br from-parchment-200 to-parchment-300',
      'border-2 border-brown-500 rounded-xl px-3 py-2',
      'flex items-center gap-2 w-full max-w-[1100px] mx-auto',
      'shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
    ].join(' ')}>

      {/* Search — grows to fill available space */}
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder={t(language, 'searchPlaceholder')}
        className={[
          'flex-1 min-w-0 px-3 py-1.5 text-[13px] outline-none',
          'bg-gradient-to-br from-parchment-100 to-parchment-200',
          'border-2 border-brown-400 rounded-lg text-brown-800',
          'placeholder-brown-500/60',
          'focus:border-brown-600 focus:shadow-[0_0_5px_rgba(139,90,43,0.3)]',
          'transition-all duration-200',
        ].join(' ')}
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls — right side */}
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => void resetGame()}>
          {t(language, 'reset')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setSlVisible(!slVisible)}>
          {slVisible ? t(language, 'hideSnL') : t(language, 'showSnL')}
        </Button>
        <LanguageDropdown />
      </div>
    </div>
  );
}
