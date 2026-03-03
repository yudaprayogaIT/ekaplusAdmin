// src/hooks/useUnsavedChanges.ts
import { useState, useEffect } from "react";

type UseUnsavedChangesProps = {
  isDirty: boolean;
  onClose: () => void;
  onConfirmClose?: () => void;
};

/**
 * Custom hook for handling unsaved changes confirmation
 * Returns handlers for backdrop click and close button
 */
export function useUnsavedChanges({
  isDirty,
  onClose,
  onConfirmClose,
}: UseUnsavedChangesProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    if (onConfirmClose) {
      onConfirmClose();
    }
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  return {
    showConfirm,
    handleClose,
    handleConfirmClose,
    handleCancelClose,
  };
}

/**
 * Helper hook to detect if form fields have changed
 */
export function useFormDirty<T extends Record<string, unknown>>(
  formData: T,
  initialData: T
): boolean {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const hasChanged = Object.keys(formData).some(
      (key) => formData[key] !== initialData[key]
    );
    setIsDirty(hasChanged);
  }, [formData, initialData]);

  return isDirty;
}
