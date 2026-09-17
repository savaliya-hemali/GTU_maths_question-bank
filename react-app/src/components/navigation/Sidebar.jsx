import { useState, useMemo, useEffect, useRef } from "react";
import { SEMESTERS } from "../../data/meta.js";
import { getAllQuestions } from "../../data/questions.js";

export default function Sidebar({
  isOpen,
  onClose,
  allMeta,
  activeSubject,
  activeUnit,
  onSelectSubjectAndUnit,
  onSelectQuestion,
  savedCount,
  onViewBookmarks,
}) {
  const [globalSearch, setGlobalSearch] = useState("");
  const [expandedSemesters, setExpandedSemesters] = useState({ 1: true, 2: true, 3: true, 4: true });
  const searchInputRef = useRef(null);

  const handleClose = () => {
    setGlobalSearch("");
    onClose();
  };

  // Focus search input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Group all subjects by semester
  const subjectsBySemester = useMemo(() => {
    const grouped = {};
    for (const sem of SEMESTERS) {
      grouped[sem.id] = [];
    }

    Object.entries(allMeta).forEach(([key, meta]) => {
      const semId = meta.semester || 1;
      if (!grouped[semId]) grouped[semId] = [];
      grouped[semId].push({ key, ...meta });
    });

    return grouped;
  }, [allMeta]);

  // All questions across all subjects for global search
  const allQuestions = useMemo(() => {
    return getAllQuestions(allMeta);
  }, [allMeta]);

  // Filtered questions based on global search input
  const searchResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    if (!query) return [];
    return allQuestions
      .filter((q) => {
        const textMatch = q.text?.toLowerCase().includes(query);
        const sourceMatch = q.source?.toLowerCase().includes(query);
        const subjectMatch = q.subjectName?.toLowerCase().includes(query);
        return textMatch || sourceMatch || subjectMatch;
      })
      .slice(0, 30); // Show top 30 relevant matches
  }, [globalSearch, allQuestions]);

  const toggleSemesterExpand = (semId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semId]: !prev[semId],
    }));
  };

  const handleResultClick = (q) => {
    onSelectQuestion(q);
    handleClose();
  };

  const handleUnitClick = (subjectKey, unitNum) => {
    onSelectSubjectAndUnit(subjectKey, unitNum);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar-root" role="dialog" aria-modal="true" aria-label="Navigation & Question Search">
      {/* Dark backdrop overlay */}
      <div className="sidebar-backdrop" onClick={handleClose} aria-hidden="true" />

      {/* Slide-in drawer container */}
      <aside className="sidebar-drawer">
        {/* Drawer Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">🎓</span>
            <div>
              <h2 className="sidebar-title">GTU Question Bank</h2>
              <span className="sidebar-subtitle">Bachelor of Engineering (IT/COM)</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={handleClose}
            aria-label="Close navigation sidebar"
          >
            ✕
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="sidebar-search-section">
          <div className="sidebar-search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="sidebar-search-input"
              placeholder="Search questions across all semesters..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            {globalSearch && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setGlobalSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Drawer Content: Either Global Search Results or Semester Tree */}
        <div className="sidebar-content">
          {globalSearch.trim() ? (
            /* Search Results View */
            <div className="sidebar-search-results">
              <div className="results-header">
                <span className="results-count">
                  {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
                </span>
                <span className="results-hint">Click any question to open</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="no-search-results">
                  <div className="no-res-icon">🔍</div>
                  <p>No questions found matching "<strong>{globalSearch}</strong>"</p>
                  <span>Try searching by math formula, theorem name, or exam session (e.g. "W23", "Gauss").</span>
                </div>
              ) : (
                <div className="search-result-cards">
                  {searchResults.map((q) => (
                    <button
                      key={`${q.subject}-${q.id}`}
                      type="button"
                      className="search-result-card"
                      onClick={() => handleResultClick(q)}
                    >
                      <div className="result-card-badges">
                        <span className="res-sem-badge">Sem {q.semester}</span>
                        <span className="res-subject-badge">{q.subjectName || q.subject.toUpperCase()}</span>
                        <span className="res-unit-badge">Unit {q.unit}</span>
                        <span className="res-marks-badge">{q.marksNum}M</span>
                        {q.sessionClean && <span className="res-session-badge">{q.sessionClean}</span>}
                      </div>
                      <div className="result-card-text">
                        {q.text.length > 140 ? `${q.text.slice(0, 140)}...` : q.text}
                      </div>
                      <div className="result-card-source">
                        {q.source} · Q{q.qnum}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Semester Wise Navigation Tree */
            <div className="sidebar-tree">
              <div className="tree-section-header">
                <span className="tree-title">Semester Wise Subjects</span>
              </div>

              {SEMESTERS.map((sem) => {
                const subjects = subjectsBySemester[sem.id] || [];
                const isExpanded = expandedSemesters[sem.id];
                const hasSubjects = subjects.length > 0;

                return (
                  <div key={sem.id} className={`semester-node ${isExpanded ? "expanded" : ""}`}>
                    <button
                      type="button"
                      className="semester-header-btn"
                      onClick={() => toggleSemesterExpand(sem.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className="sem-header-left">
                        <span className="sem-badge">Sem {sem.id}</span>
                        <span className="sem-name">{sem.label}</span>
                        <span className="sem-count">({subjects.length})</span>
                      </div>
                      <span className="sem-arrow">{isExpanded ? "▾" : "▸"}</span>
                    </button>

                    {isExpanded && (
                      <div className="semester-body">
                        {!hasSubjects ? (
                          <div className="empty-semester-row">
                            <span>No subjects added yet.</span>
                          </div>
                        ) : (
                          subjects.map((sub) => {
                            const isSubjectActive = activeSubject === sub.key;
                            return (
                              <div
                                key={sub.key}
                                className={`subject-item-block ${isSubjectActive ? "active-subject" : ""}`}
                              >
                                <div className="subject-row-main">
                                  <button
                                    type="button"
                                    className="subject-title-btn"
                                    onClick={() => handleUnitClick(sub.key, 1)}
                                  >
                                    <span className="subject-name">{sub.name}</span>
                                    {sub.code && <span className="subject-code-tag">{sub.code.split("/")[0]}</span>}
                                  </button>
                                </div>

                                {/* Units list under subject */}
                                <div className="subject-units-strip">
                                  {Object.keys(sub.units || {}).map((uStr) => {
                                    const uNum = parseInt(uStr);
                                    const isUnitActive = isSubjectActive && activeUnit === uNum;
                                    const uData = sub.units[uNum];
                                    return (
                                      <button
                                        key={uNum}
                                        type="button"
                                        className={`sidebar-unit-chip ${isUnitActive ? "active" : ""}`}
                                        onClick={() => handleUnitClick(sub.key, uNum)}
                                        title={`U${uNum}: ${uData?.title || ""}`}
                                      >
                                        <span className="chip-icon">{uData?.icon || "📘"}</span>
                                        <span>U{uNum}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="footer-btn secondary"
            onClick={() => {
              onViewBookmarks();
              onClose();
            }}
          >
            <span>⭐</span> Saved Questions ({savedCount})
          </button>
        </div>
      </aside>
    </div>
  );
}
