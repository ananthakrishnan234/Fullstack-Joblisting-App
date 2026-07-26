/**
 * JobDetailPage.jsx — Full job detail view
 *
 * Shows complete job info: profile, description, experience, all tech tags.
 * Actions: Bookmark toggle, Delete (with confirmation), Back navigation.
 *
 * File path: Joblisting-Frontend/src/pages/JobDetailPage.jsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsApi } from '../services/api';
import { useToastContext, useBookmarkContext } from '../App';
import TechTag from '../components/TechTag';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  const bookmarked = job ? isBookmarked(job.id) : false;

  useEffect(() => {
    setLoading(true);
    jobsApi.getById(id)
      .then((res) => setJob(res.data))
      .catch(() => setError('Job not found or has been removed.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookmark = async () => {
    if (bookmarkPending) return;
    setBookmarkPending(true);
    try {
      await toggleBookmark(job.id);
      showToast(bookmarked ? 'Removed from saved jobs' : 'Job saved!');
    } catch {
      showToast('Could not update bookmark.', 'error');
    } finally {
      setBookmarkPending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000); // auto-cancel after 4s
      return;
    }
    setDeleting(true);
    try {
      await jobsApi.delete(id);
      showToast('Job deleted successfully.');
      navigate('/');
    } catch (err) {
      showToast(err.message, 'error');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  // ── Skeleton loading ─────────────────────────────
  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <div className="skeleton" style={{ height: '14px', width: '120px', marginBottom: '32px' }} />
        <div className="skeleton" style={{ height: '28px', width: '55%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '16px', width: '25%', marginBottom: '28px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
          {[100, 95, 88, 75, 60].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: '14px', width: `${w}%` }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[70, 80, 55, 65, 75].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: '26px', width: `${w}px`, borderRadius: '4px' }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────
  if (error) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '600px', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: '12px' }}>◌</p>
        <p style={{ color: 'var(--slate-light)', marginBottom: '20px' }}>{error}</p>
        <button className="btn-teal" onClick={() => navigate('/')}>
          ← Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: '800px' }}>

      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--slate-light)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          padding: '0 0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ← Back
      </button>

      {/* Card */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start" style={{ marginBottom: '8px' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--offwhite)',
              margin: 0,
              lineHeight: 1.3,
              flex: 1,
              paddingRight: '16px',
            }}
          >
            {job.profile}
          </h1>

          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkPending}
            aria-label={bookmarked ? 'Remove from saved' : 'Save this job'}
            style={{
              background: bookmarked ? 'var(--teal-ghost)' : 'transparent',
              border: `1px solid ${bookmarked ? 'var(--teal)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              color: bookmarked ? 'var(--teal)' : 'var(--slate-light)',
              cursor: bookmarkPending ? 'wait' : 'pointer',
              padding: '7px 14px',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {bookmarked ? '★ Saved' : '☆ Save'}
          </button>
        </div>

        {/* Experience badge */}
        <div style={{ marginBottom: '24px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: job.exp === 0 ? 'rgba(0,212,170,0.12)' : 'rgba(100,116,139,0.15)',
              color: job.exp === 0 ? 'var(--teal)' : 'var(--slate-light)',
              border: `1px solid ${job.exp === 0 ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}
          >
            {job.exp === 0 ? '✦ Fresher / 0 experience' : `${job.exp} year${job.exp !== 1 ? 's' : ''} of experience`}
          </span>
        </div>

        {/* Divider */}
        <hr style={{ borderColor: 'var(--border)', margin: '0 0 24px' }} />

        {/* Description */}
        <div style={{ marginBottom: '28px' }}>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--slate)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Job Description
          </p>
          <p
            style={{
              color: 'var(--offwhite)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {job.desc || 'No description provided.'}
          </p>
        </div>

        {/* Tech stack */}
        {job.techs && job.techs.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--slate)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Tech Stack Required
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {job.techs.map((tech) => (
                <TechTag key={tech} tech={tech} />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <hr style={{ borderColor: 'var(--border)', margin: '0 0 20px' }} />

        {/* Job ID (subtle, for developers) */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--slate)',
            marginBottom: '20px',
          }}
        >
          Job ID: {job.id}
        </p>

        {/* Action buttons */}
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn-ghost"
            onClick={() => navigate(`/add?edit=${job.id}`)}
            style={{ fontSize: '0.875rem' }}
          >
            ✎ Edit Job
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: deleting ? 'wait' : 'pointer',
              border: `1px solid ${confirmDelete ? 'var(--danger)' : 'var(--border)'}`,
              backgroundColor: confirmDelete ? 'rgba(255,107,107,0.12)' : 'transparent',
              color: confirmDelete ? 'var(--danger)' : 'var(--slate-light)',
              transition: 'all 0.15s',
            }}
          >
            {deleting ? 'Deleting…' : confirmDelete ? '⚠ Confirm Delete' : '✕ Delete Job'}
          </button>

          {confirmDelete && (
            <button
              className="btn-ghost"
              onClick={() => setConfirmDelete(false)}
              style={{ fontSize: '0.875rem' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}