"use client";

import { useState, useEffect, useRef } from 'react';
import { BOOKS_DATA, fetchAllBookCovers } from '@/lib/game/books';

export function useBookCovers() {
  const [covers, setCovers] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double-fetching in strict mode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function loadCovers() {
      try {
        const coverMap = await fetchAllBookCovers(BOOKS_DATA, 5, 300);
        setCovers(coverMap);
      } catch (error) {
        console.warn('Failed to load book covers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCovers();
  }, []);

  return { covers, isLoading };
}
