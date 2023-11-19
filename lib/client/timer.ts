import { useEffect, useState } from 'react';

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

export const useTimer = (intervalMs: number) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), intervalMs);
    return () => clearInterval(interval);
  }, []);
  return time;
};
