# 🍲 Kitchen Foods Platform — Comprehensive User & Chef Manual

> **Department of Computer Engineering, University of Peradeniya**  
> **Course:** CO2060 — Software Systems Engineering  
> **Project:** Kitchen Foods Platform (`e23-co2060-Kitchen-Foods-Platform`)  
> **Target Audience:** General Customers (Users) & Home Cooks (Chefs)

---

## 📌 Document Overview & Instructions

Welcome to the **Kitchen Foods Platform User Manual**. This document is split into two standalone sections:
1. **[Part 1: Customer (User) Guide](#part-1--customer-user-guide)** — For local residents, office workers, and tourists looking to discover authentic home-cooked meals, customize dishes, and track deliveries.
2. **[Part 2: Chef (Home Cook) Manual](#part-2--chef-home-cook-manual)** — For home chefs running culinary micro-businesses, managing their dish catalog, accepting orders, and utilizing GPS-based 10km radius delivery tracking.

---

> 📝 **Notice for the Project Author (Image Placement Instructions):**  
> Throughout this manual, dedicated image placeholders have been created using high-visibility callout boxes:
> ```markdown
> > 📸 **[IMAGE PLACEHOLDER #XX: Description of Screenshot]**
> > *Screenshot Tip: ...*
> > *Markdown syntax to insert: `![Alt Text](images/filename.png)`*
> ```
> To complete your manual:
> 1. Run your frontend (`npm run dev`) and navigate to the respective page or modal.
> 2. Capture the screenshot and save it inside the `docs/images/` directory.
> 3. Replace the placeholder block with your standard markdown image tag: `![Description](images/your_image.png)`.
> 4. Refer to the **[Screenshot Insertion Checklist](#screenshot-insertion-checklist)** at the end of this document to track your progress.

---

## Table of Contents
- [About Kitchen Foods Platform](#about-kitchen-foods-platform)
- [Part 1 — Customer (User) Guide](#part-1--customer-user-guide)
  - [1. Account Registration & Sign In](#1-account-registration--sign-in)
  - [2. Exploring the Menu & Meal Categories](#2-exploring-the-menu--meal-categories)
  - [3. Customizing Your Meal Order](#3-customizing-your-meal-order)
  - [4. Delivery Location & 10km GPS Verification](#4-delivery-location--10km-gps-verification)
  - [5. Confirming & Tracking Active Orders](#5-confirming--tracking-active-orders)
  - [6. Community Impact & Social Mission](#6-community-impact--social-mission)
- [Part 2 — Chef (Home Cook) Manual](#part-2--chef-home-cook-manual)
  - [7. Chef Registration & Portal Access](#7-chef-registration--portal-access)
  - [8. Chef Dashboard & Navigation](#8-chef-dashboard--navigation)
  - [9. Setting Your Kitchen GPS Coordinates](#9-setting-your-kitchen-gps-coordinates)
  - [10. Managing the Dish Catalog (Adding & Deleting Dishes)](#10-managing-the-dish-catalog)
  - [11. Real-Time Order Management (Pipeline & Kanban)](#11-real-time-order-management)
  - [12. Inspecting Client Delivery Location & Distance Map](#12-inspecting-client-delivery-location--distance-map)
  - [13. Order Preparation Workflow (Pending → Cooking → Ready → Completed)](#13-order-preparation-workflow)
  - [14. Chef Profile, Kitchen Bio & Kitchen Settings](#14-chef-profile-kitchen-bio--kitchen-settings)
- [Part 3 — Troubleshooting & FAQs](#part-3--troubleshooting--faqs)
- [Screenshot Insertion Checklist](#screenshot-insertion-checklist)

---

# About Kitchen Foods Platform

Kitchen Foods is a hyper-local digital food network engineered to connect verified home chefs—particularly skilled women seeking sustainable home income opportunities—with nearby customers such as office staff, local residents, and traveling food enthusiasts.

### Key Pillars:
* **Authentic Homemade Cuisine:** Fresh, hygienic, and non-commercial home cooking prepared with traditional Sri Lankan flavors.
* **Granular Customization:** Customers can adjust spice tolerance, portion counts, dietary needs (e.g., gluten-free, nut allergies), and target budgets.
* **Hyper-Local 10km Delivery Radius:** Automated geolocation ensures dishes are prepared and delivered within a 10km radius for peak food freshness and timely service.
* **Empowering Home Micro-Entrepreneurs:** A streamlined management suite allowing home cooks to manage orders, schedule prep times, and track earnings without administrative friction.

---

# Part 1 — Customer (User) Guide

---

## 1. Account Registration & Sign In

To order food and track real-time meal preparation, you must have an active Customer account.

### Step 1.1: Navigating to the Portal
1. Open your web browser and navigate to the platform URL (e.g., `http://localhost:5173/` or your production domain).
2. Click the **Login** or **Sign In** button in the top navigation bar.

> 📸 **[IMAGE PLACEHOLDER #01: Customer Navigation Bar & Login Button]**  
> *Action required: Take a screenshot of the top header showing the logo, navigation links, and the Login button.*  
> *Target path: `docs/images/01_navbar_login.png`*  
> *Markdown syntax: `![Customer Navigation Bar](images/01_navbar_login.png)`*

---

### Step 1.2: Registering a New Customer Account
1. On the authentication screen, if you do not have an account, click **"Create an Account"** / **"Sign Up"**.
2. Enter your **Full Name**.
3. Under **"I am registering as a"**, select **Customer** (the toggle turns highlighted).
4. Enter your **Email Address**.
5. Enter a secure **Password** (minimum 6 characters).
6. Click **Create Account**.

> 📸 **[IMAGE PLACEHOLDER #02: Customer Registration Form]**  
> *Action required: Capture the Sign Up screen with the "Customer" radio pill highlighted and sample input filled in.*  
> *Target path: `docs/images/02_customer_register.png`*  
> *Markdown syntax: `![Customer Registration Form](images/02_customer_register.png)`*

---

### Step 1.3: Signing In
1. Switch to the **Welcome Back** tab.
2. Enter your registered email address and password.
3. Click **Sign In**.
4. You will be redirected to the main customer home page, and your name/avatar will appear in the navigation bar.

> 📸 **[IMAGE PLACEHOLDER #03: Customer Login Screen]**  
> *Action required: Capture the Login screen showing the email and password fields.*  
> *Target path: `docs/images/03_customer_login.png`*  
> *Markdown syntax: `![Customer Login Screen](images/03_customer_login.png)`*

---

## 2. Exploring the Menu & Meal Categories

### Step 2.1: Homepage Discovery
* **Hero Banner:** Discover today's highlighted home chefs and special meal announcements.
* **Recommendations:** View curated and top-rated dishes suggested based on community feedback.

> 📸 **[IMAGE PLACEHOLDER #04: Customer Homepage & Hero Section]**  
> *Action required: Capture the top portion of the customer landing page with the hero headline and featured banners.*  
> *Target path: `docs/images/04_customer_hero.png`*  
> *Markdown syntax: `![Customer Homepage](images/04_customer_hero.png)`*

---

### Step 2.2: Category Filtering & Live Search
1. Scroll down to the **"What do you feel like eating today?"** section.
2. Use the **Search Bar** to type keywords (e.g., *"Chicken Curry"*, *"Pol Roti"*, *"Pudding"*).
3. Alternatively, click any category button to view all associated dishes:
   * 🍲 **Rice & Curry** (Authentic Sri Lankan vegetable, fish, chicken, and egg curries)
   * 🥪 **Short Eats** (Patties, rolls, cutlets, rotis)
   * 🥗 **Salads** (Fresh organic greens and vegetable sambols)
   * 🍨 **Desserts** (Watalappam, caramel pudding, fruit salads)
   * ☕ **Beverages** (Fresh king coconut, spiced tea, fresh juices)
   * 🍴 **Other** (Special daily requests and chef specialties)

> 📸 **[IMAGE PLACEHOLDER #05: Meal Category Filter & Search Bar]**  
> *Action required: Capture the category pills with icons (Rice & Curry, Short Eats, etc.) and search input.*  
> *Target path: `docs/images/05_category_search.png`*  
> *Markdown syntax: `![Category Filter and Search](images/05_category_search.png)`*

---

### Step 2.3: Selecting a Dish
1. Browse through the dish cards displayed for the selected category.
2. Each dish card highlights:
   * Photo of the dish
   * Dish Name & Description
   * Starting Price per serving (in LKR)
3. Click on the dish card you want to customize. The **Order Details Customization Modal** will slide into view.

> 📸 **[IMAGE PLACEHOLDER #06: Dish Grid & Selection]**  
> *Action required: Capture a category with multiple food cards showing photos, prices in LKR, and dish titles.*  
> *Target path: `docs/images/06_dish_cards.png`*  
> *Markdown syntax: `![Dish Cards Grid](images/06_dish_cards.png)`*

---

## 3. Customizing Your Meal Order

Kitchen Foods sets itself apart through deep customization so that home meals taste exactly as you desire.

> 📸 **[IMAGE PLACEHOLDER #07: Order Customization Form Overview]**  
> *Action required: Capture the full open Order Details Customization Form showing both columns.*  
> *Target path: `docs/images/07_order_customization_modal.png`*  
> *Markdown syntax: `![Order Customization Form](images/07_order_customization_modal.png)`*

### Step 3.1: Specifying Portions
* Use the **`+`** and **`-`** buttons to set the number of people/servings you require (e.g., 1 serving for an individual lunch or 5 servings for a family dinner).

### Step 3.2: Setting Spice Level
* Choose your heat tolerance using the 4-level segmented control:
  * **Mild:** Very low heat, ideal for children and sensitive palates.
  * **Medium:** Balanced traditional spice level.
  * **Hot:** Authentic spicy Sri Lankan home cook style.
  * **Extra Hot:** Maximum chili and pepper for spice lovers.

### Step 3.3: Dietary Needs & Allergies
* Type any food allergies, religious dietary requirements, or preferences into the **Dietary Needs** box (e.g., *"No onions or garlic"*, *"Gluten-free"*, *"Less oil and salt"*).

### Step 3.4: Delivery Date & Time
* **Date:** Click the date selector to schedule today's meal or a future date.
* **Time:** Select your preferred delivery or pick-up time.

### Step 3.5: Budget Specification
* The form calculates a baseline price based on portion size.
* You can adjust the budget or use quick addition buttons (`+500`, `+1,000`, `+5,000` LKR) if requesting premium sides or larger portions.

### Step 3.6: Special Instructions
* Add specific notes for the chef in the text area (e.g., *"Please pack curry and rice in separate containers"*, *"Extra gravy on the side"*).

> 📸 **[IMAGE PLACEHOLDER #08: Spice Level and Portion Selectors]**  
> *Action required: Close-up screenshot of the Portions counter, Spice Level segmented control, and Dietary Needs input.*  
> *Target path: `docs/images/08_spice_portions.png`*  
> *Markdown syntax: `![Spice and Portion Selectors](images/08_spice_portions.png)`*

---

## 4. Delivery Location & 10km GPS Verification

Because meals are freshly prepared in residential home kitchens, our platform uses browser-based GPS verification to enforce a **10km freshness radius**.

> 📸 **[IMAGE PLACEHOLDER #09: Delivery Location GPS Status]**  
> *Action required: Capture the GPS verification card at the bottom of the order form showing '✓ Verified GPS' with coordinates.*  
> *Target path: `docs/images/09_location_gps_box.png`*  
> *Markdown syntax: `![Delivery Location GPS Status](images/09_location_gps_box.png)`*

### Step 4.1: Granting Browser Location Permissions
1. When the order form opens, your browser will display a permission prompt:  
   *"Kitchen Foods wants to know your location"*.
2. Click **Allow** / **While using the app**.
3. The platform will automatically capture your latitude and longitude.

### Step 4.2: Checking Verification Status
* **Acquiring Coordinates:** A spinning loader displays *"Acquiring browser GPS coordinates automatically..."*.
* **Verified:** You will see a green **`✓ Verified GPS`** badge with your exact coordinates.
* **Refresh GPS:** If you moved locations or switched devices, click **Refresh GPS** to re-poll your current position.
* **Location Blocked?** If permissions are denied, an alert banner will notify you. Go to your browser URL bar lock icon and set Location permissions to "Allow", then click **Retry**.

---

## 5. Confirming & Tracking Active Orders

### Step 5.1: Confirming the Order
1. Double-check all meal details, schedule, and portion count.
2. Click **Confirm Order**.
3. If not already signed in, you will be prompted to log in before the order is submitted.
4. Once saved, your order is dispatched immediately to the chef's dashboard.

> 📸 **[IMAGE PLACEHOLDER #10: Order Confirmation Button & Submission]**  
> *Action required: Capture the bottom of the form showing Cancel and the primary 'Confirm Order' button.*  
> *Target path: `docs/images/10_confirm_order_button.png`*  
> *Markdown syntax: `![Confirm Order Button](images/10_confirm_order_button.png)`*

---

### Step 5.2: Monitoring the Active Requests Tracker
1. Return to the home screen or scroll down to **"Your Active Requests"**.
2. All your active orders will be displayed as interactive status cards.
3. Every card provides:
   * **Order Title & Dish Name**
   * **Target Delivery Date & Time**
   * **Portion / Guest Count**
   * **Total Price (LKR)**
   * **Live Status Badge:**
     * 🟡 `Pending` — Received by the system, awaiting chef acceptance.
     * 🔵 `Preparing` — The home chef has accepted and cooking has commenced.
     * 🟢 `Ready` — Cooking finished; ready for pickup or delivery dispatch.
     * ⚪ `Delivered` — Meal handed over successfully.

> 📸 **[IMAGE PLACEHOLDER #11: Customer Active Requests Pipeline]**  
> *Action required: Capture the 'Your Active Requests' section with an order card showing the status badge and timeline.*  
> *Target path: `docs/images/11_active_requests_tracker.png`*  
> *Markdown syntax: `![Customer Active Requests](images/11_active_requests_tracker.png)`*

---

## 6. Community Impact & Social Mission

1. In the top navigation bar, click on **Impact** or scroll to the **Impact Counter**.
2. Learn about the broader community mission of Kitchen Foods:
   * Total number of wholesome home meals served.
   * Number of home cooks and women micro-entrepreneurs empowered with steady income.
   * Sustainable local sourcing metrics.
3. Read personal chef feature stories highlighting home cooks who have established financial independence.

> 📸 **[IMAGE PLACEHOLDER #12: Community Impact Counter & Story Page]**  
> *Action required: Capture the Impact Counter statistics section or the `/impact` story page.*  
> *Target path: `docs/images/12_impact_story.png`*  
> *Markdown syntax: `![Community Impact Counter](images/12_impact_story.png)`*

---

# Part 2 — Chef (Home Cook) Manual

---

## 7. Chef Registration & Portal Access

The Chef portal is tailored specifically for home kitchen operations, order intake, and dish catalog maintenance.

### Step 7.1: Registering as a Chef
1. Navigate to `/login`.
2. Click **Create an Account**.
3. Fill in your **Full Name**, **Email**, and secure **Password**.
4. In the role toggle, select **Chef**.
5. Click **Create Account**.

> 📸 **[IMAGE PLACEHOLDER #13: Chef Registration Toggle]**  
> *Action required: Screenshot of the registration form with the 'Chef' radio pill selected.*  
> *Target path: `docs/images/13_chef_register.png`*  
> *Markdown syntax: `![Chef Registration Screen](images/13_chef_register.png)`*

---

### Step 7.2: Logging in to the Chef Portal
1. Select the **Welcome Back** tab on `/login`.
2. Enter your credentials.
3. The platform will automatically recognize your Chef role and redirect you to the **Chef Workspace** at `/chef`.

> 📸 **[IMAGE PLACEHOLDER #14: Chef Portal Redirection Screen]**  
> *Action required: Capture the initial landing state of the `/chef` view after logging in.*  
> *Target path: `docs/images/14_chef_initial_view.png`*  
> *Markdown syntax: `![Chef Portal Initial Landing](images/14_chef_initial_view.png)`*

---

## 8. Chef Dashboard & Navigation

The Chef Workspace features a dark, focused control interface (`ChefDash`) designed for fast action in busy kitchens.

> 📸 **[IMAGE PLACEHOLDER #15: Chef Dashboard Full Layout]**  
> *Action required: Capture the complete Chef dashboard view with the sidebar, top stats cards, earnings chart, and kanban pipeline.*  
> *Target path: `docs/images/15_chef_dashboard_overview.png`*  
> *Markdown syntax: `![Chef Dashboard Overview](images/15_chef_dashboard_overview.png)`*

### Step 8.1: Sidebar Navigation Items
* 📊 **Dashboard:** High-level summary of daily earnings, KPIs, and active cooking pipeline.
* 📋 **Orders:** Detailed list and kanban view of all pending, in-progress, and historical orders.
* 🍳 **Menu Items:** Catalog of your published dishes where you can add new items or remove old ones.
* 👤 **Profile:** Public chef presentation, bio, culinary specialty, and kitchen GPS sync.
* ⚙️ **Settings:** Account information and alert toggles.
* 🚪 **Sign Out:** Securely terminate your session.

### Step 8.2: Kitchen Open/Closed Toggle
* Located directly beneath your avatar in the sidebar.
* Toggle between **Kitchen Open** (accepting new orders) and **Kitchen Closed** (temporarily pausing incoming customer orders).

> 📸 **[IMAGE PLACEHOLDER #16: Chef Sidebar & Kitchen Open/Closed Switch]**  
> *Action required: Close-up of the sidebar showing the chef profile card, Kitchen Open/Closed switcher, and nav items.*  
> *Target path: `docs/images/16_chef_sidebar_toggle.png`*  
> *Markdown syntax: `![Chef Sidebar and Kitchen Switch](images/16_chef_sidebar_toggle.png)`*

---

### Step 8.3: Performance & Earnings Overview
The top of the dashboard displays key metrics:
* 💰 **Total Revenue:** Aggregated revenue (LKR) with percentage growth.
* 🛍️ **Active Orders:** Count of meals currently in preparation.
* ⭐ **Rating:** Feedback score from customers.
* ⏱️ **Average Prep Time:** Kitchen turnaround speed.
* 📈 **Earnings Chart:** Interactive visual graph tracing revenue over recent days.

> 📸 **[IMAGE PLACEHOLDER #17: Chef Stats Cards & Earnings Trend Chart]**  
> *Action required: Capture the row of StatsCards and the EarningsChart component.*  
> *Target path: `docs/images/17_chef_stats_chart.png`*  
> *Markdown syntax: `![Chef Stats Cards and Earnings Chart](images/17_chef_stats_chart.png)`*

---

## 9. Setting Your Kitchen GPS Coordinates

> ⚠️ **CRITICAL STEP:** Customer 10km delivery radius verification relies on comparing the customer's coordinates against your kitchen's registered GPS position.

### Step 9.1: Syncing Kitchen Location
1. Click **Profile** in the sidebar.
2. Under your name and specialty, locate the button labeled **`Set Kitchen Location (GPS)`** or **`Kitchen GPS: Lat, Lng`**.
3. Click the button while located at your cooking premises.
4. Allow your browser to access device location.
5. Your coordinates will immediately save to your profile. The button will update to display your exact coordinates (e.g., `Kitchen GPS: 6.9271, 79.8612`).

> 📸 **[IMAGE PLACEHOLDER #18: Chef Kitchen GPS Calibration Button]**  
> *Action required: Capture the Chef Profile screen highlighting the 'Set Kitchen Location (GPS)' button.*  
> *Target path: `docs/images/18_chef_gps_button.png`*  
> *Markdown syntax: `![Chef GPS Calibration](images/18_chef_gps_button.png)`*

---

## 10. Managing the Dish Catalog

You have complete control over the dishes you prepare, their descriptions, photos, and prices.

> 📸 **[IMAGE PLACEHOLDER #19: Chef Dish Catalog View]**  
> *Action required: Capture the 'Menu Items' view displaying the grid of food cards and the 'Add Dish' button.*  
> *Target path: `docs/images/19_chef_menu_catalog.png`*  
> *Markdown syntax: `![Chef Menu Catalog](images/19_chef_menu_catalog.png)`*

---

### Step 10.1: Adding a New Dish
1. Click **Menu Items** in the sidebar.
2. Click the orange **`+ Add Dish`** button in the upper right.
3. Complete the form:
   * **Dish Name:** (e.g., *"Sri Lankan Jaffna Crab Curry with Roast Paan"*).
   * **Category:** Select from the dropdown (Rice & Curry, Short Eats, Salads, Desserts, Beverages, Other).
   * **Price (LKR):** Price per serving (e.g., `1200`).
   * **Image URL:** Direct image link (e.g., Unsplash food photo or cloud-hosted link).
   * **Description / Ingredients:** Describe the preparation, ingredients, allergens, and side accompaniments.
4. Click **Publish Dish**. The item will immediately be visible to all customers on the public menu.

> 📸 **[IMAGE PLACEHOLDER #20: Add Dish Modal Dialog]**  
> *Action required: Capture the open 'Add Dish' modal with all input fields filled out.*  
> *Target path: `docs/images/20_add_dish_modal.png`*  
> *Markdown syntax: `![Add Dish Modal](images/20_add_dish_modal.png)`*

---

### Step 10.2: Deleting a Dish
1. Locate the dish card inside the **Menu Items** grid.
2. Click the red **Trash Can** icon in the bottom-right corner of the card.
3. Confirm the deletion. The dish is permanently removed from the customer catalog.

---

## 11. Real-Time Order Management

When customers place orders within your 10km radius, your workspace notifies you immediately.

### Step 11.1: Incoming Order Alerts
* **Toast Notification:** A pop-up appears in the top corner notifying you of a new order ID.
* **Audio Alerts:** If audio alerts are unmuted in Settings, an alert tone sounds.

> 📸 **[IMAGE PLACEHOLDER #21: New Order Toast Notification]**  
> *Action required: Capture the live toast alert in the top-right corner when an order arrives.*  
> *Target path: `docs/images/21_new_order_toast.png`*  
> *Markdown syntax: `![New Order Toast Notification](images/21_new_order_toast.png)`*

---

### Step 11.2: Kanban Order Pipeline
Navigate to **Orders** or scroll down on your **Dashboard** to see the 3-stage kitchen workflow:
1. 🟡 **New Orders (Pending):** New customer requests awaiting your confirmation.
2. 🔵 **Cooking (Preparing):** Orders currently being cooked in the kitchen.
3. 🟢 **Ready:** Dishes cooked, plated/packed, and ready for customer handoff.

Every card highlights:
* **Order ID** (e.g., `ORD-A1B2C3D4`)
* **Customer Name**
* **Dish Title & Quantity**
* **Total Order Value (LKR)**
* **Deliver-by Time**

> 📸 **[IMAGE PLACEHOLDER #22: Chef Kanban Pipeline Columns]**  
> *Action required: Capture the 3 columns (New Orders, Cooking, Ready) with cards distributed across them.*  
> *Target path: `docs/images/22_chef_kanban_pipeline.png`*  
> *Markdown syntax: `![Chef Kanban Pipeline](images/22_chef_kanban_pipeline.png)`*

---

## 12. Inspecting Client Delivery Location & Distance Map

Kitchen Foods features an integrated **OpenStreetMap & Leaflet interactive map** inside every order modal.

### Step 12.1: Opening Order Details
1. On any order card, click **View Details** or click directly on the card.
2. The **Order Details Modal** opens.

> 📸 **[IMAGE PLACEHOLDER #23: Order Details Modal Overview]**  
> *Action required: Capture the full Order Details Modal showing timeline, customer info, items summary, and total price.*  
> *Target path: `docs/images/23_order_details_modal.png`*  
> *Markdown syntax: `![Order Details Modal](images/23_order_details_modal.png)`*

---

### Step 12.2: Using the Client Location Map
Inside the modal, scroll to **Client Delivery Location (Free Map)**:
* 📍 **Orange Pin:** Identifies your registered Kitchen position.
* 🔵 **Blue Pin:** Identifies the customer's delivery destination.
* 📏 **Dotted Line:** Connects your kitchen to the customer, displaying the calculated line distance in kilometers.
* 🟢 **Radius Badge:** Indicates **`✓ Verified ≤ 10km`**.
* **Interactive Controls:** You can pan, zoom in, and inspect roads and landmarks to plan packing and dispatch accordingly.

> 📸 **[IMAGE PLACEHOLDER #24: Interactive Client Delivery Leaflet Map]**  
> *Action required: Capture the Leaflet map component inside the modal showing the pins and distance line.*  
> *Target path: `docs/images/24_leaflet_delivery_map.png`*  
> *Markdown syntax: `![Interactive Client Location Map](images/24_leaflet_delivery_map.png)`*

---

## 13. Order Preparation Workflow

Follow these steps to advance an order from initial receipt to completion:

```
[ New Order ] ───( Accept Order )───▶ [ Cooking / Preparing ] ───( Mark Ready )───▶ [ Ready for Handoff ] ───( Complete Order )───▶ [ Delivered / Archived ]
```

### Step 13.1: Accepting an Order
1. In the **New Orders** column, click **Accept Order** on the card (or inside the modal).
2. The order status advances to **`Preparing`**.
3. The customer's tracker updates to notify them that cooking has begun.

### Step 13.2: Marking as Ready
1. Once meals are prepared and packed, open the modal or card in the **Cooking** column.
2. Click **Mark Ready**.
3. The card shifts to the **Ready** column.

### Step 13.3: Completing the Order
1. When the client or courier picks up the order, click **Complete Order**.
2. The order moves out of the active pipeline and is archived into your **History Log**.
3. The order total is credited to your revenue calculations.

> 📸 **[IMAGE PLACEHOLDER #25: Order Status Action Buttons]**  
> *Action required: Capture the modal footer showing status action buttons (Accept Order / Mark Ready / Complete Order).*  
> *Target path: `docs/images/25_order_action_buttons.png`*  
> *Markdown syntax: `![Order Action Buttons](images/25_order_action_buttons.png)`*

---

## 14. Chef Profile, Kitchen Bio & Kitchen Settings

### Step 14.1: Customizing Your Public Profile & Bio
1. Click **Profile** in the sidebar.
2. Click **Modify bio**.
3. Update your:
   * **Kitchen Specialty:** (e.g., *"Traditional Southern Sri Lankan Curries & Clay Pot Fish"*).
   * **Display Location:** (e.g., *"Galle Road, Wellawatte"*).
   * **Bio Description:** Share your culinary background, family recipes, and cooking ethos with customers.
4. Click **Save Changes**.

> 📸 **[IMAGE PLACEHOLDER #26: Chef Profile & Bio Editor]**  
> *Action required: Capture the Chef Profile view and the Bio edit form modal.*  
> *Target path: `docs/images/26_chef_profile_editor.png`*  
> *Markdown syntax: `![Chef Profile Editor](images/26_chef_profile_editor.png)`*

---

### Step 14.2: Kitchen Settings & Notification Preferences
1. Click **Settings** in the sidebar.
2. Under **Account Credentials**, adjust your Name, Email, or Kitchen Street Address.
3. Under **Security & Alerts**:
   * **SMS Notification Dispatcher:** Keep toggled to dispatch automatic SMS alerts to clients upon state changes.
   * **Audio Dispatch Alerts:** Toggle between *Enabled* and *Muted* to manage loud sound chimes in the kitchen.
4. Click **Save Profile Details**.

> 📸 **[IMAGE PLACEHOLDER #27: Chef Settings & Alert Configuration]**  
> *Action required: Capture the Settings screen showing Account Credentials and Security & Alerts toggles.*  
> *Target path: `docs/images/27_chef_settings.png`*  
> *Markdown syntax: `![Chef Settings View](images/27_chef_settings.png)`*

---

# Part 3 — Troubleshooting & FAQs

### Q1: The customer sees an error: "Location access denied" when ordering.
* **Solution:** Browser security requires user consent for geolocation. The customer must click the lock icon in their browser address bar, set **Location** to **Allow**, and refresh the page.

### Q2: Why does the map show a customer is outside the 10km radius?
* **Solution:** Kitchen Foods prioritizes food quality and safe delivery times. If a customer is further than 10km away from your kitchen coordinates, the order will be flagged. Ensure your Chef Kitchen GPS coordinates are accurately calibrated in **Profile** > **Set Kitchen Location (GPS)**.

### Q3: My newly added dish doesn't appear on the homepage.
* **Solution:** Ensure you selected a valid category (e.g., *Rice & Curry*, *Short Eats*). Reload the customer page (`Cmd+Shift+R` or `Ctrl+F5`) to clear any cached responses.

### Q4: I didn't hear the sound alert when a new order arrived.
* **Solution:** Modern browsers restrict audio auto-play until you interact with the page. Click anywhere inside the ChefDash page when opening your session, and confirm that **Audio Dispatch Alerts** is set to **Enabled** in **Settings**.

---

# Screenshot Insertion Checklist

Use this handy checklist to keep track of the screenshots you take and insert into this guide.

| Placeholder ID | Description | Target File Location | Done (✔) |
| :--- | :--- | :--- | :---: |
| **#01** | Customer Navigation Bar & Login Button | `docs/images/01_navbar_login.png` | [ ] |
| **#02** | Customer Registration Form (Customer Role) | `docs/images/02_customer_register.png` | [ ] |
| **#03** | Customer Sign In Screen | `docs/images/03_customer_login.png` | [ ] |
| **#04** | Customer Homepage Hero & Promotions | `docs/images/04_customer_hero.png` | [ ] |
| **#05** | Category Pills Filter & Search Bar | `docs/images/05_category_search.png` | [ ] |
| **#06** | Dish Grid with Prices & Photos | `docs/images/06_dish_cards.png` | [ ] |
| **#07** | Order Details Customization Modal Overview | `docs/images/07_order_customization_modal.png` | [ ] |
| **#08** | Spice Level & Portion Controls | `docs/images/08_spice_portions.png` | [ ] |
| **#09** | Delivery Location GPS Verification Status | `docs/images/09_location_gps_box.png` | [ ] |
| **#10** | Confirm Order Action Button | `docs/images/10_confirm_order_button.png` | [ ] |
| **#11** | Customer Active Requests & Live Tracker | `docs/images/11_active_requests_tracker.png` | [ ] |
| **#12** | Community Impact Counter & Story Page | `docs/images/12_impact_story.png` | [ ] |
| **#13** | Chef Registration Form (Chef Role) | `docs/images/13_chef_register.png` | [ ] |
| **#14** | Chef Portal Initial Landing View | `docs/images/14_chef_initial_view.png` | [ ] |
| **#15** | Chef Dashboard Full Overview | `docs/images/15_chef_dashboard_overview.png` | [ ] |
| **#16** | Chef Sidebar & Kitchen Open/Closed Switch | `docs/images/16_chef_sidebar_toggle.png` | [ ] |
| **#17** | Chef Stats Cards & Earnings Trend Chart | `docs/images/17_chef_stats_chart.png` | [ ] |
| **#18** | Chef Kitchen GPS Sync Button | `docs/images/18_chef_gps_button.png` | [ ] |
| **#19** | Chef Dish Catalog View (Menu Items) | `docs/images/19_chef_menu_catalog.png` | [ ] |
| **#20** | Add Dish Modal Dialog | `docs/images/20_add_dish_modal.png` | [ ] |
| **#21** | New Order Toast Notification | `docs/images/21_new_order_toast.png` | [ ] |
| **#22** | Chef Kanban Pipeline Columns | `docs/images/22_chef_kanban_pipeline.png` | [ ] |
| **#23** | Order Details Modal Overview | `docs/images/23_order_details_modal.png` | [ ] |
| **#24** | Interactive Leaflet Client Delivery Map | `docs/images/24_leaflet_delivery_map.png` | [ ] |
| **#25** | Order Status Workflow Action Buttons | `docs/images/25_order_action_buttons.png` | [ ] |
| **#26** | Chef Profile & Bio Editor | `docs/images/26_chef_profile_editor.png` | [ ] |
| **#27** | Chef Settings & Alert Configuration | `docs/images/27_chef_settings.png` | [ ] |

---
*Created for the Kitchen Foods Platform Team, Department of Computer Engineering, University of Peradeniya.*
