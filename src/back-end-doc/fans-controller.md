# Fans API Specification

The `FansController` manages ventilation equipment within tunnels, allowing for status monitoring, configuration, and operational control.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tunnels/{tunnelId}/fans` | List all fans in a specific tunnel | Yes (Any) |
| GET | `/api/fans/{id}` | Get specific fan details | Yes (Any) |
| POST | `/api/fans` | Create a new fan | Yes (Admin) |
| PUT | `/api/fans/{id}` | Update fan configuration | Yes (Admin) |
| POST | `/api/fans/{id}/control` | Send control commands to a fan | Yes (Admin) |
| DELETE | `/api/fans/{id}` | Remove a fan | Yes (Admin) |

---

## 1. Get Fans by Tunnel

- **URL**: `/api/tunnels/{tunnelId}/fans`
- **Method**: `GET`
- **Auth required**: YES

### Response
- **Code**: `200 OK`
- **Content**:
```json
[
  {
    "id": 1,
    "tunnelId": 1,
    "name": "Fan-A1",
    "position": 100,
    "isPowerOn": true,
    "isRunning": true,
    "direction": "Forward",
    "speed": 1500,
    "hasTrip": false,
    "availableSpeeds": "0,1500,3000",
    "createdAt": "2026-01-01T10:00:00Z"
  }
]
```

---

## 2. Get Fan by ID

- **URL**: `/api/fans/{id}`
- **Method**: `GET`
- **Auth required**: YES

---

## 3. Create Fan

- **URL**: `/api/fans`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| tunnelId | int | Yes | ID of the parent tunnel |
| name | string | Yes | Unique name for the fan |
| position | int | No | Position within the tunnel (meters) |
| direction | enum | No | `Forward`, `Backward`, `Stopped` |
| speed | int | No | Initial speed setting |
| availableSpeeds| string | No | Comma-separated list of supported speeds |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/fans \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "tunnelId": 1,
  "name": "Fan-B2",
  "position": 450,
  "direction": "Stopped",
  "speed": 0,
  "availableSpeeds": "0,1500,3000"
}'
```

---

## 4. Control Fan

Sends operational commands to change the fan's state.

- **URL**: `/api/fans/{id}/control`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| isPowerOn | bool | No | Power state |
| speed | int | No | Speed setting |
| direction | enum | No | `Forward`, `Backward`, `Stopped` |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/fans/1/control \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "isPowerOn": true,
  "speed": 1500,
  "direction": "Forward"
}'
```

### Response
- **Code**: `204 No Content`
- **Error Response**: `404 Not Found`

---

## 5. Delete Fan

- **URL**: `/api/fans/{id}`
- **Method**: `DELETE`
- **Auth required**: YES (Admin)

---

## Data Dependencies
- **Entity**: [Fan.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/Fan.cs)
- **Parent**: [Tunnel.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/Tunnel.cs)
