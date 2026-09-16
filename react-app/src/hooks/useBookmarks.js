import { useState, useCallback } from "react";
import { SITE_CONFIG } from "../config/site.js";

const DEFAULT_SUBJECTS = SITE_CONFIG.supportedSubjects;

function loadBookmarksFromStorage(subjects) {
  const result = {};
  for (const s of subjects) {
    try {
      const raw = localStorage.getItem("mathqb:bookmarks:" + s);
      result[s] = raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      result[s] = new Set();
    }
  }
  return result;
}

function saveBookmarksToStorage(subject, set) {
  try {
    localStorage.setItem(
      "mathqb:bookmarks:" + subject,
      JSON.stringify([...set])
    );
  } catch {}
}

/**
 * Custom hook to manage per-subject question bookmarking in localStorage.
 *
 * @param {string[]} [subjects=DEFAULT_SUBJECTS] - Array of subject keys
 * @returns {{
 *   bookmarks: Record<string, Set<string>>,
 *   toggleBookmark: (subject: string, id: string) => void,
 *   getSavedCount: (subject: string) => number
 * }}
 */
export function useBookmarks(subjects = DEFAULT_SUBJECTS) {
  const [bookmarks, setBookmarks] = useState(() => loadBookmarksFromStorage(subjects));

  const toggleBookmark = useCallback((subject, id) => {
    setBookmarks((prev) => {
      const currentSet = prev[subject] || new Set();
      const nextSet = new Set(currentSet);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      saveBookmarksToStorage(subject, nextSet);
      return { ...prev, [subject]: nextSet };
    });
  }, []);

  const getSavedCount = useCallback(
    (subject) => bookmarks[subject]?.size ?? 0,
    [bookmarks]
  );

  return {
    bookmarks,
    toggleBookmark,
    getSavedCount,
  };
}

export default useBookmarks;
