# Kitchen Foods

Kitchen Foods is a hyper-local digital food platform designed to connect verified home chefs with customers such as tourists, office workers, and nearby residents. The system aims to provide access to healthy, affordable, and authentic homemade meals while empowering skilled women by creating income-generating opportunities from their homes.

The platform supports customized meal ordering, location-based chef discovery, secure payments, and user verification. By combining technology with community-based food preparation, the project addresses economic empowerment, public health, and cultural food accessibility within Sri Lanka.

## Development Apps

This repository now contains two separate frontend applications:

- `frontend/` - public customer-facing experience
- `admin/` - isolated super admin dashboard

Run each app independently in separate terminals:

```bash
cd frontend && npm install && npm run dev
```

```bash
cd admin && npm install && npm run dev
```

This keeps admin fully isolated while staying entangled with the same backend ecosystem.

