import { z } from "zod";

// ============ Numeric Enums ============
export enum UserRole {
  Admin = 0,
  Operator = 1,
}

export enum FanDirection {
  Forward = 0,
  Backward = 1,
  Stopped = 2,
}

export enum TicketStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
}

export enum ComponentType {
  Fan = 0,
  Light = 1,
  ElectricityMeter = 2,
}

export enum FaultType {
  FanPowerLoss = 0,
  FanTrip = 1,
  LightOffSchedule = 2,
  VoltageHigh = 3,
  VoltageLow = 4,
  CurrentHigh = 5,
  PowerFactorLow = 6,
  PhaseLoss = 7,
  MeterDisconnected = 8,
  PowerOutage = 9,
  CommunicationFailure = 10,
  HardwareMalfunction = 11,
  SoftwareError = 12,
  Vandalism = 13,
  Other = 14,
}

export enum MockFanAction {
  StartForward = 0,
  StartBackward = 1,
  Stop = 2,
  InjectTrip = 3,
  InjectPowerLoss = 4,
}

// ============ Auth Types ============
const FlexibleUserRoleSchema = z.union([
  z.nativeEnum(UserRole),
  z.string().transform((val) => {
    if (val === "Admin") return UserRole.Admin;
    if (val === "Operator") return UserRole.Operator;
    return val as any;
  }).pipe(z.nativeEnum(UserRole)),
]);

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
  userId: z.number(),
  email: z.string().email(),
  roles: z.array(FlexibleUserRoleSchema),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ============ Tunnel Types ============
export const TunnelSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  location: z.string().optional().nullable(),
  longitude: z.number().optional().nullable(),
  latitude: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  voltageMin: z.number().optional().nullable(),
  voltageMax: z.number().optional().nullable(),
  currentMin: z.number().optional().nullable(),
  currentMax: z.number().optional().nullable(),
  powerFactorMin: z.number().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
});

export const CreateTunnelSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(50),
  location: z.string().optional(),
  length: z.number().positive().optional(),
  voltageMin: z.number().optional(),
  voltageMax: z.number().optional(),
  currentMax: z.number().optional(),
});

export type Tunnel = z.infer<typeof TunnelSchema>;
export type CreateTunnel = z.infer<typeof CreateTunnelSchema>;

export const TunnelSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string().optional().nullable(),
  status: z.string(),
  longitude: z.number().optional().nullable(),
  latitude: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  totalFans: z.number(),
  totalLightingLines: z.number(),
  fansWithTickets: z.number(),
});

export type TunnelSummary = z.infer<typeof TunnelSummarySchema>;

export type TunnelFilter = {
  PageNumber: number;
  PageSize: number;
  TunnelName?: string;
};

// ============ Fan Types ============
export const FanDirectionEnum = z.union([
  z.nativeEnum(FanDirection),
  z.string().transform((val) => {
    if (val === "Forward") return FanDirection.Forward;
    if (val === "Backward") return FanDirection.Backward;
    if (val === "Stopped") return FanDirection.Stopped;
    return val as any;
  }).pipe(z.nativeEnum(FanDirection)),
]);

export const FanSchema = z.object({
  id: z.number(),
  tunnelId: z.number(),
  name: z.string(),
  position: z.number().optional().nullable(),
  isPowerOn: z.boolean(),
  isRunning: z.boolean(),
  direction: FanDirectionEnum,
  speed: z.number(),
  hasTrip: z.boolean(),
  availableSpeeds: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const CreateFanSchema = z.object({
  name: z.string().min(1).max(100),
  tunnelId: z.number(),
  position: z.number().optional(),
  direction: FanDirectionEnum.optional(),
  speed: z.number().optional(),
  availableSpeeds: z.string().optional(),
});

export const FanControlSchema = z.object({
  isPowerOn: z.boolean().optional(),
  speed: z.number().optional(),
  direction: FanDirectionEnum.optional(),
});

export type Fan = z.infer<typeof FanSchema>;
export type CreateFan = z.infer<typeof CreateFanSchema>;
export type FanControl = z.infer<typeof FanControlSchema>;

// ============ Light Types ============
export const LightSchema = z.object({
  id: z.number(),
  tunnelId: z.number(),
  name: z.string(),
  line: z.string().optional().nullable(),
  isOn: z.boolean(),
  scheduleStart: z.string().optional().nullable(),
  scheduleEnd: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const LightControlSchema = z.object({
  isOn: z.boolean(),
});

export type Light = z.infer<typeof LightSchema>;
export type LightControl = z.infer<typeof LightControlSchema>;

// ============ Electricity Types ============
export const ElectricityMeterSchema = z.object({
  id: z.number(),
  tunnelId: z.number(),
  name: z.string(),
  voltage: z.number(),
  current: z.number(),
  power: z.number(),
  powerFactor: z.number(),
  energyConsumption: z.number(),
  isConnected: z.boolean(),
  updatedAt: z.string(),
});

export const ElectricityReadingSchema = z.object({
  id: z.number(),
  electricityMeterId: z.number(),
  voltage: z.number(),
  current: z.number(),
  power: z.number(),
  powerFactor: z.number(),
  energyConsumption: z.number(),
  timestamp: z.string(),
});

export type ElectricityMeter = z.infer<typeof ElectricityMeterSchema>;
export type ElectricityReading = z.infer<typeof ElectricityReadingSchema>;

// ============ Fault Ticket Types ============
export const TicketStatusEnum = z.union([
  z.nativeEnum(TicketStatus),
  z.string().transform((val) => {
    if (val === "Open") return TicketStatus.Open;
    if (val === "InProgress") return TicketStatus.InProgress;
    if (val === "Resolved") return TicketStatus.Resolved;
    if (val === "Closed") return TicketStatus.Closed;
    return val as any;
  }).pipe(z.nativeEnum(TicketStatus)),
]);

export const ComponentTypeEnum = z.union([
  z.nativeEnum(ComponentType),
  z.string().transform((val) => {
    if (val === "Fan") return ComponentType.Fan;
    if (val === "Light") return ComponentType.Light;
    if (val === "ElectricityMeter") return ComponentType.ElectricityMeter;
    return val as any;
  }).pipe(z.nativeEnum(ComponentType)),
]);

export const FaultTypeEnum = z.union([
  z.nativeEnum(FaultType),
  z.string().transform((val) => {
    const map: Record<string, FaultType> = {
      "FanPowerLoss": FaultType.FanPowerLoss,
      "FanTrip": FaultType.FanTrip,
      "LightOffSchedule": FaultType.LightOffSchedule,
      "VoltageHigh": FaultType.VoltageHigh,
      "VoltageLow": FaultType.VoltageLow,
      "CurrentHigh": FaultType.CurrentHigh,
      "PowerFactorLow": FaultType.PowerFactorLow,
      "PhaseLoss": FaultType.PhaseLoss,
      "MeterDisconnected": FaultType.MeterDisconnected,
      "PowerOutage": FaultType.PowerOutage,
      "CommunicationFailure": FaultType.CommunicationFailure,
      "HardwareMalfunction": FaultType.HardwareMalfunction,
      "SoftwareError": FaultType.SoftwareError,
      "Vandalism": FaultType.Vandalism,
      "Other": FaultType.Other,
    };
    return map[val] ?? (val as any);
  }).pipe(z.nativeEnum(FaultType)),
]);

export const FaultTicketSchema = z.object({
  id: z.number(),
  tunnelId: z.number(),
  componentType: ComponentTypeEnum,
  componentId: z.number(),
  componentName: z.string(),
  faultType: FaultTypeEnum,
  description: z.string().optional().nullable(),
  status: TicketStatusEnum,
  slaMinutes: z.number().optional().nullable(),
  createdAt: z.string(),
});

export const CreateTicketSchema = z.object({
  tunnelId: z.number(),
  componentType: ComponentTypeEnum,
  componentId: z.number(),
  componentName: z.string(),
  faultType: FaultTypeEnum,
  description: z.string().optional(),
  slaMinutes: z.number().optional(),
});

export type FaultTicket = z.infer<typeof FaultTicketSchema>;
export type CreateTicket = z.infer<typeof CreateTicketSchema>;

// ============ Settings Types ============
export const SystemSettingSchema = z.object({
  id: z.number(),
  key: z.string(),
  value: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.string(),
});

export const UpsertSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
  description: z.string().optional(),
});

export type SystemSetting = z.infer<typeof SystemSettingSchema>;
export type UpsertSetting = z.infer<typeof UpsertSettingSchema>;

// ============ Mock Types ============
export const MockFanActionEnum = z.nativeEnum(MockFanAction);

// ============ Dashboard Types ============
export const DashboardSummarySchema = z.object({
  totalTunnels: z.number(),
  totalFans: z.number(),
  totalLights: z.number(),
  totalMeters: z.number(),
  activeFans: z.number(),
  activeLights: z.number(),
  activeAlerts: z.number(),
  systemHealth: z.number(),
});

export type DashboardSummaryDto = z.infer<typeof DashboardSummarySchema>;

// ============ API Response Types ============
export interface ApiError {
  message: string;
  code?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export type TicketQueryParams = {
  PageNumber: number;
  PageSize: number;
};
