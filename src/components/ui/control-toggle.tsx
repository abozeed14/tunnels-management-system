import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

/**
 * ControlToggle - Industrial-style toggle for equipment control
 * Supports power states, directional controls, and loading states
 */
const controlToggleVariants = cva(
  "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 control-btn focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        power: "bg-secondary hover:bg-secondary/80 data-[active=true]:bg-status-operational data-[active=true]:text-primary-foreground data-[active=true]:glow-success",
        direction: "bg-secondary hover:bg-secondary/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:glow-primary",
        danger: "bg-secondary hover:bg-secondary/80 data-[active=true]:bg-status-critical data-[active=true]:text-white data-[active=true]:glow-critical",
        neutral: "bg-secondary hover:bg-secondary/80 data-[active=true]:bg-muted-foreground data-[active=true]:text-background",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
      },
    },
    defaultVariants: {
      variant: "power",
      size: "md",
    },
  }
);

interface ControlToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof controlToggleVariants> {
  isActive?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ControlToggle({
  variant,
  size,
  isActive = false,
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ControlToggleProps) {
  return (
    <button
      data-active={isActive}
      disabled={disabled || isLoading}
      className={cn(controlToggleVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

/**
 * ControlToggleGroup - Group of mutually exclusive toggles
 */
interface ControlToggleGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ControlToggleGroup({ children, className }: ControlToggleGroupProps) {
  return (
    <div className={cn("inline-flex gap-1 p-1 bg-muted/50 rounded-lg", className)}>
      {children}
    </div>
  );
}
