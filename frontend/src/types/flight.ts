export type CabinId = 'economy' | 'premium' | 'business' | 'premiumBusiness';
export type TripType = 'round' | 'oneway' | 'multi';

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
  promoCode?: string;
}

export interface Flight {
  id: string;
  flightNo: string;
  from?: string;
  to?: string;
  airline: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  aircraft: string;
  cabin: string;
  priceVND: number;
  seatsLeft: number;
  nextDay?: boolean;
}

export interface FlightSearchResponse {
  outbound: Flight[];
  return?: Flight[];
  request: FlightSearchRequest;
}

export interface Passenger {
  type: 'adult' | 'child' | 'infant';
  fullName: string;
  idNumber: string;
  birthDate: string;
  gender: 'M' | 'F';
}

export type BookingStatus = 'HOLD' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

export interface BookingPassengerDTO {
  id?: number;
  fullName: string;
  email?: string;
  documentNumber?: string;
  type?: string;
  birthDate?: string;
  gender?: string;
}

export interface FlightBooking {
  id: string; // Wait, id is number in BE, we will use number or string depending on BE response, axios often parses numbers. Let's use string | number for safety.
  status: BookingStatus | string;
  bookingType?: string;
  referenceId?: number;
  reservedUntil?: string;
  createdAt?: string;
  itemSnapshot?: string; // JSON string
  passengers: BookingPassengerDTO[];
  totalPrice?: number;
  contactEmail?: string;
  contactPhone?: string;
}
