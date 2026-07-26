/**
 * FilterPanel.jsx — Advanced filtering panel (Phase 3)
 *
 * Allows filtering by:
 *   - Experience range (min/max sliders)
 *   - Tech stack (multi-select chips)
 *   - Profile keyword
 *
 * File path: Joblisting-Frontend/src/components/FilterPanel.jsx
 */

import React, { useState } from 'react';
import TechTag from './TechTag';

// Common techs to show as quick-select chips
const QUICK_TECHS = [
  'java', 'spring', 'react', 'python', 'javascript',
  'mongodb', 'mysql', 'docker', 'kubernetes', 'aws',
  'nodejs', 'typescript', 'angular', 'vue', 'redis',
];

export default function FilterPanel({ onFilter, onReset, isLoading }) {
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [profileKeyword, setProfileKeyword] = useState('');
  const [customTech, setCustomTech] = useState('');

  const hasActiveFilters =
    minExp !== '' || maxExp !== '' || selectedTechs.length > 0 || profileKeyword !== '';

  const toggleTech = (tech) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const addCustomTech = (e) => {
    e.preventDefault();
    const trimmed = customTech.trim().toLowerCase();
    if (trimmed && !selectedTechs.includes(trimmed)) {
      setSelectedTechs((prev) => [...prev, trimmed]);
    }
    setCustomTech('');
  };

  const handleApply = () => {
    const filterData = {};
    if (minExp !== '') filterData.minExp = parseInt(minExp, 10);
    if (maxExp !== '') filterData.maxExp = parseInt(maxExp, 10);
    if (selectedTechs.length > 0) filterData.techs = selectedTechs;
    if (profileKeyword.trim()) filterData.profile = profileKeyword.trim();
    onFilter(filterData);
  };

  const handleReset = () => {
    setMinExp('');
    setMaxExp('');
    setSelectedTechs([]);
    setProfileKeyword('');
    setCustomTech('');
    onReset();
  };

  const panelStyle = {
    backgroundColor: 'var(--navy-mid)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
  };

  return (
    <div style={panelStyle}>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ marginBottom: '16px' }}
      >
        <h6 style={{ margin: 0, color: 'var(--offwhite)', fontWeight: 600 }}>
          Filter Jobs
        </h6>
        {hasActiveFilters && (
          <button
            className="btn-ghost"
            onClick={handleReset}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Profile keyword */}
      <div style={{ marginBottom: '16px' }}>
        <label className="form-label">Job Title / Role</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Backend Developer"
          value={profileKeyword}
          onChange={(e) => setProfileKeyword(e.target.value)}
          style={{ fontSize: '0.875rem' }}
        />
      </div>

      {/* Experience range */}
      <div style={{ marginBottom: '16px' }}>
        <label className="form-label">Experience (years)</label>
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min"
            min="0"
            max="50"
            value={minExp}
            onChange={(e) => setMinExp(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          />
          <span style={{ color: 'var(--slate)', alignSelf: 'center' }}>–</span>
          <input
            type="number"
            className="form-control"
            placeholder="Max"
            min="0"
            max="50"
            value={maxExp}
            onChange={(e) => setMaxExp(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Tech stack quick-select */}
      <div style={{ marginBottom: '12px' }}>
        <label className="form-label">Tech Stack</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {QUICK_TECHS.map((tech) => {
            const selected = selectedTechs.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  opacity: selected ? 1 : 0.55,
                  transform: selected ? 'scale(1.05)' : 'scale(1)',
                  transition: 'opacity 0.15s, transform 0.1s',
                }}
              >
                <TechTag tech={tech} size="sm" />
              </button>
            );
          })}
        </div>

        {/* Custom tech input */}
        <form onSubmit={addCustomTech} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Add custom tech…"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            style={{ fontSize: '0.8rem' }}
          />
          <button
            type="submit"
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            + Add
          </button>
        </form>

        {/* Selected custom techs */}
        {selectedTechs.filter((t) => !QUICK_TECHS.includes(t)).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {selectedTechs
              .filter((t) => !QUICK_TECHS.includes(t))
              .map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <TechTag tech={tech} size="sm" />
                  <span style={{ marginLeft: '4px', color: 'var(--danger)', fontSize: '0.65rem' }}>✕</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Active filter summary */}
      {selectedTechs.length > 0 && (
        <p style={{ fontSize: '0.75rem', color: 'var(--teal)', margin: '0 0 12px' }}>
          Matching jobs with all of: {selectedTechs.join(', ')}
        </p>
      )}

      {/* Apply button */}
      <button
        className="btn-teal w-100"
        onClick={handleApply}
        disabled={isLoading || !hasActiveFilters}
      >
        {isLoading ? 'Filtering…' : 'Apply Filters'}
      </button>
    </div>
  );
}