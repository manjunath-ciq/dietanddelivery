import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartScreen() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { customerProfile } = useAuth();

  const deliveryFee = 3.99;
  const totalWithDelivery = state.total + deliveryFee;

  const handleCheckout = () => {
    if (state.items.length === 0) {
      Alert.alert('Empty Cart', 'Add some items to your cart first!');
      return;
    }

    if (!customerProfile?.address) {
      Alert.alert('Delivery Address', 'Please set your delivery address in your profile first.');
      return;
    }

    // TODO: Navigate to checkout screen
    Alert.alert('Checkout', 'Checkout functionality will be implemented in Phase 4!');
  };

  if (state.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color="#D1D5DB" strokeWidth={1} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our healthy meals and add them to your cart
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.itemsList}>
        {state.items.map((cartItem) => (
          <View key={cartItem.food_item.id} style={styles.cartItem}>
            <Image
              source={{ uri: cartItem.food_item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{cartItem.food_item.name}</Text>
              <Text style={styles.itemPrice}>${cartItem.food_item.price.toFixed(2)}</Text>
              <View style={styles.nutritionInfo}>
                <Text style={styles.calories}>
                  {cartItem.food_item.nutritional_info?.calories || 0} cal
                </Text>
              </View>
              {cartItem.special_instructions && (
                <Text style={styles.instructions}>
                  Note: {cartItem.special_instructions}
                </Text>
              )}
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeFromCart(cartItem.food_item.id)}
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(cartItem.food_item.id, cartItem.quantity - 1)}
                >
                  <Minus size={16} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{cartItem.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(cartItem.food_item.id, cartItem.quantity + 1)}
                >
                  <Plus size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Nutritional Summary */}
      <View style={styles.nutritionalSummary}>
        <Text style={styles.nutritionalTitle}>Nutritional Summary</Text>
        <View style={styles.nutritionalGrid}>
          <View style={styles.nutritionalItem}>
            <Flame size={20} color="#EF4444" />
            <View style={styles.nutritionalContent}>
              <Text style={styles.nutritionalValue}>
                {state.nutritionalSummary.totalCalories}
              </Text>
              <Text style={styles.nutritionalLabel}>Calories</Text>
            </View>
          </View>
          
          <View style={styles.nutritionalItem}>
            <Zap size={20} color="#F59E0B" />
            <View style={styles.nutritionalContent}>
              <Text style={styles.nutritionalValue}>
                {state.nutritionalSummary.totalProtein}g
              </Text>
              <Text style={styles.nutritionalLabel}>Protein</Text>
            </View>
          </View>
          
          <View style={styles.nutritionalItem}>
            <Target size={20} color="#10B981" />
            <View style={styles.nutritionalContent}>
              <Text style={styles.nutritionalValue}>
                {state.nutritionalSummary.totalCarbs}g
              </Text>
              <Text style={styles.nutritionalLabel}>Carbs</Text>
            </View>
          </View>
          
          <View style={styles.nutritionalItem}>
            <Leaf size={20} color="#8B5CF6" />
            <View style={styles.nutritionalContent}>
              <Text style={styles.nutritionalValue}>
                {state.nutritionalSummary.totalFat}g
              </Text>
              <Text style={styles.nutritionalLabel}>Fat</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${state.total.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalWithDelivery.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
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
  clearText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nutritionalSummary: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nutritionalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  nutritionalItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  nutritionalContent: {
    alignItems: 'center',
  },
  nutritionalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  nutritionalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginBottom: 4,
  },
  nutritionInfo: {
    marginBottom: 4,
  },
  calories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#059669',
  },
  instructions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  quantityControls: {
    alignItems: 'flex-end',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  checkoutButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});