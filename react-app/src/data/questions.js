// Unified data index — imports all subject question arrays and re-exports as DATA map
import { M1_QUESTIONS } from "./m1-questions.js";
import { M2_QUESTIONS } from "./m2-questions.js";
import { PS_QUESTIONS } from "./ps-questions.js";
import { DM_QUESTIONS } from "./dm-questions.js";

export const BASE_DATA = {
  m1: M1_QUESTIONS.map((q) => ({ ...q, subject: "m1" })),
  m2: M2_QUESTIONS.map((q) => ({ ...q, subject: "m2" })),
  ps: PS_QUESTIONS.map((q) => ({ ...q, subject: "ps" })),
  dm: DM_QUESTIONS.map((q) => ({ ...q, subject: "dm" })),
};

export const DATA = BASE_DATA;

const CUSTOM_Q_KEY = "gtu:custom_questions";

export function loadCustomQuestions() {
  try {
    const raw = localStorage.getItem(CUSTOM_Q_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomQuestions(customMap) {
  try {
    localStorage.setItem(CUSTOM_Q_KEY, JSON.stringify(customMap));
  } catch {
    // ignore
  }
}

export function getSubjectQuestions(subjectKey, customQuestions = {}) {
  const base = BASE_DATA[subjectKey] || [];
  const custom = customQuestions[subjectKey] || [];
  return [...base, ...custom];
}

export function getAllQuestions(allMeta = {}, customQuestions = {}) {
  const results = [];
  const allKeys = new Set([...Object.keys(BASE_DATA), ...Object.keys(customQuestions)]);

  for (const key of allKeys) {
    const questions = getSubjectQuestions(key, customQuestions);
    const meta = allMeta[key] || {};
    for (const q of questions) {
      results.push({
        ...q,
        subject: key,
        subjectName: meta.name || key.toUpperCase(),
        semester: meta.semester || 1,
      });
    }
  }
  return results;
}
