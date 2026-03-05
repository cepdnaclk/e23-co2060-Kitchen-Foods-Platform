-- USERS
INSERT INTO users (uid, full_name, email, password_hash, role)
VALUES
('u1','Alice Fernando','alice@test.com','hashed_pw1','Customer'),
('u2','Bob Silva','bob@test.com','hashed_pw2','Customer'),
('u3','Chef Nimal','nimal@test.com','hashed_pw3','Chef'),
('u4','Chef Kamal','kamal@test.com','hashed_pw4','Chef'),
('u5','Admin User','admin@test.com','hashed_pw5','Admin')
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