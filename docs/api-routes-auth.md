# API Reference (v2)

This document provides a comprehensive reference for all available API endpoints in the Tunnel Management System.

## Authorization
All protected endpoints require a valid **JWT Bearer Token** in the `Authorization` header.
Most endpoints additionally require the user to have the **`Admin`** role.

**Header Format:**
```http
Authorization: Bearer <your_access_token>
```

---

## Authentication

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | **Public** | Authenticate user and retrieve JWT token. |
| `POST` | `/api/auth/register` | **Admin** | Register a new user account (Admin only). |
| `POST` | `/api/auth/logout` | **Admin** | Logout current user (invalidate session). |

---

## Tunnels

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/paginated` | **Admin** | Retrieve a paginated list of tunnels. |
| `GET` | `/api` | **Admin** | Retrieve all tunnels. |
| `GET` | `/api/{id}` | **Admin** | Retrieve a specific tunnel by ID. |
| `POST` | `/api` | **Admin** | Create a new tunnel. |
| `PUT` | `/api/{id}` | **Admin** | Update an existing tunnel. |
| `DELETE` | `/api/{id}` | **Admin** | Delete a tunnel. |

---

## Fans

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tunnels/{tunnelId}/fans` | **Admin** | Retrieve all fans for a specific tunnel. |
| `GET` | `/api/fans/{id}` | **Admin** | Retrieve a specific fan by ID. |
| `POST` | `/api/fans` | **Admin** | Create a new fan. |
| `PUT` | `/api/fans/{id}` | **Admin** | Update an existing fan configuration. |
| `POST` | `/api/fans/{id}/control` | **Admin** | Control a fan (legacy/direct control). |
| `POST` | `/api/fans/control-command` | **Admin** | Send a control command to a fan (updates monitoring state). |
| `DELETE` | `/api/fans/{id}` | **Admin** | Delete a fan. |

---

## Lights

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tunnels/{tunnelId}/lights` | **Admin** | Retrieve all lights for a specific tunnel. |
| `GET` | `/api/lights/{id}` | **Admin** | Retrieve a specific light by ID. |
| `POST` | `/api/lights` | **Admin** | Create a new light. |
| `PUT` | `/api/lights/{id}` | **Admin** | Update an existing light configuration. |
| `POST` | `/api/lights/{id}/control` | **Admin** | Control a light (turn on/off, set brightness). |
| `DELETE` | `/api/lights/{id}` | **Admin** | Delete a light. |

---

## Electricity

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/electricity/{tunnelId}` | **Admin** | Retrieve latest electricity reading for a tunnel. |
| `GET` | `/api/electricity/history/{tunnelId}` | **Admin** | Retrieve historical electricity readings. |
| `POST` | `/api/electricity` | **Admin** | Record a new electricity reading. |

---

## Fault Tickets

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/FaultTickets/paged` | **Admin** | Retrieve a paginated list of fault tickets. |
| `GET` | `/api/FaultTickets` | **Admin** | Retrieve all open fault tickets. |
| `GET` | `/api/FaultTickets/{id}` | **Admin** | Retrieve a specific fault ticket by ID. |
| `POST` | `/api/FaultTickets` | **Admin** | Create a new fault ticket manually. |
| `POST` | `/api/FaultTickets/{id}/close` | **Admin** | Close a fault ticket. |

---

## Dashboard

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | **Admin** | Retrieve aggregated dashboard statistics. |

---

## Settings

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | **Admin** | Retrieve all system settings. |
| `PUT` | `/api/settings` | **Admin** | Create or update a system setting. |
| `GET` | `/api/settings/{key}` | **Admin** | Retrieve a specific setting by key. |

---

## Mock (Testing)

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/mock/fans/{id}/control` | **Admin** | Mock fan control behavior (for testing). |
| `POST` | `/api/mock/electricity/{id}` | **Admin** | Mock electricity update (for testing). |
