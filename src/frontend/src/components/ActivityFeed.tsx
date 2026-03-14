import { useEffect, useRef, useState } from "react";
import { featuredProducts, flashDeals } from "../data/mockData";
import { formatNumber } from "../utils/formatters";

interface Entry {
  id: string;
  message: string;
  timestamp: number;
}

const allProducts = [...flashDeals, ...featuredProducts];

function randomEntry(): Entry {
  const userId = Math.floor(40000 + Math.random() * 60000);
  const product = allProducts[Math.floor(Math.random() * allProducts.length)];
  return {
    id: `${Date.now()}-${Math.random()}`,
    message: `User #${formatNumber(userId)} secured ${product.name}`,
    timestamp: Date.now(),
  };
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

const seedEntries: Entry[] = Array.from({ length: 8 }, (_, i) => ({
  id: `seed-${i}`,
  message: `User #${formatNumber(Math.floor(40000 + Math.random() * 60000))} secured ${allProducts[i % allProducts.length].name}`,
  timestamp: Date.now() - (8 - i) * 3500,
}));

export default function ActivityFeed() {
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => forceUpdate((n) => n + 1), 5000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setEntries((prev) => [randomEntry(), ...prev].slice(0, 12));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  });

  return (
    <div
      data-ocid="activity.feed"
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-blink" />
        <span className="text-sm font-semibold">Recent Activity</span>
      </div>
      <div
        ref={scrollRef}
        className="space-y-1.5 overflow-y-auto max-h-64 scrollbar-hide"
      >
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between text-xs px-2.5 py-2 rounded-lg bg-secondary/50 ${idx === 0 ? "animate-slide-up" : ""}`}
          >
            <span className="text-foreground/80 truncate pr-2">
              {entry.message}
            </span>
            <span className="text-muted-foreground whitespace-nowrap shrink-0">
              {timeAgo(entry.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
