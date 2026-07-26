/**
 * App.jsx — Root component
 *
 * Handles:
 *  - React Router routes
 *  - Global bookmark state (passed via context)
 *  - Toast notification rendering
 *  - Navbar
 *
 * File path: Joblisting-Frontend/src/App.jsx
 */

import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useToast } from './hooks/useToast';
import { useBookmarks } from './hooks/useBookmarks';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import AddJobPage from './pages/AddJobPage';
import BookmarksPage from './pages/BookmarksPage';
import StatsPage from './pages/StatsPage';
import NotFoundPage from './pages/NotFoundPage';

// ─────────────────────────────────────────
// Contexts
// ─────────────────────────────────────────

export const ToastContext = createContext(null);
export const BookmarkContext = createContext(null);

export function useToastContext() {
  return useContext(ToastContext);
}

export function useBookmarkContext() {
  return useContext(BookmarkContext);
}

// ─────────────────────────────────────────
// App
// ─────────────────────────────────────────

export default function App() {
  const toast = useToast();
  const bookmarks = useBookmarks();

  return (
    <ToastContext.Provider value={toast}>
      <BookmarkContext.Provider value={bookmarks}>
        <BrowserRouter>
          <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Navbar bookmarkCount={bookmarks.bookmarkedIds.size} />

            <main className="flex-grow-1">
              <Routes>
                <Route path="/"            element={<HomePage />} />
                <Route path="/jobs/:id"    element={<JobDetailPage />} />
                <Route path="/add"         element={<AddJobPage />} />
                <Route path="/bookmarks"   element={<BookmarksPage />} />
                <Route path="/stats"       element={<StatsPage />} />
                <Route path="*"            element={<NotFoundPage />} />
              </Routes>
            </main>

            <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 0' }}>
              <div className="container text-center">
                <span style={{ color: 'var(--slate)', fontSize: '0.8rem' }}>
                  JobBoard — Built with Spring Boot + React + MongoDB
                </span>
              </div>
            </footer>
          </div>

          {/* Global toast notifications */}
          <ToastContainer toasts={toast.toasts} />
        </BrowserRouter>
      </BookmarkContext.Provider>
    </ToastContext.Provider>
  );
}