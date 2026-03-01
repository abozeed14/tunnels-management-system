# Electricity API Specification

The `ElectricityController` provides detailed monitoring of electrical consumption and power quality across tunnel meters.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tunnels/{tunnelId}/meter` | Get real-time meter data for a tunnel | Yes (Any) |
| GET | `/api/electricity/{meterId}/history`| Get historical readings for a meter | Yes (Any) |
| POST | `/api/electricity` | Manually record a new reading | Yes (Admin) |

---

## 1. Get Meter by Tunnel

Retrieves the current state and latest aggregated values for a tunnel's electricity meter.

- **URL**: `/api/tunnels/{tunnelId}/meter`
- **Method**: `GET`
- **Auth required**: YES

### Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "id": 1,
  "tunnelId": 1,
  "name": "Main Meter",
  "voltage": 230.5,
  "current": 45.2,
  "power": 10.4,
  "powerFactor": 0.92,
  "energyConsumption": 12500.5,
  "isConnected": true,
  "updatedAt": "2026-01-31T15:59:00Z"
}
```

---

## 2. Get Meter History

Retrieves historical readings with support for time-range filtering.

- **URL**: `/api/electricity/{meterId}/history`
- **Method**: `GET`
- **Auth required**: YES

### Query Parameters
| Name | Type | Description | Default |
|------|------|-------------|---------|
| startTime | ISO Date | Start of range | None |
| endTime | ISO Date | End of range | None |
| limit | int | Number of records to return | 100 |

**Example Request**:
```bash
curl -G https://localhost:5001/api/electricity/1/history \
-H "Authorization: Bearer <token>" \
-d "startTime=2026-01-01T00:00:00Z" \
-d "limit=10"
```

### Response
- **Code**: `200 OK`
- **Content**:
```json
[
  {
    "id": 5542,
    "electricityMeterId": 1,
    "voltage": 229.8,
    "current": 44.5,
    "power": 10.2,
    "powerFactor": 0.91,
    "energyConsumption": 12490.1,
    "timestamp": "2026-01-31T15:00:00Z"
  }
]
```

---

## 3. Create Reading

Records a new electrical reading. This is typically used by automated collection scripts.

- **URL**: `/api/electricity`
- **Method**: `POST`
- **Auth required**: YES (Admin)

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| electricityMeterId | int | Yes | Target meter ID |
| voltage | float | Yes | Measured voltage |
| current | float | Yes | Measured current |
| power | float | Yes | Calculated/Measured power (kW) |
| powerFactor | float | Yes | Range: -1 to 1 |
| energyConsumption| float | Yes | Total energy (kWh) |
| timestamp | ISO Date | No | Defaults to server time |

---

## Data Dependencies
- **Entities**: 
  - [ElectricityMeter.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/ElectricityMeter.cs)
  - [ElectricityReading.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/ElectricityReading.cs)
- **Parent**: [Tunnel.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/Tunnel.cs)
