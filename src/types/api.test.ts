import { describe, it, expect } from "vitest";
import {
  FanDirection,
  FanDirectionEnum,
  TicketStatus,
  TicketStatusEnum,
  ComponentType,
  ComponentTypeEnum,
  FaultType,
  FaultTypeEnum,
  MockFanAction,
  MockFanActionEnum,
  UserRole,
  RegisterRequestSchema,
  AuthResponseSchema,
} from "./api";

describe("Enum Numeric Migration", () => {
  describe("FanDirectionEnum", () => {
    it("should accept numeric values", () => {
      expect(FanDirectionEnum.parse(0)).toBe(FanDirection.Forward);
      expect(FanDirectionEnum.parse(1)).toBe(FanDirection.Backward);
      expect(FanDirectionEnum.parse(2)).toBe(FanDirection.Stopped);
    });

    it("should accept string values and transform to numeric", () => {
      expect(FanDirectionEnum.parse("Forward")).toBe(FanDirection.Forward);
      expect(FanDirectionEnum.parse("Backward")).toBe(FanDirection.Backward);
      expect(FanDirectionEnum.parse("Stopped")).toBe(FanDirection.Stopped);
    });

    it("should reject invalid values", () => {
      expect(() => FanDirectionEnum.parse("Invalid")).toThrow();
    });
  });

  describe("AuthResponseSchema", () => {
    it("should accept numeric roles", () => {
      const data = {
        accessToken: "token",
        expiresIn: 3600,
        userId: 1,
        email: "test@example.com",
        roles: [UserRole.Admin],
      };
      const result = AuthResponseSchema.parse(data);
      expect(result.roles).toEqual([0]);
    });

    it("should accept string roles and transform to numeric", () => {
      const data = {
        accessToken: "token",
        expiresIn: 3600,
        userId: 1,
        email: "test@example.com",
        roles: ["Admin"],
      };
      const result = AuthResponseSchema.parse(data);
      expect(result.roles).toEqual([0]);
    });
  });

  describe("TicketStatusEnum", () => {
    it("should accept numeric values", () => {
      expect(TicketStatusEnum.parse(0)).toBe(TicketStatus.Open);
      expect(TicketStatusEnum.parse(3)).toBe(TicketStatus.Closed);
    });

    it("should accept string values and transform", () => {
      expect(TicketStatusEnum.parse("Open")).toBe(TicketStatus.Open);
    });
  });

  describe("ComponentTypeEnum", () => {
    it("should accept numeric values", () => {
      expect(ComponentTypeEnum.parse(0)).toBe(ComponentType.Fan);
      expect(ComponentTypeEnum.parse(1)).toBe(ComponentType.Light);
      expect(ComponentTypeEnum.parse(2)).toBe(ComponentType.ElectricityMeter);
    });

    it("should accept string values and transform", () => {
      expect(ComponentTypeEnum.parse("Fan")).toBe(ComponentType.Fan);
    });
  });

  describe("FaultTypeEnum", () => {
    it("should accept numeric values", () => {
      expect(FaultTypeEnum.parse(0)).toBe(FaultType.FanTrip);
      expect(FaultTypeEnum.parse(6)).toBe(FaultType.MeterDisconnected);
    });

    it("should accept string values and transform", () => {
      expect(FaultTypeEnum.parse("FanTrip")).toBe(FaultType.FanTrip);
    });
  });

  describe("MockFanActionEnum", () => {
    it("should accept numeric values", () => {
      expect(MockFanActionEnum.parse(0)).toBe(MockFanAction.StartForward);
      expect(MockFanActionEnum.parse(4)).toBe(MockFanAction.InjectPowerLoss);
    });

    it("should reject string values", () => {
      expect(() => MockFanActionEnum.parse("start_forward")).toThrow();
    });
  });

  describe("RegisterRequestSchema", () => {
    it("should accept numeric role", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        role: UserRole.Admin,
      };
      const result = RegisterRequestSchema.parse(data);
      expect(result.role).toBe(0);
    });

    it("should reject string role", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        role: "Admin",
      };
      expect(() => RegisterRequestSchema.parse(data)).toThrow();
    });
  });
});
