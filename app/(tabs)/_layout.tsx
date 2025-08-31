import { Tabs } from 'expo-router';
import { Home, ShoppingCart, User, Store } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function TabLayout() {
  const { userProfile } = useAuth();
  const isVendor = userProfile?.role === 'vendor';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: 'Inter-Bold',
          color: '#1F2937',
        },
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/profile')}
            style={{ marginLeft: 16 }}
          >
            <User size={24} color="#10B981" strokeWidth={2} />
          </TouchableOpacity>
        ),
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
          title: 'Diet & Delivery',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ size, color }) => (
            <ShoppingCart size={size} color={color} strokeWidth={2} />
          ),
        }}
        href={isVendor ? null : undefined}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Store size={size} color={color} strokeWidth={2} />
          ),
        }}
        href={!isVendor ? null : undefined}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
          headerLeft: () => null, // Remove profile icon from header when on profile tab
        }}
      />
    </Tabs>
  );
}