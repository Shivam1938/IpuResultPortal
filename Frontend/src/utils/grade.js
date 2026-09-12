// Mirrors backend/src/utils/calculateGpa.js getGradePoint() thresholds,
// mapped to the IPU letter grades those point values represent.
export const GRADE_SCALE = [
  { min: 90, point: 10, letter: "O", color: "grade-o" },
  { min: 80, point: 9, letter: "A+", color: "grade-aplus" },
  { min: 70, point: 8, letter: "A", color: "grade-a" },
  { min: 60, point: 7, letter: "B+", color: "grade-bplus" },
  { min: 50, point: 6, letter: "B", color: "grade-b" },
  { min: 40, point: 5, letter: "C", color: "grade-c" },
  { min: -Infinity, point: 0, letter: "F", color: "grade-f" },
];

export function gradeFromMarks(totalMarks) {
  const marks = parseInt(totalMarks, 10);
  if (Number.isNaN(marks)) return GRADE_SCALE[GRADE_SCALE.length - 1];
  return GRADE_SCALE.find((g) => marks >= g.min);
}

const GRADE_COLOR_MAP = {
  O: "grade-o",
  "A+": "grade-aplus",
  A: "grade-a",
  "B+": "grade-bplus",
  B: "grade-b",
  C: "grade-c",
  D: "grade-c",
  F: "grade-f",
  P: "grade-b",
};

/**
 * Best-effort color lookup for a grade letter that may have come straight
 * from the raw IPU payload rather than our own computed scale.
 */
export function colorForGradeText(text) {
  if (!text) return null;
  const key = String(text).trim().toUpperCase();
  return GRADE_COLOR_MAP[key] || null;
}
