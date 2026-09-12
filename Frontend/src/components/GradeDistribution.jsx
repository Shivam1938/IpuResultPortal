import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const GRADE_COLORS = {
  O: "#c3f53c",
  "A+": "#4ade80",
  A: "#60a5fa",
  "B+": "#fbbf24",
  B: "#fb923c",
  C: "#f87171",
  F: "#ef4444",
};

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-800/70 py-2 text-sm last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className={highlight ? "font-bold text-pulse" : "font-semibold text-neutral-100"}>{value}</span>
    </div>
  );
}

export default function GradeDistribution({ stats }) {
  const breakdown = stats.breakdown || [];
  const pieData = breakdown.length > 0 ? breakdown.map((g) => ({ name: g.letter, value: g.count })) : [{ name: "—", value: 1 }];

  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-neutral-300">
        Grade distribution
      </h3>
      <p className="mb-5 text-xs text-neutral-500">Breakdown of grades for this semester</p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="100%" paddingAngle={2} stroke="none">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={GRADE_COLORS[entry.name] || "#282d3a"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-neutral-50">{stats.mostCommon?.letter ?? "—"}</span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">Top grade</span>
          </div>
        </div>

        <div className="w-full flex-1">
          <Row label="Total subjects" value={stats.subjectsCounted} />
          <Row label="Pass rate" value={`${stats.passRate}%`} highlight />
          <Row label="Average marks" value={stats.averageMarks} />
          <Row label="Highest marks" value={stats.highestMarks} />
          <Row label="Lowest marks" value={stats.lowestMarks} />
          <Row label="Failed subjects" value={stats.failCount} />
          <Row label="Most common grade" value={stats.mostCommon?.letter ?? "—"} />

          {breakdown.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {breakdown.map((g) => (
                <span
                  key={g.letter}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink-600 bg-ink-900/60 px-2.5 py-1 text-xs"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: GRADE_COLORS[g.letter] || "#7c8395" }} />
                  <span className="font-semibold text-neutral-200">{g.letter}</span>
                  <span className="text-neutral-500">
                    {g.count} ({g.pct}%)
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}