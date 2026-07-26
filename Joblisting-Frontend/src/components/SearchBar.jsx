/**
 * SearchBar.jsx — Full-text search input
 *
 * Debounces the search to avoid hammering the API on every keystroke.
 * Shows a loading indicator and a clear button.
 *
 * File path: Joblisting-Frontend/src/components/SearchBar.jsx
 */

import React, { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch, onClear, isSearching }) {
  const [value, setValue] = useState('');
  const debounceRef = useRef(null);

  // Debounce: wait 400ms after last keystroke before triggering search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        onSearch(value.trim());
      }, 400);
    } else if (value.trim().length === 0) {
      onClear();
    }

    return () => clearTimeout(debounceRef.current);
  }, [value, onSearch, onClear]);

  const handleClear = () => {
    setValue('');
    onClear();
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Search icon */}
      <span
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--slate)',
          fontSize: '0.9rem',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {isSearching ? (
          <span
            style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              border: '2px solid var(--slate)',
              borderTopColor: 'var(--teal)',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
        ) : (
          '⌕'
        )}
      </span>

      <input
        type="text"
        className="form-control"
        placeholder="Search by skill, role, or keyword…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          paddingLeft: '40px',
          paddingRight: value ? '40px' : '14px',
          height: '44px',
          fontSize: '0.9rem',
        }}
        aria-label="Search jobs"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--slate)',
            fontSize: '1rem',
            padding: '2px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}

      <style>{`
        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}