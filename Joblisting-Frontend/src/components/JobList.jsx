/**
 * JobList.jsx — Renders a responsive grid of JobCards or SkeletonCards
 *
 * File path: Joblisting-Frontend/src/components/JobList.jsx
 */

import React from 'react';
import JobCard from './JobCard';
import SkeletonCard from './SkeletonCard';

export default function JobList({ jobs, loading, emptyMessage }) {
  // Show 6 skeleton cards while loading
  if (loading) {
    return (
      <div className="row g-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-4">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: 'var(--slate-light)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>◌</div>
        <p style={{ fontSize: '1rem', margin: 0 }}>
          {emptyMessage || 'No jobs found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="row g-3 page-enter">
      {jobs.map((job) => (
        <div key={job.id} className="col-12 col-md-6 col-lg-4">
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
}