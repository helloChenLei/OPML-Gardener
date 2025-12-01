"use client";

import { useState, useCallback } from "react";

export function useHistory<T>(initialState: T) {
  const [states, setStates] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = states[currentIndex];

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < states.length - 1;

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    setStates((prevStates) => {
      const state = typeof newState === 'function' 
        ? (newState as (prevState: T) => T)(prevStates[currentIndex])
        : newState;
      
      // Remove any future states when making a new change
      const newStates = prevStates.slice(0, currentIndex + 1);
      newStates.push(state);
      
      // Limit history to 50 states to prevent memory issues
      if (newStates.length > 50) {
        newStates.shift();
        return newStates;
      }
      
      return newStates;
    });
    
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex > 50 ? 50 : newIndex;
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

