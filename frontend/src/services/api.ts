import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Example API service functions
export const get = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.get<T>(url);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText
  };
};

export const post = async <T>(url: string, data: unknown): Promise<ApiResponse<T>> => {
  const response = await api.post<T>(url, data);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText
  };
};

export const put = async <T>(url: string, data: unknown): Promise<ApiResponse<T>> => {
  const response = await api.put<T>(url, data);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText
  };
};

export const del = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.delete<T>(url);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText
  };
};

export default api;