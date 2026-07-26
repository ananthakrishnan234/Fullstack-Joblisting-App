/**
 * useToast.js — Simple toast notification system
 *
 * File path: Joblisting-Frontend/src/hooks/useToast.js
 *
 * Usage:
 *   const { toasts, showToast } = useToast();
 *   showToast('Job saved!');
 *   showToast('Error occurred', 'error');
 */

import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return { toasts, showToast };
}