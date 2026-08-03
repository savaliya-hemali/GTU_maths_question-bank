// GTU Mathematics Question Bank — Application Logic
// This file handles all UI rendering, filtering, bookmarks, and state management.
// Data is loaded from separate files in data/ and meta.js

// Build the unified DATA object from the separate question arrays
const DATA = {
  m1: M1_QUESTIONS.map(q => ({ ...q, subject: "m1" })),
  m2: M2_QUESTIONS.map(q => ({ ...q, subject: "m2" })),
  ps: typeof PS_QUESTIONS !== "undefined" ? PS_QUESTIONS.map(q => ({ ...q, subject: "ps" })) : [],
  dm: typeof DM_QUESTIONS !== "undefined" ? DM_QUESTIONS.map(q => ({ ...q, subject: "dm" })) : [],
};

const state = {
  subject: "m1",
  unit: 1,
  season: "All",
  marks: "All",
  search: "",
  savedOnly: false,
  newestFirst: false,
  bookmarks: { m1: new Set(), m2: new Set(), ps: new Set(), dm: new Set() },
};

function loadBookmarks() {
  for (const s of ["m1", "m2", "ps", "dm"]) {
    try {
      const raw = localStorage.getItem("mathqb:bookmarks:" + s);
      if (raw) state.bookmarks[s] = new Set(JSON.parse(raw));
    } catch (e) {}
  }
  render();
}
function saveBookmarks(s) {
  try {
    localStorage.setItem("mathqb:bookmarks:" + s, JSON.stringify(Array.from(state.bookmarks[s])));
  } catch (e) {}
}
function toggleBookmark(id) {
  const set = state.bookmarks[state.subject];
  if (set.has(id)) set.delete(id);
  else set.add(id);
  saveBookmarks(state.subject);
  render();
}

function buildSubjectToggle() {
  const el = document.getElementById("subjectToggle");
  el.innerHTML = "";
  Object.keys(META).forEach((key) => {
    const b = document.createElement("button");
    b.textContent = META[key].name;
    b.className = state.subject === key ? "active" : "";
    b.onclick = () => {
      state.subject = key;
      state.unit = 1;
      state.season = "All";
      state.marks = "All";
      render();
    };
    el.appendChild(b);
  });
}

function renderHeader() {
  const m = META[state.subject];
  document.getElementById("eyebrow").textContent = m.eyebrow;
  document.getElementById("titleText").textContent =
    `${m.name} — Question Bank`;
  const sessions = Array.from(
    new Set(DATA[state.subject].map((q) => q.sessionClean)),
  );
  const years = sessions.map((s) => parseInt(s.match(/\d{4}/)[0]));
  const minY = Math.min(...years),
    maxY = Math.max(...years);
  document.getElementById("subText").textContent =
    `Papers: ${minY} – ${maxY}  ·  5 Units as per Current Syllabus  ·  Season Separated`;
}

function buildTabs() {
  const el = document.getElementById("tabbar");
  el.innerHTML = "";
  const units = META[state.subject].units;
  Object.keys(units).forEach((uStr) => {
    const u = parseInt(uStr);
    const b = document.createElement("button");
    b.className = "tab" + (state.unit === u ? " active" : "");
    b.innerHTML = `${units[u].icon} U${u}`;
    b.onclick = () => {
      state.unit = u;
      state.season = "All";
      state.marks = "All";
      render();
    };
    el.appendChild(b);
  });
  updateScrollThumb();
  el.onscroll = updateScrollThumb;
}
function updateScrollThumb() {
  const el = document.getElementById("tabbar");
  const thumb = document.getElementById("scrollThumb");
  const ratio = el.clientWidth / el.scrollWidth;
  const pos =
    el.scrollWidth > el.clientWidth
      ? el.scrollLeft / (el.scrollWidth - el.clientWidth)
      : 0;
  thumb.style.width = ratio * 100 + "%";
  thumb.style.left = pos * (100 - ratio * 100) + "%";
}

function buildUnitCard() {
  const info = META[state.subject].units[state.unit];
  const all = DATA[state.subject].filter((q) => q.unit === state.unit);
  const summerCount = all.filter((q) => q.season === "Summer").length;
  const winterCount = all.filter((q) => q.season === "Winter").length;
  const marksCounts = {};
  all.forEach((q) => {
    marksCounts[q.marksNum] = (marksCounts[q.marksNum] || 0) + 1;
  });
  const marksKeys = Object.keys(marksCounts)
    .map(Number)
    .sort((a, b) => a - b);
  const marksColors = [
    "#DCEFE0;color:#1f6b3a",
    "#E6E0FB;color:#4a3a9c",
    "#FCE8D5;color:#a15a1e",
    "#DCEAF7;color:#1f4e79",
    "#FBE4EA;color:#a13a5c",
  ];

  const el = document.getElementById("unitCard");
  el.style.background = `var(--u${state.unit}-bg)`;
  el.style.color = `var(--u${state.unit}-fg)`;

  let marksChips = marksKeys
    .map((k, i) => {
      const [bg, colorRule] =
        marksColors[i % marksColors.length].split(";");
      return `<span class="chip" style="background:${bg};${colorRule}">${marksCounts[k]} × ${k}M</span>`;
    })
    .join("");

  el.innerHTML = `
    <div class="row">
      <div class="unit-icon">${info.icon}</div>
      <div>
        <h2>Unit ${state.unit}: ${info.title}</h2>
      </div>
    </div>
    <div class="desc">${info.desc}</div>
    <div class="chip-row">
      <span class="chip">☀️ ${summerCount} Summer</span>
      <span class="chip">❄️ ${winterCount} Winter</span>
    </div>
    <div class="chip-row">${marksChips}</div>
    <span class="chip total">Total: ${all.length}</span>
  `;
}

function buildSeasonGrid() {
  const el = document.getElementById("seasonGrid");
  const sessions = Array.from(
    new Set(DATA[state.subject].map((q) => q.sessionClean)),
  ).sort((a, b) => {
    const ya = parseInt(a.match(/\d+/)[0]),
      yb = parseInt(b.match(/\d+/)[0]);
    if (yb !== ya) return yb - ya;
    return a.startsWith("Winter") ? -1 : 1;
  });
  const opts = ["All", ...sessions];
  el.innerHTML = opts
    .map(
      (s) =>
        `<button class="pill-btn ${state.season === s ? "active" : ""}" data-s="${s}">${s}</button>`,
    )
    .join("");
  el.querySelectorAll("button").forEach(
    (b) =>
      (b.onclick = () => {
        state.season = b.dataset.s;
        render();
      }),
  );
}

function buildMarksRow() {
  const el = document.getElementById("marksRow");
  const marksVals = Array.from(
    new Set(
      DATA[state.subject]
        .filter((q) => q.unit === state.unit)
        .map((q) => q.marksNum),
    ),
  ).sort((a, b) => a - b);
  const opts = ["All", ...marksVals];
  el.innerHTML = opts
    .map(
      (m) =>
        `<button class="pill-btn ${state.marks == m ? "active" : ""}" data-m="${m}">${m === "All" ? "All" : m + " Marks"}</button>`,
    )
    .join("");
  el.querySelectorAll("button").forEach(
    (b) =>
      (b.onclick = () => {
        state.marks = b.dataset.m;
        render();
      }),
  );
}

function getFiltered() {
  let list = DATA[state.subject].filter((q) => q.unit === state.unit);
  if (state.season !== "All")
    list = list.filter((q) => q.sessionClean === state.season);
  if (state.marks !== "All")
    list = list.filter((q) => String(q.marksNum) === String(state.marks));
  if (state.search.trim()) {
    const s = state.search.trim().toLowerCase();
    list = list.filter(
      (q) =>
        q.text.toLowerCase().includes(s) ||
        q.source.toLowerCase().includes(s),
    );
  }
  if (state.savedOnly)
    list = list.filter((q) => state.bookmarks[state.subject].has(q.id));
  list = list
    .slice()
    .sort((a, b) =>
      state.newestFirst ? b.year - a.year : a.year - b.year,
    );
  return list;
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderList() {
  const list = getFiltered();
  document.getElementById("resultCount").textContent =
    `${list.length} question${list.length === 1 ? "" : "s"}`;
  document.getElementById("savedCount").textContent =
    state.bookmarks[state.subject].size;
  const qList = document.getElementById("qList");

  if (list.length === 0) {
    qList.innerHTML = `<div class="empty">
      <div class="big">No questions here</div>
      <p>${
  state.search
    ? "Try a different search term, or clear the season / marks filters."
    : "None of the exam papers on file asked a question from this unit under the current syllabus."
}</p>
    </div>`;
    return;
  }

  qList.innerHTML = list
    .map((q) => {
      const on = state.bookmarks[state.subject].has(q.id);
      const seasonClass =
        q.season === "Summer" ? "season-summer" : "season-winter";
      const emoji = q.season === "Summer" ? "☀️" : "❄️";

      const isOr = (q.source && q.source.includes("OR")) || (q.id && q.id.includes("OR"));
      const orTag = isOr ? `<span class="tag season-or">OR</span>` : "";

      let tableHtml = "";
      if (q.table && Array.isArray(q.table.labels) && Array.isArray(q.table.rows)) {
        const rows = q.table.labels.map((label, idx) => {
          const cells = (q.table.rows[idx] || []).map(cell => `<td>${escapeHtml(cell)}</td>`).join("");
          return `<tr><th>${escapeHtml(label)}</th>${cells}</tr>`;
        }).join("");
        tableHtml = `<div class="q-table-wrap"><table class="q-table"><tbody>${rows}</tbody></table></div>`;
      }

      let imageHtml = "";
      if (q.image) {
        imageHtml = `<div class="q-image-wrap"><img src="${escapeHtml(q.image)}" alt="Original Question Diagram / Image" class="q-image" loading="lazy" /></div>`;
      }

      return `
    <div class="q-card">
      <div class="q-head">
        <div class="q-text">${escapeHtml(q.text)}${tableHtml}${imageHtml}</div>
        <button class="bookmark-btn ${on ? "on" : ""}" onclick="toggleBookmark('${q.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8">
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
          </svg>
        </button>
      </div>
      <div class="tag-row">
        <span class="tag ${seasonClass}">${emoji} ${q.sessionClean}</span>
        ${orTag}
        <span class="tag marks">${q.marksNum} Marks</span>
      </div>
      <div class="q-id">${q.displayId}</div>
    </div>`;
    })
    .join("");

  if (window.renderMathInElement) {
    renderMathInElement(qList, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }
}

function render() {
  buildSubjectToggle();
  renderHeader();
  buildTabs();
  buildUnitCard();
  buildSeasonGrid();
  buildMarksRow();
  renderList();

  const savedBtn = document.getElementById("savedBtn");
  savedBtn.className = "pill-btn" + (state.savedOnly ? " active" : "");
  savedBtn.onclick = () => {
    state.savedOnly = !state.savedOnly;
    render();
  };

  const sortBtn = document.getElementById("sortBtn");
  sortBtn.textContent = state.newestFirst
    ? "Newest first"
    : "Oldest first";
  sortBtn.onclick = () => {
    state.newestFirst = !state.newestFirst;
    render();
  };
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  state.search = e.target.value;
  renderList();
});

loadBookmarks();
render();
