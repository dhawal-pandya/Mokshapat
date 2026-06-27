import { LegendItem } from '../molecules/LegendItem';
import { useGameStore } from '../../store/gameStore';

export function Legend() {
  const language = useGameStore(s => s.language);
  const isEn = language === 'english';

  const items = [
    { style: { background: 'linear-gradient(145deg,#0277bd,#01579b)' },          label: isEn ? 'Start (Human)'            : 'प्रारम्भः (मनुष्यः)' },
    { style: { background: 'linear-gradient(145deg,#1b5e20,#2e7d32)' },          label: isEn ? 'Ladder Start'             : 'सोपान-आरम्भः' },
    { style: { background: 'linear-gradient(145deg,#1b3a1b,#254a25)' },          label: isEn ? 'Ladder End'               : 'सोपान-अन्तः' },
    { style: { background: 'linear-gradient(145deg,#b71c1c,#c62828)' },          label: isEn ? 'Snake Head'               : 'सर्प-मुखम्' },
    { style: { background: 'linear-gradient(145deg,#3a1b1b,#4a2525)' },          label: isEn ? 'Snake Tail'               : 'सर्प-पुच्छम्' },
    { style: { background: 'linear-gradient(135deg,#1b5e20 50%,#b71c1c 50%)' },  label: isEn ? 'Ladder End + Snake Head'  : 'सोपान-अन्तः + सर्प-मुखम्' },
    { style: { background: 'linear-gradient(145deg,#f9a825,#f57f17)' },          label: isEn ? 'Moksha (Liberation)'      : 'मोक्षः' },
    { style: { background: 'linear-gradient(145deg,#6a1b9a,#8e24aa)' },          label: isEn ? 'Final Goal (285)'         : 'अन्तिमं ध्येयम् (285)' },
    { style: { background: 'linear-gradient(145deg,#4a0000,#6d0000)', border: '1px solid #ff1744' }, label: isEn ? 'Mahanarak (Great Hell)' : 'महानरकः' },
    { style: { background: 'linear-gradient(145deg,#3a0a0a,#501a1a)', border: '1px solid #e57373' }, label: isEn ? 'Kshudranarak'          : 'क्षुद्रनरकः' },
    { style: { background: 'linear-gradient(145deg,#1a0033,#33004d)', border: '1px solid #ce93d8' }, label: isEn ? 'Mrutyu (Death)'        : 'मृत्युः / मरणम्' },
    { style: { background: 'linear-gradient(145deg,#8fbc8f,#6b8e6b)', border: '1px solid #4a7c4a' }, label: isEn ? 'Offboard (Side Houses)' : 'पार्श्व-गृहाणि' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-3 p-2.5 bg-gradient-to-br from-parchment-100 to-parchment-200 rounded-lg border-2 border-brown-500/50 shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
      {items.map((item, i) => (
        <LegendItem key={i} swatchStyle={item.style} label={item.label} />
      ))}
    </div>
  );
}
