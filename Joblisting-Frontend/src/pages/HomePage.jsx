/**
 * HomePage.jsx — Main job browsing page
 *
 * Features:
 *  - Paginated job listing
 *  - Full-text search (debounced)
 *  - Advanced filtering (FilterPanel)
 *  - Result count and active state display
 *
 * File path: Joblisting-Frontend/src/pages/HomePage.jsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { jobsApi } from '../services/api';
import { useToastContext } from '../App';
import JobList from '../components/JobList';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 9;

export default function HomePage() {
  const { showToast } = useToastContext();

  // Data state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [, setTotalHint] = useState(null);

  // Mode: 'browse' | 'search' | 'filter'
  const [mode, setMode] = useState('browse');
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // ── Fetch all jobs (browse mode) ────────────────
  const fetchAll = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await jobsApi.getAll(p, PAGE_SIZE);
      const data = res.data;
      setJobs(data);
      setHasMore(data.length === PAGE_SIZE);
      setTotalHint(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ── Search mode ──────────────────────────────────
  const handleSearch = useCallback(async (text) => {
    setMode('search');
    setSearchText(text);
    setPage(0);
    setLoading(true);
    try {
      const res = await jobsApi.search(text);
      setJobs(res.data);
      setHasMore(false); // Search returns all matching results
      setTotalHint(res.data.length);
    } catch (err) {
      showToast(err.message, 'error');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleSearchClear = useCallback(() => {
    setMode('browse');
    setSearchText('');
    setPage(0);
  }, []);

  // ── Filter mode ──────────────────────────────────
  const handleFilter = useCallback(async (filterData) => {
    setMode('filter');
    setActiveFilter(filterData);
    setPage(0);
    setFilterLoading(true);
    setLoading(true);
    try {
      const res = await jobsApi.filter(filterData, 0, PAGE_SIZE);
      setJobs(res.data);
      setHasMore(res.data.length === PAGE_SIZE);
      setTotalHint(res.data.length < PAGE_SIZE ? res.data.length : null);
    } catch (err) {
      showToast(err.message, 'error');
      setJobs([]);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [showToast]);

  const handleFilterReset = useCallback(() => {
    setMode('browse');
    setActiveFilter(null);
    setPage(0);
  }, []);

  // ── Pagination ───────────────────────────────────
  const handleNext = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    try {
      let res;
      if (mode === 'filter' && activeFilter) {
        res = await jobsApi.filter(activeFilter, nextPage, PAGE_SIZE);
      } else {
        res = await jobsApi.getAll(nextPage, PAGE_SIZE);
      }
      setJobs(res.data);
      setHasMore(res.data.length === PAGE_SIZE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast(err.message, 'error');
      setPage(page); // revert on error
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = async () => {
    if (page === 0) return;
    const prevPage = page - 1;
    setPage(prevPage);
    setLoading(true);
    try {
      let res;
      if (mode === 'filter' && activeFilter) {
        res = await jobsApi.filter(activeFilter, prevPage, PAGE_SIZE);
      } else {
        res = await jobsApi.getAll(prevPage, PAGE_SIZE);
      }
      setJobs(res.data);
      setHasMore(res.data.length === PAGE_SIZE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast(err.message, 'error');
      setPage(page);
    } finally {
      setLoading(false);
    }
  };

  // ── Initial load + re-fetch when mode/page resets ─
  useEffect(() => {
    if (mode === 'browse') {
      fetchAll(page);
    }
  }, [mode, page, fetchAll]);

  // ── UI helpers ───────────────────────────────────
  const getStatusText = () => {
    if (mode === 'search') {
      if (loading) return `Searching for "${searchText}"…`;
      return `${jobs.length} result${jobs.length !== 1 ? 's' : ''} for "${searchText}"`;
    }
    if (mode === 'filter') {
      if (loading) return 'Applying filters…';
      return `${jobs.length} job${jobs.length !== 1 ? 's' : ''} match your filters`;
    }
    return null;
  };

  const emptyMessage =
    mode === 'search'
      ? `No jobs found for "${searchText}". Try a different keyword.`
      : mode === 'filter'
      ? 'No jobs match these filters. Try adjusting the criteria.'
      : 'No jobs posted yet. Be the first to post one!';

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: '1200px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--offwhite)',
            margin: '0 0 4px',
          }}
        >
          Browse Jobs
        </h1>
        <p style={{ color: 'var(--slate-light)', margin: 0, fontSize: '0.9rem' }}>
          Find your next role in tech
        </p>
      </div>

      {/* Search + filter toggle row */}
      <div className="d-flex gap-2 align-items-center" style={{ marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <SearchBar
            onSearch={handleSearch}
            onClear={handleSearchClear}
            isSearching={loading && mode === 'search'}
          />
        </div>
        <button
          className={showFilters ? 'btn-teal' : 'btn-ghost'}
          onClick={() => setShowFilters((v) => !v)}
          style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 16px' }}
        >
          ⚙ Filters
          {mode === 'filter' && (
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--navy)',
                marginLeft: '6px',
                verticalAlign: 'middle',
              }}
            />
          )}
        </button>
      </div>

      <div className="row g-4">
        {/* Filter sidebar */}
        {showFilters && (
          <div className="col-12 col-lg-3">
            <FilterPanel
              onFilter={handleFilter}
              onReset={handleFilterReset}
              isLoading={filterLoading}
            />
          </div>
        )}

        {/* Job grid */}
        <div className={showFilters ? 'col-12 col-lg-9' : 'col-12'}>
          {/* Status line */}
          {getStatusText() && (
            <p
              style={{
                color: 'var(--teal)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {getStatusText()}
            </p>
          )}

          <JobList
            jobs={jobs}
            loading={loading}
            emptyMessage={emptyMessage}
          />

          {/* Pagination — only in browse or filter mode */}
          {mode !== 'search' && !loading && jobs.length > 0 && (
            <Pagination
              page={page}
              hasMore={hasMore}
              onPrev={handlePrev}
              onNext={handleNext}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}