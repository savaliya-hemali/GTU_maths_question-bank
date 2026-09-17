import { useState, useCallback, useMemo } from "react";
import { BASE_META, loadCustomSubjects, saveCustomSubjects } from "../data/meta.js";
import { loadCustomQuestions, saveCustomQuestions } from "../data/questions.js";

export function useCustomSubjects() {
  const [customSubjects, setCustomSubjects] = useState(() => loadCustomSubjects());
  const [customQuestions, setCustomQuestions] = useState(() => loadCustomQuestions());

  const allMeta = useMemo(() => {
    return { ...BASE_META, ...customSubjects };
  }, [customSubjects]);

  const addSubject = useCallback((newSubject) => {
    setCustomSubjects((prev) => {
      const updated = { ...prev, [newSubject.key]: newSubject };
      saveCustomSubjects(updated);
      return updated;
    });
  }, []);

  const removeSubject = useCallback((subjectKey) => {
    setCustomSubjects((prev) => {
      const updated = { ...prev };
      delete updated[subjectKey];
      saveCustomSubjects(updated);
      return updated;
    });
    setCustomQuestions((prev) => {
      const updated = { ...prev };
      delete updated[subjectKey];
      saveCustomQuestions(updated);
      return updated;
    });
  }, []);

  return {
    customSubjects,
    allMeta,
    addSubject,
    removeSubject,
    customQuestions,
  };
}

export default useCustomSubjects;
