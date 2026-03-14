import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import ActivityFeed from "../components/ActivityFeed";
import QueueStatusPanel from "../components/QueueStatusPanel";
import { useQueueRecovery } from "../hooks/useQueueRecovery";
import { useQueueSocket } from "../hooks/useQueueSocket";
import { useQueueStore } from "../store/queueStore";

interface QueuePageProps {
  navigate: (page: Page) => void;
}

export default function QueuePage({ navigate }: QueuePageProps) {
  const { queueStatus, queueToken, reset, setStatus } = useQueueStore();
  const isActive =
    queueStatus === "IN_QUEUE" || queueStatus === "QUEUE_JOINING";
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  useQueueRecovery();
  useQueueSocket(queueToken, isActive);

  // biome-ignore lint/correctness/useExhaustiveDependencies: navigate and setStatus are stable references
  useEffect(() => {
    if (queueStatus !== "TURN_GRANTED") return;
    setRedirectCountdown(3);
    const id = setInterval(() => {
      setRedirectCountdown((n) => {
        if (n <= 1) {
          clearInterval(id);
          setStatus("CHECKOUT");
          navigate("checkout");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [queueStatus]);

  function handleLeaveQueue() {
    reset();
    navigate("landing");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display font-bold text-xl">FLASHDROP</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-blink" />
            <span className="text-xs font-semibold text-primary">IN QUEUE</span>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display font-bold mb-2">
            {queueStatus === "TURN_GRANTED"
              ? "It's Your Turn!"
              : "You're In Line"}
          </h1>
          <p className="text-muted-foreground">
            {queueStatus === "TURN_GRANTED"
              ? `Redirecting to checkout in ${redirectCountdown}...`
              : "Hold on — we'll let you know when it's your turn"}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <QueueStatusPanel />
            <div className="mt-4 flex justify-center">
              <Button
                data-ocid="queue.leave_button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2"
                onClick={handleLeaveQueue}
                disabled={queueStatus === "TURN_GRANTED"}
              >
                <ArrowLeft className="w-4 h-4" />
                Leave Queue
              </Button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
