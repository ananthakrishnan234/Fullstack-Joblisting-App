/**
 * ToastContainer.jsx — Renders toast notifications
 *
 * File path: Joblisting-Frontend/src/components/ToastContainer.jsx
 */

import React from 'react';

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container-custom">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item ${toast.type === 'error' ? 'toast-error' : ''}`}
        >
          {toast.type === 'success' && (
            <span style={{ marginRight: '8px' }}>✓</span>
          )}
          {toast.type === 'error' && (
            <span style={{ marginRight: '8px', color: 'var(--danger)' }}>✕</span>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}