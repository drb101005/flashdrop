import type { Order } from "../types/order";
import { generateOrderId, simulateDelay } from "./api";

// Backend will:
// - validate queue token owns a reservation
// - create order record in database
// - return order ID for payment
export async function createOrder(
  token: string,
  productId: string,
  productName: string,
  price: number,
): Promise<Order> {
  await simulateDelay(400);
  return {
    id: generateOrderId(),
    productId,
    productName,
    price,
    queueToken: token,
    status: "pending",
    createdAt: Date.now(),
  };
}

// Backend will:
// - validate order exists and is in pending state
// - charge payment method via Stripe
// - confirm or fail order
// - release reservation on failure
export async function processPayment(
  _orderId: string,
): Promise<{ success: boolean; failureReason?: string }> {
  await simulateDelay(2000);
  const success = Math.random() > 0.25;
  return {
    success,
    failureReason: success ? undefined : "Payment declined. Please try again.",
  };
}
