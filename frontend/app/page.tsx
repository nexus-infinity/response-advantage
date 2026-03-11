import {
  Branding,
  HealingJourney,
  GeometricNote,
  ActionButtons,
} from './components';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-20 px-8 bg-black">
        
        <Branding />

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
            Healing Through Geometric Accountability
          </h1>
          
          <p className="text-xl leading-relaxed text-zinc-300">
            When institutions gaslight you, chaos feels like your fault.
          </p>
          
          <p className="text-xl leading-relaxed text-zinc-300">
            <span className="text-white font-semibold">Upload the evidence.</span>{" "}
            Watch the geometric transformation reveal the pattern.{" "}
            <span className="text-white font-semibold">Get your power back.</span>
          </p>

          <HealingJourney />
          <GeometricNote />
        </div>

        <ActionButtons />
      </main>
    </div>
  );
}
