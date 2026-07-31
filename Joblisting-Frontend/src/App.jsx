/**
 * App.jsx — Root component with auth + routing
 * File path: Joblisting-Frontend/src/App.jsx
 */

import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import { useBookmarks } from './hooks/useBookmarks';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage       from './pages/HomePage';
import JobDetailPage  from './pages/JobDetailPage';
import AddJobPage     from './pages/AddJobPage';
import BookmarksPage  from './pages/BookmarksPage';
import StatsPage      from './pages/StatsPage';
import NotFoundPage   from './pages/NotFoundPage';
import LoginPage      from './pages/auth/LoginPage';
import RegisterPage   from './pages/auth/RegisterPage';

// ── Contexts ──────────────────────────────────────────
export const ToastContext    = createContext(null);
export const BookmarkContext = createContext(null);

export const useToastContext    = () => useContext(ToastContext);
export const useBookmarkContext = () => useContext(BookmarkContext);

// ── App ───────────────────────────────────────────────
function AppInner() {
    const toast     = useToast();
    const bookmarks = useBookmarks();

    return (
        <ToastContext.Provider value={toast}>
            <BookmarkContext.Provider value={bookmarks}>
                <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
                    <Navbar bookmarkCount={bookmarks.bookmarkedIds.size} />

                    <main className="flex-grow-1">
                        <Routes>
                            {/* Public */}
                            <Route path="/"          element={<HomePage />} />
                            <Route path="/jobs/:id"  element={<JobDetailPage />} />
                            <Route path="/stats"     element={<StatsPage />} />
                            <Route path="/login"     element={<LoginPage />} />
                            <Route path="/register"  element={<RegisterPage />} />

                            {/* Requires login (any user) */}
                            <Route path="/bookmarks" element={
                                <ProtectedRoute><BookmarksPage /></ProtectedRoute>
                            } />

                            {/* Requires ADMIN role */}
                            <Route path="/add" element={
                                <ProtectedRoute adminOnly><AddJobPage /></ProtectedRoute>
                            } />

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>

                    <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 0' }}>
                        <div className="container text-center">
                            <span style={{ color: 'var(--slate)', fontSize: '0.8rem' }}>
                                JobBoard — Spring Boot + React + MongoDB + JWT
                            </span>
                        </div>
                    </footer>
                </div>

                <ToastContainer toasts={toast.toasts} />
            </BookmarkContext.Provider>
        </ToastContext.Provider>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppInner />
            </AuthProvider>
        </BrowserRouter>
    );
}