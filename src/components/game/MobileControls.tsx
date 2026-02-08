"use client";

import { memo, useCallback } from 'react';

interface MobileControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJump: () => void;
  onJumpEnd: () => void;
}

export const MobileControls = memo(function MobileControls({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJump,
  onJumpEnd,
}: MobileControlsProps) {
  const handleTouchStart = useCallback((handler: () => void) => (e: React.TouchEvent) => {
    e.preventDefault();
    handler();
  }, []);

  const handleTouchEnd = useCallback((handler: () => void) => (e: React.TouchEvent) => {
    e.preventDefault();
    handler();
  }, []);

  const buttonClass = "w-16 h-16 rounded-full bg-[var(--bg)]/80 border-2 border-[var(--border)] flex items-center justify-center text-[var(--text)] active:bg-[var(--accent)]/30 active:border-[var(--accent)] touch-none select-none";

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 flex justify-between items-end pointer-events-none z-40 md:hidden">
      {/* Direction buttons */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          className={buttonClass}
          onTouchStart={handleTouchStart(onLeftStart)}
          onTouchEnd={handleTouchEnd(onLeftEnd)}
          onTouchCancel={handleTouchEnd(onLeftEnd)}
          aria-label="Move left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
        <button
          className={buttonClass}
          onTouchStart={handleTouchStart(onRightStart)}
          onTouchEnd={handleTouchEnd(onRightEnd)}
          onTouchCancel={handleTouchEnd(onRightEnd)}
          aria-label="Move right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
      </div>

      {/* Jump button */}
      <button
        className={`${buttonClass} w-20 h-20 pointer-events-auto`}
        onTouchStart={handleTouchStart(onJump)}
        onTouchEnd={handleTouchEnd(onJumpEnd)}
        onTouchCancel={handleTouchEnd(onJumpEnd)}
        aria-label="Jump"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>
    </div>
  );
});

// Keyboard hint component for desktop
interface KeyboardHintProps {
  visible: boolean;
}

export const KeyboardHint = memo(function KeyboardHint({ visible }: KeyboardHintProps) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-[var(--muted)] text-sm animate-pulse">
      <div className="flex gap-1">
        <kbd className="px-2 py-1 bg-[var(--bg)]/80 rounded border border-[var(--border)] font-mono text-xs">
          <svg width="12" height="12" viewBox="0 0 12 12" className="inline">
            <path d="M6 2L2 6l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </kbd>
        <kbd className="px-2 py-1 bg-[var(--bg)]/80 rounded border border-[var(--border)] font-mono text-xs">
          <svg width="12" height="12" viewBox="0 0 12 12" className="inline">
            <path d="M6 10L10 6l-4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </kbd>
      </div>
      <span>to move</span>
      <kbd className="px-2 py-1 bg-[var(--bg)]/80 rounded border border-[var(--border)] font-mono text-xs">
        Space
      </kbd>
      <span>to jump</span>
    </div>
  );
});
