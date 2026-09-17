import { SEMESTERS } from "../../data/meta.js";

export default function SubjectToggle({
  subject,
  onSubjectChange,
  allMeta,
  selectedSemester,
  onSemesterChange,
}) {
  const metaMap = allMeta || {};
  const allSubjectKeys = Object.keys(metaMap);

  // Filter subjects based on selected semester ("All" or specific sem number)
  const filteredKeys = allSubjectKeys.filter((key) => {
    if (selectedSemester === "All") return true;
    return metaMap[key]?.semester === parseInt(selectedSemester, 10);
  });

  return (
    <div className="subject-selection-container">
      {/* Semester Filter Tabs Row */}
      <div className="semester-tabs-row" role="tablist" aria-label="Filter by Semester">
        <span className="semester-tabs-label">Semester:</span>
        <div className="semester-tabs-scroll">
          {SEMESTERS.slice(0, 7).map((sem) => (
            <button
              key={sem.id}
              type="button"
              role="tab"
              aria-selected={String(selectedSemester) === String(sem.id)}
              className={`sem-tab-pill ${String(selectedSemester) === String(sem.id) ? "active" : ""}`}
              onClick={() => onSemesterChange(sem.id)}
            >
              {sem.short}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Buttons Row */}
      <div className="subject-toggle" role="tablist" aria-label="Select Subject">
        {filteredKeys.length === 0 ? (
          <div className="no-subjects-hint">
            <span>No subjects in Semester {selectedSemester} yet.</span>
          </div>
        ) : (
          filteredKeys.map((key) => {
            const item = metaMap[key];
            const isActive = subject === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                className={`subject-btn ${isActive ? "active" : ""}`}
                onClick={() => onSubjectChange(key)}
                id={`subject-tab-${key}`}
              >
                <span className="sub-btn-sem">Sem {item?.semester || 1}</span>
                <span className="sub-btn-name">{item?.shortName || item?.name}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
