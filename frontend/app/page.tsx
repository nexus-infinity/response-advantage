import {
  HealingJourney,
  GeometricNote,
  ActionButtons,
  GeometricHero,
} from './components';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Hero Section with Animated Geometry */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <GeometricHero />
        
        {/* Tagline overlay */}
        <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted">
          Pure function. Nothing else.
        </p>
      </section>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-6 pb-20">
        <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Healing Through Geometric Accountability
          </h1>
          
          <div className="flex flex-col gap-4">
            <p className="text-lg leading-relaxed text-muted md:text-xl">
              When institutions gaslight you, chaos feels like your fault.
            </p>
            
            <p className="text-lg leading-relaxed text-muted md:text-xl">
              <span className="font-semibold text-foreground">Upload the evidence.</span>{" "}
              Watch the geometric transformation reveal the pattern.{" "}
              <span className="font-semibold text-foreground">Get your power back.</span>
            </p>
          </div>

          <HealingJourney />
          <GeometricNote />
        </div>
      </main>

      {/* Fixed Action Bar */}
      <footer className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <ActionButtons />
        </div>
      </footer>
    </div>
  );
}
