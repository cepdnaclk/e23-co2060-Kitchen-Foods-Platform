-- USERS TABLE (CUSTOMERS)
CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Customer' CHECK (role = 'Customer'),
    profile_img_url VARCHAR(255)
);

-- CHEFS TABLE
CREATE TABLE IF NOT EXISTS chefs (
    uid VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Chef' CHECK (role = 'Chef'),
    profile_img_url VARCHAR(255),
    approval_status VARCHAR(20) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected'))
);

-- ADMIN TABLE
CREATE TABLE IF NOT EXISTS admin (
    uid VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Admin' CHECK (role = 'Admin'),
    profile_img_url VARCHAR(255)
);

-- FOOD CATEGORIES TABLE (ADMIN MANAGEMENT)
CREATE TABLE IF NOT EXISTS food_categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FOOD ITEMS TABLE (ADMIN MANAGEMENT)
CREATE TABLE IF NOT EXISTS food_items (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    chef_id VARCHAR(255) REFERENCES chefs(uid) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    category_id VARCHAR(255) NOT NULL REFERENCES food_categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS TABLE (CUSTOMER REQUEST)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) REFERENCES users(uid) ON DELETE CASCADE,
    meal_description TEXT NOT NULL,
    food_item_id VARCHAR(255) REFERENCES food_items(id) ON DELETE SET NULL,
    chef_id VARCHAR(255) REFERENCES chefs(uid) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    total_price DECIMAL(10,2),
    delivery_date DATE,
    delivery_time VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled', 'Delivered', 'Quoted', 'Paid', 'Expired')) DEFAULT 'Pending',
    -- Bidding deadline: the order stops accepting quotes once this passes.
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QUOTES TABLE (CHEF BIDS)
-- One active quote per chef per order (unique_quote). Re-submitting updates
-- the chef's existing bid while it is still 'Pending'; once a quote is
-- 'Accepted' or 'Rejected' it is immutable.
CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    chef_id VARCHAR(255) NOT NULL REFERENCES chefs(uid) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    note TEXT,
    fulfillment_time VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_quote UNIQUE (order_id, chef_id)
);

-- TRANSACTIONS TABLE (ESCROW SYSTEM)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    gateway_ref_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Escrow', 'Released', 'Refunded')) DEFAULT 'Escrow'
);