import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TunnelForm } from "./TunnelForm";
import { CreateTunnelSchema } from "@/types/api";

// Mock the hooks
vi.mock("@/hooks/use-tunnels", () => ({
  useCreateTunnel: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateTunnel: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe("TunnelForm Schema Validation", () => {
  it("should validate a correct tunnel object", () => {
    const validTunnel = {
      name: "Test Tunnel",
      code: "TUN-001",
      location: "Test Location",
      length: 1000,
      voltageMin: 200,
      voltageMax: 240,
      currentMax: 100,
    };
    const result = CreateTunnelSchema.safeParse(validTunnel);
    expect(result.success).toBe(true);
  });

  it("should reject invalid tunnel object", () => {
    const invalidTunnel = {
      name: "", // Too short
      code: "", // Too short
    };
    const result = CreateTunnelSchema.safeParse(invalidTunnel);
    expect(result.success).toBe(false);
  });
});

describe("TunnelForm Component", () => {
  it("should render create form correctly", () => {
    render(<TunnelForm open={true} onOpenChange={() => {}} />);
    // Check for the dialog title
    expect(screen.getByRole("heading", { name: "Create Tunnel" })).toBeDefined();
    expect(screen.getByLabelText("Name")).toBeDefined();
    expect(screen.getByLabelText("Code")).toBeDefined();
  });

  it("should render edit form correctly", () => {
    const tunnel = {
      id: 1,
      name: "Existing Tunnel",
      code: "TUN-EXIST",
      createdAt: "2023-01-01",
    };
    render(<TunnelForm open={true} onOpenChange={() => {}} tunnel={tunnel} />);
    // Check for the dialog title
    expect(screen.getByRole("heading", { name: "Edit Tunnel" })).toBeDefined();
    expect(screen.getByDisplayValue("Existing Tunnel")).toBeDefined();
    expect(screen.getByDisplayValue("TUN-EXIST")).toBeDefined();
  });
});
