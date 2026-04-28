-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Customer', 'Chef', 'Admin')) NOT NULL,
    profile_img_url VARCHAR(255)
);


-- ORDERS TABLE (CUSTOMER REQUEST)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) REFERENCES users(uid) ON DELETE CASCADE,
    meal_description TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Quoted', 'Paid', 'Completed')) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- QUOTES TABLE (CHEF BIDS)
CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) REFERENCES orders(id) ON DELETE CASCADE,
    chef_id VARCHAR(255) REFERENCES users(uid) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    note TEXT,
    is_accepted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TRANSACTIONS TABLE (ESCROW SYSTEM)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    gateway_ref_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Escrow', 'Released', 'Refunded')) DEFAULT 'Escrow'
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
    chef_id VARCHAR(255) REFERENCES users(uid) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    category_id VARCHAR(255) NOT NULL REFERENCES food_categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Prevent chef quoting same order twice
ALTER TABLE quotes
ADD CONSTRAINT unique_quote UNIQUE (order_id, chef_id);