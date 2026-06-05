import { useState } from 'react';
import { InfoTable } from '../molecules/InfoTable';
import { useGameStore } from '../../store/gameStore';

function AccordionSection({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-brown-500 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
      <button
        onClick={() => setOpen(o => !o)}
        className={[
          'w-full flex items-center justify-between px-4 py-2.5',
          'bg-gradient-to-br from-parchment-300 to-parchment-400',
          'text-brown-700 font-bold text-[14px]',
          'hover:from-parchment-200 hover:to-parchment-300 transition-all duration-200',
        ].join(' ')}
      >
        <span>{label}</span>
        <span className="text-[18px] leading-none">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="bg-parchment-100/95 max-h-[480px] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export function InfoPanels() {
  const language = useGameStore(s => s.language);
  const ladderLabel = language === 'english' ? '🪜 Ladders' : '🪜 सोपानानि';
  const snakeLabel  = language === 'english' ? '🐍 Snakes'  : '🐍 सर्पाः';

  return (
    <div className="max-w-[1360px] mx-auto mt-4 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AccordionSection label={ladderLabel}>
          <InfoTable type="ladders" />
        </AccordionSection>
        <AccordionSection label={snakeLabel}>
          <InfoTable type="snakes" />
        </AccordionSection>
      </div>
    </div>
  );
}
