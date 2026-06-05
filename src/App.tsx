import { useGameStore } from './store/gameStore';
import { IntroScreen }    from './components/organisms/IntroScreen';
import { Board }          from './components/organisms/Board';
import { GamePanel }      from './components/organisms/GamePanel';
import { Legend }         from './components/organisms/Legend';
import { InfoPanels }     from './components/organisms/InfoPanels';
import { MoveLogDrawer }  from './components/molecules/MoveLogDrawer';
import { t }              from './utils/langUtils';

function LifeCounter() {
  const language   = useGameStore(s => s.language);
  const lifeCount  = useGameStore(s => s.lifeCount);
  const narakCount = useGameStore(s => s.narakCount);

  const stats = [
    { label: t(language, 'livesLabel'), value: lifeCount,  title: 'Times born as human (cell 1)' },
    { label: t(language, 'narakLabel'), value: narakCount, title: 'Narak + Mrutyu visits' },
  ];

  return (
    <div className={[
      'w-full max-w-[900px] px-4 py-2',
      'bg-gradient-to-br from-parchment-200 to-parchment-300',
      'border-2 border-brown-500 rounded-xl',
      'shadow-[0_2px_8px_rgba(0,0,0,0.12)]',
      'flex items-center justify-around',
    ].join(' ')}>
      {stats.map(({ label, value, title }) => (
        <div key={label} className="flex flex-col items-center" title={title}>
          <span className="text-[11px] text-brown-500">{label}</span>
          <span className="text-[16px] font-bold text-saddle leading-tight">
            {value || '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <p className="text-center text-brown-500 text-[12px] mt-6 mb-2">
      rebuilt with ❤️ by{' '}
      <a
        href="https://dhawal-pandya.github.io"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-saddle transition-colors"
      >
        Dhawal Pandya
      </a>
    </p>
  );
}

export function App() {
  const showIntro = useGameStore(s => s.showIntro);

  return (
    <div className="parchment-bg parchment-frame min-h-screen text-brown-800 font-sans">
      {showIntro && <IntroScreen />}

      <div className="px-[15px] pt-[15px]">
        {/* Page title */}
        <h1
          className="text-center text-[24px] font-bold text-saddle mb-3"
          style={{ textShadow: '1px 1px 2px rgba(139,69,19,0.3)' }}
        >
          Mokshapat
        </h1>

        {/* Single nav bar: search left · controls right */}
        <GamePanel />

        <div className="flex flex-col items-center gap-3 mt-3">
          {/* Board — dice panel floats inside the board */}
          <Board />

          {/* Legend */}
          <Legend />

          {/* Life counter */}
          <LifeCounter />

          {/* Move history — collapsible drawer */}
          <MoveLogDrawer />

          <p className="text-center text-brown-600 text-[11px] mt-1">
            ⬇ Bottom row: महानरक (Great Hell) · क्षुद्रनरक (Minor Hell) · मृत्यू उर्फ कबर (Death)
          </p>
        </div>

        {/* Info panels */}
        <InfoPanels />

        <Footer />
      </div>
    </div>
  );
}
