import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Share2, Zap } from "lucide-react";
import type { Page } from "../App";
import { featuredProducts, flashDeals, heroProduct } from "../data/mockData";
import { useQueueStore } from "../store/queueStore";
import { formatPrice } from "../utils/formatters";

const allProducts = [heroProduct, ...flashDeals, ...featuredProducts];

interface SuccessPageProps {
  navigate: (page: Page) => void;
}

export default function SuccessPage({ navigate }: SuccessPageProps) {
  const { orderId, selectedProductId, reset } = useQueueStore();
  const product =
    allProducts.find((p) => p.id === selectedProductId) ?? heroProduct;

  function handleContinue() {
    reset();
    navigate("landing");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display font-bold text-xl">FLASHDROP</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div
          data-ocid="success.panel"
          className="max-w-lg w-full bg-card border border-border rounded-2xl p-10 text-center animate-slide-up"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Order Confirmed
            </span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-2">You Got It!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been confirmed. Check your email for details.
          </p>
          <div className="bg-secondary/30 border border-border rounded-xl p-5 text-left mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono font-bold text-primary">
                #{orderId ?? "FS000000"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Product</span>
              <span className="font-semibold text-sm">{product.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="font-display font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                CONFIRMED
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold gap-2">
              <Package className="w-4 h-4" />
              View Order Details
            </Button>
            <Button
              data-ocid="success.continue_button"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              onClick={handleContinue}
            >
              Continue Shopping
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2 w-full"
            >
              <Share2 className="w-4 h-4" />
              Share This Drop
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
