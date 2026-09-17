import { useState, useCallback, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";

// Layout & Navigation components
import Navbar from "./components/layout/Navbar.jsx";
import Header from "./components/layout/Header.jsx";
import SubjectToggle from "./components/layout/SubjectToggle.jsx";
import TabBar from "./components/navigation/TabBar.jsx";
import Sidebar from "./components/navigation/Sidebar.jsx";

// Modals

// Question & Filter components
import UnitCard from "./components/questions/UnitCard.jsx";
import QuestionList from "./components/questions/QuestionList.jsx";
import Filters from "./components/filters/Filters.jsx";

// SEO
import SeoHead from "./components/seo/SeoHead.jsx";

// Custom Hooks
import useBookmarks from "./hooks/useBookmarks.js";
import useCustomSubjects from "./hooks/useCustomSubjects.js";

// Helper to initialize navigation from URL parameters
function getInitialNav() {
  if (typeof window === "undefined") return { subject: "m1", unit: 1, savedOnly: false };
  const params = new URLSearchParams(window.location.search);
  const s = params.get("subject") || "m1";
  const u = parseInt(params.get("unit"), 10) || 1;
  const savedOnly = params.get("saved") === "true";
  return { subject: s, unit: u, savedOnly };
}

export default function App() {
  const initialNav = getInitialNav();
  const [subject, setSubject] = useState(initialNav.subject);
  const [unit, setUnit] = useState(initialNav.unit);
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [season, setSeason] = useState("All");
  const [marks, setMarks] = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(initialNav.savedOnly);
  const [newestFirst, setNewestFirst] = useState(false);

  // Modals & Drawers state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Custom subjects and question bank hook
  const { allMeta, customQuestions } = useCustomSubjects();

  // Bookmarking custom hook
  const { bookmarks, toggleBookmark, getSavedCount } = useBookmarks();

  // Ensure initial history state is synchronized with the URL
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState(
        { subject, unit, savedOnly },
        "",
        window.location.search || `?subject=${subject}&unit=${unit}`
      );
    }
  }, [subject, unit, savedOnly]);

  // Subject change resets filters and pushes history
  const handleSubjectChange = useCallback((key) => {
    setSubject(key);
    setUnit(1);
    setSeason("All");
    setMarks("All");
    setTopic("All");
    setSearch("");
    setSavedOnly(false);

    const params = new URLSearchParams();
    params.set("subject", key);
    params.set("unit", 1);
    window.history.pushState(
      { subject: key, unit: 1, savedOnly: false },
      "",
      `?${params.toString()}`
    );
  }, []);

  // Semester change in tabs: filter subjects and switch subject if needed
  const handleSemesterChange = useCallback((sem) => {
    setSelectedSemester(sem);
    if (sem !== "All") {
      const semNum = parseInt(sem, 10);
      const currentSem = allMeta[subject]?.semester;
      if (currentSem !== semNum) {
        // Find first subject for this semester
        const firstInSem = Object.keys(allMeta).find(
          (k) => allMeta[k]?.semester === semNum
        );
        if (firstInSem) {
          handleSubjectChange(firstInSem);
        }
      }
    }
  }, [allMeta, subject, handleSubjectChange]);

  // Unit change resets season & marks and updates history
  const handleUnitChange = useCallback((u) => {
    setUnit(u);
    setSeason("All");
    setMarks("All");
    setTopic("All");

    const params = new URLSearchParams(window.location.search);
    params.set("subject", subject);
    params.set("unit", u);
    if (savedOnly) params.set("saved", "true");
    else params.delete("saved");

    window.history.pushState(
      { subject, unit: u, savedOnly },
      "",
      `?${params.toString()}`
    );
  }, [subject, savedOnly]);

  // Open sidebar drawer and push history state for device back button handling
  const handleOpenSidebar = useCallback(() => {
    window.history.pushState(
      { isSidebarOpen: true, subject, unit, savedOnly },
      "",
      window.location.search
    );
    setIsSidebarOpen(true);
  }, [subject, unit, savedOnly]);

  // Close sidebar drawer via UI (button/backdrop/ESC) and clean history
  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    if (window.history.state?.isSidebarOpen) {
      window.history.back();
    }
  }, []);

  // Direct selection from Sidebar navigation tree: replace sidebar state with target unit
  const handleSelectSubjectAndUnit = useCallback((subjKey, unitNum) => {
    const nextUnit = unitNum || 1;
    setSubject(subjKey);
    setUnit(nextUnit);
    setSeason("All");
    setMarks("All");
    setSearch("");
    setSavedOnly(false);
    setIsSidebarOpen(false);

    const subSem = allMeta[subjKey]?.semester;
    if (subSem) setSelectedSemester("All");

    const params = new URLSearchParams();
    params.set("subject", subjKey);
    params.set("unit", nextUnit);
    window.history.replaceState(
      { subject: subjKey, unit: nextUnit, savedOnly: false },
      "",
      `?${params.toString()}`
    );
  }, [allMeta]);

  // Direct selection from Global Search results in Sidebar
  const handleSelectQuestion = useCallback((q) => {
    const subjKey = q.subject;
    const nextUnit = q.unit || 1;
    setSubject(subjKey);
    setUnit(nextUnit);
    setSeason("All");
    setMarks("All");
    setSavedOnly(false);
    setIsSidebarOpen(false);

    const searchSnippet = q.text ? q.text.slice(0, 45).replace(/[\\${}()^]/g, "").trim() : "";
    setSearch(searchSnippet);
    setSelectedSemester("All");

    const params = new URLSearchParams();
    params.set("subject", subjKey);
    params.set("unit", nextUnit);
    window.history.replaceState(
      { subject: subjKey, unit: nextUnit, savedOnly: false },
      "",
      `?${params.toString()}`
    );
  }, []);

  // Toggle saved questions filter and sync history
  const handleToggleSavedOnly = useCallback(() => {
    setSavedOnly((prev) => {
      const next = !prev;
      const params = new URLSearchParams(window.location.search);
      params.set("subject", subject);
      params.set("unit", unit);
      if (next) {
        params.set("saved", "true");
      } else {
        params.delete("saved");
      }
      window.history.pushState(
        { subject, unit, savedOnly: next },
        "",
        `?${params.toString()}`
      );
      return next;
    });
  }, [subject, unit]);

  // View bookmarks action from Sidebar
  const handleViewBookmarksFromSidebar = useCallback(() => {
    setSavedOnly(true);
    setIsSidebarOpen(false);
    const params = new URLSearchParams(window.location.search);
    params.set("subject", subject);
    params.set("unit", unit);
    params.set("saved", "true");
    window.history.replaceState(
      { subject, unit, savedOnly: true },
      "",
      `?${params.toString()}`
    );
  }, [subject, unit]);

  // Handle browser popstate (device back button / Android gesture / browser forward & back)
  useEffect(() => {
    const handlePopState = (event) => {
      // 1. If sidebar drawer is open, dismiss it without leaving the page
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
        return;
      }

      // 2. Restore navigation state
      const state = event.state;
      if (state) {
        if (state.subject && allMeta[state.subject]) {
          setSubject(state.subject);
        }
        if (state.unit) {
          setUnit(state.unit);
        }
        if (typeof state.savedOnly === "boolean") {
          setSavedOnly(state.savedOnly);
        }
        setSeason("All");
        setMarks("All");
        setTopic("All");
      } else {
        const params = new URLSearchParams(window.location.search);
        const s = params.get("subject");
        const u = parseInt(params.get("unit"), 10);
        const saved = params.get("saved") === "true";
        if (s && allMeta[s]) setSubject(s);
        if (u && u >= 1 && u <= 6) setUnit(u);
        setSavedOnly(saved);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isSidebarOpen, allMeta]);

  // Listen for hardware back button (Capacitor / Cordova / Android WebViews)
  useEffect(() => {
    const handleHardwareBackButton = (e) => {
      if (isSidebarOpen) {
        e.preventDefault?.();
        handleCloseSidebar();
      }
    };

    document.addEventListener("backbutton", handleHardwareBackButton);
    return () => document.removeEventListener("backbutton", handleHardwareBackButton);
  }, [isSidebarOpen, handleCloseSidebar]);

  // Toggle bookmark for current subject
  const handleToggleBookmark = useCallback(
    (id) => {
      toggleBookmark(subject, id);
    },
    [subject, toggleBookmark]
  );

  const savedCount = getSavedCount(subject);
  const activeSubjectMeta = allMeta[subject] || { name: subject.toUpperCase(), semester: 1 };

  return (
    <HelmetProvider>
      <SeoHead subject={subject} unit={unit} />
      <div className="wrap">
        {/* Top Navbar with Menu toggle & quick actions */}
        <Navbar
          onOpenSidebar={handleOpenSidebar}
          activeSubjectMeta={activeSubjectMeta}
          savedCount={savedCount}
          onToggleSavedOnly={handleToggleSavedOnly}
          savedOnly={savedOnly}
        />

        {/* Main page content */}
        <Header
          subject={subject}
          unit={unit}
          allMeta={allMeta}
          customQuestions={customQuestions}
        />

        {/* Semester tabs & Subject selector */}
        <SubjectToggle
          subject={subject}
          onSubjectChange={handleSubjectChange}
          allMeta={allMeta}
          selectedSemester={selectedSemester}
          onSemesterChange={handleSemesterChange}
        />

        {/* Unit tabs */}
        <TabBar
          subject={subject}
          unit={unit}
          onUnitChange={handleUnitChange}
          allMeta={allMeta}
        />

        {/* Unit syllabus card */}
        <UnitCard
          subject={subject}
          unit={unit}
          allMeta={allMeta}
          customQuestions={customQuestions}
        />

        {/* Filters */}
        <Filters
          subject={subject}
          unit={unit}
          season={season}
          marks={marks}
          topic={topic}
          search={search}
          savedOnly={savedOnly}
          savedCount={savedCount}
          newestFirst={newestFirst}
          onSeasonChange={setSeason}
          onMarksChange={setMarks}
          onTopicChange={setTopic}
          onSearchChange={setSearch}
          onSavedToggle={handleToggleSavedOnly}
          onSortToggle={() => setNewestFirst((v) => !v)}
          customQuestions={customQuestions}
        />

        {/* Question cards list */}
        <QuestionList
          subject={subject}
          unit={unit}
          season={season}
          marks={marks}
          topic={topic}
          search={search}
          savedOnly={savedOnly}
          newestFirst={newestFirst}
          bookmarks={bookmarks[subject] || new Set()}
          onToggleBookmark={handleToggleBookmark}
          customQuestions={customQuestions}
        />
      </div>

      {/* Navigation & Global Search Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        allMeta={allMeta}
        activeSubject={subject}
        activeUnit={unit}
        onSelectSubjectAndUnit={handleSelectSubjectAndUnit}
        onSelectQuestion={handleSelectQuestion}
        savedCount={savedCount}
        onViewBookmarks={handleViewBookmarksFromSidebar}
      />


    </HelmetProvider>
  );
}
