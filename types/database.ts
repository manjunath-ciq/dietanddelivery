export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'customer' | 'vendor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'customer' | 'vendor';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'customer' | 'vendor';
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_profiles: {
        Row: {
          id: string;
          user_id: string;
          dietary_preferences: string[];
          allergies: string[];
          calorie_goal: number | null;
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dietary_preferences?: string[];
          allergies?: string[];
          calorie_goal?: number | null;
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dietary_preferences?: string[];
          allergies?: string[];
          calorie_goal?: number | null;
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendor_profiles: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          business_address: string;
          cuisine_types?: string[];
          is_verified?: boolean;
          rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          business_address?: string;
          cuisine_types?: string[];
          is_verified?: boolean;
          rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      food_items: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          category: string;
          dietary_tags: string[];
          nutritional_info: any;
          ingredients: string[];
          allergens: string[];
          is_available: boolean;
          prep_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category: string;
          dietary_tags?: string[];
          nutritional_info?: any;
          ingredients?: string[];
          allergens?: string[];
          is_available?: boolean;
          prep_time?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          category?: string;
          dietary_tags?: string[];
          nutritional_info?: any;
          ingredients?: string[];
          allergens?: string[];
          is_available?: boolean;
          prep_time?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          vendor_id: string;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          delivery_address: string;
          delivery_fee: number;
          estimated_delivery_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          vendor_id: string;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          delivery_address: string;
          delivery_fee?: number;
          estimated_delivery_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          vendor_id?: string;
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          delivery_address?: string;
          delivery_fee?: number;
          estimated_delivery_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          food_item_id: string;
          quantity: number;
          unit_price: number;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          food_item_id: string;
          quantity?: number;
          unit_price: number;
          special_instructions?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          food_item_id?: string;
          quantity?: number;
          unit_price?: number;
          special_instructions?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          customer_id: string;
          food_item_id: string;
          vendor_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          food_item_id: string;
          vendor_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          food_item_id?: string;
          vendor_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
  };
}