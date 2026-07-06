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

export const bookingApi = {
  createHold: (req: HoldRequest): Promise<FlightBooking> =>
    USE_MOCK ? mockCreateHold(req) : api.post('/bookings', req),
  get: (id: string): Promise<FlightBooking> =>
    USE_MOCK ? mockGetBooking(id) : api.get(`/bookings/${id}`),
  updatePassengers: (id: string, pax: Passenger[]): Promise<FlightBooking> =>
    USE_MOCK ? mockUpdatePassengers(id, pax) : api.post(`/bookings/${id}/passengers`, pax),
  payVnpay: (bookingId: string) =>
    USE_MOCK ? mockPayVnpay(bookingId) : api.post('/payments/create', { bookingId, paymentMethod: 'VNPAY' }),
  search: (code: string, lastName: string) => 
    api.get(`/bookings/search`, { params: { code, lastName } }),
  getMyBookings: (page = 0, size = 10) => 
    api.get(`/bookings/my-bookings`, { params: { page, size } }),
};
