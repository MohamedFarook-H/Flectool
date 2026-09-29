"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const FAVORITES_KEY = "flectool_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, [setFavorites]);

  const removeFavorite = useCallback((slug: string) => {
    setFavorites((prev) => prev.filter((s) => s !== slug));
  }, [setFavorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
}
