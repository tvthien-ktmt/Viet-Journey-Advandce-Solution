import type { FlightBooking, Flight, Passenger, FlightSearchRequest } from '@/types/flight';
import { api } from './client';


export interface HoldRequest {
  outbound: Flight;
  return?: Flight;
  request: FlightSearchRequest;
  contactEmail: string;
  contactPhone: string;
}

export interface CreateBookingRequest {
  bookingType: string;
  referenceId: number;
  passengers?: { type: string, fullName: string, gender: string, dateOfBirth: string }[];
}

export const bookingApi = {
  createReservation: async (req: CreateBookingRequest): Promise<FlightBooking> => {
    const data = await api.post<FlightBooking>('/bookings', req);
    return data;
  },
  createBooking: async (req: CreateBookingRequest): Promise<FlightBooking> => {
    const data = await api.post<FlightBooking>('/bookings', req);
    return data;
  },
  updateAddons: async (id: string, passengers: { id: number, seatNumber?: string, baggage?: string, meal?: string }[]) => {
    const data = await api.patch<{success: boolean}>(`/bookings/${id}/addons`, { passengers });
    return data;
  },
  get: async (id: string): Promise<FlightBooking> => {
    const data = await api.get<FlightBooking>(`/bookings/${id}`);
    return data;
  },
  payVnpay: (bookingId: string, usePoints?: boolean): Promise<{ paymentUrl?: string }> =>
    api.post('/payments/create', { bookingId, paymentMethod: 'VNPAY', usePoints }),
  search: (code: string, lastName: string): Promise<FlightBooking> => 
    api.get(`/bookings/search`, { params: { code, lastName } }),
  getMyBookings: (page = 0, size = 10): Promise<{ content: FlightBooking[] }> => 
    api.get<{ content: FlightBooking[] }>(`/bookings/my-bookings`, { params: { page, size } }),
};
