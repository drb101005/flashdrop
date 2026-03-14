import type { QueueSession } from "../types/queue";
import { generateToken, simulateDelay } from "./api";

export async function joinQueue(_productId: string): Promise<QueueSession> {
  await simulateDelay(800);
  const position = Math.floor(800 + Math.random() * 600);
  const totalInQueue = position + Math.floor(Math.random() * 8000) + 12000;
  return {
    token: generateToken(),
    position,
    totalInQueue,
    estimatedWaitSeconds: Math.floor(position * 0.15),
    joinedAt: Date.now(),
  };
}

export async function getQueueStatus(_token: string): Promise<{
  position: number;
  totalInQueue: number;
  estimatedWaitSeconds: number;
  checkoutAllowed: boolean;
}> {
  await simulateDelay(300);
  return {
    position: 0,
    totalInQueue: 18402,
    estimatedWaitSeconds: 0,
    checkoutAllowed: true,
  };
}

// Backend will: look up queue session by token, validate token expiry, restore position state
export async function restoreQueueSession(
  token: string,
): Promise<QueueSession | null> {
  await simulateDelay(400);
  // Simulate a valid session restore so the queue waiting room stays active.
  // In production this validates the token with the backend and returns null if expired.
  const position = Math.floor(200 + Math.random() * 600);
  return {
    token,
    position,
    totalInQueue: position + Math.floor(Math.random() * 8000) + 12000,
    estimatedWaitSeconds: Math.floor(position * 0.15),
    joinedAt: Date.now(),
  };
}

export async function reserveInventory(
  _token: string,
  _productId: string,
): Promise<{ success: boolean; reservationExpiry: number }> {
  await simulateDelay(500);
  const success = Math.random() > 0.1;
  return {
    success,
    reservationExpiry: Date.now() + 2 * 60 * 1000,
  };
}
