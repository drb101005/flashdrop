import { Button } from "@/components/ui/button";
import { Loader2, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { formatCountdown, formatNumber } from "../utils/formatters";

interface HeroDropBannerProps {
  onJoinQueue: () => void;
  isJoining: boolean;
}

export default function HeroDropBanner({
  onJoinQueue,
  isJoining,
}: HeroDropBannerProps) {
  const targetRef = useRef(Date.now() + 5 * 60 * 1000);
  const { hours, minutes, seconds, isExpired } = useCountdown(
    targetRef.current,
  );
  const [viewerCount, setViewerCount] = useState(13842);

  useEffect(() => {
    const id = setInterval(() => {
      setViewerCount((n) => n + Math.floor((Math.random() - 0.3) * 30));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border min-h-[480px] flex items-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 60% 50%, oklch(0.20 0.030 55 / 0.6), oklch(0.11 0.010 265) 70%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.97 0.005 265) 1px, transparent 1px), linear-gradient(90deg, oklch(0.97 0.005 265) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "oklch(0.74 0.175 55)" }}
      />
      <div className="relative z-10 w-full px-8 py-12 lg:px-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Midnight Drop — Limited Release
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-2">
            UltraBoost
            <br />
            <span className="text-primary">Limited Edition</span>
          </h1>
          <p className="text-muted-foreground text-base mb-8">
            Performance running shoe · Midnight Black / Gold · Global drop
          </p>
          <div data-ocid="hero.countdown_panel" className="mb-8">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">
              Release begins in:
            </p>
            {isExpired ? (
              <div className="text-4xl font-display font-bold text-primary">
                DROP IS LIVE
              </div>
            ) : (
              <div className="text-5xl font-display font-bold tabular-nums tracking-tight">
                {formatCountdown(hours, minutes, seconds)}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              data-ocid="hero.join_queue_button"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 h-14 rounded-xl"
              onClick={onJoinQueue}
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Joining Queue...
                </>
              ) : (
                "Join Queue"
              )}
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="tabular-nums">
                {formatNumber(viewerCount)} people waiting
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-8 right-8 text-right hidden lg:block">
        <div className="text-sm text-muted-foreground line-through">$280</div>
        <div className="text-4xl font-display font-bold text-primary">$199</div>
        <div className="text-xs text-muted-foreground">29% off · 150 units</div>
      </div>
    </div>
  );
}
