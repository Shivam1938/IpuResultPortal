// import { gradeFromMarks } from "./grade.js";

// // stresult rows are raw arrays straight from the IPU payload. The backend
// // only guarantees index 1 = subject code and index 5 = total marks
// // (see backend/src/utils/calculateGpa.js), so that's all we rely on for
// // numbers. Everything else is rendered generically via the `header` array.
// const CODE_IDX = 1;
// const MARKS_IDX = 5;

// function headerLabel(entry) {
//   if (entry == null) return "";
//   if (typeof entry === "string") return entry;
//   return entry.name || entry.label || entry.title || String(entry);
// }

// /**
//  * Tries to find which column of a stresult row corresponds to a semantic
//  * field, by matching keywords against the header labels the backend
//  * forwards straight from IPU. Falls back gracefully when it can't tell.
//  */
// export function detectColumns(header) {
//   const labels = (header || []).map((h) => headerLabel(h).toLowerCase());

//   const find = (...keywords) =>
//     labels.findIndex((label) => keywords.some((k) => label.includes(k)));

//   return {
//     code: find("paper", "code") !== -1 ? find("paper", "code") : CODE_IDX,
//     name: find("subject", "name", "paper name"),
//     credit: find("credit"),
//     internal: find("internal"),
//     external: find("external"),
//     total: find("total", "marks") !== -1 ? find("total", "marks") : MARKS_IDX,
//     grade: find("grade"),
//   };
// }

// export function subjectMarks(row) {
//   const val = parseInt(row?.[MARKS_IDX], 10);
//   return Number.isNaN(val) ? 0 : val;
// }

// /**
//  * Grade distribution for one semester's subject rows, computed with the
//  * same thresholds the backend uses for SGPA.
//  */
// export function semesterGradeDistribution(stresult = []) {
//   const counts = {};
//   let passCount = 0;
//   let topCount = 0;

//   stresult.forEach((row) => {
//     const marks = subjectMarks(row);
//     const grade = gradeFromMarks(marks);
//     counts[grade.letter] = (counts[grade.letter] || 0) + 1;
//     if (grade.point > 0) passCount += 1;
//     if (grade.point >= 9) topCount += 1;
//   });

//   const total = stresult.length;
//   let mostCommon = null;
//   Object.entries(counts).forEach(([letter, count]) => {
//     if (!mostCommon || count > mostCommon.count) mostCommon = { letter, count };
//   });

//   return {
//     subjectsCounted: total,
//     passCount,
//     passRate: total > 0 ? Math.round((passCount / total) * 100) : 0,
//     topGradeCount: topCount,
//     topGradePct: total > 0 ? Math.round((topCount / total) * 100) : 0,
//     mostCommon,
//     counts,
//   };
// }

// export function aggregateGradeDistribution(semesters = []) {
//   const allRows = semesters.flatMap((s) => s.stresult || []);
//   return semesterGradeDistribution(allRows);
// }

// export function marksObtained(stresult = []) {
//   return stresult.reduce((sum, row) => sum + subjectMarks(row), 0);
// }

// /**
//  * Running CGPA / credits as of each semester, using a credit-weighted
//  * average of each semester's own SGPA (standard cumulative GPA method).
//  */
// export function cumulativeBreakdown(semesters = []) {
//   let creditPointSum = 0;
//   let creditSum = 0;

//   return semesters.map((sem, idx) => {
//     const sgpa = sem.analytics?.sgpa || 0;
//     const credits = sem.analytics?.totalCredits || 0;

//     creditPointSum += sgpa * credits;
//     creditSum += credits;

//     const upToNow = semesters.slice(0, idx + 1);
//     const cgpa = creditSum > 0 ? parseFloat((creditPointSum / creditSum).toFixed(2)) : 0;

//     return {
//       label: `Sem ${upToNow.map((s) => s.semester).join("+")}`,
//       marksObtained: upToNow.reduce((sum, s) => sum + marksObtained(s.stresult), 0),
//       subjects: upToNow.reduce((sum, s) => sum + (s.stresult?.length || 0), 0),
//       credits: creditSum,
//       cgpa,
//       percentage: parseFloat((cgpa * 9.5).toFixed(2)),
//     };
//   });
// }

// /**
//  * Groups semesters two-at-a-time into academic years and credit-weights
//  * the SGPA across the pair.
//  */
// export function yearwiseBreakdown(semesters = []) {
//   const years = [];
//   for (let i = 0; i < semesters.length; i += 2) {
//     const chunk = semesters.slice(i, i + 2);
//     const credits = chunk.reduce((sum, s) => sum + (s.analytics?.totalCredits || 0), 0);
//     const creditPoints = chunk.reduce(
//       (sum, s) => sum + (s.analytics?.sgpa || 0) * (s.analytics?.totalCredits || 0),
//       0
//     );
//     const gpa = credits > 0 ? parseFloat((creditPoints / credits).toFixed(2)) : 0;

//     years.push({
//       year: `Year ${years.length + 1}`,
//       semesters: chunk.map((s) => s.semester),
//       marksObtained: chunk.reduce((sum, s) => sum + marksObtained(s.stresult), 0),
//       subjects: chunk.reduce((sum, s) => sum + (s.stresult?.length || 0), 0),
//       credits,
//       gpa,
//       percentage: parseFloat((gpa * 9.5).toFixed(2)),
//     });
//   }
//   return years;
// }

// /**
//  * Renders an arbitrary stprofile object into a clean list of label/value
//  * pairs without assuming exact key names from the upstream IPU payload.
//  */
// export function profileEntries(stprofile) {
//   if (!stprofile || typeof stprofile !== "object") return [];

//   const prettify = (key) =>
//     key
//       .replace(/([a-z])([A-Z])/g, "$1 $2")
//       .replace(/[_-]+/g, " ")
//       .replace(/\s+/g, " ")
//       .trim()
//       .replace(/\b\w/g, (c) => c.toUpperCase());

//   return Object.entries(stprofile)
//     .filter(([, value]) => value !== null && value !== undefined && value !== "")
//     .map(([key, value]) => ({ key, label: prettify(key), value: String(value) }));
// }

// /**
//  * Best-effort guess at the student's display name from stprofile, trying
//  * the common key spellings IPU-style payloads tend to use.
//  */
// export function guessName(stprofile) {
//   if (!stprofile) return null;
//   const keys = ["studentName", "stuName", "name", "studName", "fullName"];
//   for (const k of keys) {
//     if (stprofile[k]) return stprofile[k];
//   }
//   const entries = profileEntries(stprofile);
//   const nameEntry = entries.find((e) => e.key.toLowerCase().includes("name"));
//   return nameEntry ? nameEntry.value : null;
// }

// export { headerLabel };


import { gradeFromMarks } from "./grade.js";

// stresult rows are raw arrays straight from the IPU payload. The backend
// only guarantees index 1 = subject code and index 5 = total marks
// (see backend/src/utils/calculateGpa.js), so that's all we rely on for
// numbers. Everything else is rendered generically via the `header` array.
const CODE_IDX = 1;
const MARKS_IDX = 5;

function headerLabel(entry) {
  if (entry == null) return "";
  if (typeof entry === "string") return entry;
  return entry.name || entry.label || entry.title || String(entry);
}

/**
 * Tries to find which column of a stresult row corresponds to a semantic
 * field, by matching keywords against the header labels the backend
 * forwards straight from IPU. Falls back gracefully when it can't tell.
 */
export function detectColumns(header) {
  const labels = (header || []).map((h) => headerLabel(h).toLowerCase());

  const find = (...keywords) =>
    labels.findIndex((label) => keywords.some((k) => label.includes(k)));

  return {
    code: find("paper", "code") !== -1 ? find("paper", "code") : CODE_IDX,
    name: find("subject", "name", "paper name"),
    credit: find("credit"),
    internal: find("internal"),
    external: find("external"),
    total: find("total", "marks") !== -1 ? find("total", "marks") : MARKS_IDX,
    grade: find("grade"),
  };
}

export function subjectMarks(row) {
  const val = parseInt(row?.[MARKS_IDX], 10);
  return Number.isNaN(val) ? 0 : val;
}

/**
 * Per-subject marks for one semester, shaped for the bar chart:
 * paper code, subject name (if the header exposes one), internal/external
 * split (when available) and the total.
 */
export function semesterSubjectBreakdown(sem) {
  const cols = detectColumns(sem?.header);
  return (sem?.stresult || []).map((row) => {
    const total = subjectMarks(row);
    const internal = cols.internal !== -1 ? parseInt(row?.[cols.internal], 10) : NaN;
    const external = cols.external !== -1 ? parseInt(row?.[cols.external], 10) : NaN;
    return {
      code: row?.[cols.code] ?? "—",
      name: cols.name !== -1 ? row?.[cols.name] : null,
      internal: Number.isNaN(internal) ? null : internal,
      external: Number.isNaN(external) ? null : external,
      total,
      grade: (cols.grade !== -1 && row?.[cols.grade]) || gradeFromMarks(total).letter,
    };
  });
}

/**
 * Grade distribution for one semester's subject rows, computed with the
 * same thresholds the backend uses for SGPA.
 */
export function semesterGradeDistribution(stresult = []) {
  const counts = {};
  let passCount = 0;
  let topCount = 0;
  let failCount = 0;
  let marksSum = 0;
  let highest = null;
  let lowest = null;

  stresult.forEach((row) => {
    const marks = subjectMarks(row);
    const grade = gradeFromMarks(marks);
    counts[grade.letter] = (counts[grade.letter] || 0) + 1;
    if (grade.point > 0) passCount += 1;
    else failCount += 1;
    if (grade.point >= 9) topCount += 1;
    marksSum += marks;
    highest = highest === null ? marks : Math.max(highest, marks);
    lowest = lowest === null ? marks : Math.min(lowest, marks);
  });

  const total = stresult.length;

  const breakdown = Object.entries(counts)
    .map(([letter, count]) => ({
      letter,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const mostCommon = breakdown[0] || null;

  return {
    subjectsCounted: total,
    passCount,
    passRate: total > 0 ? Math.round((passCount / total) * 100) : 0,
    failCount,
    topGradeCount: topCount,
    topGradePct: total > 0 ? Math.round((topCount / total) * 100) : 0,
    averageMarks: total > 0 ? parseFloat((marksSum / total).toFixed(1)) : 0,
    highestMarks: highest ?? 0,
    lowestMarks: lowest ?? 0,
    mostCommon,
    counts,
    breakdown,
  };
}

export function aggregateGradeDistribution(semesters = []) {
  const allRows = semesters.flatMap((s) => s.stresult || []);
  return semesterGradeDistribution(allRows);
}

export function marksObtained(stresult = []) {
  return stresult.reduce((sum, row) => sum + subjectMarks(row), 0);
}

/**
 * Running CGPA / credits as of each semester, using a credit-weighted
 * average of each semester's own SGPA (standard cumulative GPA method).
 */
export function cumulativeBreakdown(semesters = []) {
  let creditPointSum = 0;
  let creditSum = 0;

  return semesters.map((sem, idx) => {
    const sgpa = sem.analytics?.sgpa || 0;
    const credits = sem.analytics?.totalCredits || 0;

    creditPointSum += sgpa * credits;
    creditSum += credits;

    const upToNow = semesters.slice(0, idx + 1);
    const cgpa = creditSum > 0 ? parseFloat((creditPointSum / creditSum).toFixed(2)) : 0;

    return {
      label: `Sem ${upToNow.map((s) => s.semester).join("+")}`,
      marksObtained: upToNow.reduce((sum, s) => sum + marksObtained(s.stresult), 0),
      subjects: upToNow.reduce((sum, s) => sum + (s.stresult?.length || 0), 0),
      credits: creditSum,
      cgpa,
      percentage: parseFloat((cgpa * 9.5).toFixed(2)),
    };
  });
}

/**
 * Groups semesters two-at-a-time into academic years and credit-weights
 * the SGPA across the pair.
 */
export function yearwiseBreakdown(semesters = []) {
  const years = [];
  for (let i = 0; i < semesters.length; i += 2) {
    const chunk = semesters.slice(i, i + 2);
    const credits = chunk.reduce((sum, s) => sum + (s.analytics?.totalCredits || 0), 0);
    const creditPoints = chunk.reduce(
      (sum, s) => sum + (s.analytics?.sgpa || 0) * (s.analytics?.totalCredits || 0),
      0
    );
    const gpa = credits > 0 ? parseFloat((creditPoints / credits).toFixed(2)) : 0;

    years.push({
      year: `Year ${years.length + 1}`,
      semesters: chunk.map((s) => s.semester),
      marksObtained: chunk.reduce((sum, s) => sum + marksObtained(s.stresult), 0),
      subjects: chunk.reduce((sum, s) => sum + (s.stresult?.length || 0), 0),
      credits,
      gpa,
      percentage: parseFloat((gpa * 9.5).toFixed(2)),
    });
  }
  return years;
}

/**
 * Renders an arbitrary stprofile object into a clean list of label/value
 * pairs without assuming exact key names from the upstream IPU payload.
 */
export function profileEntries(stprofile) {
  if (!stprofile || typeof stprofile !== "object") return [];

  const prettify = (key) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return Object.entries(stprofile)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({ key, label: prettify(key), value: String(value) }));
}

/**
 * Best-effort guess at the student's display name from stprofile, trying
 * the common key spellings IPU-style payloads tend to use.
 */
export function guessName(stprofile) {
  if (!stprofile) return null;
  const keys = ["studentName", "stuName", "name", "studName", "fullName"];
  for (const k of keys) {
    if (stprofile[k]) return stprofile[k];
  }
  const entries = profileEntries(stprofile);
  const nameEntry = entries.find((e) => e.key.toLowerCase().includes("name"));
  return nameEntry ? nameEntry.value : null;
}

export { headerLabel };