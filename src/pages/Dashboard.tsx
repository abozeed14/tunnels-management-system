import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TunnelCard } from "@/components/ui/equipment-cards";
import { PaginatedTicketTable } from "@/components/ui/paginated-ticket-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTunnels } from "@/hooks/use-tunnels";
import { usePagedTickets, useCloseTicket } from "@/hooks/use-tickets";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Route,
  Fan,
  Lightbulb,
  Zap,
  AlertTriangle,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: tunnels, isLoading: tunnelsLoading } = useTunnels();
  
  const [page, setPage] = useState(1);
  const pageSize = 5; // Smaller page size for dashboard
  
  const { data: pagedTickets, isLoading: ticketsLoading, refetch: refetchTickets, isFetching: isFetchingTickets } = usePagedTickets({
    PageNumber: page,
    PageSize: pageSize,
  });
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const closeTicket = useCloseTicket();

  const handleTunnelClick = (tunnelId: number) => {
    navigate(`/tunnels/${tunnelId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">
              Control Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time infrastructure monitoring and control
            </p>
          </div>
          <StatusBadge status="operational" pulse size="lg">
            <Activity className="h-4 w-4" />
            All Systems Operational
          </StatusBadge>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="card-industrial">
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-5 rounded-lg mb-3" />
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <SummaryCard
                icon={Route}
                label="Tunnels"
                value={stats?.totalTunnels ?? 0}
                iconColor="text-primary"
              />
              <SummaryCard
                icon={Fan}
                label="Active Fans"
                value={`${stats?.activeFans ?? 0}/${stats?.totalFans ?? 0}`}
                iconColor="text-status-operational"
              />
              <SummaryCard
                icon={Lightbulb}
                label="Active Lights"
                value={`${stats?.activeLights ?? 0}/${stats?.totalLights ?? 0}`}
                iconColor="text-status-warning"
              />
              <SummaryCard
                icon={AlertTriangle}
                label="Open Alerts"
                value={stats?.activeAlerts ?? 0}
                iconColor="text-status-critical"
                highlight={(stats?.activeAlerts ?? 0) > 0}
              />
            </>
          )}
        </div>

        {/* System health */}
        <Card className="card-industrial">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-status-operational/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-status-operational" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold font-mono text-status-operational">
                      {stats?.systemHealth ?? 0}%
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1 max-w-md mx-8">
                {statsLoading ? (
                  <Skeleton className="h-3 w-full rounded-full" />
                ) : (
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-status-operational to-primary rounded-full transition-all duration-500"
                      style={{ width: `${stats?.systemHealth ?? 0}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-mono text-sm">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tunnels grid */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Tunnels Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tunnelsLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="card-industrial">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : tunnels?.length ? (
              tunnels.map((tunnel) => (
                <TunnelCard
                  key={tunnel.id}
                  tunnel={tunnel}
                  fanCount={6}
                  lightCount={22}
                  hasAlerts={pagedTickets?.items.some((t) => t.tunnelId === tunnel.id)}
                  onClick={() => handleTunnelClick(tunnel.id)}
                />
              ))
            ) : (
              <Card className="card-industrial col-span-full">
                <CardContent className="py-12 text-center">
                  <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No tunnels configured. Add a tunnel to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Fault tickets */}
        <section>
          {ticketsLoading && !pagedTickets ? (
            <Card className="card-industrial">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
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
              onRefresh={async () => {
                const { isError } = await refetchTickets();
                if (isError) {
                  toast.error("Failed to refresh tickets");
                } else {
                  toast.success("Tickets refreshed successfully");
                }
              }}
              isLoading={ticketsLoading}
              isRefreshing={isFetchingTickets && !ticketsLoading}
            />
          ) : (
            <Card className="card-industrial">
              <CardContent className="py-12 text-center text-muted-foreground">
                No active alerts
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor?: string;
  highlight?: boolean;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  highlight = false,
}: SummaryCardProps) {
  return (
    <Card className={`card-industrial ${highlight ? "border-status-critical/50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              highlight ? "bg-status-critical/20" : "bg-muted"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${highlight ? "text-status-critical" : iconColor}`}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p
              className={`text-xl font-bold font-mono ${
                highlight ? "text-status-critical" : ""
              }`}
            >
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
