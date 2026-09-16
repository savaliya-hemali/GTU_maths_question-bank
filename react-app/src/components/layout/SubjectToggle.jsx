import { META } from "../../data/meta.js";

export default function SubjectToggle({ subject, onSubjectChange }) {
  return (
    <div className="subject-toggle" role="tablist" aria-label="Select Subject">
      {Object.keys(META).map((key) => (
        <button
          key={key}
          role="tab"
          aria-selected={subject === key}
          className={subject === key ? "active" : ""}
          onClick={() => onSubjectChange(key)}
          id={`subject-tab-${key}`}
        >
          {META[key].name}
        </button>
      ))}
    </div>
  );
}
