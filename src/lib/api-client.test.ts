import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { tunnelsApi, electricityApi, ticketsApi, dashboardApi } from "./api-client";
import apiClient from "./api-client";

// Mock the apiClient.get, post, etc. methods
vi.spyOn(apiClient, "get").mockResolvedValue({ data: [] });
vi.spyOn(apiClient, "post").mockResolvedValue({ data: {} });
vi.spyOn(apiClient, "put").mockResolvedValue({ data: {} });
vi.spyOn(apiClient, "delete").mockResolvedValue({ data: {} });

describe("API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Tunnels API", () => {
    it("getAll should call /", async () => {
      // Mock validation to pass
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: [] });
      try { await tunnelsApi.getAll(); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/");
    });

    it("getPaginated should call /paginated", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ 
        data: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 } 
      });
      try { await tunnelsApi.getPaginated({ PageNumber: 1, PageSize: 10 }); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/paginated", expect.any(Object));
    });

    it("getById should call /{id}", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ 
        data: { id: 1, name: "T1", code: "C1", createdAt: "2023" } 
      });
      try { await tunnelsApi.getById(1); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/1");
    });
  });

  describe("Electricity API", () => {
    it("getMeterByTunnel should call /electricity/{tunnelId}", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ 
        data: { id: 1, tunnelId: 1, name: "M1", voltage: 0, current: 0, power: 0, powerFactor: 0, energyConsumption: 0, isConnected: true, updatedAt: "2023" } 
      });
      try { await electricityApi.getMeterByTunnel(1); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/electricity/1");
    });

    it("getHistory should call /electricity/history/{tunnelId}", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: [] });
      try { await electricityApi.getHistory(1); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/electricity/history/1", expect.any(Object));
    });
  });

  describe("Fault Tickets API", () => {
    it("getOpen should call /FaultTickets", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: [] });
      try { await ticketsApi.getOpen(); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/FaultTickets");
    });

    it("getPaged should call /FaultTickets/paged", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ 
        data: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 } 
      });
      try { await ticketsApi.getPaged({ PageNumber: 1, PageSize: 10 }); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/FaultTickets/paged", expect.any(Object));
    });
  });

  describe("Dashboard API", () => {
    it("getStats should call /dashboard/stats", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ 
        data: { totalTunnels: 0, totalFans: 0, totalLights: 0, totalMeters: 0, activeFans: 0, activeLights: 0, activeAlerts: 0, systemHealth: 0 } 
      });
      try { await dashboardApi.getStats(); } catch {}
      expect(apiClient.get).toHaveBeenCalledWith("/dashboard/stats");
    });
  });
});
