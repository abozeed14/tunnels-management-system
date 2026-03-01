# Lights API Specification

The `LightsController` manages lighting infrastructure, supporting manual overrides and scheduled operations.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tunnels/{tunnelId}/lights` | List all lights in a tunnel | Yes (Any) |
| GET | `/api/lights/{id}` | Get specific light details | Yes (Any) |
| POST | `/api/lights` | Create a new light | Yes (Admin) |
| PUT | `/api/lights/{id}` | Update light configuration | Yes (Admin) |
| POST | `/api/lights/{id}/control` | Manually switch light On/Off | Yes (Admin) |
| DELETE | `/api/lights/{id}` | Remove a light | Yes (Admin) |

---

## 1. Get Lights by Tunnel

- **URL**: `/api/tunnels/{tunnelId}/lights`
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
    "name": "Light-01",
    "line": "L1",
    "isOn": true,
    "scheduleStart": "18:00:00",
    "scheduleEnd": "06:00:00",
    "createdAt": "2026-01-01T10:00:00Z"
  }
]
```

---

## 2. Create Light

- **URL**: `/api/lights`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| tunnelId | int | Yes | ID of the parent tunnel |
| name | string | Yes | Unique name for the light |
| line | string | No | Electrical line identifier |
| isOn | bool | No | Initial state |
| scheduleStart| string | No | Format `HH:mm:ss` (Scheduled activation) |
| scheduleEnd | string | No | Format `HH:mm:ss` (Scheduled deactivation) |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/lights \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "tunnelId": 1,
  "name": "Light-N1",
  "line": "A",
  "isOn": false,
  "scheduleStart": "19:00:00",
  "scheduleEnd": "07:00:00"
}'
```

---

## 3. Control Light

- **URL**: `/api/lights/{id}/control`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| isOn | bool | Yes | Target state |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/lights/1/control \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{ "isOn": true }'
```

---

## Data Dependencies
- **Entity**: [Light.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/Light.cs)
- **Parent**: [Tunnel.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/Tunnel.cs)
