import { api } from './client';

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

export interface HotelDetail extends Hotel {
  amenities: any[];
  rooms: any[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const getHotels = (params?: { query?: string; minPrice?: number; maxPrice?: number; location?: string; page?: number; size?: number }) => {
  return api.get<PaginatedResponse<Hotel>>('/hotels', params);
};

export const getHotelBySlug = (slug: string) => {
  return api.get<HotelDetail>(`/hotels/slug/${slug}`);
};
