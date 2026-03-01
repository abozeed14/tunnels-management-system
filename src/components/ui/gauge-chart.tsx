import { cn } from "@/lib/utils";
import { useMemo } from "react";

/**
 * GaugeChart - Semicircular gauge for displaying single metric values
 * Used for voltage, current, power factor displays
 */
interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit?: string;
  thresholds?: {
    warning?: number;
    critical?: number;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GaugeChart({
  value,
  min,
  max,
  label,
  unit = "",
  thresholds,
  size = "md",
  className,
}: GaugeChartProps) {
  const sizeConfig = {
    sm: { width: 100, height: 60, strokeWidth: 8, fontSize: 14 },
    md: { width: 140, height: 80, strokeWidth: 10, fontSize: 18 },
    lg: { width: 180, height: 100, strokeWidth: 12, fontSize: 24 },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = Math.PI * radius;

  const percentage = useMemo(() => {
    const clamped = Math.max(min, Math.min(max, value));
    return ((clamped - min) / (max - min)) * 100;
  }, [value, min, max]);

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = useMemo(() => {
    if (thresholds?.critical && value >= thresholds.critical) {
      return "hsl(var(--status-critical))";
    }
    if (thresholds?.warning && value >= thresholds.warning) {
      return "hsl(var(--status-warning))";
    }
    return "hsl(var(--primary))";
  }, [value, thresholds]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        width={config.width}
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height + 10}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.height}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.height} A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.height}`}
          fill="none"
          stroke={getColor}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-out, stroke 0.3s ease",
            filter: `drop-shadow(0 0 6px ${getColor})`,
          }}
        />
        
        {/* Value text */}
        <text
          x={config.width / 2}
          y={config.height - 5}
          textAnchor="middle"
          className="font-mono font-semibold fill-foreground"
          style={{ fontSize: config.fontSize }}
        >
          {value.toFixed(1)}
          <tspan className="text-muted-foreground" style={{ fontSize: config.fontSize * 0.6 }}>
            {unit}
          </tspan>
        </text>
      </svg>
      
      {/* Label */}
      <span className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      
      {/* Min/Max indicators */}
      <div className="flex justify-between w-full px-1 mt-0.5">
        <span className="text-[10px] text-muted-foreground font-mono">{min}</span>
        <span className="text-[10px] text-muted-foreground font-mono">{max}</span>
      </div>
    </div>
  );
}

/**
 * MetricDisplay - Simple inline metric with label and value
 */
interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  status?: "operational" | "warning" | "critical" | "offline";
  className?: string;
}

export function MetricDisplay({
  label,
  value,
  unit,
  status,
  className,
}: MetricDisplayProps) {
  const statusColors = {
    operational: "text-status-operational",
    warning: "text-status-warning",
    critical: "text-status-critical",
    offline: "text-status-offline",
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-mono text-lg font-semibold",
            status ? statusColors[status] : "text-foreground"
          )}
        >
          {typeof value === "number" ? value.toFixed(2) : value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  );
}
