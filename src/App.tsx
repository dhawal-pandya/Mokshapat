import { useState } from 'react';
import { useGameStore, getCellLabel } from './store/gameStore';
import { IntroScreen }    from './components/organisms/IntroScreen';
import { Board }          from './components/organisms/Board';
import { GamePanel }      from './components/organisms/GamePanel';
import { Legend }         from './components/organisms/Legend';
import { InfoPanels }     from './components/organisms/InfoPanels';
import { MoveLogDrawer }  from './components/molecules/MoveLogDrawer';
import { PrintModal }     from './components/organisms/PrintModal';
import { Confetti }       from './components/organisms/Confetti';
import { t }              from './utils/langUtils';

function MobileControlsBar() {
  const {
    playerPos, isAnimating, gameOver, moveLog,
    language, autoPlay, setAutoPlay, rollDice, resetGame, lastDiceValue,
  } = useGameStore();

  const label   = getCellLabel(playerPos, language);
  const lastLog = moveLog[0] ?? t(language, 'rollToBegin');

  return (
    <div id="mobile-controls">
      {/* Status */}
      <div className="flex items-center justify-between gap-2 text-[11px] w-full">
        <span className="font-bold text-brown-700 truncate flex-1">{label}</span>
        <span className={[
          'truncate max-w-[45%] text-right',
          lastLog.includes('🪜') ? 'text-green-700' :
          lastLog.includes('🐍') ? 'text-red-700'   : 'text-brown-500',
        ].join(' ')}>{lastLog}</span>
      </div>

      {/* Countdown bar */}
      {autoPlay && !isAnimating && !gameOver && (
        <div className="countdown-track w-full">
          <div key={`${String(playerPos)}-${lastDiceValue}`} className="countdown-fill" />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 w-full">
        <button
          onClick={() => void rollDice()}
          disabled={isAnimating || gameOver}
          className={[
            'flex-1 py-2.5 text-[15px] font-bold rounded-lg',
            'bg-gradient-to-br from-parchment-400 to-parchment-500',
            'border-2 border-brown-500 text-brown-800',
            'shadow-md active:scale-95 transition-transform',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          🎲 {t(language, 'rollShort')}
        </button>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          disabled={gameOver}
          className={[
            'py-2 px-3 text-[12px] font-bold rounded-lg border-2 transition-all',
            autoPlay
              ? 'bg-green-100 border-green-600 text-green-800'
              : 'bg-brown-500/15 border-brown-500 text-brown-700',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          {autoPlay ? t(language, 'autoOn') : t(language, 'autoOff')}
        </button>
        <button
          onClick={() => void resetGame()}
          className="py-2 px-3 text-[12px] font-bold rounded-lg bg-brown-500/10 border-2 border-brown-500 text-brown-700"
        >
          {t(language, 'resetShort')}
        </button>
      </div>
    </div>
  );
}

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
    <p className="text-center text-parchment-300 text-[12px] mt-6 mb-2">
      rebuilt with ❤️ by{' '}
      <a
        href="https://dhawal-pandya.github.io"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-[#e0b85a] hover:text-[#f4d488] transition-colors"
      >
        Dhawal Pandya
      </a>
    </p>
  );
}

export function App() {
  const showIntro  = useGameStore(s => s.showIntro);
  const [showPrint, setShowPrint] = useState(false);

  return (
    <div className="parchment-bg parchment-frame min-h-screen text-brown-800 font-sans">
      {showIntro && <IntroScreen />}
      <MobileControlsBar />
      <Confetti />
      {showPrint && <PrintModal onClose={() => setShowPrint(false)} />}

      <div className="px-[15px] pt-[15px]">
        {/* Page title */}
        <h1
          className="font-display text-center text-[30px] font-bold mb-3 tracking-[0.18em]"
          style={{
            color: '#e7c168',
            textShadow: '0 1px 0 #5a3e12, 0 0 18px rgba(201,161,74,0.45), 0 2px 6px rgba(0,0,0,0.6)',
          }}
        >
          ॐ MOKSHAPAT ॐ
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

          <p className="text-center text-parchment-200 text-[11px] mt-1">
            ⬇ Bottom row: महानरक (Great Hell) · क्षुद्रनरक (Minor Hell) · मृत्यू उर्फ कबर (Death)
          </p>
        </div>

        {/* Print button */}
        <div className="max-w-[1360px] mx-auto mt-4">
          <button
            onClick={() => setShowPrint(true)}
            className={[
              'w-full py-2 text-[13px] font-bold rounded-xl',
              'bg-gradient-to-br from-parchment-200 to-parchment-300',
              'border-2 border-brown-500 text-brown-700',
              'hover:from-parchment-100 hover:to-parchment-200 transition-all duration-200',
              'shadow-[0_2px_8px_rgba(0,0,0,0.10)]',
            ].join(' ')}
          >
            🖨 Print / Download Board
          </button>
        </div>

        {/* Info panels */}
        <InfoPanels />

        <Footer />
      </div>
    </div>
  );
}
