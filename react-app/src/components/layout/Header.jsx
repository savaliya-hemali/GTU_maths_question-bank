import { META } from "../../data/meta.js";
import { DATA } from "../../data/questions.js";

export default function Header({ subject, unit }) {
  const m = META[subject];
  const sessions = [...new Set(DATA[subject].map((q) => q.sessionClean))];
  const years = sessions.map((s) => parseInt(s.match(/\d{4}/)[0]));
  const minY = Math.min(...years);
  const maxY = Math.max(...years);

  return (
    <div className="header">
      <div className="eyebrow">{m.eyebrow}</div>
      <h1>{m.name} — Question Bank</h1>
      <div className="sub">
        Papers: {minY} – {maxY} · 5 Units as per Current Syllabus · Season
        Separated
      </div>
    </div>
  );
}
