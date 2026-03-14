import { AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueueStore } from "../store/queueStore";
import { formatNumber } from "../utils/formatters";
import QueueProgressBar from "./QueueProgressBar";

const statusMessages = [
  "Queue is moving steadily",
  "Processing earlier customers",
  "Preparing checkout slots",
  "Verifying inventory reserves",
  "Almost at the front",
];

export default function QueueStatusPanel() {
  const { queueStatus, queuePosition, totalInQueue, estimatedWaitSeconds } =
    useQueueStore();
  const [msgIdx, setMsgIdx] = useState(0);
  const [initialPosition] = useState(queuePosition ?? 1200);

  useEffect(() => {
    const id = setInterval(
      () => setMsgIdx((i) => (i + 1) % statusMessages.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);

  const progress =
    initialPosition > 0
      ? Math.round(
          ((initialPosition - (queuePosition ?? 0)) / initialPosition) * 100,
        )
      : 0;
  const waitMins = Math.ceil(estimatedWaitSeconds / 60);

  if (queueStatus === "TURN_GRANTED") {
    return (
      <div
        data-ocid="queue.turn_granted_panel"
        className="bg-card border border-primary/30 rounded-xl p-8 text-center animate-slide-up"
      >
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-display font-bold text-primary mb-2">
          Your Turn!
        </h2>
        <p className="text-muted-foreground">
          Inventory has been reserved for you.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Redirecting to checkout...
        </p>
      </div>
    );
  }

  if (queueStatus === "QUEUE_ERROR") {
    return (
      <div className="bg-card border border-destructive/30 rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-display font-bold mb-2">Queue Error</h2>
        <p className="text-muted-foreground text-sm">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div
      data-ocid="queue.status_panel"
      className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-blink" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Queue Status
        </span>
      </div>
      <div data-ocid="queue.position_display" className="text-center py-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
          Your Position
        </p>
        <div className="text-6xl font-display font-bold tabular-nums">
          #{queuePosition !== null ? formatNumber(queuePosition) : "..."}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          of {formatNumber(totalInQueue)} in queue
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Estimated Wait:{" "}
          <span className="text-foreground font-semibold">
            ~{waitMins} {waitMins === 1 ? "minute" : "minutes"}
          </span>
        </p>
      </div>
      <QueueProgressBar value={progress} showLabel />
      <div className="bg-secondary/50 rounded-lg p-3 min-h-[60px] flex items-center justify-center">
        <p
          className="text-sm text-center text-muted-foreground animate-slide-up"
          key={msgIdx}
        >
          {statusMessages[msgIdx]}
        </p>
      </div>
    </div>
  );
}
