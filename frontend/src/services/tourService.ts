
import client from '../api/client';
type Tour = any;
type TourFilters = any;
type PaginatedResponse<T> = any;
type ApiResponse<T> = any;

export interface TourFilterParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const tourService = {
  getTours: async (params: TourFilterParams): Promise<PaginatedResponse<Tour>> => {
    const response = await client.get<ApiResponse<PaginatedResponse<Tour>>>('/tours', { params });
    return response.data.data;
  },

  getTourBySlug: async (slug: string): Promise<Tour> => {
    const response = await client.get<ApiResponse<Tour>>(`/tours/${slug}`);
    return response.data.data;
  },

  getTourById: async (id: number): Promise<Tour> => {
    const response = await client.get<ApiResponse<Tour>>(`/tours/id/${id}`);
    return response.data.data;
  }
};
