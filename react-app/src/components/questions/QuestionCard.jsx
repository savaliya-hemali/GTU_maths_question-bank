import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// Tokenize text into math segments ($$...$$, \[...\], $...$, \(...\)) and plain text
// This ensures newlines inside KaTeX SVG paths are NEVER replaced with <br/> tags!
function renderMathContent(text) {
  if (!text) return "";

  const mathRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^$\n]+?\$|\\\([\s\S]+?\\\))/g;
  const parts = text.split(mathRegex);

  return parts
    .map((part) => {
      if (!part) return "";

      // Display math: $$...$$
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const expr = part.slice(2, -2);
        try {
          return katex.renderToString(expr, { displayMode: true, throwOnError: false });
        } catch {
          return `<span class="math-error">${part}</span>`;
        }
      }

      // Display math: \[...\]
      if (part.startsWith("\\[") && part.endsWith("\\]")) {
        const expr = part.slice(2, -2);
        try {
          return katex.renderToString(expr, { displayMode: true, throwOnError: false });
        } catch {
          return `<span class="math-error">${part}</span>`;
        }
      }

      // Inline math: $...$
      if (part.startsWith("$") && part.endsWith("$")) {
        const expr = part.slice(1, -1);
        try {
          return katex.renderToString(expr, { displayMode: false, throwOnError: false });
        } catch {
          return `<span class="math-error">${part}</span>`;
        }
      }

      // Inline math: \(...\)
      if (part.startsWith("\\(") && part.endsWith("\\)")) {
        const expr = part.slice(2, -2);
        try {
          return katex.renderToString(expr, { displayMode: false, throwOnError: false });
        } catch {
          return `<span class="math-error">${part}</span>`;
        }
      }

      // Plain text outside math: escape HTML and replace newlines with <br/>
      return part
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");
    })
    .join("");
}

function MathText({ text }) {
  const html = useMemo(() => renderMathContent(text), [text]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function QuestionCard({ q, bookmarked, onToggleBookmark }) {
  const seasonClass = q.season === "Summer" ? "season-summer" : "season-winter";
  const emoji = q.season === "Summer" ? "☀️" : "❄️";
  const isOr = (q.source && q.source.includes("OR")) || (q.id && q.id.includes("OR"));

  return (
    <div className="q-card" data-id={q.id}>
      <div className="q-head">
        <div className="q-text">
          <MathText text={q.text} />

          {/* Render Table if question includes data table */}
          {q.table && Array.isArray(q.table.labels) && Array.isArray(q.table.rows) && (
            <div className="q-table-wrap">
              <table className="q-table">
                <tbody>
                  {q.table.labels.map((label, idx) => (
                    <tr key={idx}>
                      <th>{label}</th>
                      {(q.table.rows[idx] || []).map((cell, cIdx) => (
                        <td key={cIdx}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Render Image if question includes diagram */}
          {q.image && (
            <div className="q-image-wrap">
              <img
                src={q.image}
                alt="Question Diagram"
                className="q-image"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <button
          className={`bookmark-btn${bookmarked ? " on" : ""}`}
          onClick={() => onToggleBookmark(q.id)}
          title={bookmarked ? "Remove bookmark" : "Save question"}
          aria-label={bookmarked ? `Remove bookmark for question ${q.id}` : `Bookmark question ${q.id}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
        </button>
      </div>

      <div className="tag-row">
        <span className={`tag ${seasonClass}`}>
          {emoji} {q.sessionClean}
        </span>
        {isOr && <span className="tag season-or">OR</span>}
        <span className="tag marks">{q.marksNum} Marks</span>
      </div>

      <div className="q-id">{q.displayId || q.source || q.id}</div>
    </div>
  );
}
