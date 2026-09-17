export default function Navbar({
  onOpenSidebar,
  activeSubjectMeta,
  savedCount,
  onToggleSavedOnly,
  savedOnly,
}) {
  return (
    <header className="top-navbar">
      <div className="top-navbar-inner">
        <div className="navbar-left">
          <button
            type="button"
            className="menu-btn"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            title="Open Menu & Global Search"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
            <span className="menu-btn-label">Menu</span>
          </button>

          <div className="navbar-brand">
            <span className="brand-logo" aria-hidden="true">📐</span>
            <div className="brand-text">
              <span className="brand-title">GTU Question Bank</span>
              {activeSubjectMeta && (
                <span className="brand-semester-badge">
                  Sem {activeSubjectMeta.semester} · {activeSubjectMeta.shortName || activeSubjectMeta.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className={`nav-action-btn saved-btn ${savedOnly ? "active" : ""}`}
            onClick={onToggleSavedOnly}
            title="Toggle Bookmarked Questions"
          >
            <span>⭐</span>
            <span className="saved-badge">{savedCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
