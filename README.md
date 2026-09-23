# Kitchen Foods

Kitchen Foods is a hyper-local digital food platform designed to connect verified home chefs with customers such as tourists, office workers, and nearby residents. The system aims to provide access to healthy, affordable, and authentic homemade meals while empowering skilled women by creating income-generating opportunities from their homes.

The platform supports customized meal ordering, location-based chef discovery, secure payments, and user verification. By combining technology with community-based food preparation, the project addresses economic empowerment, public health, and cultural food accessibility within Sri Lanka.

## Development

### Frontend (merged app)

All three frontends (customer, admin, chef) are merged into a single app at `frontend/`.

```bash
cd frontend && npm install && npm run dev
```

The app serves three route sections:
- `/` — public customer experience
- `/admin/*` — super admin dashboard
- `/chef` — chef dashboard

### Backend

```bash
cd backend && npm install && npm run dev
```

Configure the API URL in `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Testing

The project has three layers of tests. All of them use **Vitest** (E2E uses Playwright on top of it).

### Quick start

```bash
# Frontend: unit + component tests
 cd frontend && npm test

# Frontend: E2E smoke flows (mocked API, no backend needed)
cd frontend && npx playwright test

# Backend: unit + integration tests (integration auto-skips without Postgres)
cd backend && npm test

# Backend integration tests against the docker-compose database
docker compose up -d postgres
cd backend && DB_PORT=5433 npm test
```

### Test layout

| Layer | Location | What it covers |
|-------|----------|----------------|
| Backend unit | `backend/tests/unit/` | Bidding expiry math, auth/admin middlewares, controllers (mocked models), error handler |
| Backend integration | `backend/tests/integration/` | Real Postgres: auth flows, the full bidding engine (bid → accept → reject competitors), admin API + RBAC, uploads |
| Frontend unit/component | `frontend/src/**/*.test.ts(x)` | Formatters, status helpers, API client mapping, React hooks (polling, splash), order card interactions |
| Frontend E2E | `frontend/tests/e2e/` | Playwright smoke flows: homepage, login session, quote acceptance |

### Notes

- Backend integration tests use a dedicated `kitchen-foods-test` database — dev data is never touched. They skip automatically (with a warning) when Postgres is unreachable, so `npm test` works everywhere; CI runs them for real.
- The backend's dev server wipes its schema on every restart (`initDb`); tests avoid this by importing the side-effect-free app from `backend/src/app.js`.
- CI (`.github/workflows/ci.yml`) runs typecheck + all suites on every push/PR to `main`, with a Postgres service for the integration layer.

### Deployment

The deployed site can be found at https://e23kitchenfood.up.railway.app/
