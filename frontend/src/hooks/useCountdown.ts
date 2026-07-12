import { useState, useEffect } from 'react';

export function useCountdown(expiresAt: string): number {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    const _t = setInterval(() => {
      setRemaining(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(_t);
  }, [expiresAt]);

  return remaining;
}
