export default function SemesterTabs({ semesters, active, onChange }) {
  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        onClick={() => onChange("overall")}
        className={`tab-pill ${active === "overall" ? "tab-pill-active" : "tab-pill-inactive"}`}
      >
        Overall
      </button>
      {semesters.map((sem) => (
        <button
          key={sem.semester}
          onClick={() => onChange(sem.semester)}
          className={`tab-pill ${active === sem.semester ? "tab-pill-active" : "tab-pill-inactive"}`}
        >
          Sem {sem.semester}
        </button>
      ))}
    </div>
  );
}
