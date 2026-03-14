import { useEffect, useState } from "react";

interface CountdownValues {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

// TODO: Replace targetMs with server-synced timestamp from WebSocket heartbeat
export function useCountdown(targetMs: number): CountdownValues {
  const calc = () => {
    const diff = Math.max(0, targetMs - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isExpired: diff === 0,
      totalSeconds,
    };
  };

  const [values, setValues] = useState<CountdownValues>(calc);

  // biome-ignore lint/correctness/useExhaustiveDependencies: calc is intentionally defined inside to capture targetMs
  useEffect(() => {
    if (values.isExpired) return;
    const id = setInterval(() => {
      const next = calc();
      setValues(next);
      if (next.isExpired) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return values;
}
