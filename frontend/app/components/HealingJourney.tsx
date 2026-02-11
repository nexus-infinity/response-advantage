/**
 * HealingJourney Component
 * 
 * The four-stage alchemical transformation journey:
 * 1. Nigredo (Acknowledgement) - ● OBSERVE
 * 2. Albedo (Validation) - ▼ GROUND
 * 3. Citrinitas (Pattern Recognition) - ▲ RECOGNISE [King's Chamber at φ⁻¹ = 38.2%]
 * 4. Rubedo (Empowerment) - ◼ ACT
 * 
 * Each stage maps to specific geometric checkpoints (S0-S7) as defined in
 * GEOMETRIC_SPEC.md and HEALING_ARCHITECTURE.md
 */

import HealingStage from './HealingStage';

export default function HealingJourney() {
  return (
    <div className="mt-12 w-full text-left space-y-6 text-zinc-400">
      <HealingStage
        symbol="●"
        title="OBSERVE"
        subtitle="Acknowledgement"
        description="&quot;This happened. I&apos;m not making it up.&quot;"
      />
      
      <HealingStage
        symbol="▼"
        title="GROUND"
        subtitle="Validation"
        description="&quot;The law says you were wronged.&quot;"
      />
      
      <HealingStage
        symbol="▲"
        title="RECOGNISE"
        subtitle="Pattern Recognition"
        description="&quot;This wasn&apos;t random. It&apos;s a pattern.&quot;"
        note="★ King's Chamber (φ⁻¹ = 38.2%) — Psychological breakthrough point"
        isActive={true}
      />
      
      <HealingStage
        symbol="◼"
        title="ACT"
        subtitle="Empowerment"
        description="&quot;I can do something about this.&quot;"
      />
    </div>
  );
}
