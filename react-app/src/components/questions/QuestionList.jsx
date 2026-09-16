import QuestionCard from "./QuestionCard.jsx";
import { DATA } from "../../data/questions.js";

export function getFiltered({ subject, unit, season, marks, search, savedOnly, newestFirst, bookmarks }) {
  let list = DATA[subject].filter((q) => q.unit === unit);
  if (season !== "All") list = list.filter((q) => q.sessionClean === season);
  if (marks !== "All") list = list.filter((q) => String(q.marksNum) === String(marks));
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter(
      (q) => q.text.toLowerCase().includes(s) || q.source.toLowerCase().includes(s)
    );
  }
  if (savedOnly) list = list.filter((q) => bookmarks.has(q.id));
  return [...list].sort((a, b) => newestFirst ? b.year - a.year : a.year - b.year);
}

export default function QuestionList({ subject, unit, season, marks, search, savedOnly, newestFirst, bookmarks, onToggleBookmark }) {
  const list = getFiltered({ subject, unit, season, marks, search, savedOnly, newestFirst, bookmarks });

  return (
    <>
      <div className="result-count" aria-live="polite" aria-atomic="true">
        {list.length} question{list.length === 1 ? "" : "s"}
      </div>
      <div className="q-list" id="qList" role="list">
        {list.length === 0 ? (
          <div className="empty" role="status">
            <div className="big">No questions here</div>
            <p>
              {search
                ? "Try a different search term, or clear the season / marks filters."
                : "None of the exam papers on file asked a question from this unit under the current syllabus."}
            </p>
          </div>
        ) : (
          list.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              bookmarked={bookmarks.has(q.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))
        )}
      </div>
    </>
  );
}
