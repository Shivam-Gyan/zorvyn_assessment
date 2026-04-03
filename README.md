# Zorvyn Assessment Backend

A production-style backend system for task and project management built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **TypeScript**. The system is structured using clean layering principles (route → controller → service → model), robust validation, and centralized error handling.

## 1) Project Overview

This API provides:

- JWT-based authentication (`register`, `login`, `me`)
- Role-based authorization (`admin`, `manager`, `member`)
- Project management with ownership and membership
- Task management with filtering, sorting, and pagination
- Consistent API response format
- Input validation for body, query, and params
- Centralized error handling for operational and unexpected errors

## 2) Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Validation**: Zod
- **Security**: Helmet, CORS, JWT, bcrypt
- **Observability**: Morgan logging
- **Performance/Safety**: Express rate limiter
- **Tests**: Jest + Supertest

## 3) Folder Structure

```txt
.
├── src
│   ├── config
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   └── task.controller.ts
│   ├── middlewares
│   │   ├── asyncHandler.ts
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validate.middleware.ts
│   ├── models
│   │   ├── Project.ts
│   │   ├── Task.ts
│   │   └── User.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── index.ts
│   │   ├── project.routes.ts
│   │   └── task.routes.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   └── task.service.ts
│   ├── types
│   │   └── index.ts
│   ├── utils
│   │   ├── ApiError.ts
│   │   ├── apiResponse.ts
│   │   └── constants.ts
│   ├── validators
│   │   ├── auth.validators.ts
│   │   ├── common.validators.ts
│   │   ├── project.validators.ts
│   │   └── task.validators.ts
│   └── app.ts
├── tests
│   └── health.test.ts
├── .env.example
├── jest.config.ts
├── package.json
├── server.ts
└── tsconfig.json
```

## 4) Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB local instance or MongoDB Atlas

### Install & Run

```bash
npm install
cp .env.example .env
npm run dev
```

Build and run production mode:

```bash
npm run build
npm start
```

## 5) Environment Variables

Use `.env` file:

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/zorvyn_assessment` |
| `JWT_ACCESS_SECRET` | Secret for access token signing | `super_secret` |
| `JWT_ACCESS_TTL` | Access token validity | `1h` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window per IP | `100` |

## 6) API Design

- Base URL: `http://localhost:5000`
- Versioned prefix: `/api/v1`
- Standard response envelope:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "error": null
}
```

### Auth Endpoints

#### Register
`POST /api/v1/auth/register`

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123",
  "role": "manager"
}
```

#### Login
`POST /api/v1/auth/login`

```json
{
  "email": "alice@example.com",
  "password": "Password123"
}
```

#### Profile
`GET /api/v1/auth/me` (Bearer token required)

---

### Project Endpoints

#### Create project (admin/manager)
`POST /api/v1/projects`

```json
{
  "name": "Platform Revamp",
  "description": "Q2 platform work",
  "members": ["65f1c4c1b5f51f31dc8c21f1"]
}
```

#### List projects
`GET /api/v1/projects`

#### Get project
`GET /api/v1/projects/:projectId`

#### Update project (admin/owner)
`PATCH /api/v1/projects/:projectId`

---

### Task Endpoints

#### Create task
`POST /api/v1/tasks`

```json
{
  "title": "Implement JWT middleware",
  "description": "Protect all private endpoints",
  "project": "65f1c4c1b5f51f31dc8c21f1",
  "priority": "high",
  "assignee": "65f1c4c1b5f51f31dc8c21f2",
  "dueDate": "2026-12-31T00:00:00.000Z"
}
```

#### List tasks (pagination/filter/sort)
`GET /api/v1/tasks?page=1&limit=10&status=todo&priority=high&sortBy=createdAt&sortOrder=desc`

#### Get task
`GET /api/v1/tasks/:taskId`

#### Update task
`PATCH /api/v1/tasks/:taskId`

#### Delete task
`DELETE /api/v1/tasks/:taskId`

## 7) Sample cURL Requests

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Password123","role":"manager"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password123"}'

# List tasks (replace TOKEN)
curl -X GET "http://localhost:5000/api/v1/tasks?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

## 8) Database Modeling Notes

### User
- Unique indexed email
- Hashed password with pre-save hook
- Role enum for RBAC

### Project
- `owner` reference to `User`
- `members` reference array to `User`
- Compound uniqueness index on `(name, owner)` to reduce duplicates per owner

### Task
- References to `project`, `assignee`, and `createdBy`
- Indexes on `status`, `priority`, `dueDate`, and `(project, createdAt)`
- Designed for fast list queries and filtering

## 9) Assumptions Made

- JWT access-token-only flow is sufficient for this assessment.
- Managers can create/update projects they own.
- Members can view resources where they belong but cannot create/update projects.
- Task updates are allowed for users with project access.

## 10) Design Decisions

- **Layered architecture** to separate concerns.
- **Zod-based validation middleware** for request input safety.
- **Centralized error handling** with normalized output.
- **Service-layer authorization checks** for defense in depth.
- **Rate limiting and security headers** enabled globally.

## 11) Trade-offs

- No refresh-token/session revocation mechanism to keep scope tight.
- No full audit trail/events table included.
- Sorting by arbitrary `sortBy` is accepted for flexibility but could be strict-whitelisted in hardened production.

## 12) Future Improvements

- Add refresh tokens + token revocation.
- Add stronger authorization policies (resource-scoped permissions).
- Add OpenAPI/Swagger docs and generated Postman collection.
- Add integration tests for auth/project/task lifecycle using in-memory MongoDB.
- Add structured logging (Winston/Pino) and distributed trace context.

## 13) Testing

```bash
npm run typecheck
npm test
```

