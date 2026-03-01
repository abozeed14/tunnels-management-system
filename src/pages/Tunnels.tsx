import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TunnelCard } from "@/components/ui/equipment-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { usePaginatedTunnels } from "@/hooks/use-tunnels";
import { useDebounce } from "@/hooks/use-debounce";
import { useNavigate } from "react-router-dom";
import { Route, Plus, Search, RefreshCw, AlertCircle } from "lucide-react";
import { TunnelForm } from "@/components/tunnels/TunnelForm";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";

export default function TunnelsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { 
    data: paginatedData, 
    isLoading, 
    isFetching, 
    isError, 
    refetch 
  } = usePaginatedTunnels({
    PageNumber: page,
    PageSize: pageSize,
    TunnelName: debouncedSearch || undefined,
  });

  const tunnels = paginatedData?.items || [];
  const totalCount = paginatedData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary flex items-center gap-2">
              <Route className="h-7 w-7" />
              Tunnels
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor tunnel infrastructure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading || isFetching}>
              <RefreshCw className={cn("h-4 w-4", (isLoading || isFetching) && "animate-spin")} />
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tunnel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tunnels..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {isError ? (
          <Card className="card-industrial border-status-critical/50">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-status-critical mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Tunnels</h3>
              <p className="text-muted-foreground mb-4">
                There was a problem loading the tunnel data. Please try again.
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoading ? (
                <>
                  {Array.from({ length: pageSize }).map((_, i) => (
                    <Card key={i} className="card-industrial">
                      <CardContent className="p-4">
                        <Skeleton className="h-32 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : tunnels.length > 0 ? (
                tunnels.map((tunnel) => (
                  <TunnelCard
                    key={tunnel.id}
                    tunnel={tunnel}
                    fanCount={tunnel.totalFans}
                    lightCount={tunnel.totalLightingLines} // Assuming this maps to lights or lines count
                    hasAlerts={tunnel.fansWithTickets > 0 || tunnel.status === "Maintenance"}
                    onClick={() => navigate(`/tunnels/${tunnel.id}`)}
                  />
                ))
              ) : (
                <Card className="card-industrial col-span-full">
                  <CardContent className="py-12 text-center">
                    <Route className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Tunnels Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {search 
                        ? `No tunnels match "${search}"` 
                        : "Add your first tunnel to start monitoring infrastructure."}
                    </p>
                    {!search && (
                      <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Tunnel
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {!isLoading && tunnels.length > 0 && (
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                isLoading={isFetching}
              />
            )}
          </div>
        )}
      </div>

      <TunnelForm open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </DashboardLayout>
  );
}
