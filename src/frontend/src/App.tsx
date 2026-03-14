import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import CheckoutPage from "./pages/CheckoutPage";
import LandingPage from "./pages/LandingPage";
import QueuePage from "./pages/QueuePage";
import SoldOutPage from "./pages/SoldOutPage";
import SuccessPage from "./pages/SuccessPage";
import { useQueueStore } from "./store/queueStore";

export type Page = "landing" | "queue" | "checkout" | "success" | "sold-out";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const { queueStatus } = useQueueStore();

  useEffect(() => {
    if (
      queueStatus === "IN_QUEUE" ||
      queueStatus === "TURN_GRANTED" ||
      queueStatus === "QUEUE_JOINING"
    ) {
      setCurrentPage("queue");
    } else if (
      queueStatus === "CHECKOUT" ||
      queueStatus === "PAYMENT_PROCESSING" ||
      queueStatus === "RESERVATION_EXPIRED" ||
      queueStatus === "PAYMENT_FAILED"
    ) {
      setCurrentPage("checkout");
    } else if (queueStatus === "SUCCESS") {
      setCurrentPage("success");
    } else if (queueStatus === "SOLD_OUT") {
      setCurrentPage("sold-out");
    } else if (queueStatus === "LOBBY") {
      setCurrentPage("landing");
    }
  }, [queueStatus]);

  const navigate = (page: Page) => setCurrentPage(page);

  return (
    <>
      <Toaster position="top-right" />
      {currentPage === "landing" && <LandingPage navigate={navigate} />}
      {currentPage === "queue" && <QueuePage navigate={navigate} />}
      {currentPage === "checkout" && <CheckoutPage navigate={navigate} />}
      {currentPage === "success" && <SuccessPage navigate={navigate} />}
      {currentPage === "sold-out" && <SoldOutPage navigate={navigate} />}
    </>
  );
}
