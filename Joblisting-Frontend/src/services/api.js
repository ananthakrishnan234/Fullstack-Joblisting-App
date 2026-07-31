/**
 * api.js — Centralized Axios API service
 *
 * All backend calls go through this file.
 * Base URL is read from the environment variable REACT_APP_API_URL.
 * Falls back to localhost:8080 for local development.
 *
 * File path: Joblisting-Frontend/src/services/api.js
 */

import axios from 'axios';

// ─────────────────────────────────────────
// Axios Instance
// ─────────────────────────────────────────

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────
// Session ID (for bookmarks)
// ─────────────────────────────────────────

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('jb_session_id');
  if (!sessionId) {
    // Generate a simple UUID v4
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem('jb_session_id', sessionId);
  }
  return sessionId;
}

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jb_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['X-Session-Id'] = getOrCreateSessionId();

  return config;
});

// ─────────────────────────────────────────
// Response interceptor — normalize errors
// ─────────────────────────────────────────

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────

export const authApi = {
  // POST /auth/register
  register: (data) =>
    API.post('/auth/register', data),

  // POST /auth/login
  login: (data) =>
    API.post('/auth/login', data),

  // GET /auth/me
  getMe: () =>
    API.get('/auth/me'),
};

// ─────────────────────────────────────────
// Jobs API
// ─────────────────────────────────────────

export const jobsApi = {
  // GET /jobs?page=0&size=10
  getAll: (page = 0, size = 10) =>
    API.get('/jobs', { params: { page, size } }),

  // GET /jobs/{id}
  getById: (id) =>
    API.get(`/jobs/${id}`),

  // POST /jobs
  create: (data) =>
    API.post('/jobs', data),

  // PUT /jobs/{id}
  update: (id, data) =>
    API.put(`/jobs/${id}`, data),

  // DELETE /jobs/{id}
  delete: (id) =>
    API.delete(`/jobs/${id}`),

  // GET /jobs/search/{text}
  search: (text) =>
    API.get(`/jobs/search/${encodeURIComponent(text)}`),

  // POST /jobs/filter?page=0&size=10
  filter: (filterData, page = 0, size = 10) =>
    API.post('/jobs/filter', filterData, { params: { page, size } }),

  // GET /jobs/stats
  getStats: () =>
    API.get('/jobs/stats'),
};

// ─────────────────────────────────────────
// Bookmarks API
// ─────────────────────────────────────────

export const bookmarksApi = {
  // GET /bookmarks
  getAll: () =>
    API.get('/bookmarks'),

  // GET /bookmarks/ids
  getIds: () =>
    API.get('/bookmarks/ids'),

  // POST /bookmarks/{jobId}
  add: (jobId) =>
    API.post(`/bookmarks/${jobId}`),

  // DELETE /bookmarks/{jobId}
  remove: (jobId) =>
    API.delete(`/bookmarks/${jobId}`),

  // GET /bookmarks/{jobId}/check
  check: (jobId) =>
    API.get(`/bookmarks/${jobId}/check`),
};

// ─────────────────────────────────────────
// AI API
// ─────────────────────────────────────────

export const aiApi = {
  // POST /ai/enhance-description
  enhanceDescription: (description, profile) =>
    API.post('/ai/enhance-description', { description, profile }),
};

export default API;