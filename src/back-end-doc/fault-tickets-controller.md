# Fault Tickets API Specification

The `FaultTicketsController` handles the lifecycle of equipment failure reports, from detection/reporting to resolution and closure.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tickets` | List all open fault tickets | Yes (Any) |
| GET | `/api/tickets/{id}` | Get specific ticket details | Yes (Any) |
| POST | `/api/tickets` | Report a new equipment fault | Yes (Admin) |
| POST | `/api/tickets/{id}/close` | Close a resolved ticket | Yes (Admin) |

---

## 1. List Open Tickets

Retrieves all tickets that are not yet closed.

- **URL**: `/api/tickets`
- **Method**: `GET`
- **Auth required**: YES

### Response
- **Code**: `200 OK`
- **Content**:
```json
[
  {
    "id": 101,
    "tunnelId": 1,
    "componentType": "Fan",
    "componentId": 5,
    "componentName": "Fan-North-05",
    "faultType": "FanTrip",
    "description": "Hardware trip detected during startup.",
    "status": "Open",
    "slaMinutes": 120,
    "createdAt": "2026-01-31T14:30:00Z"
  }
]
```

---

## 2. Create Fault Ticket

Manually or automatically reports a fault. If a ticket for the same component and fault type is already open, the system may return the existing ticket.

- **URL**: `/api/tickets`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| tunnelId | int | Yes | ID of the tunnel where fault occurred |
| componentType | string | Yes | `Fan`, `Light`, `ElectricityMeter` |
| componentId | int | Yes | ID of the specific equipment |
| componentName | string | Yes | Human-readable name of equipment |
| faultType | string | Yes | Enum name (e.g., `FanTrip`, `VoltageLow`) |
| description | string | No | Additional context |
| slaMinutes | int | No | Expected resolution time |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/tickets \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "tunnelId": 1,
  "componentType": "Light",
  "componentId": 22,
  "componentName": "Light-Line2-01",
  "faultType": "LightOffSchedule",
  "description": "Light failed to activate at 18:00."
}'
```

### Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "success": true,
  "alreadyExists": false,
  "ticket": { "id": 102, ... }
}
```

---

## 3. Close Ticket

Updates the status of a ticket to `Closed`.

- **URL**: `/api/tickets/{id}/close`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Response
- **Code**: `200 OK`
- **Error Response**: `404 Not Found` (If ticket doesn't exist or is already closed)

---

## Data Dependencies
- **Entity**: [FaultTicket.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/FaultTicket.cs)
- **Business Logic**: The system prevents duplicate open tickets for the same component and fault type to reduce noise.
