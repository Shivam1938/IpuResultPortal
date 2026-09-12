import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { semesterSubjectBreakdown } from "../utils/stats.js";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const hasBreakdown = d.internal !== null && d.external !== null;

  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900 px-3.5 py-3 text-xs shadow-xl">
      <p className="text-neutral-500">{d.code}</p>
      <p className="mb-1.5 font-semibold text-neutral-100">{d.name || d.code}</p>
      <p className="text-neutral-300">Total: {d.total}/100</p>
      {hasBreakdown && (
        <>
          <p className="mt-1 text-pulse">Internal: {d.internal}</p>
          <p className="text-neutral-400">External: {d.external}</p>
        </>
      )}
    </div>
  );
}

export default function SemesterMarksChart({ sem }) {
  const data = semesterSubjectBreakdown(sem);
  const hasBreakdown = data.length > 0 && data.every((d) => d.internal !== null && d.external !== null);

  return (
    <div className="panel flex h-full flex-col p-5 sm:p-6">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-neutral-300">
        Semester statistics
      </h3>
      <p className="mb-4 text-xs text-neutral-500">Subject-wise marks distribution</p>
      <div className="h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#1e222c" vertical={false} />
            <XAxis
              dataKey="code"
              tick={{ fill: "#7c8395", fontSize: 11 }}
              axisLine={{ stroke: "#23262f" }}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              height={48}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#7c8395", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            {hasBreakdown ? (
              <>
                <Bar dataKey="internal" stackId="marks" fill="#9bd11f" />
                <Bar dataKey="external" stackId="marks" fill="#c3f53c" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <Bar dataKey="total" fill="#c3f53c" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}