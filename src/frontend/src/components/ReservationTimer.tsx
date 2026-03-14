import { Clock } from "lucide-react";
import { useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { formatTime } from "../utils/formatters";

interface ReservationTimerProps {
  expiryMs: number;
  onExpired: () => void;
}

export default function ReservationTimer({
  expiryMs,
  onExpired,
}: ReservationTimerProps) {
  const { totalSeconds, isExpired } = useCountdown(expiryMs);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onExpired intentionally excluded to avoid re-triggering
  useEffect(() => {
    if (isExpired) onExpired();
  }, [isExpired]);

  const isUrgent = totalSeconds < 30;

  return (
    <div
      data-ocid="checkout.timer"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        isUrgent
          ? "border-red-500/50 bg-red-500/10 text-red-400"
          : "border-border bg-secondary/50 text-foreground"
      } transition-colors`}
    >
      <Clock
        className={`w-4 h-4 ${isUrgent ? "text-red-400" : "text-muted-foreground"}`}
      />
      <span className="text-xs text-muted-foreground">Reservation:</span>
      <span
        className={`font-display font-bold tabular-nums ${isUrgent ? "text-red-400 animate-blink" : ""}`}
      >
        {formatTime(totalSeconds)}
      </span>
    </div>
  );
}
