import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QueueSession, QueueStatus } from "../types/queue";

interface QueueState {
  queueStatus: QueueStatus;
  queueToken: string | null;
  queuePosition: number | null;
  totalInQueue: number;
  estimatedWaitSeconds: number;
  reservationExpiry: number | null;
  checkoutAllowed: boolean;
  selectedProductId: string;
  orderId: string | null;
  setStatus: (status: QueueStatus) => void;
  setQueueSession: (session: QueueSession) => void;
  setQueuePosition: (position: number, total: number, waitSecs: number) => void;
  setReservationExpiry: (expiry: number) => void;
  setCheckoutAllowed: (allowed: boolean) => void;
  setSelectedProduct: (productId: string) => void;
  setOrderId: (orderId: string) => void;
  reset: () => void;
}

const initialState = {
  queueStatus: "LOBBY" as QueueStatus,
  queueToken: null,
  queuePosition: null,
  totalInQueue: 0,
  estimatedWaitSeconds: 0,
  reservationExpiry: null,
  checkoutAllowed: false,
  selectedProductId: "ultraboost-1",
  orderId: null,
};

export const useQueueStore = create<QueueState>()(
  persist(
    (set) => ({
      ...initialState,
      setStatus: (queueStatus) => set({ queueStatus }),
      setQueueSession: (session) =>
        set({
          queueToken: session.token,
          queuePosition: session.position,
          totalInQueue: session.totalInQueue,
          estimatedWaitSeconds: session.estimatedWaitSeconds,
          queueStatus: "IN_QUEUE",
        }),
      setQueuePosition: (position, total, waitSecs) =>
        set({
          queuePosition: position,
          totalInQueue: total,
          estimatedWaitSeconds: waitSecs,
        }),
      setReservationExpiry: (expiry) => set({ reservationExpiry: expiry }),
      setCheckoutAllowed: (allowed) => set({ checkoutAllowed: allowed }),
      setSelectedProduct: (productId) => set({ selectedProductId: productId }),
      setOrderId: (orderId) => set({ orderId }),
      reset: () => set(initialState),
    }),
    {
      name: "flash-sale-queue",
      partialize: (state) => ({
        queueToken: state.queueToken,
        queueStatus: state.queueStatus,
        selectedProductId: state.selectedProductId,
      }),
    },
  ),
);
