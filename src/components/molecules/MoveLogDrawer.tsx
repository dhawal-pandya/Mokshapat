import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export function MoveLogDrawer() {
  const moveLog = useGameStore(s => s.moveLog);
  const [open, setOpen]   = useState(false);

  const count = moveLog.length;

  return (
    <div className="w-full max-w-[900px]">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        className={[
          'w-full flex items-center justify-between px-4 py-2',
          'bg-gradient-to-br from-parchment-200 to-parchment-300',
          'border-2 border-brown-500 text-brown-700 font-bold text-[14px]',
          open ? 'rounded-t-xl' : 'rounded-xl',
          'shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-200',
          'hover:from-parchment-100 hover:to-parchment-200',
        ].join(' ')}
      >
        <span>🗂 Move History{count > 0 ? ` — ${count} moves` : ''}</span>
        <span className="text-[18px] leading-none">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={[
          'border-2 border-t-0 border-brown-500 rounded-b-xl',
          'bg-parchment-100/95 px-4 py-3',
          'max-h-[260px] overflow-y-auto',
        ].join(' ')}>
          {count === 0 ? (
            <p className="text-brown-500 text-[13px] italic">No moves yet.</p>
          ) : (
            <ol className="list-none space-y-1">
              {moveLog.map((entry, i) => {
                const moveNum = count - i;
                const isLadder = entry.includes('🪜');
                const isSnake  = entry.includes('🐍');
                const isWin    = entry.includes('🎊') || entry.includes('Moksha') || entry.includes('मोक्ष');
                return (
                  <li
                    key={i}
                    className={[
                      'text-[12px] flex gap-2 items-start py-0.5',
                      isWin    ? 'text-saddle font-bold' :
                      isLadder ? 'text-green-700' :
                      isSnake  ? 'text-red-700'   :
                      'text-brown-600',
                    ].join(' ')}
                  >
                    <span className="text-brown-400 text-[11px] w-6 text-right shrink-0 pt-[1px]">
                      {moveNum}.
                    </span>
                    <span>{entry}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
