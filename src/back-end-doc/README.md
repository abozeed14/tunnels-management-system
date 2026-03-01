# Tunnel Management System API Documentation

Welcome to the comprehensive API documentation for the Tunnel Management System. This documentation provides detailed information about all available endpoints, request/response formats, authentication, and authorization logic.

## Table of Contents

1. [Authentication & Authorization](./auth-controller.md)
   - Login, Registration, Logout, Admin Checks.
2. [Tunnels Management](./tunnels-controller.md)
   - CRUD operations for Tunnels.
3. [Fans Management & Control](./fans-controller.md)
   - CRUD operations and operational control for Fans.
4. [Lights Management & Control](./lights-controller.md)
   - CRUD operations and operational control for Lights.
5. [Electricity & Metering](./electricity-controller.md)
   - Metering information, historical readings, and data recording.
6. [Fault Tickets](./fault-tickets-controller.md)
   - Reporting and managing equipment faults.
7. [System Settings](./settings-controller.md)
   - Global configuration management.
8. [Mock & Simulation](./mock-controller.md)
   - Simulation endpoints for testing hardware interactions.

## General Information

- **Base URL**: `https://api.tunnel-system.com/api` (Production) or `https://localhost:5001/api` (Development)
- **API Version**: v1.0.0
- **Content-Type**: `application/json`
- **Response Format**: All responses are returned as JSON.

## Authentication

The API uses **JWT Bearer Authentication**. 

- Most endpoints require a valid JWT token in the `Authorization` header: `Authorization: Bearer <token>`.
- Admin-level operations require the `RequireAdminRole` policy (User must have the `Admin` role).
- Tokens are issued via the `/api/auth/login` endpoint.

## Error Handling

Standard HTTP status codes are used to indicate the success or failure of an API request:

- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `204 No Content`: Request succeeded, no response body.
- `400 Bad Request`: Invalid request parameters or body.
- `401 Unauthorized`: Authentication failed or token is missing/invalid.
- `403 Forbidden`: Authenticated user lacks necessary permissions (e.g., non-admin trying to access admin route).
- `404 Not Found`: Requested resource does not exist.
- `500 Internal Server Error`: An unexpected server error occurred.

---
© 2026 Tunnel Management System. All rights reserved.
