import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingUp, Clock, DollarSign, Star } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type FoodItem = Database['public']['Tables']['food_items']['Row'];

export default function VendorDashboard() {
  const { vendorProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    avgRating: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendorProfile) {
      fetchVendorData();
    }
  }, [vendorProfile]);

  const fetchVendorData = async () => {
    if (!vendorProfile) return;

    try {
      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch food items
      const { data: foodData } = await supabase
        .from('food_items')
        .select('*')
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);
      setFoodItems(foodData || []);

      // Calculate stats
      const today = new Date().toDateString();
      const todayOrders = (ordersData || []).filter(
        order => new Date(order.created_at).toDateString() === today
      );
      
      const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + order.total_amount,
        0
      );

      setStats({
        todayOrders: todayOrders.length,
        todayRevenue,
        avgRating: vendorProfile.rating,
        totalItems: (foodData || []).length,
      });
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: status as any } : order
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleAddMenuItem = () => {
    Alert.alert('Add Menu Item', 'Menu management functionality will be implemented in Phase 5!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'preparing': return '#8B5CF6';
      case 'ready': return '#22C55E';
      case 'delivered': return '#059669';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.businessName}>{vendorProfile?.business_name}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMenuItem}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Clock size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statNumber}>{stats.todayOrders}</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <DollarSign size={24} color="#22C55E" />
            </View>
            <Text style={styles.statNumber}>${stats.todayRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Star size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{stats.avgRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.statNumber}>{stats.totalItems}</Text>
            <Text style={styles.statLabel}>Menu Items</Text>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Order #{order.id.slice(-8)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.orderAmount}>${order.total_amount.toFixed(2)}</Text>
                <Text style={styles.orderTime}>
                  {new Date(order.created_at).toLocaleDateString()} at{' '}
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                
                {order.status === 'confirmed' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => updateOrderStatus(order.id, 'preparing')}
                  >
                    <Text style={styles.actionButtonText}>Start Preparing</Text>
                  </TouchableOpacity>
                )}
                
                {order.status === 'preparing' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => updateOrderStatus(order.id, 'ready')}
                  >
                    <Text style={styles.actionButtonText}>Mark Ready</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={handleAddMenuItem}>
              <Text style={styles.actionTitle}>Add Menu Item</Text>
              <Text style={styles.actionDescription}>Create a new healthy dish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionTitle}>View Analytics</Text>
              <Text style={styles.actionDescription}>Check your performance</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  businessName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#10B981',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  orderAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});