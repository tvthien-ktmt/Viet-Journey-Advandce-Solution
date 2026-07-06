
import type { FlightSearchRequest, FlightSearchResponse } from '@/types/flight';
import { mockSearchFlights } from './mocks/flights';
import { api } from './client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false; // TODO: set false khi BE /flights/search ready

export async function searchFlights(req: FlightSearchRequest): Promise<FlightSearchResponse> {
  if (USE_MOCK) return mockSearchFlights(req as any) as any;
  return api.post<FlightSearchResponse>('/flights/search', req);
}

export async function getAirports() {
  if (USE_MOCK) {
    const { AIRPORTS } = await import('@/data/vna-airports');
    return AIRPORTS;
  }
  return api.get('/airports');
}
