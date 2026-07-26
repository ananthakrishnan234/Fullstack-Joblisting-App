/**
 * Navbar.jsx — Top navigation bar
 *
 * File path: Joblisting-Frontend/src/components/Navbar.jsx
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ bookmarkCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navStyle = {
    backgroundColor: 'var(--navy-mid)',
    borderBottom: '1px solid var(--border)',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
    fontSize: '1.1rem',
    color: 'var(--offwhite)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  };

  const activeLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--teal)' : 'var(--slate-light)',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.9rem',
    textDecoration: 'none',
    padding: '4px 0',
    borderBottom: isActive ? '2px solid var(--teal)' : '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
  });

  return (
    <nav style={navStyle}>
      <div
        className="container-fluid"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0',
        }}
      >
        {/* Logo */}
        <span style={logoStyle} onClick={() => navigate('/')}>
          <span style={{ color: 'var(--teal)' }}>&lt;</span>
          JobBoard
          <span style={{ color: 'var(--teal)' }}>/&gt;</span>
        </span>

        {/* Desktop nav links */}
        <div
          className="d-none d-md-flex"
          style={{ gap: '28px', alignItems: 'center' }}
        >
          <NavLink to="/" style={activeLinkStyle} end>Browse Jobs</NavLink>
          <NavLink to="/stats" style={activeLinkStyle}>Stats</NavLink>
          <NavLink to="/bookmarks" style={activeLinkStyle}>
            Saved
            {bookmarkCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--teal)',
                  color: 'var(--navy)',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  marginLeft: '6px',
                }}
              >
                {bookmarkCount > 99 ? '99+' : bookmarkCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/add" style={() => ({})}>
            <button className="btn-teal" style={{ padding: '6px 16px', fontSize: '0.875rem' }}>
              + Post Job
            </button>
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="d-md-none btn-ghost"
          style={{ padding: '6px 10px', fontSize: '1.2rem' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="d-md-none"
          style={{
            backgroundColor: 'var(--navy-mid)',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <NavLink to="/" style={activeLinkStyle} end>Browse Jobs</NavLink>
          <NavLink to="/stats" style={activeLinkStyle}>Stats & Insights</NavLink>
          <NavLink to="/bookmarks" style={activeLinkStyle}>
            Saved Jobs {bookmarkCount > 0 && `(${bookmarkCount})`}
          </NavLink>
          <NavLink to="/add" style={activeLinkStyle}>Post a Job</NavLink>
        </div>
      )}
    </nav>
  );
}
