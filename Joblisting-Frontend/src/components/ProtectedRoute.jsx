/**
 * ProtectedRoute.jsx — Guards routes that require authentication or admin role.
 *
 * Usage:
 *   <ProtectedRoute>               — requires login
 *   <ProtectedRoute adminOnly>     — requires ROLE_ADMIN
 *
 * Redirects to /login with the original path saved in state
 * so after login the user is sent back where they came from.
 *
 * File path: Joblisting-Frontend/src/components/ProtectedRoute.jsx
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    // Still restoring session from localStorage — show nothing yet
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center',
                          alignItems: 'center', minHeight: '60vh' }}>
                <div style={{
                    width: '32px', height: '32px',
                    border: '3px solid var(--border)',
                    borderTopColor: 'var(--teal)',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Not logged in — redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin-only route but user is not admin
    if (adminOnly && !isAdmin) {
        return (
            <div className="container page-enter"
                 style={{ padding: '80px 16px', maxWidth: '500px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem',
                            color: 'var(--danger)', margin: '0 0 12px' }}>403</p>
                <h2 style={{ color: 'var(--offwhite)', fontSize: '1.2rem',
                             fontWeight: 600, marginBottom: '8px' }}>
                    Access Denied
                </h2>
                <p style={{ color: 'var(--slate-light)', marginBottom: '24px' }}>
                    You need Admin privileges to access this page.
                </p>
                <button className="btn-teal" onClick={() => window.history.back()}>
                    ← Go Back
                </button>
            </div>
        );
    }

    return children;
}