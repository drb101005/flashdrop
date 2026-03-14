import { useEffect } from "react";
import { restoreQueueSession } from "../services/queueService";
import { useQueueStore } from "../store/queueStore";

export function useQueueRecovery() {
  const { queueToken, queueStatus, setStatus } = useQueueStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect for session recovery
  useEffect(() => {
    if (!queueToken || queueStatus === "LOBBY" || queueStatus === "SUCCESS")
      return;
    if (queueStatus === "IN_QUEUE" || queueStatus === "QUEUE_JOINING") {
      restoreQueueSession(queueToken).then((session) => {
        if (!session) {
          setStatus("LOBBY");
        }
      });
    }
  }, []);
}
