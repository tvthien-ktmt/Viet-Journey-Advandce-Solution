import { api } from './client';

export interface GlobalSearchResult {
  tours: any[];
  hotels: any[];
  flights: any[];
}

export const searchApi = {
  global: (keyword: string): Promise<{ success: boolean; data: GlobalSearchResult }> => 
    api.get(`/search?keyword=${encodeURIComponent(keyword)}`),
};
