/**
 * NotFoundPage.jsx — 404 page
 *
 * File path: Joblisting-Frontend/src/pages/NotFoundPage.jsx
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="container page-enter"
      style={{
        padding: '100px 16px',
        maxWidth: '500px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '4rem',
          color: 'var(--teal)',
          margin: '0 0 8px',
          lineHeight: 1,
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--offwhite)',
          margin: '0 0 12px',
        }}
      >
        Page not found
      </h1>
      <p style={{ color: 'var(--slate-light)', marginBottom: '28px', fontSize: '0.9rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="d-flex gap-2 justify-content-center">
        <button className="btn-teal" onClick={() => navigate('/')}>
          ← Back to Jobs
        </button>
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}