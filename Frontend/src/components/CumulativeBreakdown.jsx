import DataTable from "./DataTable.jsx";
import { cumulativeBreakdown } from "../utils/stats.js";

export default function CumulativeBreakdown({ semesters }) {
  const rows = cumulativeBreakdown(semesters).map((row, idx) => ({
    __key: idx,
    label: row.label,
    marks: row.marksObtained,
    subjects: row.subjects,
    credits: row.credits,
    percentage: row.percentage,
    cgpa: row.cgpa,
  }));

  const columns = [
    { key: "label", label: "Through" },
    { key: "marks", label: "Marks obtained" },
    { key: "subjects", label: "Subjects" },
    { key: "credits", label: "Credits" },
    { key: "percentage", label: "Percentage", render: (r) => `${r.percentage}%` },
    {
      key: "cgpa",
      label: "CGPA",
      render: (r) => <span className="font-bold text-pulse">{r.cgpa.toFixed(2)}</span>,
    },
  ];

  return (
    <DataTable
      title="Cumulative result breakdown"
      subtitle="Running, credit-weighted CGPA as each semester is added"
      columns={columns}
      rows={rows}
    />
  );
}
