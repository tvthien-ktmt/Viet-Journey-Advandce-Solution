import { create } from 'zustand';

export type Lang = 'vn' | 'en';

import vnDict from '../locales/vi.json';
import enDict from '../locales/en.json';

export const dict = {
  vn: vnDict,
  en: enDict,
} as const;

export type Dict = (typeof dict)['vn'];

export type CallableDict = Dict & {
  (key: string): string;
};

export interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  get t(): CallableDict;
}

export const useLang = create<LangState>((set, get) => ({
  lang: 'vn',
  setLang: (l) => set({ lang: l }),
  toggle: () => set({ lang: get().lang === 'vn' ? 'en' : 'vn' }),
  get t() {
    const data = dict[get().lang];
    const tFn = (key: string) => key.split('.').reduce((acc: any, k) => acc?.[k], data) || key;
    Object.assign(tFn, data);
    return tFn as CallableDict;
  }
}));

export function useT(): CallableDict {
  const lang = useLang((s) => s.lang);
  const data = dict[lang];
  const tFn = (key: string) => key.split('.').reduce((acc: any, k) => acc?.[k], data) || key;
  Object.assign(tFn, data);
  return tFn as CallableDict;
}
