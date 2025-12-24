// src/hooks/useFormKeyboard.ts
import { useEffect } from "react";

type UseFormKeyboardProps = {
  onSave: () => void;
  onCancel: () => void;
  isOpen: boolean;
  canSave?: boolean;
};

/**
 * Custom hook for handling keyboard shortcuts in forms:
 * - Ctrl+S / Cmd+S: Save
 * - Esc: Cancel
 */
export function useFormKeyboard({
  onSave,
  onCancel,
  isOpen,
  canSave = true,
}: UseFormKeyboardProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+S or Cmd+S for save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (canSave) {
          onSave();
        }
      }

      // Esc for cancel
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onSave, onCancel, canSave]);
}
