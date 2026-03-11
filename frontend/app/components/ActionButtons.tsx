/**
 * ActionButtons Component
 * 
 * Call-to-action buttons for user interaction:
 * - Begin Journey: Initiates the S0-S7 transformation process (coming soon)
 * - View on GitHub: Links to the open-source repository
 */

export default function ActionButtons() {
  return (
    <div className="flex w-full flex-col gap-3 text-base font-medium sm:flex-row sm:justify-center">
      <button
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 text-accent-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:w-44"
        disabled
        title="Coming soon"
      >
        Begin Journey
      </button>
      <a
        className="flex h-11 flex-1 items-center justify-center rounded-full border border-border px-6 text-muted transition-colors hover:border-foreground hover:text-foreground sm:flex-none sm:w-44"
        href="https://github.com/nexus-infinity/response-advantage"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </a>
    </div>
  );
}
