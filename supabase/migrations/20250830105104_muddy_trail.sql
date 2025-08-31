/*
  # Sample Data for NutriDash

  1. Sample Data
    - Sample vendors with verified status
    - Sample food items with comprehensive nutritional information
    - Sample customer profiles with various dietary preferences

  2. Purpose
    - Provide realistic data for development and testing
    - Demonstrate the app's functionality with diverse food options
    - Show how dietary filtering works
*/

-- Sample vendor profiles (these would be created after user registration)
-- Note: In production, these would be created through the registration flow

-- Sample food items for testing
-- These represent items from various verified vendors
INSERT INTO food_items (
  vendor_id, 
  name, 
  description, 
  price, 
  image_url, 
  category, 
  dietary_tags, 
  nutritional_info, 
  ingredients, 
  allergens, 
  prep_time
) VALUES 
-- Healthy Bowl Options
(
  gen_random_uuid(),
  'Quinoa Power Bowl',
  'Nutrient-packed quinoa bowl with roasted vegetables, avocado, and tahini dressing',
  14.99,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Bowls',
  ARRAY['vegan', 'gluten-free', 'high-protein'],
  '{"calories": 420, "protein": 18, "carbs": 52, "fat": 16, "fiber": 8, "sugar": 6}',
  ARRAY['quinoa', 'mixed vegetables', 'avocado', 'tahini', 'lemon', 'olive oil'],
  ARRAY['sesame'],
  25
),
(
  gen_random_uuid(),
  'Mediterranean Bowl',
  'Fresh Greek-inspired bowl with hummus, falafel, cucumber, and herb dressing',
  13.99,
  'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Bowls',
  ARRAY['vegetarian', 'mediterranean'],
  '{"calories": 380, "protein": 15, "carbs": 45, "fat": 14, "fiber": 9, "sugar": 8}',
  ARRAY['chickpeas', 'cucumber', 'tomatoes', 'red onion', 'feta cheese', 'olive oil'],
  ARRAY['dairy'],
  20
),

-- Protein-Rich Options
(
  gen_random_uuid(),
  'Grilled Salmon with Vegetables',
  'Wild-caught salmon with seasonal roasted vegetables and quinoa',
  22.99,
  'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Main Course',
  ARRAY['keto', 'high-protein', 'omega-3'],
  '{"calories": 350, "protein": 32, "carbs": 12, "fat": 20, "fiber": 4, "sugar": 3}',
  ARRAY['salmon', 'broccoli', 'carrots', 'quinoa', 'olive oil', 'herbs'],
  ARRAY['fish'],
  30
),
(
  gen_random_uuid(),
  'Lean Chicken Breast',
  'Herb-marinated chicken breast with sweet potato and green beans',
  18.99,
  'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Main Course',
  ARRAY['high-protein', 'paleo'],
  '{"calories": 320, "protein": 35, "carbs": 22, "fat": 8, "fiber": 5, "sugar": 4}',
  ARRAY['chicken breast', 'sweet potato', 'green beans', 'herbs', 'olive oil'],
  ARRAY[],
  25
),

-- Low-Carb Options
(
  gen_random_uuid(),
  'Keto Buddha Bowl',
  'Low-carb bowl with cauliflower rice, avocado, nuts, and healthy fats',
  16.99,
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Bowls',
  ARRAY['keto', 'low-carb', 'high-fat'],
  '{"calories": 450, "protein": 12, "carbs": 8, "fat": 38, "fiber": 12, "sugar": 2}',
  ARRAY['cauliflower', 'avocado', 'almonds', 'olive oil', 'spinach', 'seeds'],
  ARRAY['nuts'],
  15
),

-- Vegan Options
(
  gen_random_uuid(),
  'Plant-Based Protein Bowl',
  'Tofu and legume bowl with tahini sauce and fresh vegetables',
  15.99,
  'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Bowls',
  ARRAY['vegan', 'high-protein', 'gluten-free'],
  '{"calories": 390, "protein": 22, "carbs": 35, "fat": 18, "fiber": 11, "sugar": 5}',
  ARRAY['tofu', 'black beans', 'quinoa', 'kale', 'tahini', 'lemon'],
  ARRAY['soy', 'sesame'],
  20
),

-- Salads
(
  gen_random_uuid(),
  'Superfood Salad',
  'Mixed greens with berries, nuts, seeds, and balsamic vinaigrette',
  12.99,
  'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Salads',
  ARRAY['vegetarian', 'gluten-free', 'antioxidant-rich'],
  '{"calories": 280, "protein": 8, "carbs": 18, "fat": 20, "fiber": 8, "sugar": 12}',
  ARRAY['mixed greens', 'blueberries', 'walnuts', 'pumpkin seeds', 'balsamic vinegar'],
  ARRAY['nuts'],
  10
),

-- Smoothie Bowls
(
  gen_random_uuid(),
  'Acai Energy Bowl',
  'Antioxidant-rich acai bowl with fresh fruits and granola',
  11.99,
  'https://images.pexels.com/photos/1172019/pexels-photo-1172019.jpeg?auto=compress&cs=tinysrgb&w=500',
  'Smoothie Bowls',
  ARRAY['vegan', 'antioxidant-rich', 'raw'],
  '{"calories": 320, "protein": 6, "carbs": 48, "fat": 12, "fiber": 10, "sugar": 28}',
  ARRAY['acai', 'banana', 'berries', 'granola', 'coconut', 'honey'],
  ARRAY['nuts', 'gluten'],
  8
);