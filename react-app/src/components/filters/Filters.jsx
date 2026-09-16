import { DATA } from "../../data/questions.js";

export default function Filters({
  subject,
  unit,
  season,
  marks,
  search,
  savedOnly,
  savedCount,
  newestFirst,
  onSeasonChange,
  onMarksChange,
  onSearchChange,
  onSavedToggle,
  onSortToggle,
}) {
  // Build sorted sessions list
  const sessions = [
    ...new Set(DATA[subject].map((q) => q.sessionClean)),
  ].sort((a, b) => {
    const ya = parseInt(a.match(/\d+/)[0]);
    const yb = parseInt(b.match(/\d+/)[0]);
    if (yb !== ya) return yb - ya;
    return a.startsWith("Winter") ? -1 : 1;
  });

  // Marks values for current unit
  const marksVals = [
    ...new Set(
      DATA[subject].filter((q) => q.unit === unit).map((q) => q.marksNum)
    ),
  ].sort((a, b) => a - b);

  return (
    <div className="filters">
      {/* Season */}
      <div className="filter-label">Season</div>
      <div className="select-wrap">
        <select
          id="seasonSelect"
          className="season-select"
          value={season}
          onChange={(e) => onSeasonChange(e.target.value)}
          aria-label="Filter by season"
        >
          {["All", ...sessions].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <svg className="select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Marks */}
      <div className="filter-label">Marks</div>
      <div className="marks-row">
        {["All", ...marksVals].map((m) => (
          <button
            key={m}
            className={"pill-btn" + (String(marks) === String(m) ? " active" : "")}
            onClick={() => onMarksChange(String(m))}
            aria-pressed={String(marks) === String(m)}
          >
            {m === "All" ? "All" : `${m} Marks`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          id="searchInput"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search questions"
        />
      </div>

      {/* Saved + Sort */}
      <div className="util-row">
        <button
          className={"pill-btn" + (savedOnly ? " active" : "")}
          id="savedBtn"
          onClick={onSavedToggle}
          aria-pressed={savedOnly}
        >
          ⭐ Saved (<span id="savedCount">{savedCount}</span>)
        </button>
        <button
          className="pill-btn"
          id="sortBtn"
          onClick={onSortToggle}
        >
          {newestFirst ? "Newest first" : "Oldest first"}
        </button>
      </div>
    </div>
  );
}
