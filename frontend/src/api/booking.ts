import type { FlightBooking, Flight, FlightSearchRequest } from '@/types/flight';
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
  contactEmail?: string;
  contactPhone?: string;
  passengers?: { type: string, fullName: string, gender: string, birthDate: string, documentNumber?: string }[];
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
  checkin: (pnr: string, lastName: string): Promise<any> =>
    api.post('/checkin', { pnr, lastName }),
  createQRPayment: (bookingId: string): Promise<any> =>
    api.post('/payments/qr', { bookingId }),
  getPaymentStatus: (bookingId: string): Promise<any> =>
    api.get(`/payments/${bookingId}/status`),
  cancelBooking: (bookingId: string): Promise<any> =>
    api.post(`/bookings/${bookingId}/cancel`),
  changeFlight: (bookingId: string, newFlightId: number): Promise<any> =>
    api.post(`/bookings/${bookingId}/change-flight`, { newFlightId }),
};
