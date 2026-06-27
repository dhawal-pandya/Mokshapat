interface LegendItemProps {
  swatchStyle: React.CSSProperties;
  label: string;
}

export function LegendItem({ swatchStyle, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-brown-800">
      <div
        className="w-5 h-4 rounded-sm border border-brown-700/50 flex-shrink-0"
        style={swatchStyle}
      />
      <span>{label}</span>
    </div>
  );
}
