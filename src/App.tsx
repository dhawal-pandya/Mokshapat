import { useGameStore } from './store/gameStore';
import { IntroScreen }    from './components/organisms/IntroScreen';
import { Board }          from './components/organisms/Board';
import { GamePanel }      from './components/organisms/GamePanel';
import { Legend }         from './components/organisms/Legend';
import { InfoPanels }     from './components/organisms/InfoPanels';
import { MoveLogDrawer }  from './components/molecules/MoveLogDrawer';

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
