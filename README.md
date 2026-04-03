# Finance Dashboard Backend

A clean, layered backend API for finance data processing and dashboard insights, built on Node.js + Express + MongoDB + TypeScript.

## Project Overview

This system is transformed from a generic task/project domain into a **finance domain** centered on transactions and analytics:

- Record financial transactions (income/expense)
- Query transactions with filtering, date range, sorting, and pagination
- Generate dashboard insights via MongoDB aggregation pipelines
- Protect APIs with JWT auth + role-based access control (RBAC)

## Tech Stack

- Node.js, Express.js
- TypeScript
- MongoDB + Mongoose
- Zod (validation)
- JWT + bcryptjs (auth)
- Helmet, CORS, Morgan, express-rate-limit

## Architecture (Preserved)

The existing architecture is preserved:

- **Routes**: endpoint declarations only
- **Controllers**: HTTP request/response handling
- **Services**: business logic and aggregation pipelines
- **Models**: schema definitions
- **Middlewares**: auth, validation, rate limiting, error handling

## Folder Structure

```txt
src/
├── config/
├── models/
│   ├── User.ts
│   └── Transaction.ts
├── routes/
│   ├── auth.routes.ts
│   ├── transaction.routes.ts
│   ├── dashboard.routes.ts
│   ├── user.routes.ts
│   └── index.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── transaction.controller.ts
│   ├── dashboard.controller.ts
│   └── user.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── transaction.service.ts
│   ├── dashboard.service.ts
│   └── user.service.ts
├── middlewares/
├── utils/
├── validators/
│   ├── auth.validators.ts
│   ├── common.validators.ts
│   ├── transaction.validators.ts
│   ├── dashboard.validators.ts
│   └── user.validators.ts
└── app.ts

server.ts
```

## Finance Domain Explanation

The backend now models personal/organizational finance data where each entry is a **Transaction**. The previous task/project flow is deprecated and replaced by:

- `/api/v1/transactions` for financial records
- `/api/v1/dashboard/*` for aggregated insights

## Transaction Model

`Transaction` fields:

- `amount`: number, required, non-negative
- `type`: enum (`income` | `expense`), required
- `category`: string, required
- `date`: date, required
- `notes`: string, optional
- `createdBy`: reference to `User`, required

## Role Mapping

Existing role values are preserved in storage, but mapped semantically for finance operations:

- `admin` → **Admin** (full access)
- `manager` → **Analyst** (read + dashboard access)
- `member` → **Viewer** (read-only transactions)

### Permission Rules

- **Viewer (`member`)**: can read transactions only
- **Analyst (`manager`)**: can read transactions and access dashboard insights
- **Admin (`admin`)**: full transaction CRUD, full dashboard access, and user management APIs

Dashboard route access in code is enforced for **Admin + Analyst only**.

## API Base

- Base URL: `http://localhost:5000`
- Prefix: `/api/v1`

## Standard API Response

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "error": null
}
```

## Transaction APIs

### Create Transaction (Admin only)
`POST /api/v1/transactions`

```json
{
  "amount": 2500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01T00:00:00.000Z",
  "notes": "Monthly payroll"
}
```

### List Transactions (All authenticated roles)
`GET /api/v1/transactions?page=1&limit=10&type=expense&category=Food&startDate=2026-01-01&endDate=2026-04-30`

### Get Transaction
`GET /api/v1/transactions/:transactionId`

### Update Transaction (Admin only)
`PATCH /api/v1/transactions/:transactionId`

### Delete Transaction (Admin only)
`DELETE /api/v1/transactions/:transactionId`

## Dashboard APIs (Mandatory)

All dashboard aggregation logic lives in `dashboard.service.ts`.

### 1) Summary
`GET /api/v1/dashboard/summary?startDate=2026-01-01&endDate=2026-12-31`

Returns:
- `totalIncome`
- `totalExpenses`
- `netBalance`

### 2) Category Breakdown
`GET /api/v1/dashboard/categories?startDate=2026-01-01&endDate=2026-12-31`

Returns grouped totals by category.

### 3) Trends
`GET /api/v1/dashboard/trends?interval=month`

Returns timeseries grouped by month (or week using `interval=week`).

### 4) Recent Transactions
`GET /api/v1/dashboard/recent?limit=5`

Returns latest N transactions sorted by `date desc`.

## User Management APIs (Admin only)

### List Users
`GET /api/v1/users`

### Update User Role/Status
`PATCH /api/v1/users/:userId`

```json
{
  "role": "manager",
  "isActive": true
}
```

## Validation

- Body validation for create/update transaction
- Param validation for ObjectIds
- Query validation for pagination, filters, date range, interval, and limit

## Environment Variables

Copy `.env.example` into `.env` and configure:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_TTL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Assumptions

- Categories are user-defined free-text values.
- Transaction amounts are stored as positive values; direction comes from `type`.
- Non-admin users only see their own transactions.
- Dashboard insights for non-admin users are scoped to their own records.

## Trade-offs

- Currency handling is not yet modeled (single-currency assumption).
- No budget/goal model yet.
- No refresh token flow added to keep scope focused.

## Future Improvements

- Add currency and exchange rate support.
- Add budget and anomaly detection modules.
- Add dashboard caching for heavy aggregations.
- Add integration tests with mongodb-memory-server.
