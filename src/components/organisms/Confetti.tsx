import { useEffect, useState, type CSSProperties } from 'react';
import { useGameStore } from '../../store/gameStore';

const COLORS = ['#e7c168', '#d4452f', '#2f8f4e', '#3a7bd5', '#9b59b6', '#ffffff', '#e0b85a'];
const rand = (a: number, b: number) => a + Math.random() * (b - a);

// A celebratory burst from the two lower corners when the journey is completed.
export function Confetti() {
  const gameOver = useGameStore(s => s.gameOver);
  const [pieces, setPieces] = useState<{ id: number; style: CSSProperties }[]>([]);

  useEffect(() => {
    if (!gameOver) { setPieces([]); return; }

    const next = Array.from({ length: 140 }, (_, id) => {
      const left = id % 2 === 0;        // half from each corner
      const dir  = left ? 1 : -1;
      const style = {
        [left ? 'left' : 'right']: `${rand(0, 14)}%`,
        bottom: `${rand(0, 6)}%`,
        background: COLORS[id % COLORS.length],
        '--dx': `${dir * rand(18, 58)}vw`,
        '--dy': `-${rand(48, 88)}vh`,
        '--rot': `${rand(-720, 720)}deg`,
        animationDuration: `${rand(2.4, 3.8)}s`,
        animationDelay: `${rand(0, 0.6)}s`,
      } as CSSProperties;
      return { id, style };
    });
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 4500);
    return () => clearTimeout(t);
  }, [gameOver]);

  if (!pieces.length) return null;
  return (
    <div className="confetti-layer">
      {pieces.map(p => <span key={p.id} className="confetti-piece" style={p.style} />)}
    </div>
  );
}
