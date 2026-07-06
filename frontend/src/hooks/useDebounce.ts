import { useState, useEffect } from 'react';

/**
 * Hook useDebounce
 * Mục đích: Delay việc update giá trị cho đến khi user dừng thao tác (gõ phím) sau một khoảng thời gian (delay).
 * Tại sao tách ra hook riêng: Dễ dàng tái sử dụng ở bất kỳ form input nào (đặc biệt là search box) mà không cần viết lại logic setTimeout/clearTimeout.
 * 
 * Ví dụ sử dụng:
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue bằng value sau khoảng delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout nếu value thay đổi trước khi delay kết thúc
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
