"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const RECENTS_KEY = "flectool_recent_tools";
const MAX_RECENTS = 8;

export interface RecentToolItem {
  slug: string;
  visitedAt: number;
}

export function useRecentTools() {
  const [recents, setRecents] = useLocalStorage<RecentToolItem[]>(RECENTS_KEY, []);

  const addRecent = useCallback((slug: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((item) => item.slug !== slug);
      const updated = [{ slug, visitedAt: Date.now() }, ...filtered];
      return updated.slice(0, MAX_RECENTS);
    });
  }, [setRecents]);

  const clearRecents = useCallback(() => {
    setRecents([]);
  }, [setRecents]);

  const removeRecent = useCallback((slug: string) => {
    setRecents((prev) => prev.filter((item) => item.slug !== slug));
  }, [setRecents]);

  return {
    recents,
    addRecent,
    clearRecents,
    removeRecent,
  };
}
