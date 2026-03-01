import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TunnelCard } from "./equipment-cards";
import { Tunnel, TunnelSummary } from "@/types/api";

const mockTunnel: Tunnel = {
  id: 1,
  name: "Tunnel 1",
  code: "TUN-001",
  location: "North",
  length: 1000,
  voltageMin: 200,
  voltageMax: 240,
  currentMin: 0,
  currentMax: 100,
  powerFactorMin: 0.9,
  createdAt: "2023-01-01",
  updatedAt: null,
};

const mockSummary: TunnelSummary = {
  id: 2,
  name: "Tunnel Summary 2",
  location: "South",
  status: "Active",
  longitude: 0,
  latitude: 0,
  length: 500,
  createdAt: "2023-01-01",
  updatedAt: null,
  totalFans: 5,
  totalLightingLines: 2,
  fansWithTickets: 0,
};

describe("TunnelCard", () => {
  it("renders full Tunnel object correctly", () => {
    render(<TunnelCard tunnel={mockTunnel} />);
    expect(screen.getByText("Tunnel 1")).toBeDefined();
    expect(screen.getByText("TUN-001")).toBeDefined();
    expect(screen.getByText("North")).toBeDefined();
    expect(screen.getByText("1000m")).toBeDefined();
  });

  it("renders TunnelSummary object correctly", () => {
    render(
      <TunnelCard 
        tunnel={mockSummary} 
        fanCount={mockSummary.totalFans}
        lightCount={mockSummary.totalLightingLines}
      />
    );
    expect(screen.getByText("Tunnel Summary 2")).toBeDefined();
    // It should fallback to ID since code is missing
    expect(screen.getByText("ID: 2")).toBeDefined();
    expect(screen.getByText("South")).toBeDefined();
    expect(screen.getByText("500m")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined(); // Fan count
    expect(screen.getByText("2")).toBeDefined(); // Light count
  });

  it("shows alert badge when hasAlerts is true", () => {
    render(<TunnelCard tunnel={mockTunnel} hasAlerts={true} />);
    expect(screen.getByText("Alert")).toBeDefined();
  });
});
