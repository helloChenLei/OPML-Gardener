"use client";

import { useState, useCallback } from "react";

export function useHistory<T>(initialState: T) {
  const [states, setStates] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure currentState is never undefined
  const currentState = states[currentIndex] ?? initialState;

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < states.length - 1;

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    setStates((prevStates) => {
      const currentState = prevStates[currentIndex] || prevStates[0];
      const state = typeof newState === 'function' 
        ? (newState as (prevState: T) => T)(currentState)
        : newState;
      
      // Remove any future states when making a new change
      const newStates = prevStates.slice(0, currentIndex + 1);
      newStates.push(state);
      
      // Limit history to 50 states to prevent memory issues
      if (newStates.length > 50) {
        newStates.shift();
        // Don't update currentIndex when we shift, as it should stay at the last position
        setCurrentIndex(49);
        return newStates;
      }
      
      // Update currentIndex synchronously with states
      setCurrentIndex(newStates.length - 1);
      return newStates;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback((initialState: T) => {
    setStates([initialState]);
    setCurrentIndex(0);
  }, []);

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
}

