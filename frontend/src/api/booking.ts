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
  createHold: async (req: HoldRequest): Promise<FlightBooking> => {
    if (USE_MOCK) return mockCreateHold(req);
    const data: any = await api.post('/bookings', req);
    return { ...data, bookingCode: 'BK' + data.id, totalAmount: data.totalPrice, expiresAt: data.reservedUntil };
  },
  createBooking: async (req: CreateBookingRequest): Promise<any> => {
    return api.post('/bookings', req);
  },
  get: async (id: string): Promise<FlightBooking> => {
    if (USE_MOCK) return mockGetBooking(id);
    const data: any = await api.get(`/bookings/${id}`);
    return { ...data, bookingCode: 'BK' + data.id, totalAmount: data.totalPrice, expiresAt: data.reservedUntil };
  },
  updatePassengers: (id: string, pax: Passenger[]): Promise<FlightBooking> =>
    USE_MOCK ? mockUpdatePassengers(id, pax) : api.post(`/bookings/${id}/passengers`, pax),
  payVnpay: (bookingId: string) =>
    USE_MOCK ? mockPayVnpay(bookingId) : api.post('/payments/create', { bookingId, paymentMethod: 'VNPAY' }),
  search: (code: string, lastName: string) => 
    api.get(`/bookings/search`, { params: { code, lastName } }),
  getMyBookings: (page = 0, size = 10) => 
    api.get(`/bookings/my-bookings`, { params: { page, size } }),
};
