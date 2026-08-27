# Graph Report - .  (2026-08-27)

## Corpus Check
- 142 files · ~63,393 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 653 nodes · 1074 edges · 42 communities (35 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 5% INFERRED · 1% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Menu & Food Catalog UI
- Database & Core Config
- Food Domain Controllers
- Admin & Order Management
- Chef Dashboard Pipeline
- Customer Landing Experience
- Backend Dependencies
- Frontend Tooling
- Shared Frontend Deps
- Request Form Fields
- TypeScript Build Config
- Admin Mock API Layer
- Project Docs & Vision
- Auth UI & Login Flow
- Admin Layout & Routing
- Shared Layout & Navigation
- API Docs & Auth Reference
- Admin Auth Context
- User Management & Roles
- Modals & Order UI
- Data Tables & Dashboard
- Food Catalog Admin
- Docker & Deployment Stack
- Test User Seeding
- Craving Chips UI
- Brand Identity & Logo
- Light Mode Build Script
- Frontend Brand Assets
- Chef Impact Visual
- Chef Marketing Assets
- Chef Brand Logo
- Customer Persona Assets
- Docs Placeholder Image
- Dish Photo Assets
- Dish Photography
- Admin Hero Visual
- Vite Tooling
- Startup Scripts
- Placeholder File

## God Nodes (most connected - your core abstractions)
1. `Order` - 14 edges
2. `FoodItem` - 14 edges
3. `compilerOptions` - 14 edges
4. `OrderRequestCard()` - 12 edges
5. `Request` - 12 edges
6. `Kitchen Foods Backend API Reference` - 11 edges
7. `Food` - 10 edges
8. `Quote` - 10 edges
9. `User` - 10 edges
10. `pool` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Kitchen Food Platform Project Page` --semantically_similar_to--> `Kitchen Foods`  [INFERRED] [semantically similar]
  docs/README.md → README.md
- `Hyper-Local Digital Food Platform` --semantically_similar_to--> `Hyper-Local Digital Marketplace`  [INFERRED] [semantically similar]
  README.md → docs/README.md
- `/src/main.tsx Entry Point` --references--> `Frontend Merged App`  [INFERRED]
  frontend/index.html → README.md
- `RequestFormProps` --references--> `Request`  [EXTRACTED]
  frontend/src/customer/components/request/RequestForm.tsx → frontend/src/customer/types.ts
- `Backend` --references--> `Backend API Reference Document`  [EXTRACTED]
  README.md → backend/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Authentication Flow (Register, Login, JWT)** — backend_docs_api_reference_register_user_endpoint, backend_docs_api_reference_login_endpoint, backend_docs_api_reference_jwt_authentication [INFERRED 0.85]
- **User Management CRUD Surface** — backend_docs_api_reference_register_user_endpoint, backend_docs_api_reference_get_all_users_endpoint, backend_docs_api_reference_get_user_by_id_endpoint, backend_docs_api_reference_update_user_endpoint, backend_docs_api_reference_delete_user_endpoint [INFERRED 0.85]
- **Kitchen Foods Platform Vision** — readme_kitchenfoods, readme_verified_home_chefs, readme_hyper_local_platform, docs_readme_economic_empowerment, docs_readme_public_health, docs_readme_cultural_food_accessibility [INFERRED 0.85]
- **Kitchen Foods Docker Stack** — docker_compose_postgres, docker_compose_backend, docker_compose_frontend, docker_compose_seed [EXTRACTED 1.00]

## Communities (42 total, 7 thin omitted)

### Community 0 - "Menu & Food Catalog UI"
Cohesion: 0.07
Nodes (57): CategoryPills(), CategoryPillsProps, FoodItemCard(), FoodItemCardProps, FoodItemGrid(), FoodItemGridProps, MenuCustomization(), MenuHeader() (+49 more)

### Community 1 - "Database & Core Config"
Cohesion: 0.05
Nodes (23): __dirname, __filename, pool, __dirname, __filename, acceptQuote(), cancelOrder(), claimOrder() (+15 more)

### Community 2 - "Food Domain Controllers"
Cohesion: 0.07
Nodes (32): initDb(), removeFood(), addChefFoodItem(), deleteChefFoodItem(), getPublicFoodCategories(), getPublicFoodItems(), app, __dirname (+24 more)

### Community 3 - "Admin & Order Management"
Cohesion: 0.09
Nodes (42): addFood(), adminLogin(), createUser(), deleteOrder(), getDashboardOverview(), getFood(), getOrders(), getStats() (+34 more)

### Community 4 - "Chef Dashboard Pipeline"
Cohesion: 0.07
Nodes (34): App(), cn(), CustomFoodItem, PipelineColumnProps, statusDot, timeAgo(), EarningsChart(), EarningsChartProps (+26 more)

### Community 5 - "Customer Landing Experience"
Cohesion: 0.07
Nodes (23): App(), Hero(), HeroContent(), TRUST_BADGES, HeroImageMosaic(), HowItWorks(), STEPS, ImpactStats() (+15 more)

### Community 6 - "Backend Dependencies"
Cohesion: 0.06
Nodes (34): author, dependencies, bcrypt, cors, dotenv, express, jsonwebtoken, multer (+26 more)

### Community 7 - "Frontend Tooling"
Cohesion: 0.07
Nodes (26): devDependencies, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom, typescript, vite (+18 more)

### Community 8 - "Shared Frontend Deps"
Cohesion: 0.08
Nodes (25): axios, clsx, date-fns, dependencies, axios, clsx, date-fns, @google/genai (+17 more)

### Community 9 - "Request Form Fields"
Cohesion: 0.12
Nodes (16): BudgetField(), BudgetFieldProps, QUICK_ADD_AMOUNTS, DateTimeFields(), DateTimeFieldsProps, PortionSelector(), PortionSelectorProps, RequestForm() (+8 more)

### Community 10 - "TypeScript Build Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, allowJs, isolatedModules, jsx, lib, module, moduleDetection (+12 more)

### Community 11 - "Admin Mock API Layer"
Cohesion: 0.10
Nodes (19): authToken, instance, mockActivities, mockFoodCategories, mockFoodItems, mockOrders, mockUsers, TODO: Wire up Axios call here (POST /auth/login) (+11 more)

### Community 12 - "Project Docs & Vision"
Cohesion: 0.12
Nodes (18): Backend API Reference Document, OpenAPI Contract, Swagger UI, cepdnaclk/eYY-project-theme, Cultural Food Accessibility, Economic Empowerment, Hyper-Local Digital Marketplace, Kitchen Food Platform Project Page (+10 more)

### Community 13 - "Auth UI & Login Flow"
Cohesion: 0.17
Nodes (11): AuthForm(), BENEFITS, BrandingPanel(), AuthRole, RoleOption, ROLES, RoleSelector(), RoleSelectorProps (+3 more)

### Community 14 - "Admin Layout & Routing"
Cohesion: 0.26
Nodes (9): ProtectedRoute(), AdminLayout(), Header(), titleMap, navItems, Sidebar(), useAuth(), AdminLogin() (+1 more)

### Community 15 - "Shared Layout & Navigation"
Cohesion: 0.21
Nodes (9): Footer(), Layout(), LayoutProps, Navbar(), User, getInitials(), User, UserMenu() (+1 more)

### Community 16 - "API Docs & Auth Reference"
Cohesion: 0.29
Nodes (12): Kitchen Foods Backend API Reference, Delete User Endpoint (DELETE /api/users/:uid), Backend Error Formats (route vs global handler), Food Item imageUrl Field, Get All Users Endpoint (GET /api/users), Get User By ID Endpoint (GET /api/users/:uid), JWT Bearer Token Authentication, Login Endpoint (POST /api/auth/login) (+4 more)

### Community 17 - "Admin Auth Context"
Cohesion: 0.24
Nodes (8): App(), AuthContext, AuthContextValue, AuthProvider(), File Icon (UI asset), adminApi, AdminUser, App()

### Community 18 - "User Management & Roles"
Cohesion: 0.24
Nodes (9): approvalBadge, initialForm, roleOptions, UserManagement(), ChefApprovalStatus, FoodCategory, OrderStatus, User (+1 more)

### Community 19 - "Modals & Order UI"
Cohesion: 0.22
Nodes (8): Modal(), ModalProps, OrderManagement(), TODO: Wire up Axios call here (fetch all orders), TODO: Wire up Axios call here (update order status), TODO: Wire up Axios call here (delete order), statusOptions, Order

### Community 20 - "Data Tables & Dashboard"
Cohesion: 0.22
Nodes (8): Column, Table(), TableProps, DashboardOverview(), TODO: Wire up Axios call here (dashboard overview fetch), statCards, ActivityEvent, DashboardStats

### Community 21 - "Food Catalog Admin"
Cohesion: 0.25
Nodes (7): FoodCatalogManagement(), initialForm, TODO: Wire up Axios call here (create food item), TODO: Wire up Axios call here (delete food item), TODO: Wire up Axios call here (fetch food catalog), TODO: Wire up Axios call here (update food item), FoodItem

### Community 22 - "Docker & Deployment Stack"
Cohesion: 0.29
Nodes (7): Backend Service, Frontend Service, pgdata Volume, Postgres Service, postgres:16-alpine Image, Seed Runner Service, uploads-data Volume

### Community 23 - "Test User Seeding"
Cohesion: 0.40
Nodes (3): pool, IMPORTANT: uids are FIXED (not random) on purpose. The backend wipes the, testUsers

### Community 24 - "Craving Chips UI"
Cohesion: 0.50
Nodes (3): CravingChips(), CravingChipsProps, CRAVINGS

### Community 25 - "Brand Identity & Logo"
Cohesion: 0.67
Nodes (4): Kitchen Foods Platform Brand Identity, Logo Color Scheme, Visual Depiction of the Logo, Kitchen Food Logo

### Community 26 - "Light Mode Build Script"
Cohesion: 0.50
Nodes (3): filesToProcess, fs, path

### Community 27 - "Frontend Brand Assets"
Cohesion: 0.50
Nodes (4): Atom Orbit Iconography, Frontend Admin Brand Assets, React, React Logo

### Community 28 - "Chef Impact Visual"
Cohesion: 1.00
Nodes (3): Chef, Chef Impact Image 1, Impact

### Community 29 - "Chef Marketing Assets"
Cohesion: 0.67
Nodes (3): Chef Impact Image 2, Chef Persona, Marketing Messaging

### Community 30 - "Chef Brand Logo"
Cohesion: 0.67
Nodes (3): Kitchen Foods Platform Brand Identity, Chef Branding, Chef Logo

### Community 31 - "Customer Persona Assets"
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
- **189 isolated node(s):** `pool`, `testUsers`, `name`, `version`, `description` (+184 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

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