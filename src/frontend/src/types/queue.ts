export type QueueStatus =
  | "LOBBY"
  | "QUEUE_JOINING"
  | "IN_QUEUE"
  | "TURN_GRANTED"
  | "CHECKOUT"
  | "PAYMENT_PROCESSING"
  | "SUCCESS"
  | "QUEUE_ERROR"
  | "RESERVATION_EXPIRED"
  | "SOLD_OUT"
  | "PAYMENT_FAILED";

export interface QueueSession {
  token: string;
  position: number;
  totalInQueue: number;
  estimatedWaitSeconds: number;
  joinedAt: number;
}

export interface SystemMetrics {
  usersInQueue: number;
  checkoutsPerSecond: number;
  inventoryRemaining: number;
  totalViewers: number;
}

export interface ActivityEntry {
  id: string;
  message: string;
  timestamp: number;
}
