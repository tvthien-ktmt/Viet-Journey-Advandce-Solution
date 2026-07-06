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
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
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
  get: <T>(url: string, params?: object) => apiClient.get<T>(url, { params }).then(r => r.data),
  post: <T>(url: string, body?: object) => apiClient.post<T>(url, body).then(r => r.data),
  put: <T>(url: string, body?: object) => apiClient.put<T>(url, body).then(r => r.data),
  patch: <T>(url: string, body?: object) => apiClient.patch<T>(url, body).then(r => r.data),
  delete: <T>(url: string) => apiClient.delete<T>(url).then(r => r.data),
};
