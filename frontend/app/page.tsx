import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-20 px-8 bg-black">
        
        {/* Branding */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 tracking-wider">● ▼ ▲ ◼</div>
          <p className="text-sm text-zinc-500 tracking-wider">Pure function. Nothing else.</p>
        </div>

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

          {/* Healing Journey */}
          <div className="mt-12 w-full text-left space-y-6 text-zinc-400">
            <div className="border-l-2 border-zinc-700 pl-6 py-2">
              <div className="text-2xl mb-2">● OBSERVE</div>
              <p className="text-sm text-zinc-500">
                <span className="text-zinc-300">Acknowledgement:</span> "This happened. I'm not making it up."
              </p>
            </div>
            
            <div className="border-l-2 border-zinc-700 pl-6 py-2">
              <div className="text-2xl mb-2">▼ GROUND</div>
              <p className="text-sm text-zinc-500">
                <span className="text-zinc-300">Validation:</span> "The law says you were wronged."
              </p>
            </div>
            
            <div className="border-l-2 border-white pl-6 py-2">
              <div className="text-2xl mb-2 text-white">▲ RECOGNISE</div>
              <p className="text-sm text-zinc-400">
                <span className="text-white">Pattern Recognition:</span> "This wasn't random. It's a pattern."
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                ★ King's Chamber (φ⁻¹ = 38.2%) — Psychological breakthrough point
              </p>
            </div>
            
            <div className="border-l-2 border-zinc-700 pl-6 py-2">
              <div className="text-2xl mb-2">◼ ACT</div>
              <p className="text-sm text-zinc-500">
                <span className="text-zinc-300">Empowerment:</span> "I can do something about this."
              </p>
            </div>
          </div>

          {/* Technical Note */}
          <div className="mt-12 p-6 border border-zinc-800 rounded-lg text-sm text-zinc-500">
            <p className="mb-2 text-zinc-400">
              <strong>This is trauma resolution through geometric proof.</strong>
            </p>
            <p>
              Four alchemical stages. Four psychological transformations. 
              Eight geometric checkpoints (S0→S7). Pattern #47 detection at 94% confidence.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-16">
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-black transition-colors hover:bg-zinc-200 md:w-[200px] cursor-not-allowed opacity-75"
            disabled
            title="Coming soon"
          >
            Begin Journey
          </button>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-700 px-6 transition-colors hover:border-white hover:bg-zinc-900 md:w-[200px] text-zinc-300"
            href="https://github.com/nexus-infinity/response-advantage"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
