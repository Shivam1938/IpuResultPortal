import { useState, useMemo } from "react";
import { detectColumns } from "../utils/stats.js";
import { gradeFromMarks } from "../utils/grade.js";
import GradeBadge from "./GradeBadge.jsx";

function SemesterTable({ sem, showBreakdown }) {
  const cols = useMemo(() => detectColumns(sem.header), [sem.header]);

  const displayColumns = useMemo(() => {
    const list = [];
    list.push({ label: "Paper code", get: (row) => row[cols.code] ?? "—" });
    if (cols.name !== -1) list.push({ label: "Subject name", get: (row) => row[cols.name] ?? "—" });
    if (cols.credit !== -1) list.push({ label: "Credits", get: (row) => row[cols.credit] ?? "—" });
    if (showBreakdown && cols.internal !== -1)
      list.push({ label: "Internal", get: (row) => row[cols.internal] ?? "—" });
    if (showBreakdown && cols.external !== -1)
      list.push({ label: "External", get: (row) => row[cols.external] ?? "—" });
    list.push({ label: "Total", get: (row) => row[cols.total] ?? "—" });
    list.push({
      label: "Grade",
      get: (row) => {
        const raw = cols.grade !== -1 ? row[cols.grade] : null;
        return raw || gradeFromMarks(row[cols.total]).letter;
      },
      isGrade: true,
    });
    return list;
  }, [cols, showBreakdown]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700 px-6 py-4">
        <h4 className="text-sm font-bold text-neutral-100">Semester {sem.semester}</h4>
        <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
          <span>
            Total: <b className="text-neutral-200">{sem.analytics?.totalCredits ?? "—"} credits</b>
          </span>
          <span>
            SGPA: <b className="text-pulse">{sem.analytics?.sgpa?.toFixed(2) ?? "—"}</b>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-700">
              {displayColumns.map((c) => (
                <th
                  key={c.label}
                  className="whitespace-nowrap px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(sem.stresult || []).map((row, i) => (
              <tr key={i} className="border-b border-ink-800/70 last:border-0 hover:bg-ink-800/40">
                {displayColumns.map((c) => (
                  <td key={c.label} className="whitespace-nowrap px-6 py-3 text-neutral-200">
                    {c.isGrade ? <GradeBadge grade={c.get(row)} /> : c.get(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DetailedResults({ semesters }) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const totalSubjects = semesters.reduce((sum, s) => sum + (s.stresult?.length ?? 0), 0);
  const isSingle = semesters.length === 1;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-neutral-50">
            {isSingle ? `Detailed results — semester ${semesters[0]?.semester}` : "Detailed results — all semesters"}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            Showing {totalSubjects} subject{totalSubjects === 1 ? "" : "s"} across {semesters.length} semester
            {semesters.length === 1 ? "" : "s"}
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300">
          Show marks breakdown
          <button
            type="button"
            role="switch"
            aria-checked={showBreakdown}
            onClick={() => setShowBreakdown((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              showBreakdown ? "bg-pulse" : "bg-ink-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink-950 transition-transform ${
                showBreakdown ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      <div className="space-y-5">
        {semesters.map((sem) => (
          <SemesterTable key={sem.semester} sem={sem} showBreakdown={showBreakdown} />
        ))}
      </div>
    </div>
  );
}
