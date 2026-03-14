import { useEffect, useRef } from "react";
import { useQueueStore } from "../store/queueStore";

// TODO: Replace with real WebSocket connection
// WS endpoint: wss://api.flashdrop.io/queue/ws?token=<queueToken>
// Expected events:
//   { type: 'POSITION_UPDATE', position: number, totalInQueue: number, estimatedWaitSeconds: number }
//   { type: 'TURN_GRANTED', reservationExpiry: number }
//   { type: 'SOLD_OUT' }

export function useQueueSocket(token: string | null, active: boolean) {
  const {
    queuePosition,
    setQueuePosition,
    setStatus,
    setReservationExpiry,
    setCheckoutAllowed,
  } = useQueueStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const positionRef = useRef<number>(queuePosition ?? 1200);

  // biome-ignore lint/correctness/useExhaustiveDependencies: store actions are stable, intentional dep array
  useEffect(() => {
    if (!active || !token) return;

    positionRef.current = queuePosition ?? 1200;

    intervalRef.current = setInterval(() => {
      const decrement = Math.floor(Math.random() * 120) + 60;
      const newPosition = Math.max(0, positionRef.current - decrement);
      positionRef.current = newPosition;

      const totalInQueue = 18000 + Math.floor(Math.random() * 1000);
      const estimatedWaitSeconds = Math.floor(newPosition * 0.15);

      setQueuePosition(newPosition, totalInQueue, estimatedWaitSeconds);

      if (newPosition === 0) {
        clearInterval(intervalRef.current!);
        const expiry = Date.now() + 2 * 60 * 1000;
        setReservationExpiry(expiry);
        setCheckoutAllowed(true);
        setStatus("TURN_GRANTED");
      }
    }, 2500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, token]);
}
