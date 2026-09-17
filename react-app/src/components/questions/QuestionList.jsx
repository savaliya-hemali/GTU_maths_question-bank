import QuestionCard from "./QuestionCard.jsx";
import { DATA } from "../../data/questions.js";

export function getFiltered({ subject, unit, season, marks, topic, search, savedOnly, newestFirst, bookmarks, customQuestions }) {
  const subjectList = DATA[subject] || customQuestions?.[subject] || [];
  let list = subjectList.filter((q) => q.unit === unit);
  if (season !== "All") list = list.filter((q) => q.sessionClean === season);
  if (marks !== "All") list = list.filter((q) => String(q.marksNum) === String(marks));
  if (topic && topic !== "All") list = list.filter((q) => q.topic === topic);
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter(
      (q) => q.text?.toLowerCase().includes(s) || q.source?.toLowerCase().includes(s)
    );
  }
  if (savedOnly) list = list.filter((q) => bookmarks?.has(q.id));
  return [...list].sort((a, b) => newestFirst ? b.year - a.year : a.year - b.year);
}

// Topic display order (covers all units)
const TOPIC_ORDER = [
  // Unit 1
  "Improper Integrals",
  "Beta & Gamma Functions",
  "Applications of Definite Integrals",
  // Unit 2
  "Indeterminate Forms & L'Hôpital's Rule",
  "Taylor's & Maclaurin's Series",
  "Extreme Values",
  // Unit 3
  "Sequences & Convergence",
  "Tests for Convergence",
  "Alternating Series",
  "Power Series & Radius of Convergence",
  // Unit 4
  "Limits & Continuity",
  "Partial Derivatives & Chain Rule",
  "Gradient & Directional Derivatives",
  "Tangent Plane & Normal Line",
  "Extreme Values & Lagrange Multipliers",
  // Unit 5
  "Double Integrals",
  "Change of Order of Integration",
  "Polar Coordinates",
  "Change of Variables (Jacobian)",
  "Areas & Volumes",
  "Triple Integrals",
];

export default function QuestionList({
  subject,
  unit,
  season,
  marks,
  topic,
  search,
  savedOnly,
  newestFirst,
  bookmarks,
  onToggleBookmark,
  customQuestions,
}) {
  const list = getFiltered({ subject, unit, season, marks, topic, search, savedOnly, newestFirst, bookmarks, customQuestions });

  // Group by topic only when "All Topics" selected and topics exist in the list
  const showTopicGroups = topic === "All" && list.some((q) => q.topic);

  const renderCard = (q) => (
    <QuestionCard
      key={q.id}
      q={q}
      bookmarked={bookmarks?.has(q.id)}
      onToggleBookmark={onToggleBookmark}
    />
  );

  return (
    <>
      <div className="result-count" aria-live="polite" aria-atomic="true">
        {list.length} question{list.length === 1 ? "" : "s"}
      </div>

      {list.length === 0 ? (
        <div className="q-list" id="qList" role="list">
          <div className="empty" role="status">
            <div className="big">No questions found</div>
            <p>
              {search
                ? `No questions matching "${search}". Try a different keyword or search in the Sidebar Menu across all semesters.`
                : savedOnly
                ? "You haven't bookmarked any questions in this unit yet. Tap the star icon on any question to save it."
                : "No questions currently listed for this unit under current filters."}
            </p>
          </div>
        </div>
      ) : showTopicGroups ? (
        // Render questions grouped by topic with section headings
        (() => {
          const withTopic = list.filter((q) => q.topic);
          const withoutTopic = list.filter((q) => !q.topic);

          // Group in defined order
          const orderedTopics = [
            ...TOPIC_ORDER.filter((t) => withTopic.some((q) => q.topic === t)),
            ...withTopic
              .map((q) => q.topic)
              .filter((t) => !TOPIC_ORDER.includes(t))
              .filter((t, i, arr) => arr.indexOf(t) === i),
          ];

          return (
            <>
              {orderedTopics.map((t) => {
                const qs = withTopic.filter((q) => q.topic === t);
                return (
                  <div key={t} className="topic-group">
                    <div className="topic-group-header">
                      <span className="topic-group-title">{t}</span>
                      <span className="topic-group-count">{qs.length} question{qs.length === 1 ? "" : "s"}</span>
                    </div>
                    <div className="q-list" role="list">
                      {qs.map(renderCard)}
                    </div>
                  </div>
                );
              })}
              {withoutTopic.length > 0 && (
                <div className="q-list" id="qList" role="list">
                  {withoutTopic.map(renderCard)}
                </div>
              )}
            </>
          );
        })()
      ) : (
        <div className="q-list" id="qList" role="list">
          {list.map(renderCard)}
        </div>
      )}
    </>
  );
}
