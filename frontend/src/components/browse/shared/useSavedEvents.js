// frontend/src/components/browse/shared/useSavedEvents.js
// Lightweight hook for managing saved/bookmarked event IDs per section.

import { useState, useCallback } from "react";

const useSavedEvents = (initialIds = []) => {
  const [savedIds, setSavedIds] = useState(() => new Set(initialIds));

  const toggleSave = useCallback((id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id) => savedIds.has(id), [savedIds]);

  return { savedIds, toggleSave, isSaved };
};

export default useSavedEvents;
