import DataTable from "./DataTable.jsx";
import { marksObtained } from "../utils/stats.js";

export default function ResultBreakdownTable({ semesters }) {
  const rows = semesters.map((s) => ({
    __key: s.semester,
    semester: `Sem ${s.semester}`,
    marks: marksObtained(s.stresult),
    subjects: s.stresult?.length ?? 0,
    credits: s.analytics?.totalCredits ?? 0,
    percentage: s.analytics?.percentage,
    sgpa: s.analytics?.sgpa,
  }));

  const columns = [
    { key: "semester", label: "Semester" },
    { key: "marks", label: "Marks obtained" },
    { key: "subjects", label: "Subjects" },
    { key: "credits", label: "Credits" },
    {
      key: "percentage",
      label: "Percentage",
      render: (r) => (r.percentage != null ? `${r.percentage}%` : "—"),
    },
    {
      key: "sgpa",
      label: "SGPA",
      render: (r) => <span className="font-bold text-pulse">{r.sgpa?.toFixed(2) ?? "—"}</span>,
    },
  ];

  return (
    <DataTable
      title="Result breakdown"
      subtitle="Semester-wise SGPA and marks obtained"
      columns={columns}
      rows={rows}
    />
  );
}
