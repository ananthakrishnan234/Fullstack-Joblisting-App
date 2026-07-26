/**
 * JobCard.jsx — Individual job listing card
 *
 * Displays: profile, description snippet, experience, tech tags, bookmark toggle.
 * Click navigates to JobDetailPage.
 *
 * File path: Joblisting-Frontend/src/components/JobCard.jsx
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TechTag from './TechTag';
import { useBookmarkContext, useToastContext } from '../App';

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarkContext();
  const { showToast } = useToastContext();
  const [bookmarkPending, setBookmarkPending] = useState(false);

  const bookmarked = isBookmarked(job.id);

  const handleBookmark = async (e) => {
    e.stopPropagation(); // Don't navigate to detail on bookmark click
    if (bookmarkPending) return;
    setBookmarkPending(true);
    try {
      await toggleBookmark(job.id);
      showToast(bookmarked ? 'Removed from saved jobs' : 'Job saved!');
    } catch {
      showToast('Could not update bookmark. Please try again.', 'error');
    } finally {
      setBookmarkPending(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '20px 22px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
    e.currentTarget.style.borderColor = 'rgba(0, 212, 170, 0.3)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.borderColor = 'var(--border)';
  };

  // Truncate description to ~100 chars
  const shortDesc =
    job.desc && job.desc.length > 110
      ? job.desc.slice(0, 110) + '…'
      : job.desc;

  return (
    <div
      style={cardStyle}
      onClick={() => navigate(`/jobs/${job.id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/jobs/${job.id}`)}
      aria-label={`View details for ${job.profile}`}
    >
      {/* Header row: profile + bookmark */}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6
            style={{
              margin: 0,
              color: 'var(--offwhite)',
              fontWeight: 600,
              fontSize: '0.95rem',
              lineHeight: 1.3,
            }}
          >
            {job.profile || 'Untitled Role'}
          </h6>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '5px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: job.exp === 0 ? 'var(--teal)' : 'var(--slate-light)',
            }}
          >
            {job.exp === 0
              ? '✦ Fresher'
              : `${job.exp} yr${job.exp !== 1 ? 's' : ''} exp`}
          </span>
        </div>

        <button
          onClick={handleBookmark}
          disabled={bookmarkPending}
          aria-label={bookmarked ? 'Remove from saved' : 'Save job'}
          style={{
            background: 'none',
            border: 'none',
            cursor: bookmarkPending ? 'wait' : 'pointer',
            padding: '4px',
            fontSize: '1.1rem',
            lineHeight: 1,
            color: bookmarked ? 'var(--teal)' : 'var(--slate)',
            transition: 'color 0.15s, transform 0.15s',
            transform: bookmarkPending ? 'scale(0.85)' : 'scale(1)',
          }}
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          color: 'var(--slate-light)',
          fontSize: '0.83rem',
          lineHeight: 1.55,
          flexGrow: 1,
        }}
      >
        {shortDesc || 'No description provided.'}
      </p>

      {/* Tech tags */}
      {job.techs && job.techs.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {job.techs.slice(0, 5).map((tech) => (
            <TechTag key={tech} tech={tech} size="sm" />
          ))}
          {job.techs.length > 5 && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--slate)',
                padding: '3px 6px',
              }}
            >
              +{job.techs.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );
}