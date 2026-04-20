# Kitchen Foods Backend API Reference

This document describes the currently completed backend API surface.

## Base URL

`http://localhost:8000`

## Interactive Docs

- Swagger UI: `GET /api-docs`
- Raw OpenAPI spec: `GET /api-docs/openapi.json`

## Authentication

Protected endpoints require a JWT bearer token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

JWT tokens are returned by `POST /api/auth/login` and currently expire in `1d`.

## Error Formats

The backend currently returns two error shapes:

1. Route/controller errors:

```json
{ "error": "..." }
```

1. Global error handler errors:

```json
{
  "status": 500,
  "message": "Something went wrong",
  "error": "..."
}
```

## Endpoints

### 1) Register User

- Method: `POST`
- Path: `/api/auth/register`
- Auth: No

Request body:

```json
{
  "full_name": "Nimal Perera",
  "email": "nimal@example.com",
  "password": "Password123!",
  "role": "Customer"
}
```

Success response (`201`):

```json
{
  "message": "User registered",
  "user": {
    "uid": "a5d6c3eb-42a3-4de4-9f66-e6f4f500ad7a",
    "full_name": "Nimal Perera",
    "email": "nimal@example.com",
    "role": "Customer"
  }
}
```

Common failures:

- `500` `{ "error": "Server error during registration" }`

### 2) Login

- Method: `POST`
- Path: `/api/auth/login`
- Auth: No

Request body:

```json
{
  "email": "nimal@example.com",
  "password": "Password123!"
}
```

Success response (`200`):

```json
{
  "message": "Logged in successfully",
  "token": "<jwt>",
  "user": {
    "uid": "a5d6c3eb-42a3-4de4-9f66-e6f4f500ad7a",
    "full_name": "Nimal Perera",
    "role": "Customer"
  }
}
```

Common failures:

- `401` `{ "error": "Invalid email or password" }`
- `500` `{ "error": "Server error during login" }`

### 3) Get All Users

- Method: `GET`
- Path: `/api/users`
- Auth: Yes (Bearer token)

Success response (`200`):

```json
[
  {
    "uid": "a5d6c3eb-42a3-4de4-9f66-e6f4f500ad7a",
    "full_name": "Nimal Perera",
    "email": "nimal@example.com",
    "role": "Customer"
  }
]
```

Common failures:

- `401` `{ "error": "No token provided" }`
- `403` `{ "error": "Invalid token" }` or `{ "error": "Token expired" }`
- `500` global error shape

### 4) Get User By ID

- Method: `GET`
- Path: `/api/users/:uid`
- Auth: Yes (Bearer token)

Path param:

- `uid` (UUID)

Success response (`200`):

```json
{
  "uid": "a5d6c3eb-42a3-4de4-9f66-e6f4f500ad7a",
  "full_name": "Nimal Perera",
  "email": "nimal@example.com",
  "role": "Customer"
}
```

Common failures:

- `404` `{ "error": "User not found" }`
- `401` / `403` auth errors
- `500` global error shape

### 5) Update User

- Method: `PUT`
- Path: `/api/users/:uid`
- Auth: Yes (Bearer token)

Path param:

- `uid` (UUID)

Request body:

```json
{
  "full_name": "Updated Name",
  "email": "updated@example.com",
  "role": "Chef"
}
```

Success response (`200`):

```json
{
  "uid": "a5d6c3eb-42a3-4de4-9f66-e6f4f500ad7a",
  "full_name": "Updated Name",
  "email": "updated@example.com",
  "role": "Chef"
}
```

Common failures:

- `404` `{ "error": "User not found" }`
- `401` / `403` auth errors
- `500` global error shape

### 6) Delete User

- Method: `DELETE`
- Path: `/api/users/:uid`
- Auth: Yes (Bearer token)

Path param:

- `uid` (UUID)

Success response (`200`):

```json
{ "message": "User deleted successfully" }
```

Common failures:

- `404` `{ "error": "User not found" }`
- `401` / `403` auth errors
- `500` global error shape

## Quick Start

1. Start DB/services (if needed):

```bash
docker compose up -d
```

1. Start backend:

```bash
npm run dev
```

1. Open docs:

- `http://localhost:8000/api-docs`
