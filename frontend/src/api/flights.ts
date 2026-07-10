
import type { FlightSearchRequest, FlightSearchResponse } from '@/types/flight';
import { api } from './client';

export interface FlightDTO {
  id: number;
  flightNumber: string;
  airlineCode?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  seatClass: string;
  price: number;
  availableSeats: number;
  duration?: string;
  stops?: number;
  aircraft?: string;
  nextDay?: boolean;
}

export interface FlightResponse {
  content: FlightDTO[];
  pageable: Record<string, unknown>;
  totalElements: number;
  totalPages: number;
}

export async function searchFlights(req: FlightSearchRequest): Promise<FlightSearchResponse> {
  const data = await api.get<FlightResponse>('/flights', { 
    params: {
      departureAirport: req.from,
      arrivalAirport: req.to,
      departureTime: req.departDate ? `${req.departDate}T00:00:00` : undefined,
    } 
  });
  
  const flights = (data.content || []).map((f: FlightDTO) => ({
    id: f.id.toString(),
    flightNo: f.flightNumber,
    airline: f.airlineCode || 'VN',
    from: f.departureAirport,
    to: f.arrivalAirport,
    departTime: f.departureTime ? f.departureTime.split('T')[1]?.substring(0, 5) || '' : '',
    arriveTime: f.arrivalTime ? f.arrivalTime.split('T')[1]?.substring(0, 5) || '' : '',
    duration: f.duration || '2h 10m',
    stops: f.stops || 0,
    aircraft: f.aircraft || 'A321',
    cabin: f.seatClass,
    priceVND: f.price,
    seatsLeft: f.availableSeats,
    nextDay: f.nextDay,
  }));
  
  return { outbound: flights, request: req };
}

export async function getAirports() {
  return api.get('/airports');
}
