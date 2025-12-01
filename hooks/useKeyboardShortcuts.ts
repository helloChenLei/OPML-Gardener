"use client";

import { useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow only undo/redo shortcuts in input fields
        if (
          !(
            (event.ctrlKey || event.metaKey) &&
            (event.key === "z" || event.key === "y")
          )
        ) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
        const metaMatch = shortcut.meta ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export const defaultShortcuts = {
  undo: { key: "z", ctrl: true, description: "撤销" },
  redo: { key: "y", ctrl: true, description: "重做" },
  search: { key: "f", ctrl: true, description: "搜索" },
  save: { key: "s", ctrl: true, description: "导出" },
  selectAll: { key: "a", ctrl: true, description: "全选" },
  delete: { key: "Delete", description: "删除选中项" },
  help: { key: "?", shift: true, description: "显示快捷键帮助" },
};

