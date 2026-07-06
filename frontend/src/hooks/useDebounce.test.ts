import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { vi } from 'vitest';

// Mục đích test: Đảm bảo hook chỉ update value sau đúng N milliseconds.
// Tại sao quan trọng: Nếu hook bị lỗi, API sẽ bị gọi liên tục mỗi khi gõ phím, gây sập server.
describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should return initial value and update after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'hello', delay: 500 });

    // Ngay sau khi rerender, value phải chưa thay đổi (vì đang bị debounce)
    expect(result.current).toBe('test');

    // Fast-forward thời gian
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Bây giờ thì value phải thay đổi
    expect(result.current).toBe('hello');
  });
});
