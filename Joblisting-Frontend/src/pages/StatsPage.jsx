/**
 * StatsPage.jsx — Job market statistics dashboard (Phase 3)
 *
 * Shows:
 *  - Total jobs, avg experience, min/max experience
 *  - Top 10 technologies (horizontal bar chart, pure CSS)
 *  - Experience distribution (visual breakdown)
 *  - Top job profiles/roles
 *
 * File path: Joblisting-Frontend/src/pages/StatsPage.jsx
 */

import React, { useState, useEffect } from 'react';
import { jobsApi } from '../services/api';
import { useToastContext } from '../App';
import TechTag from '../components/TechTag';

// ── Subcomponents ────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 22px',
        borderLeft: `3px solid ${accent || 'var(--teal)'}`,
      }}
    >
      <p style={{ color: 'var(--slate-light)', fontSize: '0.75rem', fontWeight: 500,
        letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
        {label}
      </p>
      <p style={{ color: 'var(--offwhite)', fontSize: '1.8rem', fontWeight: 700,
        margin: '0 0 2px', fontFamily: 'var(--font-mono)' }}>
        {value}
      </p>
      {sub && (
        <p style={{ color: 'var(--slate)', fontSize: '0.78rem', margin: 0 }}>{sub}</p>
      )}
    </div>
  );
}

function BarChart({ data, label }) {
  if (!data || Object.keys(data).length === 0) return null;

  const entries = Object.entries(data);
  const maxVal = Math.max(...entries.map(([, v]) => Number(v)));

  return (
    <div>
      <p style={{ color: 'var(--slate-light)', fontSize: '0.75rem', fontWeight: 500,
        letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {entries.map(([key, val]) => {
          const pct = maxVal > 0 ? (Number(val) / maxVal) * 100 : 0;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '110px', flexShrink: 0 }}>
                <TechTag tech={key} size="sm" />
              </div>
              <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--navy-light)',
                borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    backgroundColor: 'var(--teal)',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                color: 'var(--slate-light)', minWidth: '24px', textAlign: 'right' }}>
                {val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExpDistribution({ data }) {
  if (!data) return null;
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, v]) => sum + Number(v), 0);

  const colors = ['var(--teal)', '#6DB33F', '#FFD93D', '#FF6B35'];

  return (
    <div>
      <p style={{ color: 'var(--slate-light)', fontSize: '0.75rem', fontWeight: 500,
        letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Experience Distribution
      </p>

      {/* Segmented bar */}
      <div style={{ display: 'flex', height: '10px', borderRadius: '5px',
        overflow: 'hidden', marginBottom: '16px', gap: '2px' }}>
        {entries.map(([key, val], i) => {
          const pct = total > 0 ? (Number(val) / total) * 100 : 0;
          return pct > 0 ? (
            <div
              key={key}
              style={{
                width: `${pct}%`, height: '100%',
                backgroundColor: colors[i % colors.length],
                transition: 'width 0.6s ease',
              }}
              title={`${key}: ${val} jobs (${pct.toFixed(1)}%)`}
            />
          ) : null;
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {entries.map(([key, val], i) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px',
              backgroundColor: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ color: 'var(--slate-light)', fontSize: '0.8rem' }}>
              {key}:{' '}
              <span style={{ color: 'var(--offwhite)', fontWeight: 600 }}>{val}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopProfiles({ data }) {
  if (!data || Object.keys(data).length === 0) return null;
  const entries = Object.entries(data);
  const maxVal = Math.max(...entries.map(([, v]) => Number(v)));

  return (
    <div>
      <p style={{ color: 'var(--slate-light)', fontSize: '0.75rem', fontWeight: 500,
        letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Top Job Roles
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.map(([profile, count], i) => {
          const pct = maxVal > 0 ? (Number(count) / maxVal) * 100 : 0;
          return (
            <div key={profile} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--slate)', fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem', width: '16px', textAlign: 'right', flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ color: 'var(--offwhite)', fontSize: '0.85rem',
                width: '180px', flexShrink: 0, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile}
              </span>
              <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--navy-light)',
                borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  backgroundColor: 'rgba(0,212,170,0.5)',
                  borderRadius: '3px', transition: 'width 0.6s ease',
                }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                color: 'var(--slate-light)', minWidth: '24px', textAlign: 'right' }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────

export default function StatsPage() {
  const { showToast } = useToastContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.getStats()
      .then((res) => setStats(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 16px', maxWidth: '1100px' }}>
        <div className="skeleton" style={{ height: '28px', width: '30%', marginBottom: '32px' }} />
        <div className="row g-3" style={{ marginBottom: '28px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="skeleton" style={{ height: '90px', borderRadius: 'var(--radius-md)' }} />
            </div>
          ))}
        </div>
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-md)' }} />
          </div>
          <div className="col-12 col-lg-6">
            <div className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <p style={{ color: 'var(--slate-light)' }}>Could not load statistics.</p>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '24px',
  };

  return (
    <div className="container page-enter" style={{ padding: '32px 16px', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--offwhite)', margin: '0 0 4px' }}>
          Job Market Insights
        </h1>
        <p style={{ color: 'var(--slate-light)', margin: 0, fontSize: '0.9rem' }}>
          Aggregated data across all job listings
        </p>
      </div>

      {/* Stat cards row */}
      <div className="row g-3" style={{ marginBottom: '28px' }}>
        <div className="col-6 col-md-3">
          <StatCard
            label="Total Jobs"
            value={stats.totalJobs}
            sub="all listings"
            accent="var(--teal)"
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard
            label="Avg Experience"
            value={`${stats.averageExperience} yrs`}
            sub="across all roles"
            accent="#6DB33F"
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard
            label="Min Experience"
            value={stats.minExperience === 0 ? 'Fresher' : `${stats.minExperience} yr`}
            sub="most accessible"
            accent="var(--teal)"
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard
            label="Max Experience"
            value={`${stats.maxExperience} yrs`}
            sub="most senior role"
            accent="#FF6B35"
          />
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="row g-4" style={{ marginBottom: '24px' }}>
        <div className="col-12 col-lg-7">
          <div style={cardStyle}>
            <BarChart data={stats.topTechnologies} label="Top Technologies in Demand" />
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div style={cardStyle}>
            <ExpDistribution data={stats.experienceDistribution} />
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="row g-4">
        <div className="col-12">
          <div style={cardStyle}>
            <TopProfiles data={stats.topProfiles} />
          </div>
        </div>
      </div>
    </div>
  );
}