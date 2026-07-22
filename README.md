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
### Deployment

The deployed site can be found at https://e23kitchenfood.up.railway.app/
