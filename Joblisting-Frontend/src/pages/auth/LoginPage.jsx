/**
 * LoginPage.jsx — Login form
 * File path: Joblisting-Frontend/src/pages/auth/LoginPage.jsx
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToastContext } from '../../App';

export default function LoginPage() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { login } = useAuth();
    const { showToast } = useToastContext();

    const from = location.state?.from?.pathname || '/';

    const [form, setForm]       = useState({ email: '', password: '' });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = field => e =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const errs = {};
        if (!form.email.trim())    errs.email    = 'Email is required';
        if (!form.password.trim()) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await login(form.email, form.password);
            showToast('Welcome back!');
            navigate(from, { replace: true });
        } catch (err) {
            showToast(err.message || 'Invalid email or password', 'error');
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        width: '100%',
        maxWidth: '420px',
    };

    return (
        <div className="d-flex justify-content-center align-items-center"
             style={{ minHeight: '80vh', padding: '24px 16px' }}>
            <div style={cardStyle} className="page-enter">

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem',
                                color: 'var(--offwhite)', margin: '0 0 6px' }}>
                        <span style={{ color: 'var(--teal)' }}>&lt;</span>
                        JobBoard
                        <span style={{ color: 'var(--teal)' }}>/&gt;</span>
                    </p>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700,
                                 color: 'var(--offwhite)', margin: 0 }}>
                        Sign in to your account
                    </h1>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label" htmlFor="email">Email</label>
                        <input id="email" type="email" className="form-control"
                               placeholder="you@example.com"
                               value={form.email}
                               onChange={handleChange('email')}
                               style={{ borderColor: errors.email ? 'var(--danger)' : undefined }} />
                        {errors.email && (
                            <p style={{ color: 'var(--danger)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '24px' }}>
                        <label className="form-label" htmlFor="password">Password</label>
                        <input id="password" type="password" className="form-control"
                               placeholder="••••••••"
                               value={form.password}
                               onChange={handleChange('password')}
                               style={{ borderColor: errors.password ? 'var(--danger)' : undefined }} />
                        {errors.password && (
                            <p style={{ color: 'var(--danger)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="btn-teal w-100"
                            disabled={loading}
                            style={{ height: '44px', fontSize: '0.95rem' }}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px',
                            color: 'var(--slate-light)', fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 500 }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}