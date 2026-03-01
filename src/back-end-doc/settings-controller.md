# System Settings API Specification

The `SettingsController` manages global configuration parameters used by various background workers and business logic modules.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/settings` | List all system settings | Yes (Admin) |
| GET | `/api/settings/{key}` | Get specific setting by key | Yes (Admin) |
| PUT | `/api/settings` | Create or update a setting | Yes (Admin) |

---

## 1. List All Settings

- **URL**: `/api/settings`
- **Method**: `GET`
- **Auth required**: YES (Admin)

### Response
- **Code**: `200 OK`
- **Content**:
```json
[
  {
    "id": 1,
    "key": "VoltageTolerancePercent",
    "value": "10",
    "description": "Allowed deviation percentage before raising alert",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

## 2. Get Setting by Key

- **URL**: `/api/settings/{key}`
- **Method**: `GET`
- **Auth required**: YES (Admin)

---

## 3. Upsert Setting

Creates a new setting or updates an existing one if the key already exists.

- **URL**: `/api/settings`
- **Method**: `PUT`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | Yes | Unique identifier for the setting |
| value | string | Yes | Configuration value (stored as string) |
| description | string | No | Usage context for the setting |

**Example Request**:
```bash
curl -X PUT https://localhost:5001/api/settings \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
  "key": "SlaTargetMinutes",
  "value": "120",
  "description": "Default SLA for equipment repair"
}'
```

### Response
- **Code**: `200 OK`
- **Content**:
```json
{ "success": true }
```

---

## Data Dependencies
- **Entity**: [SystemSetting.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/SystemSetting.cs)
