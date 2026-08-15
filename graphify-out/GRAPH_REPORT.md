# Graph Report - .  (2026-08-04)

## Corpus Check
- Corpus is ~48,072 words - fits in a single context window. You may not need a graph.

## Summary
- 463 nodes · 689 edges · 31 communities (25 shown, 6 thin omitted)
- Extraction: 91% EXTRACTED · 8% INFERRED · 1% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- React UI Component Library
- Admin Auth & CRUD API
- Customer Home Experience
- Chef Earnings & Food Items
- Backend Dependency Stack
- Database & Order Management
- DB Init & User Management
- Admin Dashboard UI
- Frontend Build Tooling
- Shared HTTP Client Deps
- API Contract & Deployment
- TypeScript Compiler Config
- Public Food & Category API
- Site Layout & Navigation
- REST Endpoint Spec
- Test Data Seed Script
- Logo & Brand Identity
- Docs Build Script
- Admin Brand Icon Assets
- Chef Impact Imagery
- Chef Persona & Marketing
- Chef Logo Branding
- Aunty Kamala Persona
- Docs Sample Image
- Customer Dish Photo
- Marketing Dish Photo
- Admin Dashboard Hero
- Vite Build Tool Logo

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 14 edges
2. `Food` - 10 edges
3. `Order` - 10 edges
4. `User` - 9 edges
5. `useAuth()` - 9 edges
6. `pool` - 8 edges
7. `Kitchen Food Platform Project Page` - 8 edges
8. `getUserByEmailService()` - 7 edges
9. `adminApi` - 7 edges
10. `Order` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Kitchen Food Platform Project Page` --semantically_similar_to--> `Kitchen Foods`  [INFERRED] [semantically similar]
  docs/README.md → README.md
- `Hyper-Local Digital Food Platform` --semantically_similar_to--> `Hyper-Local Digital Marketplace`  [INFERRED] [semantically similar]
  README.md → docs/README.md
- `/src/main.tsx Entry Point` --references--> `Frontend Merged App`  [INFERRED]
  frontend/index.html → README.md
- `Backend API Reference Document` --references--> `PostgreSQL 16 Service`  [INFERRED]
  backend/README.md → docker-compose.yml
- `Backend` --references--> `Backend API Reference Document`  [EXTRACTED]
  README.md → backend/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User CRUD Endpoint Flow** — backend_docs_api_reference_register_endpoint, backend_docs_api_reference_login_endpoint, backend_docs_api_reference_get_all_users, backend_docs_api_reference_get_user_by_id, backend_docs_api_reference_update_user, backend_docs_api_reference_delete_user [INFERRED 0.85]
- **Docker Compose Deployment Stack** — docker_compose_yml_postgres, docker_compose_yml_backend, docker_compose_yml_frontend [EXTRACTED 1.00]
- **Kitchen Foods Platform Vision** — readme_kitchenfoods, readme_verified_home_chefs, readme_hyper_local_platform, docs_readme_economic_empowerment, docs_readme_public_health, docs_readme_cultural_food_accessibility [INFERRED 0.85]

## Communities (31 total, 6 thin omitted)

### Community 0 - "React UI Component Library"
Cohesion: 0.06
Nodes (46): Modal(), ModalProps, Column, Table(), TableProps, TODO: Wire up Axios call here (dashboard overview fetch), statCards, initialForm (+38 more)

### Community 1 - "Admin Auth & CRUD API"
Cohesion: 0.11
Nodes (36): addFood(), adminLogin(), createUser(), deleteOrder(), getDashboardOverview(), getFood(), getOrders(), getStats() (+28 more)

### Community 2 - "Customer Home Experience"
Cohesion: 0.09
Nodes (21): App(), Hero(), HowItWorks(), ImpactCounter(), Stats, MenuCustomization(), PromoBanner(), PROMOS (+13 more)

### Community 3 - "Chef Earnings & Food Items"
Cohesion: 0.10
Nodes (24): App(), cn(), CustomFoodItem, EarningsChart(), EarningsChartProps, NewOrderToast(), NewOrderToastProps, OrderCard() (+16 more)

### Community 4 - "Backend Dependency Stack"
Cohesion: 0.06
Nodes (32): author, dependencies, bcrypt, cors, dotenv, express, jsonwebtoken, pg (+24 more)

### Community 5 - "Database & Order Management"
Cohesion: 0.09
Nodes (10): __dirname, __filename, pool, claimOrder(), createOrder(), getChefOrders(), getCustomerOrders(), updateOrderStatus() (+2 more)

### Community 6 - "DB Init & User Management"
Cohesion: 0.10
Nodes (21): __dirname, __filename, initDb(), deleteUser(), getAllUsers(), getUserById(), updateUser(), app (+13 more)

### Community 7 - "Admin Dashboard UI"
Cohesion: 0.13
Nodes (20): App(), ProtectedRoute(), AdminLayout(), Header(), titleMap, navItems, Sidebar(), AuthContext (+12 more)

### Community 8 - "Frontend Build Tooling"
Cohesion: 0.07
Nodes (26): devDependencies, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom, typescript, vite (+18 more)

### Community 9 - "Shared HTTP Client Deps"
Cohesion: 0.08
Nodes (25): axios, clsx, date-fns, dependencies, axios, clsx, date-fns, @google/genai (+17 more)

### Community 10 - "API Contract & Deployment"
Cohesion: 0.10
Nodes (21): Backend API Reference Document, OpenAPI Contract, Swagger UI, Backend Docker Service, Frontend Docker Service, PostgreSQL 16 Service, cepdnaclk/eYY-project-theme, Cultural Food Accessibility (+13 more)

### Community 11 - "TypeScript Compiler Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, allowJs, isolatedModules, jsx, lib, module, moduleDetection (+12 more)

### Community 12 - "Public Food & Category API"
Cohesion: 0.27
Nodes (5): addChefFoodItem(), deleteChefFoodItem(), getPublicFoodCategories(), getPublicFoodItems(), Food

### Community 13 - "Site Layout & Navigation"
Cohesion: 0.21
Nodes (9): Footer(), Layout(), LayoutProps, Navbar(), User, getInitials(), User, UserMenu() (+1 more)

### Community 14 - "REST Endpoint Spec"
Cohesion: 0.28
Nodes (9): Backend Base URL (localhost:8000), DELETE /api/users/:uid, GET /api/users, GET /api/users/:uid, Global Error Handler, JWT Bearer Token Authentication, POST /api/auth/login, POST /api/auth/register (+1 more)

### Community 16 - "Logo & Brand Identity"
Cohesion: 0.67
Nodes (4): Kitchen Foods Platform Brand Identity, Logo Color Scheme, Visual Depiction of the Logo, Kitchen Food Logo

### Community 17 - "Docs Build Script"
Cohesion: 0.50
Nodes (3): filesToProcess, fs, path

### Community 18 - "Admin Brand Icon Assets"
Cohesion: 0.50
Nodes (4): Atom Orbit Iconography, Frontend Admin Brand Assets, React, React Logo

### Community 19 - "Chef Impact Imagery"
Cohesion: 1.00
Nodes (3): Chef, Chef Impact Image 1, Impact

### Community 20 - "Chef Persona & Marketing"
Cohesion: 0.67
Nodes (3): Chef Impact Image 2, Chef Persona, Marketing Messaging

### Community 21 - "Chef Logo Branding"
Cohesion: 0.67
Nodes (3): Kitchen Foods Platform Brand Identity, Chef Branding, Chef Logo

### Community 22 - "Aunty Kamala Persona"
Cohesion: 1.00
Nodes (3): Customer-Facing Image Asset, Aunty Kamala (Person), Aunty Kamala Photo Asset

## Ambiguous Edges - Review These
- `AuthContext.tsx` → `File Icon (UI asset)`  [AMBIGUOUS]
  frontend/src/admin/context/file.png · relation: conceptually_related_to
- `Kitchen Food Logo` → `Logo Color Scheme`  [AMBIGUOUS]
  docs/images/kitchen_food_logo.png · relation: conceptually_related_to
- `Chef` → `Impact`  [AMBIGUOUS]
  frontend/public/images/chef_impact_1.png · relation: conceptually_related_to
- `Chef Impact Image 2` → `Chef Persona`  [AMBIGUOUS]
  frontend/public/images/chef_impact_2.png · relation: conceptually_related_to
- `Chef Impact Image 2` → `Marketing Messaging`  [AMBIGUOUS]
  frontend/public/images/chef_impact_2.png · relation: conceptually_related_to
- `Dish Photo` → `Food Item`  [AMBIGUOUS]
  frontend/public/images/dish1.jpeg · relation: references
- `dish2.jpg Image File` → `Food Dish Photo`  [AMBIGUOUS]
  frontend/public/images/dish2.jpg · relation: references
- `Admin Hero Image Asset` → `Admin Dashboard Visual Asset`  [AMBIGUOUS]
  frontend/src/admin/assets/hero.png · relation: conceptually_related_to
- `Aunty Kamala Photo Asset` → `Customer-Facing Image Asset`  [AMBIGUOUS]
  frontend/src/customer/assets/aunty-kamala.jpg · relation: conceptually_related_to
- `Aunty Kamala (Person)` → `Customer-Facing Image Asset`  [AMBIGUOUS]
  frontend/src/customer/assets/aunty-kamala.jpg · relation: conceptually_related_to

## Knowledge Gaps
- **147 isolated node(s):** `pool`, `testUsers`, `name`, `version`, `description` (+142 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `AuthContext.tsx` and `File Icon (UI asset)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Kitchen Food Logo` and `Logo Color Scheme`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Chef` and `Impact`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Chef Impact Image 2` and `Chef Persona`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Chef Impact Image 2` and `Marketing Messaging`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Dish Photo` and `Food Item`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `dish2.jpg Image File` and `Food Dish Photo`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._