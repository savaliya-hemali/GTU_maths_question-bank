// Unified data index — imports all subject question arrays and re-exports as DATA map
import { M1_QUESTIONS } from "./m1-questions.js";
import { M2_QUESTIONS } from "./m2-questions.js";
import { PS_QUESTIONS } from "./ps-questions.js";
import { DM_QUESTIONS } from "./dm-questions.js";

export const DATA = {
  m1: M1_QUESTIONS.map((q) => ({ ...q, subject: "m1" })),
  m2: M2_QUESTIONS.map((q) => ({ ...q, subject: "m2" })),
  ps: PS_QUESTIONS.map((q) => ({ ...q, subject: "ps" })),
  dm: DM_QUESTIONS.map((q) => ({ ...q, subject: "dm" })),
};
