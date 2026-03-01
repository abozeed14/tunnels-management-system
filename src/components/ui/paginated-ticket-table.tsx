import { cn } from "@/lib/utils";
import { FaultTicket } from "@/types/api";
import { TicketRow } from "./fault-alerts";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { AlertTriangle, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

interface PaginatedTicketTableProps {
  tickets: FaultTicket[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onCloseTicket?: (id: number) => void;
  onViewTicket?: (id: number) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  className?: string;
}

export function PaginatedTicketTable({
  tickets,
  totalCount,
  pageNumber,
  pageSize,
  onPageChange,
  onCloseTicket,
  onViewTicket,
  onRefresh,
  isLoading,
  isRefreshing,
  className,
}: PaginatedTicketTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = pageNumber < totalPages;
  const hasPreviousPage = pageNumber > 1;

  return (
    <Card className={cn("card-industrial", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-critical" />
            Fault Tickets
            <span className="ml-2 px-2 py-0.5 bg-status-critical/20 text-status-critical text-xs rounded-full font-mono">
              {totalCount}
            </span>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading || isRefreshing}
              aria-label="Refresh tickets"
              className="h-8 px-2 lg:px-3"
            >
              <RotateCw
                className={cn(
                  "h-4 w-4 mr-0 lg:mr-2",
                  isRefreshing && "animate-spin"
                )}
              />
              <span className="hidden lg:inline">Refresh</span>
            </Button>
          )}
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
            <tbody className={isLoading ? "opacity-50 pointer-events-none" : ""}>
              {tickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onClose={onCloseTicket ? () => onCloseTicket(ticket.id) : undefined}
                  onView={onViewTicket ? () => onViewTicket(ticket.id) : undefined}
                />
              ))}
              {tickets.length === 0 && !isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
          <div className="text-sm text-muted-foreground">
            Page {pageNumber} of {Math.max(1, totalPages)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageNumber - 1)}
              disabled={!hasPreviousPage || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageNumber + 1)}
              disabled={!hasNextPage || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
