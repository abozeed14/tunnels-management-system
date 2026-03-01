# Mock & Simulation API Specification

The `MockController` provides specialized endpoints for simulating hardware states and failures. These endpoints are intended for development, testing, and demonstration purposes.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/mock/fans/{id}/control` | Force fan state (including trip/loss) | Yes (Admin) |
| POST | `/api/mock/electricity/{id}` | Update meter simulation values | Yes (Admin) |

---

## 1. Mock Fan Control

Bypasses standard control logic to force the fan into specific simulated states.

- **URL**: `/api/mock/fans/{id}/control`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| action | enum | Yes | Simulation action to perform |

**Available Actions**:
- `start_forward`: Sets power=on, running=true, direction=forward, trip=false.
- `start_backward`: Sets power=on, running=true, direction=backward, trip=false.
- `stop`: Sets running=false, direction=stopped.
- `inject_trip`: Sets hasTrip=true, running=false.
- `inject_power_loss`: Sets isPowerOn=false, running=false.

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/mock/fans/1/control \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{ "action": "inject_trip" }'
```

### Response
- **Code**: `200 OK`
- **Content**: `{ "success": true }`
- **Error Response**: `404 Not Found`

---

## 2. Update Electricity Simulation

Simulates real-time changes to an electricity meter's readings.

- **URL**: `/api/mock/electricity/{id}`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| voltage | float | Yes | Simulated voltage |
| current | float | Yes | Simulated current |
| powerFactor | float | No | Simulated power factor (defaults to current or 0.9) |
| isConnected | bool | No | Connection status |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/mock/electricity/1 \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "voltage": 190.0,
  "current": 50.0,
  "isConnected": true
}'
```

### Response
- **Code**: `200 OK`
- **Content**: `{ "success": true }`

---

## Security Warning

These endpoints modify core system state without hardware validation. They should be disabled or strictly firewalled in production environments.
