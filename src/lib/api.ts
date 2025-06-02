import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('customerconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customerconnect_token');
      localStorage.removeItem('customerconnect_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints

export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  googleAuth: '/auth/google',
  googleCallback: '/auth/google/callback', // Add this line
  profile: '/users/profile',
  
  // Customer
  customers: '/customers',
  customer: (id: string) => `/customers/${id}`,
  
  // Orders
  orders: '/orders',
  order: (id: string) => `/orders/${id}`,
  
  // Segments
  segments: '/segments',
  segment: (id: string) => `/segments/${id}`,
  segmentPreview: '/segments/preview',
  
  // Campaigns
  campaigns: '/campaigns',
  campaign: (id: string) => `/campaigns/${id}`,
  campaignSend: (id: string) => `/campaigns/${id}/send`,
  
  // AI
  aiInsights: '/ai/insights',
  aiSegmentCreation: '/ai/create-segment',
  aiMessageSuggestions: '/ai/message-suggestions',
  aiChat: '/ai/chat',
  
  // Analytics
  analytics: '/analytics',
  dashboardStats: '/analytics/dashboard',
};
