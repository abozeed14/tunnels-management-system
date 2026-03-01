import { cn } from "@/lib/utils";
import { FaultTicket, ComponentType, FaultType } from "@/types/api";
import { StatusBadge } from "./status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Fan,
  Lightbulb,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Component icons
 */
const COMPONENT_ICONS: Record<ComponentType, any> = {
  [ComponentType.Fan]: Fan,
  [ComponentType.Light]: Lightbulb,
  [ComponentType.ElectricityMeter]: Zap,
};

/**
 * Fault type labels for display
 */
const FAULT_TYPE_LABELS: Record<FaultType, string> = {
  [FaultType.FanPowerLoss]: "Fan Power Loss",
  [FaultType.FanTrip]: "Fan Trip",
  [FaultType.LightOffSchedule]: "Lighting Off Schedule",
  [FaultType.VoltageHigh]: "High Voltage",
  [FaultType.VoltageLow]: "Low Voltage",
  [FaultType.CurrentHigh]: "High Current",
  [FaultType.PowerFactorLow]: "Low Power Factor",
  [FaultType.PhaseLoss]: "Phase Loss",
  [FaultType.MeterDisconnected]: "Meter Disconnected",
  [FaultType.PowerOutage]: "Power Outage",
  [FaultType.CommunicationFailure]: "Communication Failure",
  [FaultType.HardwareMalfunction]: "Hardware Malfunction",
  [FaultType.SoftwareError]: "Software Error",
  [FaultType.Vandalism]: "Vandalism",
  [FaultType.Other]: "Other Fault",
};

/**
 * FaultAlert - Prominent alert banner for critical faults
 */
interface FaultAlertProps {
  ticket: FaultTicket;
  onClose?: () => void;
  className?: string;
}

export function FaultAlert({ ticket, onClose, className }: FaultAlertProps) {
  const ComponentIcon = COMPONENT_ICONS[ticket.componentType];

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg alert-pulse",
        className
      )}
    >
      <div className="p-2 bg-status-critical/20 rounded-lg">
        <AlertTriangle className="h-6 w-6 text-status-critical" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <ComponentIcon className="h-4 w-4 text-status-critical" />
          <span className="font-medium text-status-critical">
            {FAULT_TYPE_LABELS[ticket.faultType] || `Fault Type ${ticket.faultType}`}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {ticket.componentName} - {ticket.description || "Fault detected"}
        </p>
      </div>
      {ticket.slaMinutes && (
        <SLACountdown
          createdAt={ticket.createdAt}
          slaMinutes={ticket.slaMinutes}
        />
      )}
      {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose}>
          <CheckCircle className="h-4 w-4" />
          Close
        </Button>
      )}
    </div>
  );
}

/**
 * SLACountdown - Real-time countdown for ticket SLA
 */
interface SLACountdownProps {
  createdAt: string;
  slaMinutes: number;
  className?: string;
}

export function SLACountdown({ createdAt, slaMinutes, className }: SLACountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateRemaining = () => {
      const created = new Date(createdAt).getTime();
      const deadline = created + slaMinutes * 60 * 1000;
      const now = Date.now();
      return Math.max(0, deadline - now);
    };

    setTimeRemaining(calculateRemaining());
    const interval = setInterval(() => {
      setTimeRemaining(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, slaMinutes]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const isOverdue = timeRemaining === 0;
  const isUrgent = minutes < 15;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm",
        isOverdue && "bg-status-critical/20 text-status-critical",
        isUrgent && !isOverdue && "bg-status-warning/20 text-status-warning",
        !isUrgent && !isOverdue && "bg-muted text-muted-foreground",
        className
      )}
    >
      <Clock className="h-4 w-4" />
      {isOverdue ? (
        <span>OVERDUE</span>
      ) : (
        <span>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

/**
 * TicketRow - Compact row for ticket table
 */
interface TicketRowProps {
  ticket: FaultTicket;
  onClose?: () => void;
  onView?: () => void;
}

export function TicketRow({ ticket, onClose, onView }: TicketRowProps) {
  const ComponentIcon = COMPONENT_ICONS[ticket.componentType];

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="py-3 px-4">
        <span className="font-mono text-sm text-muted-foreground">
          #{ticket.id}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <ComponentIcon className="h-4 w-4 text-muted-foreground" />
          <span>{ticket.componentName}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status="critical" size="sm">
          {FAULT_TYPE_LABELS[ticket.faultType] || `Type ${ticket.faultType}`}
        </StatusBadge>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-muted-foreground">
          {ticket.description || "-"}
        </span>
      </td>
      <td className="py-3 px-4">
        {ticket.slaMinutes && (
          <SLACountdown
            createdAt={ticket.createdAt}
            slaMinutes={ticket.slaMinutes}
          />
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {onView && (
            <Button variant="ghost" size="sm" onClick={onView}>
              View
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

/**
 * TicketTable - Full table for fault tickets
 */
interface TicketTableProps {
  tickets: FaultTicket[];
  onCloseTicket?: (id: number) => void;
  onViewTicket?: (id: number) => void;
  className?: string;
}

export function TicketTable({
  tickets,
  onCloseTicket,
  onViewTicket,
  className,
}: TicketTableProps) {
  return (
    <Card className={cn("card-industrial", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-status-critical" />
          Open Fault Tickets
          <span className="ml-2 px-2 py-0.5 bg-status-critical/20 text-status-critical text-xs rounded-full font-mono">
            {tickets.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-industrial">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Component
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fault Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  SLA
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onClose={onCloseTicket ? () => onCloseTicket(ticket.id) : undefined}
                  onView={onViewTicket ? () => onViewTicket(ticket.id) : undefined}
                />
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No open tickets
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
