import { useState, useCallback } from "react";
import { HelmetProvider } from "react-helmet-async";

// Layout & Navigation components
import Header from "./components/layout/Header.jsx";
import SubjectToggle from "./components/layout/SubjectToggle.jsx";
import TabBar from "./components/navigation/TabBar.jsx";

// Question & Filter components
import UnitCard from "./components/questions/UnitCard.jsx";
import QuestionList, { getFiltered } from "./components/questions/QuestionList.jsx";
import Filters from "./components/filters/Filters.jsx";

// SEO
import SeoHead from "./components/seo/SeoHead.jsx";

// Custom Hooks
import useBookmarks from "./hooks/useBookmarks.js";

export default function App() {
  const [subject, setSubject] = useState("m1");
  const [unit, setUnit] = useState(1);
  const [season, setSeason] = useState("All");
  const [marks, setMarks] = useState("All");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [newestFirst, setNewestFirst] = useState(false);

  // Bookmarking custom hook
  const { bookmarks, toggleBookmark, getSavedCount } = useBookmarks();

  // Subject change resets filters
  const handleSubjectChange = useCallback((key) => {
    setSubject(key);
    setUnit(1);
    setSeason("All");
    setMarks("All");
    setSearch("");
    setSavedOnly(false);
  }, []);

  // Unit change resets season & marks
  const handleUnitChange = useCallback((u) => {
    setUnit(u);
    setSeason("All");
    setMarks("All");
  }, []);

  // Toggle bookmark for current subject
  const handleToggleBookmark = useCallback(
    (id) => {
      toggleBookmark(subject, id);
    },
    [subject, toggleBookmark]
  );

  const savedCount = getSavedCount(subject);

  return (
    <HelmetProvider>
      <SeoHead subject={subject} unit={unit} />
      <div className="wrap">
        <Header subject={subject} unit={unit} />
        <SubjectToggle subject={subject} onSubjectChange={handleSubjectChange} />
        <TabBar subject={subject} unit={unit} onUnitChange={handleUnitChange} />
        <UnitCard subject={subject} unit={unit} />
        <Filters
          subject={subject}
          unit={unit}
          season={season}
          marks={marks}
          search={search}
          savedOnly={savedOnly}
          savedCount={savedCount}
          newestFirst={newestFirst}
          onSeasonChange={setSeason}
          onMarksChange={setMarks}
          onSearchChange={setSearch}
          onSavedToggle={() => setSavedOnly((v) => !v)}
          onSortToggle={() => setNewestFirst((v) => !v)}
        />
        <QuestionList
          subject={subject}
          unit={unit}
          season={season}
          marks={marks}
          search={search}
          savedOnly={savedOnly}
          newestFirst={newestFirst}
          bookmarks={bookmarks[subject] || new Set()}
          onToggleBookmark={handleToggleBookmark}
        />
      </div>
    </HelmetProvider>
  );
}
