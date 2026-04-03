# API Documentation

## Base URL

http://localhost:5000/api/v1

## Authentication

Use Bearer Token:

Authorization: Bearer <JWT_TOKEN>

## Roles

This backend uses three roles:

- Admin (role value: admin)
- Analyst (role value: manager)
- Viewer (role value: member)

Role checks are enforced by middleware on protected routes.

## Response Format

All endpoints return a consistent response shape:

{
  "success": true,
  "message": "...",
  "data": { ... } | null,
  "error": { ... } | null
}

Common error responses:

- 400 Validation failed (Zod)
- 401 Unauthorized (missing/invalid token)
- 403 Forbidden (insufficient role)
- 404 Not found
- 409 Duplicate data conflict
- 500 Internal server error

## Health

### GET /health

Description: Service health check (not under /api/v1).

Access: Public

Response:

{
  "success": true,
  "message": "Service healthy",
  "data": { "timestamp": "2026-01-01T00:00:00.000Z" },
  "error": null
}

## Auth APIs

### Register User

POST /auth/register

Description: Create a new user. Role is always set to "member" internally for security.

Access: Public

Request Body:

{
  "name": "John",
  "email": "john@example.com",
  "password": "Password123",
  "role":"member"
}

Validation:

- name: string, 2-80 chars
- email: valid email
- password: string, 8-64 chars

Response:

{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John",
      "email": "john@example.com",
      "role": "member"
    },
    "accessToken": "<JWT>"
  },
  "error": null
}

### Login

POST /auth/login

Access: Public

Request Body:

{
  "email": "john@example.com",
  "password": "Password123",
  "role": "member"
}

Validation:

- email: valid email
- password: string, min 8 chars

Response:

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John",
      "email": "john@example.com",
      "role": "member"
    },
    "accessToken": "<JWT>"
  },
  "error": null
}

Errors:

- 401 Invalid credentials
- 403 User account is deactivated

### Get Profile

GET /auth/me

Access: Authenticated (any role)

Response:

{
  "success": true,
  "message": "Profile fetched",
  "data": {
    "_id": "...",
    "name": "John",
    "email": "john@example.com",
    "role": "member",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "error": null
}

## Transactions APIs

Notes:

- All endpoints require authentication.
- Admin can view/update/delete any transaction.
- Non-admin users can only access transactions they created.

### Create Transaction

POST /transactions

Access: Admin only

Request Body:

{
  "amount": 1000,
  "type": "income",
  "category": "salary",
  "date": "2026-01-01",
  "notes": "Monthly salary"
}

Validation:

- amount: non-negative number
- type: "income" | "expense"
- category: string, 2-80 chars
- date: date (ISO string accepted)
- notes: string, max 500 chars (optional)

Response:

{
  "success": true,
  "message": "Transaction created",
  "data": {
    "_id": "...",
    "amount": 1000,
    "type": "income",
    "category": "salary",
    "date": "2026-01-01T00:00:00.000Z",
    "notes": "Monthly salary",
    "createdBy": "...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "error": null
}

### Get Transactions (List)

GET /transactions

Access: Authenticated

Query Parameters:

- page: number, min 1 (default 1)
- limit: number, min 1 max 100 (default 10)
- sortBy: "date" | "amount" | "createdAt" (default "createdAt")
- sortOrder: "asc" | "desc" (default "desc")
- type: "income" | "expense" (optional)
- category: string (optional)
- startDate: date (optional)
- endDate: date (optional)

Response:

{
  "success": true,
  "message": "Transactions fetched",
  "data": {
    "items": [
      {
        "_id": "...",
        "amount": 1000,
        "type": "income",
        "category": "salary",
        "date": "2026-01-01T00:00:00.000Z",
        "notes": "Monthly salary",
        "createdBy": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  },
  "error": null
}

### Get Single Transaction

GET /transactions/:transactionId

Access: Authenticated

Route Params:

- transactionId: MongoDB ObjectId

Response:

{
  "success": true,
  "message": "Transaction fetched",
  "data": {
    "_id": "...",
    "amount": 1000,
    "type": "income",
    "category": "salary",
    "date": "2026-01-01T00:00:00.000Z",
    "notes": "Monthly salary",
    "createdBy": {
      "_id": "...",
      "name": "John",
      "email": "john@example.com",
      "role": "member"
    },
    "createdAt": "...",
    "updatedAt": "..."
  },
  "error": null
}

### Update Transaction

PATCH /transactions/:transactionId

Access: Admin only

Request Body (any subset):

{
  "amount": 1200,
  "type": "income",
  "category": "salary",
  "date": "2026-01-02",
  "notes": "Updated note"
}

Response:

{
  "success": true,
  "message": "Transaction updated",
  "data": { "_id": "..." },
  "error": null
}

### Delete Transaction

DELETE /transactions/:transactionId

Access: Admin only

Response:

{
  "success": true,
  "message": "Transaction deleted",
  "data": null,
  "error": null
}

## Dashboard APIs

Access: Admin and Analyst only

Query Parameters (all endpoints):

- startDate: date (optional)
- endDate: date (optional)
- limit: number, 1-100 (default 5)
- interval: "week" | "month" (default "month")

### Summary

GET /dashboard/summary

Response:

{
  "success": true,
  "message": "Dashboard summary fetched",
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 30000,
    "netBalance": 20000
  },
  "error": null
}

### Category Breakdown

GET /dashboard/categories

Response:

{
  "success": true,
  "message": "Dashboard categories fetched",
  "data": [
    { "category": "salary", "amount": 50000, "count": 5 },
    { "category": "rent", "amount": 12000, "count": 12 }
  ],
  "error": null
}

### Trends

GET /dashboard/trends

Response:

{
  "success": true,
  "message": "Dashboard trends fetched",
  "data": [
    { "period": { "year": 2026, "month": 1 }, "income": 5000, "expense": 1800, "net": 3200 }
  ],
  "error": null
}

### Recent Transactions

GET /dashboard/recent

Response:

{
  "success": true,
  "message": "Dashboard recent transactions fetched",
  "data": [
    {
      "_id": "...",
      "amount": 1000,
      "type": "income",
      "category": "salary",
      "date": "2026-01-01T00:00:00.000Z",
      "notes": "Monthly salary",
      "createdBy": "..."
    }
  ],
  "error": null
}

## Users APIs

Access: Admin only

### List Users

GET /users

Response:

{
  "success": true,
  "message": "Users fetched",
  "data": [
    {
      "_id": "...",
      "name": "John",
      "email": "john@example.com",
      "role": "member",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "error": null
}

### Update User

PATCH /users/:userId

Route Params:

- userId: MongoDB ObjectId

Request Body:

{
  "role": "admin",
  "isActive": true
}

Validation:

- role: "admin" | "manager" | "member" (optional)
- isActive: boolean (optional)

Response:

{
  "success": true,
  "message": "User updated",
  "data": {
    "_id": "...",
    "name": "John",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "error": null
}
