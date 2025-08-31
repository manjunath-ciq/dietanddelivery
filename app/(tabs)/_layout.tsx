import { Tabs } from 'expo-router';
import { Home, ShoppingCart, User, Store, Package } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { userProfile, loading } = useAuth();
  const isVendor = userProfile?.role === 'vendor';

  // Debug logging
  console.log('TabLayout - userProfile:', userProfile);
  console.log('TabLayout - isVendor:', isVendor);
  console.log('TabLayout - loading:', loading);
  console.log('TabLayout - Will render cart tab:', !isVendor);
  console.log('TabLayout - Will render dashboard tab:', isVendor);

  // Don't render tabs until user profile is loaded
  if (loading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-SemiBold',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />

      {!isVendor && (
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarIcon: ({ size, color }) => (
              <ShoppingCart size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ size, color }) => (
            <Package size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      {isVendor && (
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ size, color }) => (
              <Store size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}