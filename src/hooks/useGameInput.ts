"use client";

import { useRef, useEffect, useCallback } from 'react';
import type { InputState } from '@/lib/game/types';

export function useGameInput(onFirstInput?: () => void) {
  const inputRef = useRef<InputState>({
    left: false,
    right: false,
    jump: false,
  });
  const hasReceivedInputRef = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Notify on first input
    if (!hasReceivedInputRef.current && onFirstInput) {
      hasReceivedInputRef.current = true;
      onFirstInput();
    }

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        inputRef.current.left = true;
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        inputRef.current.right = true;
        e.preventDefault();
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        inputRef.current.jump = true;
        e.preventDefault();
        break;
    }
  }, [onFirstInput]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        inputRef.current.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        inputRef.current.right = false;
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        inputRef.current.jump = false;
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Mobile/touch control methods
  const setLeft = useCallback((pressed: boolean) => {
    if (!hasReceivedInputRef.current && pressed && onFirstInput) {
      hasReceivedInputRef.current = true;
      onFirstInput();
    }
    inputRef.current.left = pressed;
  }, [onFirstInput]);

  const setRight = useCallback((pressed: boolean) => {
    if (!hasReceivedInputRef.current && pressed && onFirstInput) {
      hasReceivedInputRef.current = true;
      onFirstInput();
    }
    inputRef.current.right = pressed;
  }, [onFirstInput]);

  const setJump = useCallback((pressed: boolean) => {
    if (!hasReceivedInputRef.current && pressed && onFirstInput) {
      hasReceivedInputRef.current = true;
      onFirstInput();
    }
    inputRef.current.jump = pressed;
  }, [onFirstInput]);

  const getInput = useCallback((): Readonly<InputState> => {
    return inputRef.current;
  }, []);

  return {
    getInput,
    setLeft,
    setRight,
    setJump,
    inputRef,
  };
}
