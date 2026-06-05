import { useGameStore } from '../../store/gameStore';
import { getCellNames } from '../../utils/langUtils';
import { t } from '../../utils/langUtils';
import { ladders } from '../../data/ladders';
import { snakes } from '../../data/snakes';

interface InfoTableProps {
  type: 'ladders' | 'snakes';
}

export function InfoTable({ type }: InfoTableProps) {
  const { language, setHighlightedCells } = useGameStore();
  const names = getCellNames(language);
  const isLadder = type === 'ladders';

  function highlight(num: number) {
    setHighlightedCells([num]);
  }

  if (isLadder) {
    const sorted = Object.entries(ladders).sort((a, b) => Number(a[0]) - Number(b[0]));
    return (
      <div className={[
        'bg-parchment-200/40 rounded-lg p-3 max-h-[500px] overflow-y-auto',
        'border border-brown-500/30',
      ].join(' ')}>
        <h2 className="text-[18px] mb-2 pb-1.5 border-b-2 border-green-700 text-green-700 font-bold">
          🪜 {t(language, 'ladderTitle')} — {Object.keys(ladders).length} Total
        </h2>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="text-left p-1 bg-brown-500/20 text-brown-700 sticky top-0">#</th>
              <th className="text-left p-1 bg-brown-500/20 text-brown-700 sticky top-0">{t(language, 'startCol')}</th>
              <th className="p-1 bg-brown-500/20 text-brown-700 sticky top-0">→</th>
              <th className="text-left p-1 bg-brown-500/20 text-brown-700 sticky top-0">{t(language, 'endCol')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([s, e]) => {
              const sn = Number(s);
              const endName = typeof e === 'number' ? `${e} — ${names[e] ?? ''}` : String(e);
              return (
                <tr
                  key={s}
                  className="hover:bg-brown-500/10 cursor-pointer"
                  onClick={() => highlight(sn)}
                >
                  <td className="p-0.5 pl-1.5 border-b border-brown-500/15 text-green-800">{s}</td>
                  <td className="p-0.5 pl-1.5 border-b border-brown-500/15 text-green-800">{names[sn]}</td>
                  <td className="p-0.5 text-center border-b border-brown-500/15">→</td>
                  <td className="p-0.5 pl-1.5 border-b border-brown-500/15 text-green-800">{endName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  const sorted = Object.entries(snakes).sort((a, b) => Number(b[0]) - Number(a[0]));
  return (
    <div className={[
      'bg-parchment-200/40 rounded-lg p-3 max-h-[500px] overflow-y-auto',
      'border border-brown-500/30',
    ].join(' ')}>
      <h2 className="text-[18px] mb-2 pb-1.5 border-b-2 border-red-700 text-red-700 font-bold">
        🐍 {t(language, 'snakeTitle')} — {Object.keys(snakes).length} Total
      </h2>
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="text-left p-1 bg-brown-500/20 text-brown-700 sticky top-0">#</th>
            <th className="text-left p-1 bg-brown-500/20 text-brown-700 sticky top-0">{t(language, 'headCol')}</th>
            <th className="p-1 bg-brown-500/20 text-brown-700 sticky top-0">→</th>
            <th className="text-left p-1 bg-brown-500/20 text-brown-700 sticky top-0">{t(language, 'tailCol')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(([h, t2]) => {
            const hn = Number(h);
            const headName = isNaN(hn) ? String(h) : (names[hn] ?? '');
            const tailName = typeof t2 === 'number' ? `${t2} — ${names[t2] ?? ''}` : String(t2);
            return (
              <tr
                key={h}
                className="hover:bg-brown-500/10 cursor-pointer"
                onClick={() => !isNaN(hn) && highlight(hn)}
              >
                <td className="p-0.5 pl-1.5 border-b border-brown-500/15 text-red-800">{h}</td>
                <td className="p-0.5 pl-1.5 border-b border-brown-500/15 text-red-800">{headName}</td>
                <td className="p-0.5 text-center border-b border-brown-500/15">→</td>
                <td className="p-0.5 pl-1.5 border-b border-brown-500/15 text-red-800">{tailName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
