
import client from '../api/client';
type Booking = any;
type BookingRequest = any;
type ApiResponse<T> = any;
type PaginatedResponse<T> = any;

export interface CreateBookingRequest {
  bookingType: 'tour' | 'hotel' | 'flight';
  referenceId: number;
  passengers: Array<{
    fullName: string;
    email?: string;
    phone?: string;
    documentNumber?: string;
  }>;
}

export const bookingService = {
  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await client.post<ApiResponse<Booking>>('/bookings', data);
    return response.data.data;
  },
  
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await client.get<ApiResponse<Booking[]>>('/bookings/me');
    return response.data.data;
  }
};
