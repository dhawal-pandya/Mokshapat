import { LegendItem } from '../molecules/LegendItem';
import { useGameStore } from '../../store/gameStore';

export function Legend() {
  const language = useGameStore(s => s.language);
  const isEn = language === 'english';

  const items = [
    { style: { background: 'linear-gradient(145deg,#0277bd,#01579b)' },          label: isEn ? 'Start (Human)'            : 'Start (मनुष्य)' },
    { style: { background: 'linear-gradient(145deg,#1b5e20,#2e7d32)' },          label: isEn ? 'Ladder Start'             : 'शिडी सुरवात' },
    { style: { background: 'linear-gradient(145deg,#1b3a1b,#254a25)' },          label: isEn ? 'Ladder End'               : 'शिडी शेवट' },
    { style: { background: 'linear-gradient(145deg,#b71c1c,#c62828)' },          label: isEn ? 'Snake Head'               : 'सापाचे मुख' },
    { style: { background: 'linear-gradient(145deg,#3a1b1b,#4a2525)' },          label: isEn ? 'Snake Tail'               : 'सापाची शेपटी' },
    { style: { background: 'linear-gradient(135deg,#1b5e20 50%,#b71c1c 50%)' },  label: isEn ? 'Ladder End + Snake Head'  : 'शिडी शेवट + साप' },
    { style: { background: 'linear-gradient(145deg,#f9a825,#f57f17)' },          label: isEn ? 'Moksha (Liberation)'      : 'मोक्ष' },
    { style: { background: 'linear-gradient(145deg,#6a1b9a,#8e24aa)' },          label: isEn ? 'Final Goal (285)'         : 'अंतिम ध्येय (285)' },
    { style: { background: 'linear-gradient(145deg,#4a0000,#6d0000)', border: '1px solid #ff1744' }, label: isEn ? 'Mahanarak (Great Hell)' : 'महानरक' },
    { style: { background: 'linear-gradient(145deg,#3a0a0a,#501a1a)', border: '1px solid #e57373' }, label: isEn ? 'Kshudranarak'          : 'क्षुद्रनरक' },
    { style: { background: 'linear-gradient(145deg,#1a0033,#33004d)', border: '1px solid #ce93d8' }, label: isEn ? 'Mrutyu (Death)'        : 'मृत्यू/मरण' },
    { style: { background: 'linear-gradient(145deg,#8fbc8f,#6b8e6b)', border: '1px solid #4a7c4a' }, label: isEn ? 'Offboard (Side Houses)' : 'Offboard (Side Houses)' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-3 p-2.5 bg-brown-500/10 rounded-lg border border-brown-500/30">
      {items.map((item, i) => (
        <LegendItem key={i} swatchStyle={item.style} label={item.label} />
      ))}
    </div>
  );
}
