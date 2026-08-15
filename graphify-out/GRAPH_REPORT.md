# Graph Report - .  (2026-08-15)

## Corpus Check
- 61 files · ~53,941 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 587 nodes · 954 edges · 33 communities (26 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 5% INFERRED · 1% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin App Shell
- Customer Menu Components
- Admin API Controllers
- Chef App Interface
- Backend Init & Food API
- Customer Landing Pages
- Backend Dependencies
- Database Access Layer
- Frontend Tooling
- Frontend Dependencies
- Request Form Fields
- TypeScript Configuration
- REST Endpoint Docs
- API Docs & Vision
- Login UI Components
- Shared Layout Components
- Logo & Brand Identity
- Craving Search UI
- Test User Seeding
- Light Mode Script
- React Brand Assets
- Chef Impact Imagery
- Chef Marketing Assets
- Customer Persona Image
- Docs Placeholder Images
- Food Photo Assets
- Dish Photography
- Admin Dashboard Assets
- Vite Branding
- Code Placeholder

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 14 edges
2. `FoodItem` - 14 edges
3. `Kitchen Foods Backend API Reference` - 13 edges
4. `Request` - 12 edges
5. `Order` - 10 edges
6. `Food` - 10 edges
7. `User` - 9 edges
8. `useAuth()` - 9 edges
9. `FoodCategory` - 9 edges
10. `JWT Bearer Token Authentication` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Kitchen Food Platform Project Page` --semantically_similar_to--> `Kitchen Foods`  [INFERRED] [semantically similar]
  docs/README.md → README.md
- `Hyper-Local Digital Food Platform` --semantically_similar_to--> `Hyper-Local Digital Marketplace`  [INFERRED] [semantically similar]
  README.md → docs/README.md
- `JWT Bearer Token Authentication` --shares_data_with--> `JWT_SECRET Configuration`  [INFERRED]
  backend/docs/API_REFERENCE.md → docker-compose.yml
- `/src/main.tsx Entry Point` --references--> `Frontend Merged App`  [INFERRED]
  frontend/index.html → README.md
- `Kitchen Foods Backend API Reference` --conceptually_related_to--> `Backend Service`  [INFERRED]
  backend/docs/API_REFERENCE.md → docker-compose.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Authentication Flow (Register, Login, JWT)** — backend_docs_api_reference_register_user_endpoint, backend_docs_api_reference_login_endpoint, backend_docs_api_reference_jwt_authentication [INFERRED 0.85]
- **User Management CRUD Surface** — backend_docs_api_reference_register_user_endpoint, backend_docs_api_reference_get_all_users_endpoint, backend_docs_api_reference_get_user_by_id_endpoint, backend_docs_api_reference_update_user_endpoint, backend_docs_api_reference_delete_user_endpoint [INFERRED 0.85]
- **Application Deployment Stack** — docker_compose_postgres_service, docker_compose_backend_service, docker_compose_frontend_service [INFERRED 0.75]
- **Kitchen Foods Platform Vision** — readme_kitchenfoods, readme_verified_home_chefs, readme_hyper_local_platform, docs_readme_economic_empowerment, docs_readme_public_health, docs_readme_cultural_food_accessibility [INFERRED 0.85]

## Communities (33 total, 7 thin omitted)

### Community 0 - "Admin App Shell"
Cohesion: 0.05
Nodes (60): App(), ProtectedRoute(), AdminLayout(), Header(), titleMap, navItems, Sidebar(), Modal() (+52 more)

### Community 1 - "Customer Menu Components"
Cohesion: 0.09
Nodes (41): CategoryPills(), CategoryPillsProps, FoodItemCard(), FoodItemCardProps, FoodItemGrid(), FoodItemGridProps, MenuCustomization(), MenuHeader() (+33 more)

### Community 2 - "Admin API Controllers"
Cohesion: 0.08
Nodes (46): addFood(), adminLogin(), createUser(), deleteOrder(), getDashboardOverview(), getFood(), getOrders(), getStats() (+38 more)

### Community 3 - "Chef App Interface"
Cohesion: 0.07
Nodes (30): App(), cn(), CustomFoodItem, EarningsChart(), EarningsChartProps, NewOrderToast(), NewOrderToastProps, OrderCard() (+22 more)

### Community 4 - "Backend Init & Food API"
Cohesion: 0.08
Nodes (24): __dirname, __filename, initDb(), addChefFoodItem(), deleteChefFoodItem(), getPublicFoodCategories(), getPublicFoodItems(), app (+16 more)

### Community 5 - "Customer Landing Pages"
Cohesion: 0.08
Nodes (22): App(), Hero(), HeroContent(), TRUST_BADGES, HeroImageMosaic(), HowItWorks(), STEPS, ImpactStats() (+14 more)

### Community 6 - "Backend Dependencies"
Cohesion: 0.06
Nodes (34): author, dependencies, bcrypt, cors, dotenv, express, jsonwebtoken, multer (+26 more)

### Community 7 - "Database Access Layer"
Cohesion: 0.09
Nodes (11): __dirname, __filename, pool, claimOrder(), createOrder(), getChefOrders(), getCustomerOrders(), updateOrderStatus() (+3 more)

### Community 8 - "Frontend Tooling"
Cohesion: 0.07
Nodes (26): devDependencies, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom, typescript, vite (+18 more)

### Community 9 - "Frontend Dependencies"
Cohesion: 0.08
Nodes (25): axios, clsx, date-fns, dependencies, axios, clsx, date-fns, @google/genai (+17 more)

### Community 10 - "Request Form Fields"
Cohesion: 0.12
Nodes (16): BudgetField(), BudgetFieldProps, QUICK_ADD_AMOUNTS, DateTimeFields(), DateTimeFieldsProps, PortionSelector(), PortionSelectorProps, RequestForm() (+8 more)

### Community 11 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, allowJs, isolatedModules, jsx, lib, module, moduleDetection (+12 more)

### Community 12 - "REST Endpoint Docs"
Cohesion: 0.17
Nodes (20): Kitchen Foods Backend API Reference, Delete User Endpoint (DELETE /api/users/:uid), Backend Error Formats (route vs global handler), Food Item imageUrl Field, Get All Users Endpoint (GET /api/users), Get User By ID Endpoint (GET /api/users/:uid), JWT Bearer Token Authentication, Login Endpoint (POST /api/auth/login) (+12 more)

### Community 13 - "API Docs & Vision"
Cohesion: 0.12
Nodes (18): Backend API Reference Document, OpenAPI Contract, Swagger UI, cepdnaclk/eYY-project-theme, Cultural Food Accessibility, Economic Empowerment, Hyper-Local Digital Marketplace, Kitchen Food Platform Project Page (+10 more)

### Community 14 - "Login UI Components"
Cohesion: 0.20
Nodes (9): AuthForm(), BrandingPanel(), AuthRole, ROLES, RoleSelector(), RoleSelectorProps, TextField(), TextFieldProps (+1 more)

### Community 15 - "Shared Layout Components"
Cohesion: 0.21
Nodes (9): Footer(), Layout(), LayoutProps, Navbar(), User, getInitials(), User, UserMenu() (+1 more)

### Community 16 - "Logo & Brand Identity"
Cohesion: 0.40
Nodes (6): Logo Color Scheme, Visual Depiction of the Logo, Kitchen Food Logo, Kitchen Foods Platform Brand Identity, Chef Branding, Chef Logo

### Community 17 - "Craving Search UI"
Cohesion: 0.50
Nodes (3): CravingChips(), CravingChipsProps, CRAVINGS

### Community 19 - "Light Mode Script"
Cohesion: 0.50
Nodes (3): filesToProcess, fs, path

### Community 20 - "React Brand Assets"
Cohesion: 0.50
Nodes (4): Atom Orbit Iconography, Frontend Admin Brand Assets, React, React Logo

### Community 21 - "Chef Impact Imagery"
Cohesion: 1.00
Nodes (3): Chef, Chef Impact Image 1, Impact

### Community 22 - "Chef Marketing Assets"
Cohesion: 0.67
Nodes (3): Chef Impact Image 2, Chef Persona, Marketing Messaging

### Community 23 - "Customer Persona Image"
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
- **182 isolated node(s):** `pool`, `testUsers`, `__filename`, `__dirname`, `__filename` (+177 more)
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