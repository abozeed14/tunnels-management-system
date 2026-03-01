import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api-client";

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
