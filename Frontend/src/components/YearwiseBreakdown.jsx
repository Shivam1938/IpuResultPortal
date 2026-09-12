import DataTable from "./DataTable.jsx";
import { yearwiseBreakdown } from "../utils/stats.js";

export default function YearwiseBreakdown({ semesters }) {
  const rows = yearwiseBreakdown(semesters).map((y) => ({
    __key: y.year,
    year: y.year,
    semesters: y.semesters.map((n) => `Sem ${n}`).join(" + "),
    marks: y.marksObtained,
    subjects: y.subjects,
    credits: y.credits,
    percentage: y.percentage,
    gpa: y.gpa,
  }));

  const columns = [
    { key: "year", label: "Year" },
    { key: "semesters", label: "Semesters" },
    { key: "marks", label: "Marks obtained" },
    { key: "credits", label: "Credits" },
    { key: "percentage", label: "Percentage", render: (r) => `${r.percentage}%` },
    {
      key: "gpa",
      label: "GPA",
      render: (r) => <span className="font-bold text-pulse">{r.gpa.toFixed(2)}</span>,
    },
  ];

  return (
    <DataTable
      title="Yearwise result breakdown"
      subtitle="Two semesters credit-weighted into each academic year"
      columns={columns}
      rows={rows}
    />
  );
}
