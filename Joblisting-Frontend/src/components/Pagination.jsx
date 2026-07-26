/**
 * Pagination.jsx — Page navigation controls
 *
 * File path: Joblisting-Frontend/src/components/Pagination.jsx
 */

import React from 'react';

export default function Pagination({ page, hasMore, onPrev, onNext, loading }) {
  const btnBase = {
    padding: '7px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: '1px solid var(--border)',
  };

  const activeBtn = {
    ...btnBase,
    backgroundColor: 'var(--teal)',
    color: 'var(--navy)',
    borderColor: 'var(--teal)',
  };

  const disabledBtn = {
    ...btnBase,
    backgroundColor: 'transparent',
    color: 'var(--slate)',
    cursor: 'not-allowed',
    opacity: 0.4,
  };

  const ghostBtn = {
    ...btnBase,
    backgroundColor: 'transparent',
    color: 'var(--slate-light)',
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center gap-3"
      style={{ marginTop: '32px' }}
    >
      <button
        style={page === 0 ? disabledBtn : ghostBtn}
        onClick={onPrev}
        disabled={page === 0 || loading}
      >
        ← Prev
      </button>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--slate-light)',
          minWidth: '60px',
          textAlign: 'center',
        }}
      >
        Page {page + 1}
      </span>

      <button
        style={!hasMore ? disabledBtn : activeBtn}
        onClick={onNext}
        disabled={!hasMore || loading}
      >
        Next →
      </button>
    </div>
  );
}