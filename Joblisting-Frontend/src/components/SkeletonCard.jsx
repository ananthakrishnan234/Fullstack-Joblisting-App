/**
 * SkeletonCard.jsx — Placeholder card shown during loading
 *
 * File path: Joblisting-Frontend/src/components/SkeletonCard.jsx
 */

import React from 'react';

export default function SkeletonCard() {
  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%',
  };

  return (
    <div style={cardStyle} aria-hidden="true">
      {/* Header row */}
      <div className="d-flex justify-content-between align-items-start">
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: '16px', width: '65%', marginBottom: '8px' }} />
          <div className="skeleton" style={{ height: '12px', width: '30%' }} />
        </div>
        <div className="skeleton" style={{ height: '20px', width: '20px', borderRadius: '50%' }} />
      </div>

      {/* Description lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="skeleton" style={{ height: '11px', width: '100%' }} />
        <div className="skeleton" style={{ height: '11px', width: '88%' }} />
        <div className="skeleton" style={{ height: '11px', width: '72%' }} />
      </div>

      {/* Tech tags */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[50, 60, 45, 55].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: '22px', width: `${w}px`, borderRadius: '4px' }}
          />
        ))}
      </div>
    </div>
  );
}