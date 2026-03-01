import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * StatusBadge - Visual indicator for equipment operational states
 * Used across dashboard for fans, lights, meters, and tickets
 */
const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
  {
    variants: {
      status: {
        operational: "bg-status-operational/20 text-status-operational border border-status-operational/30",
        warning: "bg-status-warning/20 text-status-warning border border-status-warning/30",
        critical: "bg-status-critical/20 text-status-critical border border-status-critical/30 alert-pulse",
        offline: "bg-status-offline/20 text-status-offline border border-status-offline/30",
        info: "bg-status-info/20 text-status-info border border-status-info/30",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
      pulse: {
        true: "status-pulse",
        false: "",
      },
    },
    defaultVariants: {
      status: "info",
      size: "md",
      pulse: false,
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  status,
  size,
  pulse,
  icon,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status, size, pulse }), className)}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Helper to map equipment state to status
export function getEquipmentStatus(isRunning: boolean, hasTrip: boolean, isPowerOn: boolean): "operational" | "warning" | "critical" | "offline" {
  if (hasTrip) return "critical";
  if (!isPowerOn) return "offline";
  if (isRunning) return "operational";
  return "warning";
}

export function getLightStatus(isOn: boolean): "operational" | "offline" {
  return isOn ? "operational" : "offline";
}

export function getMeterStatus(isConnected: boolean, voltage: number, voltageMin?: number | null, voltageMax?: number | null): "operational" | "warning" | "critical" | "offline" {
  if (!isConnected) return "offline";
  if (voltageMin && voltage < voltageMin) return "critical";
  if (voltageMax && voltage > voltageMax) return "critical";
  return "operational";
}
