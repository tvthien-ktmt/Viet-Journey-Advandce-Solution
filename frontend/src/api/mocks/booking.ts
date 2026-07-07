import type { FlightBooking, Flight, Passenger, FlightSearchRequest } from '@/types/flight';

const STORAGE_KEY = 'vna_mock_bookings';
const HOLD_MS = 10 * 60 * 1000;

function load(): Record<string, FlightBooking> {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
}

function save(data: Record<string, FlightBooking>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function genCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function mockCreateHold(payload: {
  outbound: Flight; return?: Flight; request: FlightSearchRequest;
  contactEmail: string; contactPhone: string;
}): Promise<FlightBooking> {
  await new Promise(r => setTimeout(r, 400));
  const id = 'BK' + Date.now();
  const paxCount = payload.request.adults + payload.request.children + payload.request.infants;
  const booking: FlightBooking = {
    id,
    status: 'HOLD',
    referenceId: 102345,
    bookingType: 'FLIGHT',
    reservedUntil: new Date(Date.now() + HOLD_MS).toISOString(),
    createdAt: new Date().toISOString(),
    itemSnapshot: JSON.stringify(payload.outbound),
    passengers: [],
    totalPrice: (payload.outbound.priceVND + (payload.return?.priceVND ?? 0)) * paxCount,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
  };
  const data = load();
  data[id] = booking;
  save(data);
  return booking;
}

export async function mockGetBooking(id: string): Promise<FlightBooking> {
  await new Promise(r => setTimeout(r, 200));
  const data = load();
  const b = data[id];
  if (!b) throw new Error('Booking not found');
  if (b.status === 'HOLD' && b.reservedUntil && new Date(b.reservedUntil).getTime() < Date.now()) {
    b.status = 'EXPIRED';
    data[id] = b;
    save(data);
  }
  return b;
}

export async function mockUpdatePassengers(id: string, passengers: any[]): Promise<FlightBooking> {
  await new Promise(r => setTimeout(r, 400));
  const data = load();
  const b = data[id];
  if (!b) throw new Error('Booking not found');
  b.passengers = passengers;
  b.status = 'PENDING_PAYMENT';
  data[id] = b;
  save(data);
  return b;
}

export async function mockPayVnpay(bookingId: string) {
  await new Promise(r => setTimeout(r, 1500));
  const data = load();
  const b = data[bookingId];
  if (!b) throw new Error('Not found');
  b.status = 'CONFIRMED';
  data[bookingId] = b;
  save(data);
  return { success: true, transactionId: 'VNP' + Date.now() };
}
