import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PaginatedTicketTable } from "@/components/ui/paginated-ticket-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagedTickets, useCloseTicket } from "@/hooks/use-tickets";
import { AlertTriangle, Plus, CheckCircle, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TicketsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const { data: pagedTickets, isLoading, refetch, isFetching, isError } = usePagedTickets({
    PageNumber: page,
    PageSize: pageSize,
  });
  
  const closeTicket = useCloseTicket();

  const handleRefresh = async () => {
    const { isError } = await refetch();
    if (isError) {
      toast.error("Failed to refresh tickets");
    } else {
      toast.success("Tickets refreshed successfully");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary flex items-center gap-2">
              <AlertTriangle className="h-7 w-7" />
              Fault Tickets
            </h1>
            <p className="text-muted-foreground">
              Track and resolve equipment faults
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Report Fault
          </Button>
        </div>

        {/* Tickets */}
        {isError ? (
          <Card className="card-industrial border-status-critical/50">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-16 w-16 mx-auto text-status-critical mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-status-critical">Error Loading Tickets</h3>
              <p className="text-muted-foreground mb-4">
                Failed to load ticket data. Please try again.
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : isLoading && !pagedTickets ? (
          <Card className="card-industrial">
            <CardContent className="p-4">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : pagedTickets?.items.length ? (
          <PaginatedTicketTable
            tickets={pagedTickets.items}
            totalCount={pagedTickets.totalCount}
            pageNumber={pagedTickets.pageNumber}
            pageSize={pagedTickets.pageSize}
            onPageChange={setPage}
            onCloseTicket={(id) => closeTicket.mutate(id)}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            isRefreshing={isFetching && !isLoading}
          />
        ) : (
          <Card className="card-industrial">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-status-operational mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
              <p className="text-muted-foreground mb-6">
                No fault tickets found.
              </p>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isFetching}
              >
                <RotateCw className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")} />
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
