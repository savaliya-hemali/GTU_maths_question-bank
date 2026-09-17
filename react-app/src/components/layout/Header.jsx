import { BASE_META } from "../../data/meta.js";
import { DATA } from "../../data/questions.js";

export default function Header({ subject, allMeta, customQuestions }) {
  const metaMap = allMeta || BASE_META;
  const m = metaMap[subject] || BASE_META[subject] || {
    name: "Mathematics",
    eyebrow: "GTU · Gujarat Technological University",
    units: {},
    semester: 1,
  };

  const subjectQuestions = DATA[subject] || customQuestions?.[subject] || [];
  const sessions = [...new Set(subjectQuestions.map((q) => q.sessionClean).filter(Boolean))];
  const years = sessions
    .map((s) => {
      const match = s.match(/\d{4}/);
      return match ? parseInt(match[0], 10) : null;
    })
    .filter((y) => y !== null);

  const minY = years.length > 0 ? Math.min(...years) : 2021;
  const maxY = years.length > 0 ? Math.max(...years) : 2025;
  const totalUnits = Object.keys(m.units || {}).length || 5;

  return (
    <div className="header">
      <div className="eyebrow-row">
        <span className="eyebrow">{m.eyebrow}</span>
        <span className="header-sem-badge">Semester {m.semester || 1}</span>
      </div>
      <h1>{m.name} — Question Bank</h1>
      <div className="sub">
        {subjectQuestions.length > 0 ? (
          <>
            Papers: {minY} – {maxY} · {totalUnits} Units as per Current Syllabus · {subjectQuestions.length} Questions
          </>
        ) : (
          <>
            {totalUnits} Units as per GTU Syllabus · Custom Question Bank
          </>
        )}
      </div>
    </div>
  );
}
