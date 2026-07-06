
export const formatVND = (n: number): string =>
  `${new Intl.NumberFormat('vi-VN').format(n)} ₫`;

export const formatDate = (d: Date | string): string =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(typeof d === 'string' ? new Date(d) : d);

export const todayStr = (): string => new Date().toISOString().split('T')[0] || '';

export const addDaysStr = (base: string, days: number): string => {
  const d = new Date(base + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0] || '';
};
