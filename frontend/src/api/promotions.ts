import { api } from './client';

export interface Promotion {
  id: number;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  validFrom: string;
  validUntil: string;
}

export const promotionsApi = {
  getAll: () => api.get<Promotion[]>('/promotions'),
  getByCode: (code: string) => api.get<Promotion>(`/promotions/${code}`),
};
