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

export default function OverallStatStrip({ data, semesters }) {
  const totalSubjects = semesters.reduce((sum, s) => sum + (s.stresult?.length || 0), 0);
  const totalMarks = semesters.reduce((sum, s) => sum + marksObtained(s.stresult || []), 0);
  const totalCredits = semesters.reduce((sum, s) => sum + (s.analytics?.totalCredits || 0), 0);
  const maxMarks = totalSubjects * 100;

  return (
    <div className="panel flex flex-col sm:flex-row">
      <StatBox label="Marks" value={totalMarks} unit={`/ ${maxMarks}`} sub="Total Marks Obtained" />
      <StatBox label="CGPA" value={data?.overallCgpa?.toFixed(2) ?? "—"} sub="Cumulative Grade Point Average" />
      <StatBox
        label="Percentage"
        value={`${data?.overallPercentage?.toFixed?.(2) ?? data?.overallPercentage ?? "—"}%`}
        sub="Overall Aggregate Percentage"
      />
      <StatBox label="Total Credits" value={totalCredits} sub="Total Credits Earned" />
    </div>
  );
}