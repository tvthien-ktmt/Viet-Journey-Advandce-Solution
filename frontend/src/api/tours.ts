import { api } from './client';

export interface Tour {
  id: string;
  name: string;
  slug: string;
  duration: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

export interface TourDetail extends Tour {
  itinerary: string;
  description: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const getTours = (params?: { query?: string; minPrice?: number; maxPrice?: number; location?: string; page?: number; size?: number }) => {
  return api.get<PaginatedResponse<Tour>>('/tours', params);
};

export const getTourBySlug = (slug: string) => {
  return api.get<TourDetail>(`/tours/slug/${slug}`);
};
