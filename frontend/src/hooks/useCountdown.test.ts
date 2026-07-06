import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';
import { vi } from 'vitest';

// Mục đích test: Đảm bảo đếm ngược đúng thời gian và tự ngắt.
describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should count down correctly', () => {
    // Current time is mocked to some value. Let's set it to 0.
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    
    // Expires in 10 seconds
    const expiresAt = new Date('2025-01-01T00:00:10Z').toISOString();
    
    const { result } = renderHook(() => useCountdown(expiresAt));
    
    expect(result.current).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(9);
  });

  it('should stop at zero', () => {
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    
    const expiresAt = new Date('2025-01-01T00:00:02Z').toISOString();
    
    const { result } = renderHook(() => useCountdown(expiresAt));
    
    expect(result.current).toBe(2);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toBe(0);
  });
});
