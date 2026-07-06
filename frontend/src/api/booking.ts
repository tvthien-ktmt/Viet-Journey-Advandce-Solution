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
    USE_MOCK ? mockCreateHold(req) : api.post('/booking/hold', req),
  get: (id: string): Promise<FlightBooking> =>
    USE_MOCK ? mockGetBooking(id) : api.get(`/booking/${id}`),
  updatePassengers: (id: string, pax: Passenger[]): Promise<FlightBooking> =>
    USE_MOCK ? mockUpdatePassengers(id, pax) : api.post(`/booking/${id}/passengers`, pax),
  payVnpay: (bookingId: string) =>
    USE_MOCK ? mockPayVnpay(bookingId) : api.post('/payment/vnpay/mock', { bookingId }),
  search: (code: string, lastName: string) => 
    api.get(`/bookings/search`, { params: { code, lastName } }),
  getMyBookings: () => 
    api.get(`/bookings/my-bookings`),
};
