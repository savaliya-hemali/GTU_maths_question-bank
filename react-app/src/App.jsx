import { useState, useCallback } from "react";
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

export default function App() {
  const [subject, setSubject] = useState("m1");
  const [unit, setUnit] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [season, setSeason] = useState("All");
  const [marks, setMarks] = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [newestFirst, setNewestFirst] = useState(false);

  // Modals & Drawers state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Custom subjects and question bank hook
  const { allMeta, customQuestions } = useCustomSubjects();

  // Bookmarking custom hook
  const { bookmarks, toggleBookmark, getSavedCount } = useBookmarks();

  // Subject change resets filters
  const handleSubjectChange = useCallback((key) => {
    setSubject(key);
    setUnit(1);
    setSeason("All");
    setMarks("All");
    setTopic("All");
    setSearch("");
    setSavedOnly(false);
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

  // Unit change resets season & marks
  const handleUnitChange = useCallback((u) => {
    setUnit(u);
    setSeason("All");
    setMarks("All");
    setTopic("All");
  }, []);

  // Direct selection from Sidebar navigation tree
  const handleSelectSubjectAndUnit = useCallback((subjKey, unitNum) => {
    setSubject(subjKey);
    setUnit(unitNum || 1);
    setSeason("All");
    setMarks("All");
    setSearch("");
    setSavedOnly(false);
    const subSem = allMeta[subjKey]?.semester;
    if (subSem) setSelectedSemester("All");
  }, [allMeta]);

  // Direct selection from Global Search results in Sidebar
  const handleSelectQuestion = useCallback((q) => {
    setSubject(q.subject);
    setUnit(q.unit || 1);
    setSeason("All");
    setMarks("All");
    setSavedOnly(false);
    // Use first few keywords of the question to filter and highlight
    const searchSnippet = q.text ? q.text.slice(0, 45).replace(/[\\${}()^]/g, "").trim() : "";
    setSearch(searchSnippet);
    setSelectedSemester("All");
  }, []);


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
          onOpenSidebar={() => setIsSidebarOpen(true)}
          activeSubjectMeta={activeSubjectMeta}
          savedCount={savedCount}
          onToggleSavedOnly={() => setSavedOnly((v) => !v)}
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
          onSavedToggle={() => setSavedOnly((v) => !v)}
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
        onClose={() => setIsSidebarOpen(false)}
        allMeta={allMeta}
        activeSubject={subject}
        activeUnit={unit}
        onSelectSubjectAndUnit={handleSelectSubjectAndUnit}
        onSelectQuestion={handleSelectQuestion}
        savedCount={savedCount}
        onViewBookmarks={() => setSavedOnly(true)}
      />


    </HelmetProvider>
  );
}
