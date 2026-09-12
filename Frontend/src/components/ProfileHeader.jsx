import { profileEntries, guessName } from "../utils/stats.js";
import { IconArrowLeft, IconDownload } from "./icons.jsx";

export default function ProfileHeader({ stprofile, overallCgpa, overallPercentage, onBack }) {
  const name = guessName(stprofile);
  const allEntries = profileEntries(stprofile);
  // Don't repeat the name field below the heading where we already show it.
  const entries = allEntries.filter((e) => e.value !== name);

  return (
    <div className="panel p-6 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="btn-ghost no-print">
          <IconArrowLeft />
          Back
        </button>
        <button onClick={() => window.print()} className="btn-ghost no-print">
          <IconDownload />
          Export PDF
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {name || "Student"}
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {entries.slice(0, 6).map((e) => (
              <div key={e.key} className="rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  {e.label}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-neutral-100">{e.value}</p>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-sm text-neutral-500">No additional profile details were returned.</p>
            )}
          </div>
        </div>

        <div className="flex min-w-[180px] flex-col justify-center rounded-2xl border border-pulse/25 bg-pulse/10 px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-pulse-dim">
            Cumulative GPA
          </p>
          <p className="mt-1 text-4xl font-extrabold text-pulse">{overallCgpa?.toFixed(2) ?? "—"}</p>
          <p className="text-xs text-neutral-400">Out of 10.0</p>
          {overallPercentage != null && (
            <p className="mt-2 text-xs text-neutral-400">≈ {overallPercentage}% aggregate</p>
          )}
        </div>
      </div>
    </div>
  );
}
