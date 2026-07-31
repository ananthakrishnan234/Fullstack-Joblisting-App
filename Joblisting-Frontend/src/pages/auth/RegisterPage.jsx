/**
 * RegisterPage.jsx — Register form
 * File path: Joblisting-Frontend/src/pages/auth/RegisterPage.jsx
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToastContext } from '../../App';

export default function RegisterPage() {
    const navigate    = useNavigate();
    const { register } = useAuth();
    const { showToast } = useToastContext();

    const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = field => e =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const errs = {};
        if (!form.name.trim() || form.name.trim().length < 2)
            errs.name = 'Name must be at least 2 characters';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
            errs.email = 'Valid email is required';
        if (!form.password || form.password.length < 6)
            errs.password = 'Password must be at least 6 characters';
        if (form.password !== form.confirm)
            errs.confirm = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            showToast('Account created! Welcome to JobBoard.');
            navigate('/');
        } catch (err) {
            showToast(err.message || 'Registration failed', 'error');
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

    const fieldError = field => errors[field] && (
        <p style={{ color: 'var(--danger)', fontSize: '0.78rem', margin: '4px 0 0' }}>
            {errors[field]}
        </p>
    );

    return (
        <div className="d-flex justify-content-center align-items-center"
             style={{ minHeight: '80vh', padding: '24px 16px' }}>
            <div style={cardStyle} className="page-enter">

                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem',
                                color: 'var(--offwhite)', margin: '0 0 6px' }}>
                        <span style={{ color: 'var(--teal)' }}>&lt;</span>
                        JobBoard
                        <span style={{ color: 'var(--teal)' }}>/&gt;</span>
                    </p>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700,
                                 color: 'var(--offwhite)', margin: 0 }}>
                        Create your account
                    </h1>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input id="name" type="text" className="form-control"
                               placeholder="Ananthakrishnan S"
                               value={form.name} onChange={handleChange('name')}
                               style={{ borderColor: errors.name ? 'var(--danger)' : undefined }} />
                        {fieldError('name')}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label" htmlFor="email">Email</label>
                        <input id="email" type="email" className="form-control"
                               placeholder="you@example.com"
                               value={form.email} onChange={handleChange('email')}
                               style={{ borderColor: errors.email ? 'var(--danger)' : undefined }} />
                        {fieldError('email')}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label className="form-label" htmlFor="password">Password</label>
                        <input id="password" type="password" className="form-control"
                               placeholder="Min. 6 characters"
                               value={form.password} onChange={handleChange('password')}
                               style={{ borderColor: errors.password ? 'var(--danger)' : undefined }} />
                        {fieldError('password')}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label className="form-label" htmlFor="confirm">Confirm Password</label>
                        <input id="confirm" type="password" className="form-control"
                               placeholder="Re-enter password"
                               value={form.confirm} onChange={handleChange('confirm')}
                               style={{ borderColor: errors.confirm ? 'var(--danger)' : undefined }} />
                        {fieldError('confirm')}
                    </div>

                    <button type="submit" className="btn-teal w-100"
                            disabled={loading}
                            style={{ height: '44px', fontSize: '0.95rem' }}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px',
                            color: 'var(--slate-light)', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 500 }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}