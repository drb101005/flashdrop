import { Activity, Eye, ShoppingBag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { formatNumber } from "../utils/formatters";

export default function SystemMetricsPanel() {
  const [metrics, setMetrics] = useState({
    usersInQueue: 18402,
    checkoutsPerSecond: 94,
    inventoryRemaining: 73,
    totalViewers: 32841,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((prev) => ({
        usersInQueue:
          prev.usersInQueue + Math.floor((Math.random() - 0.4) * 80),
        checkoutsPerSecond: Math.floor(80 + Math.random() * 40),
        inventoryRemaining: Math.max(
          0,
          prev.inventoryRemaining - (Math.random() > 0.7 ? 1 : 0),
        ),
        totalViewers:
          prev.totalViewers + Math.floor((Math.random() - 0.3) * 200),
      }));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const items = [
    {
      icon: Users,
      label: "Users In Queue",
      value: formatNumber(metrics.usersInQueue),
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      dotColor: "bg-blue-400",
    },
    {
      icon: Activity,
      label: "Checkouts / sec",
      value: `${metrics.checkoutsPerSecond}/s`,
      color: "text-primary",
      bgColor: "bg-primary/10",
      dotColor: "bg-primary",
    },
    {
      icon: ShoppingBag,
      label: "Inventory Remaining",
      value: formatNumber(metrics.inventoryRemaining),
      color:
        metrics.inventoryRemaining < 30 ? "text-red-400" : "text-green-400",
      bgColor:
        metrics.inventoryRemaining < 30 ? "bg-red-500/10" : "bg-green-500/10",
      dotColor: metrics.inventoryRemaining < 30 ? "bg-red-400" : "bg-green-400",
    },
    {
      icon: Eye,
      label: "Watching Now",
      value: formatNumber(metrics.totalViewers),
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      dotColor: "bg-purple-400",
    },
  ];

  return (
    <div
      data-ocid="metrics.panel"
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-blink" />
        <h2 className="text-lg font-display font-semibold">
          Live Drop Activity
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className={`rounded-lg p-4 ${item.bgColor} border border-border/50`}
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span
                className={`w-1.5 h-1.5 rounded-full ${item.dotColor} animate-blink`}
              />
            </div>
            <div className={`text-2xl font-display font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
