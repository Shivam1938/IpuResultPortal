export default function DataTable({ title, subtitle, columns, rows, rightSlot }) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700 px-6 py-5">
        <div>
          <h3 className="text-base font-bold text-neutral-50">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>}
        </div>
        {rightSlot}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.__key ?? i}
                className="border-b border-ink-800/70 transition-colors last:border-0 hover:bg-ink-800/40"
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-6 py-3.5 text-neutral-200">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-neutral-500">
                  Nothing to show yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
