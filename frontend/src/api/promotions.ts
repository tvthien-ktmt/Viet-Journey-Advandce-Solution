import { api } from './client';

export const promotionsApi = {
  getAll: () => api.get('/promotions'),
  getByCode: (code: string) => api.get(`/promotions/${code}`),
};
