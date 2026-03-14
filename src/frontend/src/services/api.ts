// Base API layer for flash sale platform
// TODO: Replace simulation delays with real HTTP/WebSocket endpoints

export const API_BASE = "/api/v1"; // TODO: Configure for production

export function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateToken(): string {
  return `fq_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function generateOrderId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `FS${num}`;
}
