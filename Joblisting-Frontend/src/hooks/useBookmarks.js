/**
 * useBookmarks.js — Manages bookmark state across the app
 *
 * File path: Joblisting-Frontend/src/hooks/useBookmarks.js
 *
 * Loads bookmarked job IDs from the backend on mount.
 * Provides toggle, check, and sync functions.
 */

import { useState, useEffect, useCallback } from 'react';
import { bookmarksApi } from '../services/api';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load all bookmarked IDs from backend on mount
  useEffect(() => {
    bookmarksApi.getIds()
      .then((res) => {
        setBookmarkedIds(new Set(res.data));
      })
      .catch(() => {
        // If backend is down, fall back to empty — don't crash the app
        setBookmarkedIds(new Set());
      })
      .finally(() => setLoading(false));
  }, []);

  const isBookmarked = useCallback(
    (jobId) => bookmarkedIds.has(jobId),
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback(async (jobId) => {
    if (bookmarkedIds.has(jobId)) {
      // Optimistic remove
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
      try {
        await bookmarksApi.remove(jobId);
      } catch {
        // Roll back on failure
        setBookmarkedIds((prev) => new Set([...prev, jobId]));
        throw new Error('Failed to remove bookmark');
      }
    } else {
      // Optimistic add
      setBookmarkedIds((prev) => new Set([...prev, jobId]));
      try {
        await bookmarksApi.add(jobId);
      } catch {
        // Roll back on failure
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        throw new Error('Failed to add bookmark');
      }
    }
  }, [bookmarkedIds]);

  return { bookmarkedIds, isBookmarked, toggleBookmark, bookmarkLoading: loading };
}