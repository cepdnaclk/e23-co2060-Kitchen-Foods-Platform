-- Seed data

-- USERS (Customers)
INSERT INTO users (uid, full_name, email, password_hash, role)
VALUES
('u1','Alice Customer','alice@test.com','hashed_pw1','Customer'),
('u2','Bob Customer','bob@test.com','hashed_pw2','Customer')
ON CONFLICT (uid) DO NOTHING;

-- CHEFS
INSERT INTO chefs (uid, full_name, email, password_hash, role, approval_status)
VALUES
('u3','Chef Nimal','nimal@test.com','hashed_pw3','Chef','Approved'),
('u4','Chef Kamala','kamala@test.com','hashed_pw4','Chef','Approved')
ON CONFLICT (uid) DO NOTHING;

-- ADMIN
--INSERT INTO admin (uid, full_name, email, password_hash, role)
--VALUES
--('u5','Admin User','admin@test.com','$2b$10$wJtK16347R4tO.Hq2M1KyeI.Zexz9TCO4w6qgM0q9T5jK1zZl2e.S','Admin')
--ON CONFLICT (uid) DO NOTHING;

-- FOOD CATEGORIES
INSERT INTO food_categories (id, name, description)
VALUES
('c1','Rice & Curry','Traditional Sri Lankan rice plates with curries.'),
('c2','Short Eats','Popular quick bites and snack items.'),
('c3','Salads','Fresh, seasonal salads and sides.'),
('c4','Desserts','Sweet treats and desserts.'),
('c5','Beverages','Refreshing drinks and warm beverages.'),
('c6','Other','Specials that do not fit a main category.')
ON CONFLICT (id) DO NOTHING;

-- FOOD ITEMS
INSERT INTO food_items (id, name, description, price, chef_id, image_url, category_id)
VALUES
('f1','Village Rice Bowl','Traditional rice bowl with seasonal curries',1250.00,'u3','https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','c1'),
('f2','Spicy Kottu Combo','Chicken kottu with house-made gravy and sambol',1450.00,'u3','https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80','c2'),
('f3','Garden Green Salad','Mixed greens with lime vinaigrette',850.00,'u3','https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80','c3'),
('f4','Coconut Pudding','Classic Sri Lankan kiribath pudding',700.00,'u3','https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80','c4'),
('f5','Ginger Lime Cooler','House-made lime soda with ginger',550.00,'u3','https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80','c5'),
('f6','Chef Special Platter','Weekly rotating chef special',1650.00,'u3','https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80','c6'),

-- c1: Rice & Curry (4 more)
('f7','Jaffna Crab Curry Rice','Tender crab cooked in fiery Jaffna-style curry, served with steamed white rice',1950.00,'u4','https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80','c1'),
('f8','Dhal Curry & Roti','Slow-cooked red lentil curry served with freshly made coconut roti',950.00,'u3','https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80','c1'),
('f9','Chicken Biryani','Fragrant basmati rice layered with spiced chicken, caramelised onions and raita',1600.00,'u4','https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80','c1'),
('f10','Prawn Curry Plate','Juicy prawns in a rich coconut-milk curry served with red rice and pol sambol',1750.00,'u3','https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80','c1'),

-- c2: Short Eats (4 more)
('f11','Isso Vadai','Crispy lentil fritters topped with whole prawns — a Galle Face classic',600.00,'u3','https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','c2'),
('f12','Chicken Patties','Flaky short-crust pastry filled with spiced minced chicken and potatoes',500.00,'u4','https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','c2'),
('f13','Egg Roti Roll','Flaky coconut roti wrapped around a spicy egg and leek filling',400.00,'u3','https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','c2'),
('f14','Lentil Samosa Trio','Three crispy pastry triangles filled with curried lentils and green chillies',450.00,'u4','https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','c2'),

-- c3: Salads (4 more)
('f15','Papaya Green Salad','Shredded raw papaya tossed with lime, chilli and roasted peanuts',700.00,'u3','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80','c3'),
('f16','Beetroot & Coconut Salad','Grated beetroot tossed with fresh coconut, mustard seeds and curry leaves',600.00,'u4','https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80','c3'),
('f17','Lentil & Spinach Salad','Warm green lentils with wilted baby spinach, red onion and cumin dressing',750.00,'u3','https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80','c3'),
('f18','Mango Avocado Salad','Ripe Alphonso mango slices with creamy avocado, lime and coriander',900.00,'u4','https://images.unsplash.com/photo-1590593162201-f67611a18b87?auto=format&fit=crop&w=600&q=80','c3'),

-- c4: Desserts (4 more)
('f19','Watalappan','Classic Malay-Sri Lankan steamed jaggery custard with cardamom and cashews',850.00,'u3','https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80','c4'),
('f20','Curd & Kithul Treacle','Thick buffalo curd drizzled generously with dark kithul palm treacle',650.00,'u4','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80','c4'),
('f21','Bibikkan Cake Slice','Traditional moist coconut and jaggery cake spiced with cardamom and cloves',550.00,'u3','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80','c4'),
('f22','Chocolate Biscuit Pudding','Layered Marie biscuits and rich dark chocolate ganache — a Sri Lankan favourite',800.00,'u4','https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80','c4'),

-- c5: Beverages (4 more)
('f23','King Coconut Water','Fresh thambili harvested daily — nature''s electrolyte drink',300.00,'u3','https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&q=80','c5'),
('f24','Ceylon Iced Tea','Strong Ceylon black tea brewed and served over ice with mint and lemon',400.00,'u4','https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80','c5'),
('f25','Mango Lassi','Chilled yoghurt blended with ripe Alphonso mango and a pinch of cardamom',500.00,'u3','https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80','c5'),
('f26','Woodapple Cream Soda','Native woodapple pulp mixed with sparkling soda and a splash of coconut milk',450.00,'u4','https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80','c5'),

-- c6: Other (4 more)
('f27','String Hopper Platter','Steamed rice-flour noodle rounds served with dhal, coconut sambol and seeni seeni',1100.00,'u3','https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80','c6'),
('f28','Egg Hopper Basket','Three crispy hoppers each cradling a perfectly set sunny-side-up egg',950.00,'u4','https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80','c6'),
('f29','Dutch Lamprais','Oven-baked banana-leaf parcel of stock rice, frikkadels, brinjal moju and more',2400.00,'u3','https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80','c6'),
('f30','Pittu & Chicken Curry','Steamed rice-and-coconut pittu cylinders paired with aromatic country chicken curry',1300.00,'u4','https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80','c6')
ON CONFLICT (id) DO NOTHING;

-- ORDERS
-- o1 has an accepted quote (status Quoted, locked to chef u4).
-- o2 is still open for bidding (Pending, expires 6h from creation).
INSERT INTO orders (id, customer_id, meal_description, status, chef_id, expires_at)
VALUES
('o1','u1','Vegetarian lunch for 5 people','Quoted','u4', CURRENT_TIMESTAMP + INTERVAL '6 hours'),
('o2','u2','Birthday dinner for 8 guests','Pending', NULL, CURRENT_TIMESTAMP + INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- QUOTES
INSERT INTO quotes (id, order_id, chef_id, price, note, fulfillment_time, status)
VALUES
('q1','o1','u3',45.00,'Healthy vegetarian buffet','13:00','Rejected'),
('q2','o1','u4',40.00,'Rice and curry vegetarian set','12:30','Accepted'),
('q3','o2','u3',120.00,'Full birthday dinner menu','19:00','Pending')
ON CONFLICT (id) DO NOTHING;

-- TRANSACTIONS
INSERT INTO transactions (id, order_id, gateway_ref_id, amount, status)
VALUES
('t1','o1','PAY123456',40.00,'Escrow')
ON CONFLICT (id) DO NOTHING;