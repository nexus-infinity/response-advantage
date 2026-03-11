/**
 * ActionButtons Component
 * 
 * Call-to-action buttons for user interaction:
 * - Begin Journey: Initiates the S0-S7 transformation process (coming soon)
 * - View on GitHub: Links to the open-source repository
 */

export default function ActionButtons() {
  return (
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
  );
}
