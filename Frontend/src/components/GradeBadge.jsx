import { colorForGradeText } from "../utils/grade.js";

const COLOR_CLASSES = {
  "grade-o": "bg-grade-o/15 text-grade-o border-grade-o/30",
  "grade-aplus": "bg-grade-aplus/15 text-grade-aplus border-grade-aplus/30",
  "grade-a": "bg-grade-a/15 text-grade-a border-grade-a/30",
  "grade-bplus": "bg-grade-bplus/15 text-grade-bplus border-grade-bplus/30",
  "grade-b": "bg-grade-b/15 text-grade-b border-grade-b/30",
  "grade-c": "bg-grade-c/15 text-grade-c border-grade-c/30",
  "grade-f": "bg-grade-f/15 text-grade-f border-grade-f/30",
};

export default function GradeBadge({ grade }) {
  const colorKey = colorForGradeText(grade);
  const className = colorKey
    ? COLOR_CLASSES[colorKey]
    : "bg-ink-700 text-neutral-300 border-ink-600";

  return (
    <span
      className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-md border px-2 py-1 text-xs font-bold ${className}`}
    >
      {grade}
    </span>
  );
}
