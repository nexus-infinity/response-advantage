"use client";

export function GeometricHero() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Outermost ring - rotating slowly */}
      <svg
        className="absolute w-[400px] h-[400px] animate-rotate-slow"
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
        />
        {/* Tick marks */}
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i * 5 * Math.PI) / 180;
          const x1 = 200 + 175 * Math.cos(angle);
          const y1 = 200 + 175 * Math.sin(angle);
          const x2 = 200 + 180 * Math.cos(angle);
          const y2 = 200 + 180 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={i % 9 === 0 ? "1" : "0.3"}
              className="text-muted-foreground"
            />
          );
        })}
      </svg>

      {/* Middle ring - counter-rotating */}
      <svg
        className="absolute w-[320px] h-[320px] animate-rotate-reverse"
        viewBox="0 0 320 320"
      >
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
        />
        <circle
          cx="160"
          cy="160"
          r="130"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-muted-foreground"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Inner static ring with glow */}
      <svg
        className="absolute w-[240px] h-[240px]"
        viewBox="0 0 240 240"
      >
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent animate-pulse-glow"
        />
        <circle
          cx="120"
          cy="120"
          r="95"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-accent/30"
        />
      </svg>

      {/* Center geometric shapes */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-float">
        {/* Four sacred shapes in sequence */}
        <div className="flex items-center gap-8">
          {/* Circle - Observe */}
          <div className="group relative">
            <svg className="w-12 h-12" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground transition-colors group-hover:text-accent"
              />
            </svg>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Observe
            </span>
          </div>

          {/* Triangle down - Ground */}
          <div className="group relative">
            <svg className="w-12 h-12" viewBox="0 0 48 48">
              <path
                d="M24 34L12 14L36 14Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground transition-colors group-hover:text-accent"
              />
            </svg>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ground
            </span>
          </div>

          {/* Triangle up - Recognise (King's Chamber) */}
          <div className="group relative">
            <svg className="w-12 h-12" viewBox="0 0 48 48">
              <path
                d="M24 14L36 34L12 34Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-accent"
              />
              {/* Inner golden ratio marker */}
              <circle
                cx="24"
                cy="26.6"
                r="2"
                fill="currentColor"
                className="text-accent animate-pulse-glow"
              />
            </svg>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Recognise
            </span>
          </div>

          {/* Square - Act */}
          <div className="group relative">
            <svg className="w-12 h-12" viewBox="0 0 48 48">
              <rect
                x="14"
                y="14"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-foreground transition-colors group-hover:text-accent"
              />
            </svg>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Act
            </span>
          </div>
        </div>
      </div>

      {/* Connecting lines to content sections */}
      <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 800 500">
        {/* Line from center to bottom left */}
        <line
          x1="400"
          y1="250"
          x2="100"
          y2="450"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border animate-draw-line"
          style={{ animationDelay: "1s" }}
        />
        <rect
          x="96"
          y="446"
          width="8"
          height="8"
          fill="currentColor"
          className="text-foreground"
        />

        {/* Line from center to bottom right */}
        <line
          x1="400"
          y1="250"
          x2="700"
          y2="450"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border animate-draw-line"
          style={{ animationDelay: "1.2s" }}
        />
        <rect
          x="696"
          y="446"
          width="8"
          height="8"
          fill="currentColor"
          className="text-foreground"
        />
      </svg>
    </div>
  );
}
