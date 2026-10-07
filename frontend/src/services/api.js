import { getMockSummary, getMockRevenue, getMockCategories, getMockDelivery, getMockOrders, getMockProducts } from './mockApi';

export const DEFAULT_API_URL = 'http://localhost:5000/api';

// Dynamic API URL getter (localStorage -> env var -> default)
export const getApiUrl = () => {
  const stored = localStorage.getItem('custom_api_url');
  if (stored !== null) {
    return stored.trim();
  }
  return (import.meta.env.VITE_API_URL || DEFAULT_API_URL).trim();
};

export const setApiUrl = (value) => {
  if (value === null || value === undefined) {
    localStorage.removeItem('custom_api_url');
  } else {
    localStorage.setItem('custom_api_url', String(value).trim());
  }
};

// Allow runtime override via localStorage, defaulting to env var (or false for live API)
export const getUseMock = () => {
  const stored = localStorage.getItem('use_mock_api');
  if (stored !== null) return stored === 'true';
  return import.meta.env.VITE_USE_MOCK_API === 'true';
};

export const setUseMock = (value) => {
  localStorage.setItem('use_mock_api', String(value));
};

const buildQueryString = (filters) => {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.category) params.append('category', filters.category);
  if (filters.deliveryStatus) params.append('deliveryStatus', filters.deliveryStatus);
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', filters.limit);
  const str = params.toString();
  return str ? `?${str}` : '';
};

const fetchAPI = async (endpoint, filters) => {
  const baseUrl = getApiUrl();
  if (!baseUrl) {
    throw new Error('API Error: Backend API URL is empty. Please configure it in Settings.');
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  const query = buildQueryString(filters);
  const targetUrl = `${cleanBase}${endpoint}${query}`;

  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText} (${response.status})`);
  }
  const result = await response.json();
  return result.data !== undefined ? result.data : result;
};

// Analytics Data
export const getSummary = async (filters) => {
  if (getUseMock()) return getMockSummary(filters);
  return fetchAPI('/analytics/summary', filters);
};

export const getRevenue = async (filters) => {
  if (getUseMock()) return getMockRevenue(filters);
  return fetchAPI('/analytics/revenue', filters);
};

export const getCategories = async (filters) => {
  if (getUseMock()) return getMockCategories(filters);
  return fetchAPI('/analytics/categories', filters);
};

export const getDelivery = async (filters) => {
  if (getUseMock()) return getMockDelivery(filters);
  return fetchAPI('/analytics/delivery', filters);
};

export const getOrders = async (filters) => {
  if (getUseMock()) return getMockOrders(filters);
  return fetchAPI('/analytics/orders', filters);
};

export const getProducts = async (filters) => {
  if (getUseMock()) return getMockProducts(filters);
  return fetchAPI('/analytics/products', filters);
};

// External APIs
export const getCurrencyRates = async (base = 'INR') => {
  if (getUseMock()) return { base, rates: { EUR: 0.011, USD: 0.012, INR: 1 } };
  return fetchAPI(`/analytics/currency?base=${base}`);
};

export const getCountries = async (region = '') => {
  const baseUrl = getApiUrl();
  if (!baseUrl) throw new Error('Backend URL is empty');
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const query = region ? `?region=${encodeURIComponent(region)}` : '';
  const response = await fetch(`${cleanBase}/analytics/countries${query}`);
  if (!response.ok) throw new Error('Failed to load countries');
  const res = await response.json();
  return res.data || [];
};

// Data Ingestion APIs
export const ingestJson = async (fileOrData) => {
  const baseUrl = getApiUrl();
  if (!baseUrl) throw new Error('Backend URL is empty');
  const cleanBase = baseUrl.replace(/\/+$/, '');

  let body, headers = {};
  if (fileOrData instanceof File) {
    const formData = new FormData();
    formData.append('file', fileOrData);
    body = formData;
  } else if (typeof fileOrData === 'string') {
    headers['Content-Type'] = 'application/json';
    body = fileOrData;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(fileOrData);
  }

  const res = await fetch(`${cleanBase}/ingest/json`, { method: 'POST', headers, body });
  return res.json();
};

export const ingestCsv = async (fileOrData) => {
  const baseUrl = getApiUrl();
  if (!baseUrl) throw new Error('Backend URL is empty');
  const cleanBase = baseUrl.replace(/\/+$/, '');

  let body, headers = {};
  if (fileOrData instanceof File) {
    const formData = new FormData();
    formData.append('file', fileOrData);
    body = formData;
  } else {
    headers['Content-Type'] = 'text/csv';
    body = String(fileOrData);
  }

  const res = await fetch(`${cleanBase}/ingest/csv`, { method: 'POST', headers, body });
  return res.json();
};

export const ingestXml = async (fileOrData) => {
  const baseUrl = getApiUrl();
  if (!baseUrl) throw new Error('Backend URL is empty');
  const cleanBase = baseUrl.replace(/\/+$/, '');

  let body, headers = {};
  if (fileOrData instanceof File) {
    const formData = new FormData();
    formData.append('file', fileOrData);
    body = formData;
  } else {
    headers['Content-Type'] = 'application/xml';
    body = String(fileOrData);
  }

  const res = await fetch(`${cleanBase}/ingest/xml`, { method: 'POST', headers, body });
  return res.json();
};

export const seedDemoData = async () => {
  const baseUrl = getApiUrl();
  if (!baseUrl) throw new Error('Backend URL is empty');
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const res = await fetch(`${cleanBase}/ingest/seed`, { method: 'POST' });
  return res.json();
};

export const getPipelineStatus = async () => {
  const baseUrl = getApiUrl();
  if (!baseUrl) throw new Error('Backend URL is empty');
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const res = await fetch(`${cleanBase}/ingest/status`);
  return res.json();
};

/**
 * Health check that validates the SPECIFIC URL passed to it
 * Returns { online: false, error: ... } if empty, invalid, or unreachable
 */
export const checkBackendHealth = async (testUrl) => {
  const raw = (testUrl !== undefined && testUrl !== null) ? testUrl.trim() : getApiUrl();
  
  if (!raw) {
    return { online: false, error: 'API URL is empty. Please enter a valid URL.' };
  }

  // Validate URL protocol and format
  try {
    const parsed = new URL(raw);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { online: false, error: 'URL must start with http:// or https://' };
    }
  } catch (e) {
    return { online: false, error: 'Invalid URL format (e.g. http://localhost:5000/api)' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const clean = raw.replace(/\/+$/, '');
    const healthUrl = clean.endsWith('/api') ? `${clean}/health` : `${clean}/api/health`;

    const res = await fetch(healthUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { online: false, error: `Server returned HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    if (!data || data.success !== true) {
      return { online: false, error: 'Endpoint responded but is not a valid Order Analytics API' };
    }

    return { online: true, data };
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return { 
      online: false, 
      error: isTimeout ? 'Connection timed out (no response within 3s)' : (err.message || 'Connection refused') 
    };
  }
};
