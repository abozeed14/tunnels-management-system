# Tunnels API Specification

The `TunnelsController` provides endpoints for managing tunnel infrastructure, including location, physical dimensions, and electrical threshold configurations.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tunnels` | List all tunnels | Yes (Any) |
| GET | `/api/tunnels/{id}` | Get specific tunnel details | Yes (Any) |
| POST | `/api/tunnels` | Create a new tunnel | Yes (Admin) |
| PUT | `/api/tunnels/{id}` | Update existing tunnel | Yes (Admin) |
| DELETE | `/api/tunnels/{id}` | Remove a tunnel | Yes (Admin) |

---

## 1. List All Tunnels

Retrieves a list of all tunnels registered in the system.

- **URL**: `/api/tunnels`
- **Method**: `GET`
- **Auth required**: YES

### Response
- **Code**: `200 OK`
- **Content**:
```json
[
  {
    "id": 1,
    "name": "North Tunnel",
    "code": "NT-01",
    "location": "City Sector A",
    "longitude": 121.4737,
    "latitude": 31.2304,
    "length": 1500,
    "voltageMin": 210,
    "voltageMax": 240,
    "currentMin": 0,
    "currentMax": 100,
    "powerFactorMin": 0.85,
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-15T12:00:00Z"
  }
]
```

---

## 2. Get Tunnel by ID

- **URL**: `/api/tunnels/{id}`
- **Method**: `GET`
- **Auth required**: YES

### Parameters
- `id` (path): Integer ID of the tunnel.

### Response
- **Code**: `200 OK`
- **Content**: (Single Tunnel Object)
- **Error Response**: `404 Not Found`

---

## 3. Create Tunnel

- **URL**: `/api/tunnels`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | Unique name (max 100 chars) |
| code | string | Yes | Unique code (max 50 chars) |
| location | string | No | Physical location description |
| length | int | No | Length in meters |
| voltageMin | float | No | Minimum operational voltage |
| voltageMax | float | No | Maximum operational voltage |
| currentMax | float | No | Maximum operational current |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/tunnels \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "name": "East Tunnel",
  "code": "ET-01",
  "location": "Sector B",
  "length": 2200,
  "voltageMin": 200,
  "voltageMax": 250
}'
```

### Response
- **Code**: `201 Created`
- **Content**: (Created Tunnel Object)

---

## 4. Update Tunnel

- **URL**: `/api/tunnels/{id}`
- **Method**: `PUT`
- **Auth required**: YES (Admin)

### Request Body
(Same as Create Tunnel, but all fields are optional for partial updates in logic, though DTO might require some)

### Response
- **Code**: `204 No Content`
- **Error Response**: `404 Not Found`

---

## 5. Delete Tunnel

- **URL**: `/api/tunnels/{id}`
- **Method**: `DELETE`
- **Auth required**: YES (Admin)

### Response
- **Code**: `204 No Content`
- **Error Response**: `404 Not Found`

---

## Data Dependencies
- **Entity**: [Tunnel.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/Tunnel.cs)
- **Related Components**: Fans, Lights, and Electricity Meters are associated with Tunnels via `TunnelId`.
