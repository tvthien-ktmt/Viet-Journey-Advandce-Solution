import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Flight, FlightSearchRequest } from '@/types/flight';

interface FlightSelectionState {
  request: FlightSearchRequest | null;
  outbound: Flight | null;
  return: Flight | null;
  setRequest: (r: FlightSearchRequest) => void;
  setOutbound: (f: Flight | null) => void;
  setReturn: (f: Flight | null) => void;
  total: () => number;
  reset: () => void;
}

export const useFlightSelection = create<FlightSelectionState>()(
  persist(
    (set, get) => ({
      request: null,
      outbound: null,
      return: null,
      setRequest: (request) => set({ request }),
      setOutbound: (outbound) => set({ outbound }),
      setReturn: (ret) => set({ return: ret }),
      total: () => (get().outbound?.priceVND ?? 0) + (get().return?.priceVND ?? 0),
      reset: () => set({ request: null, outbound: null, return: null }),
    }),
    {
      name: 'vna-flight-selection',
    }
  )
);
