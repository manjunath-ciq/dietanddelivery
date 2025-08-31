import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users']['Row'];
type CustomerProfile = Database['public']['Tables']['customer_profiles']['Row'];
type VendorProfile = Database['public']['Tables']['vendor_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  customerProfile: CustomerProfile | null;
  vendorProfile: VendorProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>, additionalData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => Promise<{ error: any }>;
  updateVendorProfile: (updates: Partial<VendorProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setCustomerProfile(null);
          setVendorProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);

      // Fetch role-specific profile
      if (data.role === 'customer') {
        const { data: customerData, error: customerError } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (!customerError) {
          setCustomerProfile(customerData);
        }
      } else if (data.role === 'vendor') {
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendor_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (!vendorError) {
          setVendorProfile(vendorData);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>, additionalData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            ...userData,
          });

        if (profileError) return { error: profileError };

        // Create role-specific profile
        if (userData.role === 'customer') {
          const { error: customerError } = await supabase
            .from('customer_profiles')
            .insert({
              user_id: data.user.id,
              dietary_preferences: additionalData?.dietary_preferences || [],
              allergies: additionalData?.allergies || [],
              calorie_goal: additionalData?.calorie_goal || 2000,
              activity_level: additionalData?.activity_level || 'moderate',
              address: additionalData?.address || '',
            });
          if (customerError) return { error: customerError };
        } else if (userData.role === 'vendor') {
          const { error: vendorError } = await supabase
            .from('vendor_profiles')
            .insert({
              user_id: data.user.id,
              business_name: additionalData?.business_name || '',
              business_address: additionalData?.business_address || '',
              cuisine_types: additionalData?.cuisine_types || [],
              is_verified: false,
              rating: 0,
              total_reviews: 0,
            });
          if (vendorError) return { error: vendorError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: new Error('No user logged in') };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) return { error };

      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateCustomerProfile = async (updates: Partial<CustomerProfile>) => {
    try {
      if (!user) return { error: new Error('No user logged in') };

      const { error } = await supabase
        .from('customer_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) return { error };

      setCustomerProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateVendorProfile = async (updates: Partial<VendorProfile>) => {
    try {
      if (!user) return { error: new Error('No user logged in') };

      const { error } = await supabase
        .from('vendor_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) return { error };

      setVendorProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        customerProfile,
        vendorProfile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        updateCustomerProfile,
        updateVendorProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};