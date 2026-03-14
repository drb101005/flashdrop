import { useEffect } from "react";
import { useQueueStore } from "../store/queueStore";

export function useReservationTimer() {
  const { reservationExpiry, queueStatus, setStatus } = useQueueStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: setStatus is a stable store action
  useEffect(() => {
    if (queueStatus !== "CHECKOUT" || !reservationExpiry) return;

    const check = () => {
      if (Date.now() >= reservationExpiry) {
        setStatus("RESERVATION_EXPIRED");
      }
    };

    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [reservationExpiry, queueStatus]);
}
