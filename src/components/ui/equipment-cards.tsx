import { cn } from "@/lib/utils";
import { Fan, Light, ElectricityMeter, Tunnel, FanDirection, TunnelSummary } from "@/types/api";
import { StatusBadge, getEquipmentStatus, getLightStatus, getMeterStatus } from "./status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Fan as FanIcon,
  Lightbulb,
  Zap,
  MapPin,
  Ruler,
  ArrowRight,
  ArrowLeft,
  Square,
  Power,
  AlertTriangle,
} from "lucide-react";

/**
 * Direction labels for display
 */
const DIRECTION_LABELS: Record<FanDirection, string> = {
  [FanDirection.Forward]: "Forward",
  [FanDirection.Backward]: "Backward",
  [FanDirection.Stopped]: "Stopped",
};

/**
 * Direction icons
 */
const DIRECTION_ICONS: Record<FanDirection, any> = {
  [FanDirection.Forward]: ArrowRight,
  [FanDirection.Backward]: ArrowLeft,
  [FanDirection.Stopped]: Square,
};

/**
 * TunnelCard - Overview card for a tunnel with summary stats
 */
export interface TunnelCardProps {
  tunnel: Tunnel | TunnelSummary;
  fanCount?: number;
  lightCount?: number;
  hasAlerts?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TunnelCard({
  tunnel,
  fanCount = 0,
  lightCount = 0,
  hasAlerts = false,
  onClick,
  className,
}: TunnelCardProps) {
  // Check if it's a full Tunnel object to access 'code'
  const code = "code" in tunnel ? tunnel.code : `ID: ${tunnel.id}`;

  return (
    <Card
      className={cn(
        "card-industrial cursor-pointer group",
        hasAlerts && "border-status-critical/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {tunnel.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-mono">{code}</p>
          </div>
          {hasAlerts && (
            <StatusBadge status="critical" pulse>
              <AlertTriangle className="h-3 w-3" />
              Alert
            </StatusBadge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {tunnel.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {tunnel.location}
            </div>
          )}
          {tunnel.length && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Ruler className="h-4 w-4" />
              {tunnel.length}m
            </div>
          )}
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm">
              <FanIcon className="h-4 w-4 text-primary" />
              <span className="font-mono">{fanCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Lightbulb className="h-4 w-4 text-status-warning" />
              <span className="font-mono">{lightCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Zap className="h-4 w-4 text-chart-voltage" />
              <span className="font-mono">1</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * FanCard - Equipment card for ventilation fan
 */
interface FanCardProps {
  fan: Fan;
  onClick?: () => void;
  className?: string;
}

export function FanCard({ fan, onClick, className }: FanCardProps) {
  const status = getEquipmentStatus(fan.isRunning, fan.hasTrip, fan.isPowerOn);
  
  const DirectionIcon = DIRECTION_ICONS[fan.direction];

  return (
    <Card
      className={cn(
        "card-industrial cursor-pointer",
        status === "critical" && "border-status-critical/50 alert-pulse",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-2 rounded-lg",
                status === "operational" && "bg-status-operational/20",
                status === "warning" && "bg-status-warning/20",
                status === "critical" && "bg-status-critical/20",
                status === "offline" && "bg-status-offline/20"
              )}
            >
              <FanIcon
                className={cn(
                  "h-5 w-5",
                  fan.isRunning && "animate-spin-slow",
                  status === "operational" && "text-status-operational",
                  status === "warning" && "text-status-warning",
                  status === "critical" && "text-status-critical",
                  status === "offline" && "text-status-offline"
                )}
              />
            </div>
            <div>
              <h4 className="font-medium text-sm">{fan.name}</h4>
              {fan.position && (
                <p className="text-xs text-muted-foreground">{fan.position}m</p>
              )}
            </div>
          </div>
          <StatusBadge status={status} size="sm">
            {status === "critical" ? "TRIP" : status.toUpperCase()}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/30 rounded">
            <Power
              className={cn(
                "h-4 w-4 mx-auto mb-1",
                fan.isPowerOn ? "text-status-operational" : "text-status-offline"
              )}
            />
            <p className="text-[10px] text-muted-foreground">Power</p>
          </div>
          <div className="p-2 bg-muted/30 rounded">
            <DirectionIcon className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-[10px] text-muted-foreground">{DIRECTION_LABELS[fan.direction]}</p>
          </div>
          <div className="p-2 bg-muted/30 rounded">
            <span className="font-mono text-sm text-foreground">{fan.speed}</span>
            <p className="text-[10px] text-muted-foreground">RPM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * LightCard - Equipment card for lighting
 */
interface LightCardProps {
  light: Light;
  onClick?: () => void;
  className?: string;
}

export function LightCard({ light, onClick, className }: LightCardProps) {
  const status = getLightStatus(light.isOn);

  return (
    <Card
      className={cn("card-industrial cursor-pointer", className)}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-2 rounded-lg",
                light.isOn ? "bg-status-warning/20" : "bg-status-offline/20"
              )}
            >
              <Lightbulb
                className={cn(
                  "h-5 w-5",
                  light.isOn ? "text-status-warning" : "text-status-offline"
                )}
              />
            </div>
            <div>
              <h4 className="font-medium text-sm">{light.name}</h4>
              {light.line && (
                <p className="text-xs text-muted-foreground">Line {light.line}</p>
              )}
            </div>
          </div>
          <StatusBadge status={status} size="sm">
            {light.isOn ? "ON" : "OFF"}
          </StatusBadge>
        </div>

        {(light.scheduleStart || light.scheduleEnd) && (
          <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
            Schedule: {light.scheduleStart || "--"} → {light.scheduleEnd || "--"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * MeterCard - Equipment card for electricity meter
 */
interface MeterCardProps {
  meter: ElectricityMeter;
  tunnel?: Tunnel;
  onClick?: () => void;
  className?: string;
}

export function MeterCard({ meter, tunnel, onClick, className }: MeterCardProps) {
  const status = getMeterStatus(
    meter.isConnected,
    meter.voltage,
    tunnel?.voltageMin,
    tunnel?.voltageMax
  );

  return (
    <Card
      className={cn(
        "card-industrial cursor-pointer",
        status === "critical" && "border-status-critical/50",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-2 rounded-lg",
                status === "operational" && "bg-primary/20",
                status === "critical" && "bg-status-critical/20",
                status === "offline" && "bg-status-offline/20"
              )}
            >
              <Zap
                className={cn(
                  "h-5 w-5",
                  status === "operational" && "text-primary",
                  status === "critical" && "text-status-critical",
                  status === "offline" && "text-status-offline"
                )}
              />
            </div>
            <div>
              <h4 className="font-medium text-sm">{meter.name}</h4>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(meter.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <StatusBadge status={status} size="sm" pulse={status === "operational"}>
            {meter.isConnected ? "LIVE" : "OFFLINE"}
          </StatusBadge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted/30 rounded text-center">
            <span className="font-mono text-lg text-chart-voltage">
              {meter.voltage.toFixed(1)}
            </span>
            <p className="text-[10px] text-muted-foreground">Voltage (V)</p>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <span className="font-mono text-lg text-chart-current">
              {meter.current.toFixed(1)}
            </span>
            <p className="text-[10px] text-muted-foreground">Current (A)</p>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <span className="font-mono text-lg text-chart-power">
              {meter.power.toFixed(2)}
            </span>
            <p className="text-[10px] text-muted-foreground">Power (kW)</p>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <span className="font-mono text-lg text-foreground">
              {meter.powerFactor.toFixed(2)}
            </span>
            <p className="text-[10px] text-muted-foreground">PF</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
