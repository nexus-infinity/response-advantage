/**
 * HealingStage Component
 * 
 * Represents a single stage in the alchemical healing journey.
 * Maps to the S0-S7 geometric stages defined in GEOMETRIC_SPEC.md
 */

interface HealingStageProps {
  symbol: string;
  title: string;
  subtitle: string;
  description: string;
  note?: string;
  isActive?: boolean;
}

export default function HealingStage({
  symbol,
  title,
  subtitle,
  description,
  note,
  isActive = false
}: HealingStageProps) {
  const borderColor = isActive ? 'border-white' : 'border-zinc-700';
  const titleColor = isActive ? 'text-white' : '';
  const subtitleColor = isActive ? 'text-white' : 'text-zinc-300';
  const descriptionColor = isActive ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className={`border-l-2 ${borderColor} pl-6 py-2`}>
      <div className={`text-2xl mb-2 ${titleColor}`}>
        {symbol} {title}
      </div>
      <p className={`text-sm ${descriptionColor}`}>
        <span className={subtitleColor}>{subtitle}:</span> {description}
      </p>
      {note && (
        <p className="text-xs text-zinc-500 mt-1">
          {note}
        </p>
      )}
    </div>
  );
}
