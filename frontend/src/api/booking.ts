import type { FlightBooking, Flight, Passenger, FlightSearchRequest } from '@/types/flight';
import { mockCreateHold, mockGetBooking, mockUpdatePassengers, mockPayVnpay } from './mocks/booking';
import { api } from './client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false; // TODO: set false khi BE /booking/* ready

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
  get: async (id: string): Promise<FlightBooking> => {
    const data = await api.get<FlightBooking>(`/bookings/${id}`);
    return data;
  },
  payVnpay: (bookingId: string) =>
    api.post('/payments/create', { bookingId, paymentMethod: 'VNPAY' }),
  search: (code: string, lastName: string) => 
    api.get(`/bookings/search`, { params: { code, lastName } }),
  getMyBookings: (page = 0, size = 10) => 
    api.get(`/bookings/my-bookings`, { params: { page, size } }),
};
