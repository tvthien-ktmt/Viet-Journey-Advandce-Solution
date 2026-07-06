import axios from 'axios';
import { useAuth } from '@/store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // withCredentials: true ensures the HttpOnly cookie is sent automatically
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: Error | unknown) => void }[] = [];

const processQueue = (error: Error | unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuth.getState().refreshToken;
      
      if (!refreshToken) {
        processQueue(error, null);
        useAuth.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(BASE_URL + '/auth/refresh', { refreshToken });
        // The new JWT will be set in the HttpOnly cookie by the backend response
        useAuth.getState().setAuth(data.data.user, data.data.token, data.data.refreshToken);
        
        processQueue(null, data.data.token);
        
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuth.getState().logout();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, params?: object): Promise<T> => apiClient.get(url, { params }).then(r => r.data?.success !== undefined ? r.data.data : r.data),
  post: <T>(url: string, body?: object): Promise<T> => apiClient.post(url, body).then(r => r.data?.success !== undefined ? r.data.data : r.data),
  put: <T>(url: string, body?: object): Promise<T> => apiClient.put(url, body).then(r => r.data?.success !== undefined ? r.data.data : r.data),
  patch: <T>(url: string, body?: object): Promise<T> => apiClient.patch(url, body).then(r => r.data?.success !== undefined ? r.data.data : r.data),
  delete: <T>(url: string): Promise<T> => apiClient.delete(url).then(r => r.data?.success !== undefined ? r.data.data : r.data),
};
