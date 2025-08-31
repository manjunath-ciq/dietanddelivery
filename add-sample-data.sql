-- Add Sample Data to Database
-- Run this in your Supabase SQL Editor

-- First, let's get the vendor and customer IDs that were created
-- We'll use these to create the remaining data

-- Add more food items
INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Quinoa Buddha Bowl' as name,
  'Fresh quinoa with roasted vegetables and tahini dressing' as description,
  12.99 as price,
  'bowls' as category,
  ARRAY['vegetarian', 'vegan', 'gluten-free'] as dietary_tags,
  '{"calories": 420, "protein": 15, "carbs": 45, "fat": 18}'::jsonb as nutritional_info,
  ARRAY['quinoa', 'broccoli', 'carrots', 'chickpeas', 'tahini'] as ingredients,
  ARRAY[]::text[] as allergens,
  15 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Healthy Bites'
LIMIT 1;

INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Grilled Salmon' as name,
  'Fresh Atlantic salmon with lemon herb butter' as description,
  18.99 as price,
  'main-course' as category,
  ARRAY['pescatarian', 'high-protein'] as dietary_tags,
  '{"calories": 380, "protein": 42, "carbs": 8, "fat": 22}'::jsonb as nutritional_info,
  ARRAY['salmon', 'lemon', 'herbs', 'butter', 'garlic'] as ingredients,
  ARRAY['fish', 'dairy'] as allergens,
  20 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Healthy Bites'
LIMIT 1;

INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Butter Chicken' as name,
  'Tender chicken in rich tomato and cream sauce' as description,
  14.99 as price,
  'curry' as category,
  ARRAY['indian', 'spicy'] as dietary_tags,
  '{"calories": 450, "protein": 28, "carbs": 12, "fat": 32}'::jsonb as nutritional_info,
  ARRAY['chicken', 'tomatoes', 'cream', 'spices', 'butter'] as ingredients,
  ARRAY['dairy'] as allergens,
  25 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Spice Garden'
LIMIT 1;

INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Palak Paneer' as name,
  'Fresh spinach curry with homemade cheese' as description,
  11.99 as price,
  'curry' as category,
  ARRAY['vegetarian', 'indian'] as dietary_tags,
  '{"calories": 320, "protein": 18, "carbs": 15, "fat": 24}'::jsonb as nutritional_info,
  ARRAY['spinach', 'paneer', 'onions', 'spices'] as ingredients,
  ARRAY['dairy'] as allergens,
  18 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Spice Garden'
LIMIT 1;

INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Truffle Mushroom Pasta' as name,
  'Homemade fettuccine with wild mushrooms and truffle oil' as description,
  16.99 as price,
  'pasta' as category,
  ARRAY['vegetarian', 'italian'] as dietary_tags,
  '{"calories": 520, "protein": 16, "carbs": 68, "fat": 24}'::jsonb as nutritional_info,
  ARRAY['fettuccine', 'mushrooms', 'truffle oil', 'parmesan', 'garlic'] as ingredients,
  ARRAY['dairy', 'gluten'] as allergens,
  22 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Fresh Pasta Co'
LIMIT 1;

INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Seafood Linguine' as name,
  'Fresh linguine with shrimp, clams, and white wine sauce' as description,
  19.99 as price,
  'pasta' as category,
  ARRAY['seafood', 'italian'] as dietary_tags,
  '{"calories": 480, "protein": 32, "carbs": 52, "fat": 18}'::jsonb as nutritional_info,
  ARRAY['linguine', 'shrimp', 'clams', 'white wine', 'garlic'] as ingredients,
  ARRAY['shellfish', 'gluten'] as allergens,
  28 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Fresh Pasta Co'
LIMIT 1;

INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Beyond Burger' as name,
  'Plant-based burger with vegan cheese and special sauce' as description,
  13.99 as price,
  'burgers' as category,
  ARRAY['vegan', 'plant-based'] as dietary_tags,
  '{"calories": 380, "protein": 20, "carbs": 25, "fat": 28}'::jsonb as nutritional_info,
  ARRAY['beyond meat', 'vegan cheese', 'lettuce', 'tomato', 'onion'] as ingredients,
  ARRAY['soy'] as allergens,
  12 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Vegan Delight'
LIMIT 1;

INSERT INTO food_items (vendor_id, name, description, price, category, dietary_tags, nutritional_info, ingredients, allergens, prep_time)
SELECT 
  vp.id as vendor_id,
  'Acai Bowl' as name,
  'Fresh acai with granola, berries, and coconut' as description,
  10.99 as price,
  'bowls' as category,
  ARRAY['vegan', 'healthy', 'gluten-free'] as dietary_tags,
  '{"calories": 320, "protein": 8, "carbs": 45, "fat": 12}'::jsonb as nutritional_info,
  ARRAY['acai', 'granola', 'berries', 'coconut', 'honey'] as ingredients,
  ARRAY['nuts'] as allergens,
  8 as prep_time
FROM vendor_profiles vp 
WHERE vp.business_name = 'Vegan Delight'
LIMIT 1;

-- Add more orders
INSERT INTO orders (customer_id, vendor_id, total_amount, status, delivery_address, delivery_fee)
SELECT 
  cp.id as customer_id,
  vp.id as vendor_id,
  15.98 as total_amount, -- 12.99 + 2.99 delivery
  'delivered' as status,
  '123 Customer St, Downtown' as delivery_address,
  2.99 as delivery_fee
FROM customer_profiles cp, vendor_profiles vp
WHERE cp.address = '123 Customer St, Downtown' 
  AND vp.business_name = 'Healthy Bites'
LIMIT 1;

INSERT INTO orders (customer_id, vendor_id, total_amount, status, delivery_address, delivery_fee)
SELECT 
  cp.id as customer_id,
  vp.id as vendor_id,
  17.98 as total_amount, -- 14.99 + 2.99 delivery
  'delivered' as status,
  '456 Customer Ave, Midtown' as delivery_address,
  2.99 as delivery_fee
FROM customer_profiles cp, vendor_profiles vp
WHERE cp.address = '456 Customer Ave, Midtown' 
  AND vp.business_name = 'Spice Garden'
LIMIT 1;

-- Add order items for the new orders
INSERT INTO order_items (order_id, food_item_id, quantity, unit_price)
SELECT 
  o.id as order_id,
  fi.id as food_item_id,
  1 as quantity,
  fi.price as unit_price
FROM orders o, food_items fi, vendor_profiles vp
WHERE o.vendor_id = vp.id 
  AND fi.vendor_id = vp.id
  AND vp.business_name = 'Healthy Bites'
  AND fi.name = 'Quinoa Buddha Bowl'
LIMIT 1;

INSERT INTO order_items (order_id, food_item_id, quantity, unit_price)
SELECT 
  o.id as order_id,
  fi.id as food_item_id,
  1 as quantity,
  fi.price as unit_price
FROM orders o, food_items fi, vendor_profiles vp
WHERE o.vendor_id = vp.id 
  AND fi.vendor_id = vp.id
  AND vp.business_name = 'Spice Garden'
  AND fi.name = 'Butter Chicken'
LIMIT 1;

-- Add more reviews
INSERT INTO reviews (customer_id, food_item_id, vendor_id, rating, comment)
SELECT 
  cp.id as customer_id,
  fi.id as food_item_id,
  vp.id as vendor_id,
  5 as rating,
  'Amazing healthy food! The quinoa bowl was perfect.' as comment
FROM customer_profiles cp, food_items fi, vendor_profiles vp
WHERE cp.address = '123 Customer St, Downtown'
  AND fi.name = 'Quinoa Buddha Bowl'
  AND vp.business_name = 'Healthy Bites'
LIMIT 1;

INSERT INTO reviews (customer_id, food_item_id, vendor_id, rating, comment)
SELECT 
  cp.id as customer_id,
  fi.id as food_item_id,
  vp.id as vendor_id,
  4 as rating,
  'Delicious butter chicken! Authentic Indian flavors.' as comment
FROM customer_profiles cp, food_items fi, vendor_profiles vp
WHERE cp.address = '456 Customer Ave, Midtown'
  AND fi.name = 'Butter Chicken'
  AND vp.business_name = 'Spice Garden'
LIMIT 1;

INSERT INTO reviews (customer_id, food_item_id, vendor_id, rating, comment)
SELECT 
  cp.id as customer_id,
  fi.id as food_item_id,
  vp.id as vendor_id,
  5 as rating,
  'Best vegan burger I have ever had!' as comment
FROM customer_profiles cp, food_items fi, vendor_profiles vp
WHERE cp.address = '789 Customer Rd, Uptown'
  AND fi.name = 'Beyond Burger'
  AND vp.business_name = 'Vegan Delight'
LIMIT 1;

-- Show summary of what we have
SELECT 'Summary' as info, 
       (SELECT COUNT(*) FROM users WHERE role = 'vendor') as vendors,
       (SELECT COUNT(*) FROM users WHERE role = 'customer') as customers,
       (SELECT COUNT(*) FROM food_items) as food_items,
       (SELECT COUNT(*) FROM orders) as orders,
       (SELECT COUNT(*) FROM reviews) as reviews;
