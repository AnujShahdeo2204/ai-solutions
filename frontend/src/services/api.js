import { getMockSummary, getMockRevenue, getMockCategories, getMockDelivery, getMockOrders, getMockProducts } from './mockApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

const buildQueryString = (filters) => {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.category) params.append('category', filters.category);
  if (filters.deliveryStatus) params.append('deliveryStatus', filters.deliveryStatus);
  const str = params.toString();
  return str ? `?${str}` : '';
};

const fetchAPI = async (endpoint, filters) => {
  const query = buildQueryString(filters);
  const response = await fetch(`${API_URL}${endpoint}${query}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

export const getSummary = async (filters) => {
  if (USE_MOCK) return getMockSummary(filters);
  return fetchAPI('/analytics/summary', filters);
};

export const getRevenue = async (filters) => {
  if (USE_MOCK) return getMockRevenue(filters);
  return fetchAPI('/analytics/revenue', filters);
};

export const getCategories = async (filters) => {
  if (USE_MOCK) return getMockCategories(filters);
  return fetchAPI('/analytics/categories', filters);
};

export const getDelivery = async (filters) => {
  if (USE_MOCK) return getMockDelivery(filters);
  return fetchAPI('/analytics/delivery', filters);
};

export const getOrders = async (filters) => {
  if (USE_MOCK) return getMockOrders(filters);
  return fetchAPI('/analytics/orders', filters);
};

export const getProducts = async (filters) => {
  if (USE_MOCK) return getMockProducts(filters);
  return fetchAPI('/analytics/products', filters);
};
