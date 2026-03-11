/**
 * HealingStage Component
 * 
 * Represents a single stage in the alchemical healing journey.
 * Maps to the S0-S7 geometric stages defined in GEOMETRIC_SPEC.md
 */

import type { HealingSymbol, PsychologicalProcess } from './types';

interface HealingStageProps {
  symbol: HealingSymbol;
  title: string;
  subtitle: PsychologicalProcess;
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
  return (
    <div 
      className={`border-l-2 py-3 pl-5 transition-colors ${
        isActive ? 'border-accent' : 'border-border'
      }`}
    >
      <div className={`mb-1 flex items-center gap-2 text-lg font-medium ${
        isActive ? 'text-accent' : 'text-foreground'
      }`}>
        <span className="text-xl">{symbol}</span>
        <span className="uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        <span className={isActive ? 'text-foreground' : 'text-muted'}>{subtitle}:</span>{' '}
        {description}
      </p>
      {note && (
        <p className="mt-1 text-xs text-accent/70">
          {note}
        </p>
      )}
    </div>
  );
}
