export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface TourItinerary {
  id: number;
  dayNumber: number;
  dayTitle: string;
  content: string;
}

export interface TourHighlight {
  id: number;
  content: string;
}

export interface TourInclusion {
  id: number;
  content: string;
}

export interface TourExclusion {
  id: number;
  content: string;
}

export interface Tour {
  id: number;
  name: string;
  slug: string;
  image: string;
  location: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  duration: string;
  overview: string;
  isFeatured: boolean;
  itineraries: TourItinerary[];
  highlights: TourHighlight[];
  inclusions: TourInclusion[];
  exclusions: TourExclusion[];
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

export interface Booking {
  id: number;
  bookingType: 'tour' | 'hotel' | 'flight';
  status: 'pending' | 'reserved' | 'confirmed' | 'cancelled' | 'expired';
  totalPrice: number;
  reservedUntil?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
