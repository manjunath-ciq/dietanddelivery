import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Utensils,
  Truck,
  Timer,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    special_instructions: string | null;
    food_items: {
      id: string;
      name: string;
      image_url: string | null;
    };
  }>;
};

interface KitchenDisplayProps {
  vendorId: string;
  onBack?: () => void;
}

export default function KitchenDisplay({ vendorId, onBack }: KitchenDisplayProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchActiveOrders();
    
    // Set up real-time subscription for order updates
    const subscription = supabase
      .channel(`kitchen-orders-${vendorId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `vendor_id=eq.${vendorId}`,
        },
        (payload) => {
          console.log('Kitchen order update:', payload);
          fetchActiveOrders();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [vendorId]);

  const fetchActiveOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            special_instructions,
            food_items (
              id,
              name,
              image_url
            )
          )
        `)
        .eq('vendor_id', vendorId)
        .in('status', ['confirmed', 'preparing', 'ready'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveOrders();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      // Show success message
      Alert.alert('Success', `Order status updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getOrderTime = (createdAt: string) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#3B82F6';
      case 'preparing':
        return '#8B5CF6';
      case 'ready':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <AlertCircle size={20} color="#3B82F6" />;
      case 'preparing':
        return <Utensils size={20} color="#8B5CF6" />;
      case 'ready':
        return <Truck size={20} color="#10B981" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'CONFIRMED';
      case 'preparing':
        return 'PREPARING';
      case 'ready':
        return 'READY';
      default:
        return status.toUpperCase();
    }
  };

  const getPriorityColor = (minutes: number) => {
    if (minutes > 30) return '#EF4444'; // Red for urgent
    if (minutes > 20) return '#F59E0B'; // Orange for medium priority
    return '#10B981'; // Green for normal
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = [];
    }
    acc[order.status].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const statusOrder = ['confirmed', 'preparing', 'ready'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Kitchen Display</Text>
          <Text style={styles.headerSubtitle}>Active Orders</Text>
        </View>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {statusOrder.map((status) => {
          const statusOrders = groupedOrders[status] || [];
          if (statusOrders.length === 0) return null;

          return (
            <View key={status} style={styles.statusSection}>
              <View style={styles.statusHeader}>
                {getStatusIcon(status)}
                <Text style={[styles.statusTitle, { color: getStatusColor(status) }]}>
                  {getStatusText(status)} ({statusOrders.length})
                </Text>
              </View>

              {statusOrders.map((order) => {
                const orderTime = getOrderTime(order.created_at);
                const priorityColor = getPriorityColor(orderTime);

                return (
                  <View key={order.id} style={styles.orderCard}>
                    {/* Order Header */}
                    <View style={styles.orderHeader}>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                        <View style={styles.timeInfo}>
                          <Timer size={16} color={priorityColor} />
                          <Text style={[styles.orderTime, { color: priorityColor }]}>
                            {orderTime}m ago
                          </Text>
                        </View>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(status) }
                      ]}>
                        <Text style={styles.statusBadgeText}>
                          {getStatusText(status)}
                        </Text>
                      </View>
                    </View>

                    {/* Order Items */}
                    <View style={styles.orderItems}>
                      {order.order_items.map((item) => (
                        <View key={item.id} style={styles.orderItem}>
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>
                              {item.quantity}x {item.food_items.name}
                            </Text>
                            {item.special_instructions && (
                              <Text style={styles.specialInstructions}>
                                Note: {item.special_instructions}
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      {status === 'confirmed' && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
                          onPress={() => updateOrderStatus(order.id, 'preparing')}
                        >
                          <Utensils size={16} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Start Preparing</Text>
                        </TouchableOpacity>
                      )}

                      {status === 'preparing' && (
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                          onPress={() => updateOrderStatus(order.id, 'ready')}
                        >
                          <CheckCircle size={16} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Mark Ready</Text>
                        </TouchableOpacity>
                      )}

                      {status === 'ready' && (
                        <View style={styles.readyStatus}>
                          <CheckCircle size={20} color="#10B981" />
                          <Text style={styles.readyText}>Ready for pickup</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {orders.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Utensils size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Active Orders</Text>
            <Text style={styles.emptySubtitle}>
              All caught up! New orders will appear here automatically.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusSection: {
    marginTop: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  specialInstructions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    marginTop: 2,
    fontStyle: 'italic',
  },
  actionButtons: {
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  readyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  readyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});
