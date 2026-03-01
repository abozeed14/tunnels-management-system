# Authentication API Specification

The `AuthController` manages user identity, session lifecycle, and access control validation.

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Authenticate user and receive JWT token | No |
| POST | `/api/auth/register` | Create a new user account | No |
| POST | `/api/auth/logout` | Revoke the current user session | Yes (Any) |
| GET | `/api/auth/admin-check` | Verify admin privileges | Yes (Admin) |

---

## 1. User Login

Authenticates a user using email and password.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: NO

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | Yes | Registered user email |
| password | string | Yes | User password |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@tunnel.com",
  "password": "Password123!"
}'
```

### Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 1800,
  "userId": 1,
  "email": "admin@tunnel.com",
  "roles": ["Admin"]
}
```

- **Error Response**:
  - `401 Unauthorized`: Invalid credentials.

---

## 2. User Registration

Registers a new user account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth required**: NO

### Request Body
| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | Yes | Unique user email |
| password | string | Yes | Password (must meet complexity requirements) |
| name | string | No | Full name of the user |
| role | string | No | Initial role (e.g., "Admin", "Operator") |

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "operator1@tunnel.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "Operator"
}'
```

### Response
- **Code**: `200 OK`
- **Content**: (Same as Login Response)

---

## 3. User Logout

Invalidates the current session by updating the user's security stamp.

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth required**: YES (JWT)

**Example Request**:
```bash
curl -X POST https://localhost:5001/api/auth/logout \
-H "Authorization: Bearer <token>"
```

### Response
- **Code**: `200 OK`
- **Content**:
```json
{ "message": "Logged out." }
```

---

## 4. Admin Check

A diagnostic endpoint to verify if the user has administrative privileges.

- **URL**: `/api/auth/admin-check`
- **Method**: `GET`
- **Auth required**: YES (Admin Role)

### Response
- **Code**: `200 OK`
- **Content**:
```json
{ "message": "Admin access granted" }
```

- **Error Response**:
  - `403 Forbidden`: User is authenticated but does not have the "Admin" role.

---

## Security Details

- **JWT Claims**: Tokens include `sub` (UserId), `email`, `roles`, and `sstamp` (Security Stamp).
- **Validation**: On every request, the system verifies the `sstamp` claim against the database. If they don't match (e.g., after logout or password change), the request is rejected with `401 Unauthorized`.
- **Expiration**: Default token lifetime is 30 minutes.

## Data Dependencies
- **Entity**: [User.cs](file:///d:/tunnel-project/tunnel-management-system-complete/tunnel-management-system/entities/User.cs)
