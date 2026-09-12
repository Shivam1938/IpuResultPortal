import { marksObtained } from "../utils/stats.js";

function StatBox({ label, value, unit, sub }) {
  return (
    <div className="flex-1 border-b border-ink-800 px-6 py-5 last:border-0 sm:border-b-0 sm:border-r sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-pulse sm:text-3xl">
        {value}
        {unit && <span className="ml-1.5 text-sm font-medium text-neutral-500">{unit}</span>}
      </p>
      <p className="mt-1 text-xs text-neutral-500">{sub}</p>
    </div>
  );
}

export default function SemesterStatStrip({ sem }) {
  const subjects = sem?.stresult?.length || 0;
  const obtained = marksObtained(sem?.stresult || []);
  const maxMarks = subjects * 100;

  return (
    <div className="panel flex flex-col sm:flex-row">
      <StatBox label="Marks" value={obtained} unit={`/ ${maxMarks}`} sub="Total Marks Obtained" />
      <StatBox label="SGPA" value={sem?.analytics?.sgpa?.toFixed(2) ?? "—"} sub="Semester Grade Point Average" />
      <StatBox
        label="Percentage"
        value={`${sem?.analytics?.percentage?.toFixed?.(2) ?? sem?.analytics?.percentage ?? "—"}%`}
        sub="Percentage of Marks Obtained"
      />
      <StatBox label="Total Credits" value={sem?.analytics?.totalCredits ?? "—"} sub="Total Credits for the Semester" />
    </div>
  );
}