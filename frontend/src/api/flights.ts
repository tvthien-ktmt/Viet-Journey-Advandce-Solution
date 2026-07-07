
import type { FlightSearchRequest, FlightSearchResponse } from '@/types/flight';
import { mockSearchFlights } from './mocks/flights';
import { api } from './client';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false; // TODO: set false khi BE /flights/search ready

export async function searchFlights(req: FlightSearchRequest): Promise<FlightSearchResponse> {
  if (USE_MOCK) return mockSearchFlights(req);
  const data = await api.get<any>('/flights', { 
    params: {
      departureAirport: req.from,
      arrivalAirport: req.to,
      departureTime: req.departDate ? `${req.departDate}T00:00:00` : undefined,
    } 
  });
  
  const flights = (data.content || []).map((f: any) => ({
    id: f.id.toString(),
    flightNo: f.flightNumber,
    airline: f.airlineCode || 'VN',
    from: f.departureAirport,
    to: f.arrivalAirport,
    departTime: f.departureTime ? f.departureTime.split('T')[1].substring(0, 5) : '',
    arriveTime: f.arrivalTime ? f.arrivalTime.split('T')[1].substring(0, 5) : '',
    duration: '2h 10m', // mockup
    stops: 0,
    aircraft: 'A321', // mockup
    cabin: f.seatClass,
    priceVND: f.price,
    seatsLeft: f.availableSeats,
  }));
  
  return { outbound: flights, request: req };
}

export async function getAirports() {
  if (USE_MOCK) {
    const { AIRPORTS } = await import('@/data/vna-airports');
    return AIRPORTS;
  }
  return api.get('/airports');
}
