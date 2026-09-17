import { BASE_META } from "../../data/meta.js";
import { DATA } from "../../data/questions.js";

const MARKS_COLORS = [
  { bg: "#DCEFE0", color: "#1f6b3a" },
  { bg: "#E6E0FB", color: "#4a3a9c" },
  { bg: "#FCE8D5", color: "#a15a1e" },
  { bg: "#DCEAF7", color: "#1f4e79" },
  { bg: "#FBE4EA", color: "#a13a5c" },
];

export default function UnitCard({ subject, unit, allMeta, customQuestions }) {
  const metaMap = allMeta || BASE_META;
  const currentSub = metaMap[subject] || BASE_META[subject] || {};
  const info = currentSub.units?.[unit] || {
    title: `Unit ${unit}`,
    icon: "📘",
    desc: "Questions and exam topics for this syllabus unit.",
  };

  const subjectQuestions = DATA[subject] || customQuestions?.[subject] || [];
  const all = subjectQuestions.filter((q) => q.unit === unit);
  const summerCount = all.filter((q) => q.season === "Summer").length;
  const winterCount = all.filter((q) => q.season === "Winter").length;

  const marksCounts = {};
  all.forEach((q) => {
    marksCounts[q.marksNum] = (marksCounts[q.marksNum] || 0) + 1;
  });
  const marksKeys = Object.keys(marksCounts)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="unit-card" style={{ background: `var(--u${unit}-bg, #eef2f6)`, color: `var(--u${unit}-fg, #1e293b)` }}>
      <div className="row">
        <div className="unit-icon">{info.icon}</div>
        <div>
          <h2>Unit {unit}: {info.title}</h2>
        </div>
      </div>
      <div className="desc">{info.desc}</div>
      <div className="chip-row">
        <span className="chip">☀️ {summerCount} Summer</span>
        <span className="chip">❄️ {winterCount} Winter</span>
      </div>
      {marksKeys.length > 0 && (
        <div className="chip-row">
          {marksKeys.map((k, i) => {
            const c = MARKS_COLORS[i % MARKS_COLORS.length];
            return (
              <span
                key={k}
                className="chip"
                style={{ background: c.bg, color: c.color }}
              >
                {marksCounts[k]} × {k}M
              </span>
            );
          })}
        </div>
      )}
      <span className="chip total">Total in Unit: {all.length}</span>
    </div>
  );
}
