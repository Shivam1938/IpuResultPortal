import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-neutral-200">{label}</p>
      <p className="text-pulse">SGPA: {payload[0].value?.toFixed(2)}</p>
    </div>
  );
}

export default function GpaTrendChart({ semesters }) {
  const data = semesters.map((s) => ({
    label: `Sem ${s.semester}`,
    sgpa: s.analytics?.sgpa || 0,
  }));

  return (
    <div className="panel flex h-full flex-col p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-300">
        SGPA trend
      </h3>
      <div className="h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#1e222c" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#7c8395", fontSize: 12 }}
              axisLine={{ stroke: "#23262f" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: "#7c8395", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#23262f" }} />
            <Line
              type="monotone"
              dataKey="sgpa"
              stroke="#c3f53c"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#c3f53c", stroke: "#08090c", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#c3f53c", stroke: "#08090c", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
