import { getMockSummary, getMockRevenue, getMockCategories, getMockDelivery, getMockOrders, getMockProducts } from './mockApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Allow runtime override via localStorage, defaulting to env var (or false for live API if backend is available)
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
  const query = buildQueryString(filters);
  const response = await fetch(`${API_URL}${endpoint}${query}`);
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
  const query = region ? `?region=${encodeURIComponent(region)}` : '';
  const response = await fetch(`${API_URL}/analytics/countries${query}`);
  if (!response.ok) throw new Error('Failed to load countries');
  const res = await response.json();
  return res.data || [];
};

// Data Ingestion APIs
export const ingestJson = async (fileOrData) => {
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

  const res = await fetch(`${API_URL}/ingest/json`, { method: 'POST', headers, body });
  return res.json();
};

export const ingestCsv = async (fileOrData) => {
  let body, headers = {};
  if (fileOrData instanceof File) {
    const formData = new FormData();
    formData.append('file', fileOrData);
    body = formData;
  } else {
    headers['Content-Type'] = 'text/csv';
    body = String(fileOrData);
  }

  const res = await fetch(`${API_URL}/ingest/csv`, { method: 'POST', headers, body });
  return res.json();
};

export const ingestXml = async (fileOrData) => {
  let body, headers = {};
  if (fileOrData instanceof File) {
    const formData = new FormData();
    formData.append('file', fileOrData);
    body = formData;
  } else {
    headers['Content-Type'] = 'application/xml';
    body = String(fileOrData);
  }

  const res = await fetch(`${API_URL}/ingest/xml`, { method: 'POST', headers, body });
  return res.json();
};

export const seedDemoData = async () => {
  const res = await fetch(`${API_URL}/ingest/seed`, { method: 'POST' });
  return res.json();
};

export const getPipelineStatus = async () => {
  const res = await fetch(`${API_URL}/ingest/status`);
  return res.json();
};

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) return { online: false, error: res.statusText };
    const data = await res.json();
    return { online: true, data };
  } catch (err) {
    return { online: false, error: err.message };
  }
};
