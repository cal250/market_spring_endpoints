import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }
    if (error.response?.status === 404) {
      throw new Error('Resource not found.');
    }
    if (error.response?.data && typeof error.response.data === 'string') {
      throw new Error(error.response.data);
    }
    throw new Error('An unexpected error occurred. Please try again later.');
  }
);

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<Customer[]>('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Customer> => {
    try {
      const response = await api.get<Customer>(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  create: async (customer: Customer): Promise<Customer> => {
    try {
      const response = await api.post<Customer>('/customers', customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  update: async (id: number, customer: Customer): Promise<Customer> => {
    try {
      const response = await api.put<Customer>(`/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  },
}; 