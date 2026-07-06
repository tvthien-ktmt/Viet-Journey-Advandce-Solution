import type { FlightSearchRequest, FlightSearchResponse, Flight as MockFlight } from '@/types/flight';

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

const AIRCRAFT = ['Airbus A321', 'Airbus A350', 'Boeing 787', 'Airbus A330'];
const CABIN_MULTIPLIER: Record<string, number> = {
  economy: 1, premium: 1.6, business: 3, premiumBusiness: 4.5,
};
const CABIN_LABEL: Record<string, string> = {
  economy: 'Phổ thông', premium: 'Phổ thông đặc biệt',
  business: 'Thương gia', premiumBusiness: 'Thương nhân',
};

function genFlights(from: string, to: string, date: string, cabin: string): MockFlight[] {
  const seed = hashSeed(`${from}${to}${date}${cabin}`);
  const rand = mulberry32(seed);
  const count = 4 + Math.floor(rand() * 4);
  const basePrice = 1_200_000 + Math.floor(rand() * 2_300_000);
  const multiplier = CABIN_MULTIPLIER[cabin] ?? 1;
  const cabinLabel = CABIN_LABEL[cabin] ?? cabin;
  const hh = (n: number) => String(n).padStart(2, '0');
  return Array.from({ length: count }, (_, i) => {
    const departHour = 5 + Math.floor(rand() * 18);
    const departMin = [0, 15, 30, 45][Math.floor(rand() * 4)] ?? 0;
    const durationMin = 55 + Math.floor(rand() * 180);
    const arriveTotal = departHour * 60 + departMin + durationMin;
    const arriveNextDay = arriveTotal >= 24 * 60;
    const arriveHour = Math.floor((arriveTotal % (24 * 60)) / 60);
    const arriveMin = arriveTotal % 60;
    return {
      id: `${from}${to}-${date}-${i}`,
      flightNo: `VN${100 + Math.floor(rand() * 899)}`,
      airline: 'Vietnam Airlines',
      departTime: `${hh(departHour)}:${hh(departMin)}`,
      arriveTime: `${hh(arriveHour)}:${hh(arriveMin)}`,
      nextDay: arriveNextDay,
      duration: `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`,
      stops: rand() > 0.7 ? 1 : 0,
      aircraft: AIRCRAFT[Math.floor(rand() * AIRCRAFT.length)] ?? 'Airbus A321',
      cabin: cabinLabel,
      priceVND: Math.round((basePrice + i * 150_000) * multiplier),
      seatsLeft: 1 + Math.floor(rand() * 9),
    };
  });
}

export async function mockSearchFlights(req: FlightSearchRequest): Promise<FlightSearchResponse> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    outbound: genFlights(req.from, req.to, req.departDate, req.cabin),
    return: req.tripType === 'round' && req.returnDate
      ? genFlights(req.to, req.from, req.returnDate, req.cabin)
      : undefined,
    request: req,
  };
}
