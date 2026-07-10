import { api } from './client';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  tourId: number;
  createdAt: string;
  user: {
    fullName: string;
    avatar: string;
  };
}

export const reviewApi = {
  getTourReviews: (tourId: string): Promise<Review[]> => api.get(`/reviews/tour/${tourId}`),
  addReview: (data: { tourId: number; rating: number; comment: string }): Promise<Review> => api.post('/reviews', data),
  deleteReview: (id: string): Promise<void> => api.delete(`/reviews/${id}`),
};
