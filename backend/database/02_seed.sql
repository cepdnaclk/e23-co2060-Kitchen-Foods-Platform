-- USERS
INSERT INTO users (uid, full_name, email, password_hash, role)
VALUES
('u1','Alice Customer','alice@test.com','hashed_pw1','Customer'),
('u2','Bob Customer','bob@test.com','hashed_pw2','Customer'),
('u3','Chef Nimal','nimal@test.com','hashed_pw3','Chef'),
('u4','Chef Kamala','kamala@test.com','hashed_pw4','Chef')
ON CONFLICT (uid) DO NOTHING;



-- ORDERS
INSERT INTO orders (id, customer_id, meal_description, status)
VALUES
('o1','u1','Vegetarian lunch for 5 people','Pending'),
('o2','u2','Birthday dinner for 8 guests','Quoted')
ON CONFLICT (id) DO NOTHING;



-- QUOTES
INSERT INTO quotes (id, order_id, chef_id, price, note, is_accepted)
VALUES
('q1','o1','u3',45.00,'Healthy vegetarian buffet',FALSE),
('q2','o1','u4',40.00,'Rice and curry vegetarian set',TRUE),
('q3','o2','u3',120.00,'Full birthday dinner menu',FALSE)
ON CONFLICT (id) DO NOTHING;



-- TRANSACTIONS
INSERT INTO transactions (id, order_id, gateway_ref_id, amount, status)
VALUES
('t1','o1','PAY123456',40.00,'Escrow')
ON CONFLICT (id) DO NOTHING;


-- FOOD ITEMS
INSERT INTO food_categories (id, name, description)
VALUES
('c1','Rice & Curry','Traditional Sri Lankan rice plates with curries.'),
('c2','Short Eats','Popular quick bites and snack items.'),
('c3','Salads','Fresh, seasonal salads and sides.'),
('c4','Desserts','Sweet treats and desserts.'),
('c5','Beverages','Refreshing drinks and warm beverages.'),
('c6','Other','Specials that do not fit a main category.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO food_items (id, name, description, price, chef_id, image_url, category_id)
VALUES
('f1','Village Rice Bowl','Traditional rice bowl with seasonal curries',1250.00,'u3','https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','c1'),
('f2','Spicy Kottu Combo','Chicken kottu with house-made gravy and sambol',1450.00,'u3','https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80','c2'),
('f3','Garden Green Salad','Mixed greens with lime vinaigrette',850.00,'u3','https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80','c3'),
('f4','Coconut Pudding','Classic Sri Lankan kiribath pudding',700.00,'u3','https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80','c4'),
('f5','Ginger Lime Cooler','House-made lime soda with ginger',550.00,'u3','https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80','c5'),
('f6','Chef Special Platter','Weekly rotating chef special',1650.00,'u3','https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80','c6')
ON CONFLICT (id) DO NOTHING;