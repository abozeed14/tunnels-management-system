# Enum Migration Report

This report documents the comprehensive migration of all enums in the frontend codebase from string literals to numeric values to align with the backend contract.

## Touched Files

- `src/types/api.ts`: Centralized enum declarations and updated Zod schemas.
- `src/lib/api-client.ts`: Updated API client to handle numeric enum serialization/deserialization.
- `src/hooks/use-tickets.ts`: Refactored ticket-related hooks.
- `src/hooks/use-tunnels.ts`: Refactored tunnel-related hooks.
- `src/contexts/AuthContext.tsx`: Updated `isAdmin` check and roles handling.
- `src/pages/Register.tsx`: Updated registration form and role selection.
- `src/components/ui/equipment-cards.tsx`: Updated `FanCard` display logic.
- `src/components/ui/fault-alerts.tsx`: Updated `FaultAlert` and `TicketRow` display logic.
- `src/pages/TunnelDetail.tsx`: Updated fan control logic.
- `src/components/layout/DashboardLayout.tsx`: Updated user role display logic.

## Specific Enums Converted

| Enum Name | Numeric Mapping |
|-----------|-----------------|
| `UserRole` | `Admin = 0`, `Operator = 1` |
| `FanDirection` | `Forward = 0`, `Backward = 1`, `Stopped = 2` |
| `TicketStatus` | `Open = 0`, `Closed = 1` |
| `ComponentType` | `Fan = 0`, `Light = 1`, `ElectricityMeter = 2` |
| `FaultType` | `FanTrip = 0`, `VoltageLow = 1`, `VoltageHigh = 2`, `CurrentHigh = 3`, `PowerFactorLow = 4`, `LightOffSchedule = 5`, `MeterDisconnected = 6` |
| `MockFanAction` | `StartForward = 0`, `StartBackward = 1`, `Stop = 2`, `InjectTrip = 3`, `InjectPowerLoss = 4` |

## Validation

- **Zod Schemas**: All schemas now use `z.nativeEnum()` to validate numeric inputs.
- **Unit Tests**: Added `src/types/api.test.ts` to verify that:
  - Requests serialize enums as numbers.
  - Responses parse enums into numbers.
  - Invalid string values are rejected at runtime.
- **Integration**: Verified that all existing hooks and components correctly handle numeric values for equipment control and display.

## Status

- [x] All string literals replaced with numeric enums.
- [x] Zod validation updated to `z.number()`.
- [x] UI components updated for numeric enum display.
- [x] Unit tests passing.
- [x] Integration verified.

**Migration Date**: 2026-02-03
