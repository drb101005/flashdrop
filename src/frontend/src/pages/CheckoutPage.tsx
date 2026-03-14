import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Lock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import CheckoutSummary from "../components/CheckoutSummary";
import ReservationTimer from "../components/ReservationTimer";
import { featuredProducts, flashDeals, heroProduct } from "../data/mockData";
import { useReservationTimer } from "../hooks/useReservationTimer";
import { createOrder, processPayment } from "../services/orderService";
import { useQueueStore } from "../store/queueStore";

const allProducts = [heroProduct, ...flashDeals, ...featuredProducts];

interface CheckoutPageProps {
  navigate: (page: Page) => void;
}

export default function CheckoutPage({ navigate }: CheckoutPageProps) {
  const {
    checkoutAllowed,
    queueToken,
    reservationExpiry,
    selectedProductId,
    queueStatus,
    setStatus,
    setOrderId,
  } = useQueueStore();
  useReservationTimer();

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const isProcessing = queueStatus === "PAYMENT_PROCESSING";

  const product =
    allProducts.find((p) => p.id === selectedProductId) ?? heroProduct;

  // biome-ignore lint/correctness/useExhaustiveDependencies: navigate is stable
  useEffect(() => {
    if (!checkoutAllowed) navigate("landing");
  }, [checkoutAllowed]);

  async function handlePay() {
    if (!queueToken) return;
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    setStatus("PAYMENT_PROCESSING");
    try {
      const order = await createOrder(
        queueToken,
        product.id,
        product.name,
        product.price,
      );
      const result = await processPayment(order.id);
      if (result.success) {
        setOrderId(order.id);
        setStatus("SUCCESS");
        navigate("success");
      } else {
        toast.error(
          result.failureReason ?? "Payment failed. Please try again.",
        );
        setStatus("CHECKOUT");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
      setStatus("CHECKOUT");
    }
  }

  if (queueStatus === "RESERVATION_EXPIRED") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div
          data-ocid="checkout.expired_panel"
          className="max-w-md w-full bg-card border border-destructive/30 rounded-2xl p-10 text-center"
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold mb-2">
            Reservation Expired
          </h1>
          <p className="text-muted-foreground mb-6">
            Your reserved inventory slot has expired. Head back to try again.
          </p>
          <Button
            className="w-full bg-primary text-primary-foreground"
            onClick={() => navigate("landing")}
          >
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display font-bold text-xl">FLASHDROP</span>
          </div>
          {reservationExpiry && (
            <ReservationTimer
              expiryMs={reservationExpiry}
              onExpired={() => setStatus("RESERVATION_EXPIRED")}
            />
          )}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-display font-bold">
            Complete Your Purchase
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div
              data-ocid="checkout.payment_form"
              className="bg-card border border-border rounded-xl p-6 space-y-5"
            >
              <h2 className="font-display font-semibold text-lg">
                Payment Details
              </h2>
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isProcessing}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input
                  id="card"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  disabled={isProcessing}
                  className="bg-secondary/50 font-mono"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    disabled={isProcessing}
                    className="bg-secondary/50 font-mono"
                    maxLength={7}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    disabled={isProcessing}
                    className="bg-secondary/50 font-mono"
                    maxLength={4}
                  />
                </div>
              </div>
              <Button
                data-ocid="checkout.pay_button"
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base rounded-xl"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                🔒 Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <CheckoutSummary product={product} />
            <div className="mt-4 bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-blink" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Reservation Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your item is reserved. Complete checkout before the timer
                expires.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
