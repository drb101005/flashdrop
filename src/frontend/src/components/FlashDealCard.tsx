import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Loader2 } from "lucide-react";
import { useRef } from "react";
import { categoryColors } from "../data/mockData";
import { useCountdown } from "../hooks/useCountdown";
import type { Product } from "../types/product";
import { formatCountdown, formatPrice } from "../utils/formatters";

interface FlashDealCardProps {
  product: Product;
  onJoinQueue: (productId: string) => void;
  isJoining: boolean;
  index: number;
}

export default function FlashDealCard({
  product,
  onJoinQueue,
  isJoining,
  index,
}: FlashDealCardProps) {
  const expiryRef = useRef(product.dealExpiresAt.getTime());
  const { hours, minutes, seconds, isExpired } = useCountdown(
    expiryRef.current,
  );
  const claimedPct = Math.round(
    (1 - product.inventory / product.totalInventory) * 100,
  );
  const isUrgent = product.inventory / product.totalInventory < 0.2;

  return (
    <div
      data-ocid={`flash_deals.item.${index}`}
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[product.category] ?? "bg-muted text-muted-foreground"}`}
            >
              {product.category}
            </span>
            {product.badge && (
              <Badge
                variant="outline"
                className="text-xs border-primary/50 text-primary gap-1"
              >
                {isUrgent && <Flame className="w-3 h-3" />}
                {product.badge}
              </Badge>
            )}
          </div>
          <h3 className="font-display font-semibold text-base leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.description}
          </p>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-display font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span className={isUrgent ? "text-red-400 font-semibold" : ""}>
            {claimedPct}% claimed
          </span>
          <span>{product.inventory} left</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${claimedPct}%`,
              background: isUrgent
                ? "linear-gradient(90deg, oklch(0.55 0.22 28), oklch(0.65 0.22 28))"
                : "linear-gradient(90deg, oklch(0.74 0.175 55), oklch(0.65 0.22 28))",
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {isExpired ? (
            <span className="text-red-400">Expired</span>
          ) : (
            <span>{formatCountdown(hours, minutes, seconds)}</span>
          )}
        </div>
        <Button
          data-ocid={`flash_deals.join_queue_button.${index}`}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          onClick={() => onJoinQueue(product.id)}
          disabled={isJoining || isExpired}
        >
          {isJoining ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "Join Queue"
          )}
        </Button>
      </div>
    </div>
  );
}
