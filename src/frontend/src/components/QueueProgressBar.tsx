import { cn } from "@/lib/utils";

interface QueueProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export default function QueueProgressBar({
  value,
  className,
  showLabel = false,
}: QueueProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Queue Progress</span>
          <span>{Math.round(clamped)}% cleared</span>
        </div>
      )}
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background:
              "linear-gradient(90deg, oklch(0.74 0.175 55), oklch(0.65 0.22 28))",
          }}
        />
      </div>
    </div>
  );
}
