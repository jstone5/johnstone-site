"use client";

import { memo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookPlatform } from '@/lib/game/types';
import { getAmazonSearchUrl } from '@/lib/game/books';

interface BookModalProps {
  book: BookPlatform | null;
  coverUrl?: string;
  onClose: () => void;
}

export const BookModal = memo(function BookModal({
  book,
  coverUrl,
  onClose,
}: BookModalProps) {
  // Close on escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (book) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [book, handleKeyDown]);

  const amazonUrl = book ? getAmazonSearchUrl(book.title, book.author) : '';

  return (
    <AnimatePresence>
      {book && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md"
          >
            <div className="bg-[var(--panel)] border-2 border-[var(--border)] rounded-lg shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-start gap-4 p-6">
                {/* Book cover */}
                <div
                  className="w-24 h-36 rounded shadow-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: book.color }}
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-white text-xs text-center px-2 font-[family-name:var(--font-pixelify-sans)]">
                      {book.title}
                    </span>
                  )}
                </div>

                {/* Book info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-pixelify-sans)] text-xl text-[var(--text)] mb-1 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-[var(--muted)] text-sm mb-4">
                    by {book.author}
                  </p>

                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--panel)] rounded font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    View on Amazon
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M3.5 1.5h7v7M10 2L2 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </a>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              {/* Footer hint */}
              <div className="bg-[var(--bg-subtle)] px-6 py-3 text-xs text-[var(--muted)] text-center">
                Press <kbd className="px-1.5 py-0.5 bg-[var(--panel)] rounded border border-[var(--border)] font-mono">ESC</kbd> or click outside to close
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
