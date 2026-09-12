import { fetchScrapedResult } from "../services/result.service.js";
import { calculateSemesterGpa } from "../utils/calculateGpa.js";

const getResultController = async (req, res, next) => {
  try {
    const { authCookie, semester, program = "BTECH_CSE" } = req.body;

    if (!authCookie) {
      return res.status(400).json({
        success: false,
        message: "Bhai, authCookie parameter pass karna mandatory hai!",
      });
    }

    const semTarget = semester !== undefined ? semester : "all";
    const rawJsonData = await fetchScrapedResult(authCookie, semTarget);

    let finalResponseData;

    if (semTarget === "all" && Array.isArray(rawJsonData)) {
      let creditPointSum = 0;
      let creditSum = 0;

      finalResponseData = rawJsonData.map((semBlock) => {
        const gpaStats = calculateSemesterGpa(semBlock.stresult, program);

        creditPointSum += gpaStats.totalCreditPoints;
        creditSum += gpaStats.totalCredits;

        return {
          ...semBlock,
          analytics: gpaStats,
        };
      });

      const overallCgpa =
        creditSum > 0 ? parseFloat((creditPointSum / creditSum).toFixed(2)) : 0;

      return res.status(200).json({
        success: true,
        message:
          "All semesters data with automatic GPA calculations retrieved!",
        overallCgpa: overallCgpa,
        overallPercentage: parseFloat((overallCgpa * 9.5).toFixed(2)),
        semesters: finalResponseData,
      });
    }

    const singleSemStats = calculateSemesterGpa(rawJsonData?.stresult, program);

    return res.status(200).json({
      success: true,
      message: `Semester ${semTarget} data with dynamic calculations!`,
      analytics: singleSemStats,
      data: rawJsonData,
    });
  } catch (error) {
    console.error("Result Calculation Controller Error:", error.message);
    next(error);
  }
};

export { getResultController };
