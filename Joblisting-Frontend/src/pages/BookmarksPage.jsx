/**
 * BookmarksPage.jsx — Displays all saved/bookmarked jobs
 *
 * File path: Joblisting-Frontend/src/pages/BookmarksPage.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarksApi } from '../services/api';
import { useToastContext } from '../App';
import JobList from '../components/JobList';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookmarksApi.getAll()
      .then((res) => setJobs(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  return (
    <div className="container page-enter" style={{ padding: '32px 16px', maxWidth: '1200px' }}>

      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-end"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--offwhite)', margin: '0 0 4px' }}>
            Saved Jobs
          </h1>
          <p style={{ color: 'var(--slate-light)', margin: 0, fontSize: '0.9rem' }}>
            {loading
              ? 'Loading your saved jobs…'
              : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {!loading && jobs.length > 0 && (
          <button
            className="btn-ghost"
            onClick={() => navigate('/')}
            style={{ fontSize: '0.875rem' }}
          >
            + Browse more
          </button>
        )}
      </div>

      <JobList
        jobs={jobs}
        loading={loading}
        emptyMessage="You haven't saved any jobs yet. Star a job to save it here."
      />

      {/* CTA when empty */}
      {!loading && jobs.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button className="btn-teal" onClick={() => navigate('/')}>
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  );
}