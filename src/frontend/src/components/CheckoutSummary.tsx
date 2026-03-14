import { Badge } from "@/components/ui/badge";
import { categoryColors } from "../data/mockData";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/formatters";

interface CheckoutSummaryProps {
  product: Product;
}

export default function CheckoutSummary({ product }: CheckoutSummaryProps) {
  const savings = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  return (
    <div className="bg-secondary/30 border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Limited Edition
            </Badge>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[product.category] ?? "bg-muted text-muted-foreground"}`}
            >
              {product.category}
            </span>
          </div>
          <h3 className="font-display font-bold text-xl">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {product.description}
          </p>
          {product.color && (
            <p className="text-xs text-muted-foreground mt-1">
              Color: {product.color}
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Original price</span>
          <span className="text-sm text-muted-foreground line-through">
            {product.originalPrice ? formatPrice(product.originalPrice) : "—"}
          </span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-green-400">Flash Sale Discount</span>
            <span className="text-sm text-green-400">
              −{formatPrice(savings)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center border-t border-border pt-2">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-display font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
