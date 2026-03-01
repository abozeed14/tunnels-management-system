import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "@/lib/api-client";
import { CreateTicket, TicketQueryParams } from "@/types/api";
import { toast } from "sonner";

export const ticketKeys = {
  all: ["tickets"] as const,
  list: (params: TicketQueryParams) => ["tickets", "list", params] as const,
  detail: (id: number) => ["tickets", id] as const,
};

export function useOpenTickets() {
  return useQuery({
    queryKey: ticketKeys.all,
    queryFn: ticketsApi.getOpen,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function usePagedTickets(params: TicketQueryParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => ticketsApi.getPaged(params),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching next page
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticket: CreateTicket) => ticketsApi.create(ticket),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
      queryClient.invalidateQueries({ queryKey: ["tickets", "list"] });
      if (response.alreadyExists) {
        toast.info("A ticket for this issue already exists");
      } else {
        toast.success("Fault ticket created");
      }
    },
    onError: () => {
      toast.error("Failed to create ticket");
    },
  });
}

export function useCloseTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ticketsApi.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
      queryClient.invalidateQueries({ queryKey: ["tickets", "list"] }); // Invalidate paged lists
      toast.success("Ticket closed successfully");
    },
    onError: () => {
      toast.error("Failed to close ticket");
    },
  });
}
