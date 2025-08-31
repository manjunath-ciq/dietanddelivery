/*
  # NutriDash Database Schema

  1. New Tables
    - `users` - Core user information with role-based access
    - `customer_profiles` - Customer-specific data including dietary preferences
    - `vendor_profiles` - Vendor business information and verification status
    - `food_items` - Menu items with detailed nutritional information
    - `orders` - Order management with status tracking
    - `order_items` - Individual items within orders
    - `reviews` - Customer reviews for food items and vendors

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Ensure customers can only access their own data
    - Ensure vendors can only manage their own items and orders

  3. Features
    - Comprehensive nutritional tracking
    - Flexible dietary preference system
    - Order status management
    - Review and rating system
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('customer', 'vendor')) DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  dietary_preferences text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  calorie_goal integer,
  activity_level text CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')) DEFAULT 'moderate',
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vendor profiles table
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_address text NOT NULL,
  cuisine_types text[] DEFAULT '{}',
  is_verified boolean DEFAULT false,
  rating numeric(3,2) DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category text NOT NULL,
  dietary_tags text[] DEFAULT '{}',
  nutritional_info jsonb DEFAULT '{}',
  ingredients text[] DEFAULT '{}',
  allergens text[] DEFAULT '{}',
  is_available boolean DEFAULT true,
  prep_time integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customer_profiles(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')) DEFAULT 'pending',
  delivery_address text NOT NULL,
  delivery_fee numeric(10,2) DEFAULT 0.00,
  estimated_delivery_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  food_item_id uuid REFERENCES food_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  special_instructions text,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customer_profiles(id) ON DELETE CASCADE,
  food_item_id uuid REFERENCES food_items(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Customer profiles policies
CREATE POLICY "Customers can manage own profile"
  ON customer_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Vendor profiles policies
CREATE POLICY "Vendors can manage own profile"
  ON vendor_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view verified vendors"
  ON vendor_profiles
  FOR SELECT
  TO authenticated
  USING (is_verified = true);

-- Food items policies
CREATE POLICY "Vendors can manage own food items"
  ON food_items
  FOR ALL
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view available food items"
  ON food_items
  FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Orders policies
CREATE POLICY "Customers can manage own orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can view their orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can update their orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
    )
  );

-- Order items policies
CREATE POLICY "Order items follow order policies"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE 
        customer_id IN (SELECT id FROM customer_profiles WHERE user_id = auth.uid())
        OR vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid())
    )
  );

-- Reviews policies
CREATE POLICY "Customers can manage own reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customer_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_food_items_vendor_id ON food_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category);
CREATE INDEX IF NOT EXISTS idx_food_items_dietary_tags ON food_items USING GIN(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_food_item_id ON reviews(food_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON reviews(vendor_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();