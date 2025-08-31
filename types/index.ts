export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'vendor';
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  dietary_preferences: string[];
  allergies: string[];
  calorie_goal?: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_address: string;
  cuisine_types: string[];
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  dietary_tags: string[];
  nutritional_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  ingredients: string[];
  allergens: string[];
  is_available: boolean;
  prep_time: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  vendor_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  delivery_address: string;
  delivery_fee: number;
  estimated_delivery_time: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  food_item_id: string;
  quantity: number;
  special_instructions?: string;
}