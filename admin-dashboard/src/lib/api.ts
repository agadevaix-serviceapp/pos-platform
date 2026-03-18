import axios from 'axios';

// API base URL - pakai proxy Vite di development
export const API_BASE_URL = '/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Customer {
  id: string;
  name: string;
  business: string;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
  updatedAt: string;
  licenses?: License[];
}

export interface License {
  id: string;
  key: string;
  customerId: string;
  appType: string;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  activatedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
}

// API Functions
export const customersApi = {
  // Get all customers
  getAll: async () => {
    const response = await api.get<{ status: string; data: Customer[] }>('/customers');
    return response.data.data;
  },

  // Get customer by ID
  getById: async (id: string) => {
    const response = await api.get<{ status: string; data: Customer }>(`/customers/${id}`);
    return response.data.data;
  },

  // Create customer
  create: async (data: { name: string; business: string; phone?: string; email?: string }) => {
    const response = await api.post<{ status: string; data: Customer }>('/customers', data);
    return response.data.data;
  },
};

export const licensesApi = {
  // Generate license key
  generate: async (data: { customerId: string; appType: string; durationDays?: number }) => {
    const response = await api.post<{ status: string; data: { licenseKey: string; license: License } }>('/licenses/generate', data);
    return response.data.data;
  },

  // Activate license
  activate: async (licenseKey: string) => {
    const response = await api.post<{ status: string; data: { license: License } }>('/licenses/activate', { licenseKey });
    return response.data.data;
  },

  // Validate license
  validate: async (licenseKey: string) => {
    const response = await api.post<{ status: string; data: { isValid: boolean; license: License; customer: Customer } }>('/licenses/validate', { licenseKey });
    return response.data.data;
  },

  // Get licenses by customer
  getByCustomer: async (customerId: string) => {
    const response = await api.get<{ status: string; data: License[] }>(`/licenses/customer/${customerId}`);
    return response.data.data;
  },
};
