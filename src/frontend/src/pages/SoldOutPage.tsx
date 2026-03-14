import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bell, XCircle, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { flashDeals, heroProduct } from "../data/mockData";
import { useQueueStore } from "../store/queueStore";

const allProducts = [heroProduct, ...flashDeals];

interface SoldOutPageProps {
  navigate: (page: Page) => void;
}

export default function SoldOutPage({ navigate }: SoldOutPageProps) {
  const { selectedProductId, reset } = useQueueStore();
  const product =
    allProducts.find((p) => p.id === selectedProductId) ?? heroProduct;
  const [email, setEmail] = useState("");

  function handleNotify() {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success(`We'll notify you at ${email} for the next drop!`);
    setEmail("");
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
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 mx-auto">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <div>
              <div
                className="text-7xl font-display font-bold"
                style={{ color: "oklch(0.45 0.22 28)" }}
              >
                SOLD OUT
              </div>
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-muted-foreground mt-2">
                Demand exceeded available inventory. All units have been
                claimed.
              </p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">423 people</span>{" "}
              purchased this item in the last 24 hours
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold">Be First Next Time</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get notified the moment the next drop goes live.
            </p>
            <div className="flex gap-2">
              <Input
                data-ocid="soldout.notify_input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50"
              />
              <Button
                data-ocid="soldout.notify_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shrink-0"
                onClick={handleNotify}
              >
                Notify Me
              </Button>
            </div>
          </div>
          <Button
            data-ocid="soldout.back_button"
            variant="outline"
            className="w-full border-border gap-2"
            onClick={() => {
              reset();
              navigate("landing");
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </div>
      </main>
    </div>
  );
}
