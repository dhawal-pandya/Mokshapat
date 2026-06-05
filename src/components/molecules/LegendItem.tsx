interface LegendItemProps {
  swatchStyle: React.CSSProperties;
  label: string;
}

export function LegendItem({ swatchStyle, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-brown-700">
      <div
        className="w-5 h-4 rounded-sm border border-brown-500/40 flex-shrink-0"
        style={swatchStyle}
      />
      <span>{label}</span>
    </div>
  );
}
