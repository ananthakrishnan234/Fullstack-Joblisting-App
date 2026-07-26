/**
 * AddJobPage.jsx — Create or edit a job posting
 *
 * Features:
 *  - Full form with validation (mirrors backend Bean Validation)
 *  - AI description enhancer (calls /ai/enhance-description)
 *  - Edit mode: pre-fills if ?edit=jobId param is present
 *  - Tech tag management
 *
 * File path: Joblisting-Frontend/src/pages/AddJobPage.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobsApi, aiApi } from '../services/api';
import { useToastContext } from '../App';
import TechTag from '../components/TechTag';

const INITIAL_FORM = {
  profile: '',
  desc: '',
  exp: '',
  techInput: '',
  techs: [],
};

const VALIDATION = {
  profile: (v) => !v.trim() ? 'Job title is required' :
    v.trim().length < 2 ? 'Must be at least 2 characters' : null,
  desc: (v) => !v.trim() ? 'Description is required' :
    v.trim().length < 10 ? 'Must be at least 10 characters' : null,
  exp: (v) => v === '' ? 'Experience is required' :
    isNaN(v) || parseInt(v) < 0 ? 'Must be 0 or more' :
    parseInt(v) > 50 ? 'Maximum 50 years' : null,
  techs: (v) => v.length === 0 ? 'Add at least one technology' : null,
};

export default function AddJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToastContext();

  const editId = searchParams.get('edit');
  const isEditMode = Boolean(editId);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);

  // AI enhancer state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  // Load job data in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    jobsApi.getById(editId)
      .then((res) => {
        const job = res.data;
        setForm({
          profile: job.profile || '',
          desc: job.desc || '',
          exp: job.exp?.toString() || '',
          techInput: '',
          techs: job.techs || [],
        });
      })
      .catch(() => {
        showToast('Could not load job for editing.', 'error');
        navigate('/');
      })
      .finally(() => setLoadingEdit(false));
  }, [editId, isEditMode, navigate, showToast]);

  // Field change
  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: VALIDATION[field]?.(val) }));
    }
  };

  // Blur — mark field as touched
  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: VALIDATION[field]?.(
        field === 'techs' ? form.techs : form[field]
      ),
    }));
  };

  // Add tech tag on Enter or comma
  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech();
    }
  };

  const addTech = () => {
    const tech = form.techInput.trim().toLowerCase().replace(/,/g, '');
    if (!tech) return;
    if (form.techs.includes(tech)) {
      showToast(`"${tech}" is already in the list`, 'error');
      return;
    }
    const newTechs = [...form.techs, tech];
    setForm((prev) => ({ ...prev, techs: newTechs, techInput: '' }));
    setErrors((prev) => ({ ...prev, techs: null }));
  };

  const removeTech = (tech) => {
    const newTechs = form.techs.filter((t) => t !== tech);
    setForm((prev) => ({ ...prev, techs: newTechs }));
    if (newTechs.length === 0) {
      setErrors((prev) => ({ ...prev, techs: VALIDATION.techs([]) }));
    }
  };

  // ── AI enhancer ──────────────────────────────────
  const handleEnhanceWithAI = async () => {
    if (!form.desc.trim() || form.desc.trim().length < 10) {
      showToast('Write at least 10 characters in the description first.', 'error');
      return;
    }
    setAiLoading(true);
    try {
      const res = await aiApi.enhanceDescription(form.desc, form.profile);
      setForm((prev) => ({ ...prev, desc: res.data.enhanced }));
      setAiUsed(true);
      showToast('Description enhanced with AI!');
    } catch (err) {
      showToast(err.message || 'AI enhancement failed. Check if the backend AI key is configured.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Validate all ─────────────────────────────────
  const validateAll = () => {
    const newErrors = {
      profile: VALIDATION.profile(form.profile),
      desc: VALIDATION.desc(form.desc),
      exp: VALIDATION.exp(form.exp),
      techs: VALIDATION.techs(form.techs),
    };
    setErrors(newErrors);
    setTouched({ profile: true, desc: true, exp: true, techs: true });
    return Object.values(newErrors).every((e) => !e);
  };

  // ── Submit ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    const payload = {
      profile: form.profile.trim(),
      desc: form.desc.trim(),
      exp: parseInt(form.exp, 10),
      techs: form.techs,
    };

    setSubmitting(true);
    try {
      if (isEditMode) {
        await jobsApi.update(editId, payload);
        showToast('Job updated successfully!');
        navigate(`/jobs/${editId}`);
      } else {
        const res = await jobsApi.create(payload);
        showToast('Job posted successfully!');
        navigate(`/jobs/${res.data.id}`);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEdit) {
    return (
      <div className="container" style={{ padding: '60px 16px', maxWidth: '680px' }}>
        <div className="skeleton" style={{ height: '28px', width: '40%', marginBottom: '32px' }} />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <div className="skeleton" style={{ height: '12px', width: '20%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '44px', width: '100%' }} />
          </div>
        ))}
      </div>
    );
  }

  const fieldError = (field) =>
    touched[field] && errors[field] ? (
      <p style={{ color: 'var(--danger)', fontSize: '0.78rem', margin: '4px 0 0' }}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: '680px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none',
            color: 'var(--slate-light)', cursor: 'pointer',
            fontSize: '0.85rem', padding: '0 0 16px',
          }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--offwhite)', margin: 0 }}>
          {isEditMode ? 'Edit Job' : 'Post a Job'}
        </h1>
        <p style={{ color: 'var(--slate-light)', margin: '4px 0 0', fontSize: '0.875rem' }}>
          {isEditMode ? 'Update the job details below.' : 'Fill in the details to post a new job listing.'}
        </p>
      </div>

      {/* Form card */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}
      >
        <form onSubmit={handleSubmit} noValidate>

          {/* Job Title */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="profile">Job Title / Role *</label>
            <input
              id="profile"
              type="text"
              className="form-control"
              placeholder="e.g. Senior Backend Developer"
              value={form.profile}
              onChange={handleChange('profile')}
              onBlur={handleBlur('profile')}
              style={{ borderColor: touched.profile && errors.profile ? 'var(--danger)' : undefined }}
            />
            {fieldError('profile')}
          </div>

          {/* Description + AI button */}
          <div style={{ marginBottom: '20px' }}>
            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '6px' }}>
              <label className="form-label" htmlFor="desc" style={{ margin: 0 }}>
                Job Description *
              </label>
              <button
                type="button"
                onClick={handleEnhanceWithAI}
                disabled={aiLoading}
                style={{
                  background: aiLoading ? 'transparent' : 'var(--teal-ghost)',
                  border: '1px solid var(--teal)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--teal)',
                  fontSize: '0.73rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  cursor: aiLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {aiLoading ? (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px', height: '10px',
                        border: '2px solid var(--teal)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                      }}
                    />
                    Enhancing…
                  </>
                ) : (
                  <>✦ Enhance with AI</>
                )}
              </button>
            </div>

            {aiUsed && (
              <p style={{ fontSize: '0.73rem', color: 'var(--teal)', marginBottom: '6px' }}>
                ✓ AI-enhanced — review and edit as needed
              </p>
            )}

            <textarea
              id="desc"
              className="form-control"
              placeholder="Describe the role, responsibilities, and what you're looking for…"
              rows={6}
              value={form.desc}
              onChange={handleChange('desc')}
              onBlur={handleBlur('desc')}
              style={{
                resize: 'vertical',
                borderColor: touched.desc && errors.desc ? 'var(--danger)' : undefined,
              }}
            />
            <div className="d-flex justify-content-between">
              {fieldError('desc')}
              <span
                style={{
                  fontSize: '0.72rem', color: 'var(--slate)',
                  marginLeft: 'auto', paddingTop: '4px',
                }}
              >
                {form.desc.length} / 2000
              </span>
            </div>
          </div>

          {/* Experience */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="exp">
              Years of Experience Required *
            </label>
            <input
              id="exp"
              type="number"
              className="form-control"
              placeholder="0 for fresher"
              min="0"
              max="50"
              value={form.exp}
              onChange={handleChange('exp')}
              onBlur={handleBlur('exp')}
              style={{
                maxWidth: '160px',
                borderColor: touched.exp && errors.exp ? 'var(--danger)' : undefined,
              }}
            />
            {form.exp === '0' && (
              <p style={{ color: 'var(--teal)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                ✦ This will be shown as a Fresher role
              </p>
            )}
            {fieldError('exp')}
          </div>

          {/* Tech stack */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="techInput">
              Tech Stack *
            </label>
            <div className="d-flex gap-2">
              <input
                id="techInput"
                type="text"
                className="form-control"
                placeholder="Type a tech and press Enter"
                value={form.techInput}
                onChange={(e) => setForm((prev) => ({ ...prev, techInput: e.target.value }))}
                onKeyDown={handleTechKeyDown}
                onBlur={handleBlur('techs')}
              />
              <button
                type="button"
                className="btn-ghost"
                onClick={addTech}
                style={{ whiteSpace: 'nowrap' }}
              >
                + Add
              </button>
            </div>

            {/* Tech chips */}
            {form.techs.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {form.techs.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => removeTech(tech)}
                    title={`Remove ${tech}`}
                    style={{
                      background: 'none', border: 'none',
                      padding: 0, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <TechTag tech={tech} />
                    <span style={{ color: 'var(--danger)', fontSize: '0.65rem' }}>✕</span>
                  </button>
                ))}
              </div>
            )}
            {fieldError('techs')}
          </div>

          {/* Submit */}
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn-teal"
              disabled={submitting}
              style={{ flex: 1 }}
            >
              {submitting
                ? (isEditMode ? 'Updating…' : 'Posting…')
                : (isEditMode ? 'Update Job' : 'Post Job')}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}