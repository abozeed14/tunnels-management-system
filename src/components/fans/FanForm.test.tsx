import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FanForm } from "./FanForm";
import { CreateFanSchema } from "@/types/api";

// Mock the hooks
vi.mock("@/hooks/use-tunnels", () => ({
  useCreateFan: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateFan: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe("FanForm Schema Validation", () => {
  it("should validate a correct fan object", () => {
    const validFan = {
      name: "Fan 1",
      tunnelId: 1,
      position: 100,
      direction: 0,
      speed: 0,
      availableSpeeds: "0,25,50,100",
    };
    const result = CreateFanSchema.safeParse(validFan);
    expect(result.success).toBe(true);
  });

  it("should reject invalid fan object", () => {
    const invalidFan = {
      name: "", // Too short
      tunnelId: 1,
    };
    const result = CreateFanSchema.safeParse(invalidFan);
    expect(result.success).toBe(false);
  });
});

describe("FanForm Component", () => {
  it("should render create form correctly", () => {
    render(<FanForm open={true} onOpenChange={() => {}} tunnelId={1} />);
    expect(screen.getByRole("heading", { name: "Add Fan" })).toBeDefined();
    expect(screen.getByLabelText("Name")).toBeDefined();
    expect(screen.getByLabelText("Position (m)")).toBeDefined();
    expect(screen.getByLabelText("Speed (RPM)")).toBeDefined();
  });

  it("should render edit form correctly", () => {
    const fan = {
      id: 1,
      tunnelId: 1,
      name: "Existing Fan",
      position: 50,
      isPowerOn: false,
      isRunning: false,
      direction: 0,
      speed: 0,
      hasTrip: false,
      availableSpeeds: "0,50,100",
      createdAt: "2023-01-01",
    };
    render(<FanForm open={true} onOpenChange={() => {}} tunnelId={1} fan={fan} />);
    expect(screen.getByRole("heading", { name: "Edit Fan" })).toBeDefined();
    expect(screen.getByDisplayValue("Existing Fan")).toBeDefined();
    expect(screen.getByDisplayValue("50")).toBeDefined();
  });
});
