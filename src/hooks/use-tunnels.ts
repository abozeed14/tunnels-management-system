import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tunnelsApi, fansApi, lightsApi, electricityApi } from "@/lib/api-client";
import { CreateTunnel, FanControl, LightControl, CreateFan, Fan, TunnelFilter } from "@/types/api";
import { toast } from "sonner";

// Query keys
export const tunnelKeys = {
  all: ["tunnels"] as const,
  list: (params: TunnelFilter) => ["tunnels", "list", params] as const,
  detail: (id: number) => ["tunnels", id] as const,
  fans: (tunnelId: number) => ["tunnels", tunnelId, "fans"] as const,
  lights: (tunnelId: number) => ["tunnels", tunnelId, "lights"] as const,
  meter: (tunnelId: number) => ["tunnels", tunnelId, "meter"] as const,
  history: (meterId: number) => ["electricity", meterId, "history"] as const,
};

// Tunnels hooks
export function useTunnels() {
  return useQuery({
    queryKey: tunnelKeys.all,
    queryFn: tunnelsApi.getAll,
    staleTime: 30000, // 30 seconds
  });
}

export function usePaginatedTunnels(params: TunnelFilter) {
  return useQuery({
    queryKey: tunnelKeys.list(params),
    queryFn: () => tunnelsApi.getPaginated(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useTunnel(id: number) {
  return useQuery({
    queryKey: tunnelKeys.detail(id),
    queryFn: () => tunnelsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTunnel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tunnel: CreateTunnel) => tunnelsApi.create(tunnel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tunnelKeys.all });
      toast.success("Tunnel created successfully");
    },
    onError: () => {
      toast.error("Failed to create tunnel");
    },
  });
}

export function useUpdateTunnel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTunnel> }) =>
      tunnelsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tunnelKeys.all });
      queryClient.invalidateQueries({ queryKey: tunnelKeys.detail(id) });
      toast.success("Tunnel updated successfully");
    },
    onError: () => {
      toast.error("Failed to update tunnel");
    },
  });
}

export function useDeleteTunnel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => tunnelsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tunnelKeys.all });
      toast.success("Tunnel deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete tunnel");
    },
  });
}

// Fans hooks
export function useFans(tunnelId: number) {
  return useQuery({
    queryKey: tunnelKeys.fans(tunnelId),
    queryFn: () => fansApi.getByTunnel(tunnelId),
    enabled: !!tunnelId,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });
}

export function useCreateFan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (fan: CreateFan) => fansApi.create(fan),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tunnelKeys.fans(variables.tunnelId) });
      toast.success("Fan created successfully");
    },
    onError: () => {
      toast.error("Failed to create fan");
    },
  });
}

export function useUpdateFan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Fan> }) =>
      fansApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tunnelKeys.fans(data.tunnelId) });
      toast.success("Fan updated successfully");
    },
    onError: () => {
      toast.error("Failed to update fan");
    },
  });
}

export function useControlFan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, command }: { id: number; command: FanControl; tunnelId: number }) =>
      fansApi.control(id, command),
    onMutate: async ({ id, command, tunnelId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: tunnelKeys.fans(tunnelId) });
      
      // Snapshot previous value
      const previousFans = queryClient.getQueryData(tunnelKeys.fans(tunnelId));
      
      // Optimistically update
      queryClient.setQueryData(tunnelKeys.fans(tunnelId), (old: any) =>
        old?.map((fan: any) =>
          fan.id === id
            ? {
                ...fan,
                ...(command.isPowerOn !== undefined && { isPowerOn: command.isPowerOn }),
                ...(command.speed !== undefined && { speed: command.speed }),
                ...(command.direction !== undefined && { direction: command.direction }),
                isRunning: command.isPowerOn ?? fan.isPowerOn,
              }
            : fan
        )
      );
      
      return { previousFans, tunnelId };
    },
    onError: (_, __, context) => {
      if (context?.previousFans && context.tunnelId) {
        queryClient.setQueryData(tunnelKeys.fans(context.tunnelId), context.previousFans);
      }
      toast.error("Failed to control fan");
    },
    onSettled: (_, __, { tunnelId }) => {
      queryClient.invalidateQueries({ queryKey: tunnelKeys.fans(tunnelId) });
    },
  });
}

// Lights hooks
export function useLights(tunnelId: number) {
  return useQuery({
    queryKey: tunnelKeys.lights(tunnelId),
    queryFn: () => lightsApi.getByTunnel(tunnelId),
    enabled: !!tunnelId,
    refetchInterval: 5000,
  });
}

export function useControlLight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, command }: { id: number; command: LightControl; tunnelId: number }) =>
      lightsApi.control(id, command),
    onMutate: async ({ id, command, tunnelId }) => {
      await queryClient.cancelQueries({ queryKey: tunnelKeys.lights(tunnelId) });
      
      const previousLights = queryClient.getQueryData(tunnelKeys.lights(tunnelId));
      
      queryClient.setQueryData(tunnelKeys.lights(tunnelId), (old: any) =>
        old?.map((light: any) =>
          light.id === id ? { ...light, isOn: command.isOn } : light
        )
      );
      
      return { previousLights, tunnelId };
    },
    onError: (_, __, context) => {
      if (context?.previousLights && context.tunnelId) {
        queryClient.setQueryData(tunnelKeys.lights(context.tunnelId), context.previousLights);
      }
      toast.error("Failed to control light");
    },
    onSettled: (_, __, { tunnelId }) => {
      queryClient.invalidateQueries({ queryKey: tunnelKeys.lights(tunnelId) });
    },
  });
}

// Electricity hooks
export function useElectricityMeter(tunnelId: number) {
  return useQuery({
    queryKey: tunnelKeys.meter(tunnelId),
    queryFn: () => electricityApi.getMeterByTunnel(tunnelId),
    enabled: !!tunnelId,
    refetchInterval: 3000, // More frequent updates for real-time monitoring
  });
}

export function useElectricityHistory(tunnelId: number, params?: { startTime?: string; endTime?: string; limit?: number }) {
  return useQuery({
    queryKey: [...tunnelKeys.history(tunnelId), params],
    queryFn: () => electricityApi.getHistory(tunnelId, params),
    enabled: !!tunnelId,
    refetchInterval: 10000,
  });
}
