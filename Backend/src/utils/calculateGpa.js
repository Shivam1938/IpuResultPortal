import { getCreditForSubject } from "./creditMap.js";

const getGradePoint = (totalMarks) => {
  const marks = parseInt(totalMarks, 10);
  if (isNaN(marks)) return 0;

  if (marks >= 90) return 10;
  if (marks >= 75) return 9;
  if (marks >= 65) return 8;
  if (marks >= 55) return 7;
  if (marks >= 50) return 6;
  if (marks >= 45) return 5;
  if (marks >= 40) return 4;

  return 0;
};

const calculateSemesterGpa = (stresult, program = "BTECH_CSE") => {
  if (!stresult || stresult.length === 0) {

    return {
      sgpa: 0,
      percentage: 0,
      totalCredits: 0,
      totalMarks: 0,
      maxMarks: 0,
      totalCreditPoints: 0,
    };
  }

  let totalCreditPoints = 0;
  let totalCredits = 0;
  let totalMarks = 0;

  // stresult.forEach((subArray) => {
  //   console.log(
  //     "SUBJECT:",
  //     subArray[1],
  //     "MARKS:",
  //     subArray[5],
  //     "CREDIT:",
  //     getCreditForSubject(subArray[1]),
  //   );
  // });

  stresult.forEach((subArray) => {
    const subjectCode = subArray[1];
    const marks = parseInt(subArray[5], 10) || 0;

    const gradePoint = getGradePoint(marks);
    const credits = getCreditForSubject(subjectCode, program);

    totalCreditPoints += gradePoint * credits;
    totalCredits += credits;
    totalMarks += marks;
  });

  const sgpa =
    totalCredits > 0
      ? parseFloat((totalCreditPoints / totalCredits).toFixed(2))
      : 0;

  const maxMarks = stresult.length * 100;

  const percentage =
    maxMarks > 0 ? parseFloat(((totalMarks / maxMarks) * 100).toFixed(2)) : 0;

  return {
    sgpa,
    percentage,
    totalCredits,
    totalMarks,
    maxMarks,
    totalCreditPoints,
  };
};

export { calculateSemesterGpa };
