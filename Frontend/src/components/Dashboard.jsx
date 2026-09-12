import { useEffect, useState, useMemo } from "react";
import { getResult } from "../api/client.js";
import Loader from "./Loader.jsx";
import ProfileHeader from "./ProfileHeader.jsx";
import SemesterTabs from "./SemesterTabs.jsx";
import GpaTrendChart from "./GpaTrendChart.jsx";
import SemesterMarksChart from "./SemesterMarksChart.jsx";
import SemesterStatStrip from "./SemesterStatStrip.jsx";
import OverallStatStrip from "./OverallStatStrip.jsx";
import GradeDistribution from "./GradeDistribution.jsx";
import ResultBreakdownTable from "./ResultBreakdownTable.jsx";
import YearwiseBreakdown from "./YearwiseBreakdown.jsx";
import CumulativeBreakdown from "./CumulativeBreakdown.jsx";
import DetailedResults from "./DetailedResults.jsx";
import { aggregateGradeDistribution, semesterGradeDistribution } from "../utils/stats.js";
import { IconAlert, IconRefresh } from "./icons.jsx";

export default function Dashboard({ authCookie, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overall");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getResult({ authCookie, semester: "all" });
      if (!result?.success) throw new Error(result?.message || "Couldn't load your result.");
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCookie]);

  const semesters = data?.semesters || [];
  const stprofile = semesters[0]?.stprofile;

  const activeSemester = useMemo(
    () => semesters.find((s) => s.semester === activeTab),
    [semesters, activeTab]
  );

  const distributionStats = useMemo(() => {
    if (activeTab === "overall") return aggregateGradeDistribution(semesters);
    return semesterGradeDistribution(activeSemester?.stresult || []);
  }, [activeTab, semesters, activeSemester]);

  const visibleSemesters = activeTab === "overall" ? semesters : activeSemester ? [activeSemester] : [];

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loader label="Fetching your result from GGSIPU…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/30">
          <IconAlert width="24" height="24" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Couldn't load your result</h2>
          <p className="mt-1.5 text-sm text-neutral-400">{error}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="btn-primary">
            <IconRefresh />
            Try again
          </button>
          <button onClick={onLogout} className="btn-ghost">
            Sign in again
          </button>
        </div>
      </div>
    );
  }

  if (semesters.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-lg font-bold">No results published yet</h2>
        <p className="text-sm text-neutral-400">
          GGSIPU hasn't declared a result for any semester on this account yet.
        </p>
        <button onClick={onLogout} className="btn-ghost">
          Sign in again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <ProfileHeader
        stprofile={stprofile}
        overallCgpa={data.overallCgpa}
        overallPercentage={data.overallPercentage}
        onBack={onLogout}
      />

      <SemesterTabs semesters={semesters} active={activeTab} onChange={setActiveTab} />

      {activeTab === "overall" ? (
        <OverallStatStrip data={data} semesters={semesters} />
      ) : (
        activeSemester && <SemesterStatStrip sem={activeSemester} />
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {activeTab === "overall" ? (
          <GpaTrendChart semesters={semesters} />
        ) : activeSemester ? (
          <SemesterMarksChart sem={activeSemester} />
        ) : (
          <div className="panel flex items-center justify-center p-6 text-sm text-neutral-500">
            No data for this semester yet.
          </div>
        )}
        <GradeDistribution stats={distributionStats} />
      </div>

      {activeTab === "overall" && (
        <>
          <ResultBreakdownTable semesters={semesters} />
          <YearwiseBreakdown semesters={semesters} />
          <CumulativeBreakdown semesters={semesters} />
        </>
      )}

      <DetailedResults semesters={visibleSemesters} />
    </div>
  );
}