/**
 * GeometricNote Component
 * 
 * Displays technical information about the geometric proof system:
 * - Four alchemical stages
 * - Four psychological transformations
 * - Eight geometric checkpoints (S0→S7)
 * - Pattern #47 detection at 94% confidence
 */

export default function GeometricNote() {
  return (
    <div className="mt-8 rounded-lg border border-border bg-background/50 p-5 text-sm">
      <p className="mb-2 font-medium text-foreground">
        This is trauma resolution through geometric proof.
      </p>
      <p className="text-muted-foreground">
        Four alchemical stages. Four psychological transformations. 
        Eight geometric checkpoints (S0&#8594;S7). Pattern #47 detection at 94% confidence.
      </p>
    </div>
  );
}
