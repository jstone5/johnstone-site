"use client";

import { useMemo } from 'react';
import { BOOKS_DATA, getBookCoverUrl } from '@/lib/game/books';

export function useBookCovers() {
  // Build cover URL map from ISBNs — no API calls needed
  // Open Library serves images directly from the ISBN URL
  const covers = useMemo(() => {
    const map = new Map<string, string>();
    for (const book of BOOKS_DATA) {
      if (book.isbn) {
        map.set(book.title, getBookCoverUrl(book.isbn));
      }
    }
    return map;
  }, []);

  return { covers, isLoading: false };
}
