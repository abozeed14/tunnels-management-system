# Paginated Tunnels Endpoint Documentation

## Overview
This document details the integration specifications for the new paginated tunnels retrieval endpoint. This endpoint is designed to provide efficient access to tunnel summaries with support for pagination and filtering, optimizing performance for frontend dashboards and lists.

## Endpoint Specification

### URL
`GET /api/Tunnels/paginated`

### Method
`GET`

### Authentication
**Public Access** (No explicit authorization attribute required on this endpoint).
*Note: Ensure your global API security policies allow access if applicable.*

### Rate Limiting
Standard API rate limits apply (e.g., 100 requests/minute per IP, depending on global configuration).

## Request Parameters

The endpoint accepts query parameters to control pagination and filtering.

| Parameter | Type | Required | Default | Description | Constraints |
|-----------|------|----------|---------|-------------|-------------|
| `PageNumber` | `integer` | No | 1 | The page number to retrieve. | Must be ≥ 1. |
| `PageSize` | `integer` | No | 10 | The number of items per page. | Must be between 1 and 100. |
| `TunnelName` | `string` | No | null | Filter tunnels by partial name match (case-insensitive). | Max length 100 chars. |

**Example Query String:**
`?PageNumber=1&PageSize=20&TunnelName=Main`

## Response Format

### Success Response (200 OK)

Returns a `PaginatedResult<TunnelSummaryDto>` object containing the list of tunnels and metadata.

```json
{
  "items": [
    {
      "id": 101,
      "name": "Main Tunnel A",
      "location": "Sector 7",
      "status": "Active",
      "longitude": 45.123456,
      "latitude": -93.654321,
      "length": 1500,
      "createdAt": "2023-01-15T08:30:00Z",
      "updatedAt": "2023-06-20T14:45:00Z",
      "totalFans": 12,
      "totalLightingLines": 4,
      "fansWithTickets": 0
    },
    {
      "id": 102,
      "name": "East Tunnel B",
      "location": "Sector 8",
      "status": "Maintenance",
      "longitude": 45.128888,
      "latitude": -93.659999,
      "length": 800,
      "createdAt": "2023-02-10T09:15:00Z",
      "updatedAt": null,
      "totalFans": 8,
      "totalLightingLines": 2,
      "fansWithTickets": 2
    }
  ],
  "totalCount": 45,
  "pageNumber": 1,
  "pageSize": 20
}
```

### Error Responses

| Status Code | Description | Body Example |
|-------------|-------------|--------------|
| **400 Bad Request** | Invalid pagination parameters. | `PageNumber must be >= 1 and PageSize must be between 1 and 100.` |
| **500 Internal Server Error** | Server-side processing error. | `An internal error occurred while processing your request.` |

## Business Logic & Data
- **Status Derivation**: 
  - `Maintenance`: If any fan in the tunnel has an open or in-progress fault ticket.
  - `Active`: If no fans have active fault tickets.
- **FansWithTickets**: Count of distinct fans associated with the tunnel that have at least one open/in-progress fault ticket.
- **Sorting**: Default sorting is by database primary key (Id) unless otherwise specified in implementation updates.

## Integration Guide (TypeScript/JavaScript)

Here is a ready-to-use function for your API service:

```typescript
// Types for the response
interface TunnelSummary {
  id: number;
  name: string;
  location: string;
  status: string;
  longitude: number;
  latitude: number;
  length: number;
  createdAt: string;
  updatedAt: string | null;
  totalFans: number;
  totalLightingLines: number;
  fansWithTickets: number;
}

interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface TunnelFilter {
  pageNumber?: number;
  pageSize?: number;
  tunnelName?: string;
}

// API Call Function
async function getTunnels(filter: TunnelFilter): Promise<PaginatedResult<TunnelSummary>> {
  const queryParams = new URLSearchParams();
  
  if (filter.pageNumber) queryParams.append('PageNumber', filter.pageNumber.toString());
  if (filter.pageSize) queryParams.append('PageSize', filter.pageSize.toString());
  if (filter.tunnelName) queryParams.append('TunnelName', filter.tunnelName);

  const response = await fetch(`/api/Tunnels/paginated?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorText = await response.text();
      throw new Error(`Bad Request: ${errorText}`);
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Usage Example
getTunnels({ pageNumber: 1, pageSize: 10, tunnelName: 'Main' })
  .then(data => {
    console.log(`Loaded ${data.items.length} of ${data.totalCount} tunnels`);
    data.items.forEach(t => console.log(`${t.name} - ${t.status}`));
  })
  .catch(err => console.error(err));
```

## Troubleshooting

### Common Issues
1.  **400 Bad Request**: Check that `PageNumber` is not 0 (it must be 1 or greater) and `PageSize` is within 1-100 range.
2.  **Empty Result**: If `items` is empty but `totalCount` is 0, no data matches your filter. If `totalCount` > 0 but items are empty, check if `PageNumber` exceeds the available pages.
3.  **Connection Refused**: Ensure the backend API is running and reachable at the base URL.

### Performance
- **Expected Response Time**: < 200ms for typical page sizes (10-50 items).
- **Optimization**: The endpoint uses optimized database projection to fetch only summary data, avoiding full entity graph loading.

## Support
For backend support or bug reports, please contact the backend team lead or file an issue in the project repository.
