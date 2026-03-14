import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import ActivityFeed from "../components/ActivityFeed";
import FlashDealCard from "../components/FlashDealCard";
import HeroDropBanner from "../components/HeroDropBanner";
import SystemMetricsPanel from "../components/SystemMetricsPanel";
import {
  categoryColors,
  featuredProducts,
  flashDeals,
  heroProduct,
} from "../data/mockData";
import { joinQueue } from "../services/queueService";
import { useQueueStore } from "../store/queueStore";
import { formatPrice } from "../utils/formatters";

interface LandingPageProps {
  navigate: (page: Page) => void;
}

export default function LandingPage({ navigate }: LandingPageProps) {
  const [isJoining, setIsJoining] = useState(false);
  const { setQueueSession, setSelectedProduct } = useQueueStore();
  const joiningProductRef = useRef<string | null>(null);

  async function handleJoinQueue(productId: string) {
    if (isJoining) return;
    setIsJoining(true);
    joiningProductRef.current = productId;
    setSelectedProduct(productId);
    try {
      const session = await joinQueue(productId);
      setQueueSession(session);
      navigate("queue");
    } catch {
      toast.error("Failed to join queue. Please try again.");
      setIsJoining(false);
      joiningProductRef.current = null;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary fill-primary" />
            <span className="font-display font-bold text-xl tracking-tight">
              FLASHDROP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-blink" />
              <span className="text-xs font-semibold text-red-400">
                LIVE DROP
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Login
            </Button>
            <Button variant="outline" size="sm" className="border-border">
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              My Orders
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <section>
          <HeroDropBanner
            onJoinQueue={() => handleJoinQueue(heroProduct.id)}
            isJoining={
              isJoining && joiningProductRef.current === heroProduct.id
            }
          />
        </section>

        <div className="overflow-hidden border-y border-border py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-0">
          <div className="flex animate-marquee whitespace-nowrap">
            {["a", "b", "c", "d"].map((k) => (
              <span key={k} className="flex items-center gap-6 px-6">
                <Zap className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Midnight Drop Event — Limited Inventory
                </span>
                <Zap className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Exclusive Releases — Queue System Active
                </span>
                <Zap className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  First Come First Served — No Restocks
                </span>
              </span>
            ))}
          </div>
        </div>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-primary fill-primary" />
            <h2 className="text-2xl font-display font-bold">
              ⚡ Flash Deals — Ending Soon
            </h2>
          </div>
          <div
            data-ocid="flash_deals.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {flashDeals.map((product, i) => (
              <FlashDealCard
                key={`${product.id}-${i}`}
                product={product}
                onJoinQueue={handleJoinQueue}
                isJoining={
                  isJoining && joiningProductRef.current === product.id
                }
                index={i + 1}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SystemMetricsPanel />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">
              Featured Products
            </h2>
            <span className="text-sm text-muted-foreground">
              Limited inventory · Queue required
            </span>
          </div>
          <div
            data-ocid="products.list"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {featuredProducts.map((product, i) => {
              const claimedPct = Math.round(
                (1 - product.inventory / product.totalInventory) * 100,
              );
              return (
                <div
                  key={product.id}
                  data-ocid={`products.item.${i + 1}`}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors"
                >
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <div
                      className="w-full h-full"
                      style={{
                        background: `radial-gradient(circle at 50% 60%, oklch(0.25 0.020 ${55 + i * 25}) 0%, oklch(0.13 0.010 265) 100%)`,
                      }}
                    />
                  </div>
                  {product.badge && (
                    <span className="text-xs font-bold tracking-widest text-primary uppercase">
                      {product.badge}
                    </span>
                  )}
                  <div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[product.category] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {product.category}
                    </span>
                    <h3 className="font-display font-semibold text-sm mt-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{claimedPct}% claimed</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${claimedPct}%`,
                          background:
                            "linear-gradient(90deg, oklch(0.74 0.175 55), oklch(0.65 0.22 28))",
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-colors font-semibold"
                    onClick={() => handleJoinQueue(product.id)}
                    disabled={isJoining}
                  >
                    Join Queue
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-display font-bold">FLASHDROP</span>
            <span className="text-xs text-muted-foreground">
              — Flash Sale Event Platform
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
