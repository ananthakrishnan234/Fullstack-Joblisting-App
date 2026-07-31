/**
 * Navbar.jsx — Updated with auth state (login/logout/admin badge)
 * File path: Joblisting-Frontend/src/components/Navbar.jsx
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../App';

export default function Navbar({ bookmarkCount }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { showToast } = useToastContext();

    const handleLogout = () => {
        logout();
        showToast('Signed out successfully.');
        navigate('/');
        setMenuOpen(false);
    };

    const navStyle = {
        backgroundColor: 'var(--navy-mid)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 1000,
    };

    const linkStyle = ({ isActive }) => ({
        color: isActive ? 'var(--teal)' : 'var(--slate-light)',
        fontWeight: isActive ? 600 : 400,
        fontSize: '0.9rem',
        textDecoration: 'none',
        padding: '4px 0',
        borderBottom: isActive ? '2px solid var(--teal)' : '2px solid transparent',
        transition: 'color 0.15s, border-color 0.15s',
    });

    const BookmarkBadge = () => bookmarkCount > 0 ? (
        <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--teal)', color: 'var(--navy)',
            borderRadius: '50%', width: '18px', height: '18px',
            fontSize: '0.65rem', fontWeight: 700, marginLeft: '6px',
        }}>
            {bookmarkCount > 99 ? '99+' : bookmarkCount}
        </span>
    ) : null;

    return (
        <nav style={navStyle}>
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                height: '60px', maxWidth: '1200px', margin: '0 auto',
            }}>
                {/* Logo */}
                <span onClick={() => navigate('/')} style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 500,
                    fontSize: '1.1rem', color: 'var(--offwhite)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                    <span style={{ color: 'var(--teal)' }}>&lt;</span>
                    JobBoard
                    <span style={{ color: 'var(--teal)' }}>/&gt;</span>
                </span>

                {/* Desktop nav */}
                <div className="d-none d-md-flex" style={{ gap: '28px', alignItems: 'center' }}>
                    <NavLink to="/" style={linkStyle} end>Browse</NavLink>
                    <NavLink to="/stats" style={linkStyle}>Stats</NavLink>

                    {isAuthenticated && (
                        <NavLink to="/bookmarks" style={linkStyle}>
                            Saved <BookmarkBadge />
                        </NavLink>
                    )}

                    {/* Admin-only: Post Job */}
                    {isAdmin && (
                        <NavLink to="/add" style={() => ({})}>
                            <button className="btn-ghost"
                                    style={{ padding: '5px 14px', fontSize: '0.85rem' }}>
                                + Post Job
                            </button>
                        </NavLink>
                    )}

                    {/* Auth area */}
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* User pill */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                backgroundColor: 'var(--navy-light)',
                                border: '1px solid var(--border)',
                                borderRadius: '20px', padding: '4px 12px',
                            }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    backgroundColor: 'var(--teal)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--navy)', fontWeight: 700, fontSize: '0.7rem',
                                }}>
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span style={{ color: 'var(--offwhite)', fontSize: '0.85rem' }}>
                                    {user?.name?.split(' ')[0]}
                                </span>
                                {isAdmin && (
                                    <span style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                                        color: 'var(--teal)', border: '1px solid var(--teal)',
                                        borderRadius: '3px', padding: '1px 5px',
                                    }}>ADMIN</span>
                                )}
                            </div>
                            <button className="btn-ghost"
                                    onClick={handleLogout}
                                    style={{ padding: '5px 14px', fontSize: '0.85rem' }}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-ghost"
                                    onClick={() => navigate('/login')}
                                    style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
                                Sign In
                            </button>
                            <button className="btn-teal"
                                    onClick={() => navigate('/register')}
                                    style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className="d-md-none btn-ghost"
                        style={{ padding: '6px 10px', fontSize: '1.1rem' }}
                        onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="d-md-none" style={{
                    backgroundColor: 'var(--navy-mid)',
                    borderTop: '1px solid var(--border)',
                    padding: '16px 24px',
                    display: 'flex', flexDirection: 'column', gap: '16px',
                }} onClick={() => setMenuOpen(false)}>
                    <NavLink to="/"       style={linkStyle} end>Browse Jobs</NavLink>
                    <NavLink to="/stats"  style={linkStyle}>Stats</NavLink>
                    {isAuthenticated && (
                        <NavLink to="/bookmarks" style={linkStyle}>
                            Saved Jobs {bookmarkCount > 0 && `(${bookmarkCount})`}
                        </NavLink>
                    )}
                    {isAdmin && <NavLink to="/add" style={linkStyle}>Post a Job</NavLink>}
                    <hr style={{ borderColor: 'var(--border)', margin: '4px 0' }} />
                    {isAuthenticated ? (
                        <>
                            <span style={{ color: 'var(--slate-light)', fontSize: '0.85rem' }}>
                                Signed in as <strong style={{ color: 'var(--offwhite)' }}>{user?.name}</strong>
                                {isAdmin && <span style={{ color: 'var(--teal)', marginLeft: '6px' }}>(Admin)</span>}
                            </span>
                            <button className="btn-ghost" onClick={handleLogout}
                                    style={{ textAlign: 'left' }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login"    style={linkStyle}>Sign In</NavLink>
                            <NavLink to="/register" style={linkStyle}>Create Account</NavLink>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}