import { cn } from "@/lib/utils";

type StatusVariant =
  | "active" | "inactive" | "maintenance" | "retired"
  | "draft" | "dispatched" | "in_progress" | "completed" | "cancelled"
  | "scheduled" | "suspended"
  | "success" | "warning" | "danger";

const variantStyles: Record<StatusVariant, string> = {
  active: "bg-success/15 text-success border-success/25",
  inactive: "bg-muted text-muted-foreground border-border",
  maintenance: "bg-warning/15 text-warning border-warning/25",
  retired: "bg-muted text-muted-foreground border-border",
  draft: "bg-secondary text-secondary-foreground border-border",
  dispatched: "bg-primary/15 text-primary border-primary/25",
  in_progress: "bg-chart-3/15 text-chart-3 border-chart-3/25",
  completed: "bg-success/15 text-success border-success/25",
  cancelled: "bg-destructive/15 text-destructive border-destructive/25",
  scheduled: "bg-primary/15 text-primary border-primary/25",
  suspended: "bg-destructive/15 text-destructive border-destructive/25",
  success: "bg-success/15 text-success border-success/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  danger: "bg-destructive/15 text-destructive border-destructive/25",
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, label, className, dot = true }: StatusBadgeProps) {
  const displayLabel = label || status.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize tracking-wide",
        variantStyles[status] || variantStyles.inactive,
        className
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      )}
      {displayLabel}
    </span>
  );
}
