export type TripType = 'round' | 'oneway' | 'multi';
export type CabinId = 'economy' | 'economy-special' | 'business' | 'premium';

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface FlightSearchRequest {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  tripType: TripType;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinId;
  promo?: string;
}

export interface MockFlight {
  id: string;
  flightNo: string;
  airline: string;
  departTime: string;
  arriveTime: string;
  arriveNextDay: boolean;
  duration: string;
  stops: 0 | 1;
  aircraft: string;
  cabin: string;
  priceVND: number;
  seatsLeft: number;
}

export interface FlightSearchResponse {
  outbound: MockFlight[];
  return?: MockFlight[];
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  cabin: CabinId;
  adults: number;
  children: number;
  infants: number;
}
