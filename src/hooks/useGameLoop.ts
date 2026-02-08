"use client";

import { useRef, useCallback, useEffect } from 'react';

export interface GameLoopCallback {
  (deltaTime: number): void;
}

export function useGameLoop(callback: GameLoopCallback, isRunning: boolean = true) {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef<GameLoopCallback>(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      // Cap delta time to prevent huge jumps (e.g., after tab switch)
      const cappedDelta = Math.min(deltaTime, 32); // ~30fps minimum
      callbackRef.current(cappedDelta);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, isRunning]);

  const pause = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  const resume = useCallback(() => {
    if (!requestRef.current) {
      previousTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  return { pause, resume };
}
