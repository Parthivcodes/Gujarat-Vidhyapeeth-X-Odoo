import { cn } from "@/lib/utils";
import {
  Truck, Wrench, Gauge, Package, TrendingUp, TrendingDown, Minus,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  truck: Truck,
  wrench: Wrench,
  gauge: Gauge,
  package: Package,
};

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  className?: string;
}

export function KpiCard({ label, value, change, changeLabel, icon, className }: KpiCardProps) {
  const Icon = iconMap[icon] || Package;
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isNeutral = !change || change === 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:glow-primary",
        className
      )}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-150" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {change !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            {isPositive && <TrendingUp className="h-3.5 w-3.5 text-success" />}
            {isNegative && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
            {isNeutral && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
            <span
              className={cn(
                "text-xs font-medium",
                isPositive && "text-success",
                isNegative && "text-destructive",
                isNeutral && "text-muted-foreground"
              )}
            >
              {isPositive && "+"}
              {change}
              {typeof change === "number" && change !== 0 && !Number.isInteger(change) ? "%" : ""}
            </span>
            {changeLabel && (
              <span className="text-xs text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
