import { useState } from "react";
import { SEMESTERS } from "../../data/meta.js";

const DEFAULT_UNIT_ICONS = ["📐", "📈", "🔢", "🌐", "📦"];

export default function AddSubjectModal({
  isOpen,
  onClose,
  initialSemester = 1,
  onAddSubject,
}) {
  const [semester, setSemester] = useState(initialSemester || 1);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [code, setCode] = useState("");
  const [unitCount, setUnitCount] = useState(5);
  const [unitTitles, setUnitTitles] = useState({
    1: "Unit 1: Fundamentals & Theory",
    2: "Unit 2: Methods & Equations",
    3: "Unit 3: Applications & Analysis",
    4: "Unit 4: Advanced Theorems",
    5: "Unit 5: Applied Problems",
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleUnitTitleChange = (unitNum, value) => {
    setUnitTitles((prev) => ({ ...prev, [unitNum]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a subject name.");
      return;
    }

    const key =
      "custom_" +
      (shortName.trim() || name.trim())
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 10) +
      "_" +
      Date.now().toString(36);

    const units = {};
    for (let u = 1; u <= unitCount; u++) {
      units[u] = {
        title: unitTitles[u] || `Unit ${u}`,
        icon: DEFAULT_UNIT_ICONS[(u - 1) % DEFAULT_UNIT_ICONS.length],
        desc: `Questions and topics for Unit ${u} of ${name.trim()}`,
        weight: Math.round(100 / unitCount),
      };
    }

    const newSubject = {
      key,
      name: name.trim(),
      shortName: shortName.trim() || name.trim().slice(0, 12),
      semester: parseInt(semester, 10),
      code: code.trim() || "CUSTOM-GTU",
      eyebrow: `GTU · SEMESTER ${semester} · SUBJECT CODE: ${code.trim() || "GTU"}`,
      units,
      isCustom: true,
    };

    onAddSubject(newSubject);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">📚</span>
            <h3>Add Subject to Semester</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-banner">{error}</div>}

          {/* Semester selection */}
          <div className="form-group">
            <label htmlFor="subject-sem-select">Select GTU Semester *</label>
            <select
              id="subject-sem-select"
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value, 10))}
              className="form-select"
            >
              {SEMESTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.short})
                </option>
              ))}
            </select>
          </div>

          {/* Subject name */}
          <div className="form-group">
            <label htmlFor="subject-name-input">Subject Name *</label>
            <input
              id="subject-name-input"
              type="text"
              placeholder="e.g. Linear Algebra & Numerical Analysis"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className="form-input"
              required
            />
          </div>

          {/* Subject Code and Short Name in grid */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="subject-code-input">GTU Subject Code</label>
              <input
                id="subject-code-input"
                type="text"
                placeholder="e.g. 3130008"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject-short-input">Abbreviation / Short Name</label>
              <input
                id="subject-short-input"
                type="text"
                placeholder="e.g. LANA"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Unit setup */}
          <div className="form-group">
            <div className="units-header-row">
              <label>Syllabus Units ({unitCount} Units)</label>
              <div className="unit-count-selector">
                {[3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`unit-count-pill ${unitCount === count ? "active" : ""}`}
                    onClick={() => setUnitCount(count)}
                  >
                    {count} Units
                  </button>
                ))}
              </div>
            </div>

            <div className="unit-titles-list">
              {Array.from({ length: unitCount }, (_, i) => i + 1).map((u) => (
                <div key={u} className="unit-title-input-row">
                  <span className="unit-number-tag">U{u}</span>
                  <input
                    type="text"
                    value={unitTitles[u] || ""}
                    onChange={(e) => handleUnitTitleChange(u, e.target.value)}
                    placeholder={`Unit ${u} title...`}
                    className="form-input-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
