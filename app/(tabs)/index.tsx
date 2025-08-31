import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  MapPin, 
  Filter, 
  Search, 
  TrendingUp, 
  Heart, 
  Clock, 
  Star,
  ArrowRight,
  Utensils,
  Leaf,
  Zap,
  Target,
  Store
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import FoodItemCard from '@/components/FoodItemCard';
import type { Database } from '@/types/database';

type FoodItem = Database['public']['Tables']['food_items']['Row'];

const FOOD_CATEGORIES = [
  { key: 'trending', label: 'Trending', icon: TrendingUp, color: '#EF4444' },
  { key: 'healthy', label: 'Healthy', icon: Leaf, color: '#10B981' },
  { key: 'protein', label: 'High Protein', icon: Zap, color: '#F59E0B' },
  { key: 'vegan', label: 'Vegan', icon: Target, color: '#8B5CF6' },
  { key: 'quick', label: 'Quick Meals', icon: Clock, color: '#3B82F6' },
];

export default function Home() {
  const { user, userProfile } = useAuth();
  const { addToCart, removeFromCart, updateQuantity, state: cartState } = useCart();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('trending');

  useEffect(() => {
    if (!user) {
      router.replace('/welcome');
    } else {
      fetchFoodItems();
    }
  }, [user]);

  const fetchFoodItems = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFoodItems(data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFoodItems();
    setRefreshing(false);
  };

  const getFilteredItems = (category: string) => {
    switch (category) {
      case 'trending':
        return foodItems.slice(0, 6); // Show first 6 items
      case 'healthy':
        return foodItems.filter(item => 
          item.dietary_tags.some(tag => 
            ['healthy', 'organic', 'low-calorie'].includes(tag.toLowerCase())
          )
        );
      case 'protein':
        return foodItems.filter(item => 
          item.dietary_tags.some(tag => 
            ['high-protein', 'protein'].includes(tag.toLowerCase())
          )
        );
      case 'vegan':
        return foodItems.filter(item => 
          item.dietary_tags.some(tag => 
            ['vegan', 'plant-based'].includes(tag.toLowerCase())
          )
        );
      case 'quick':
        return foodItems.filter(item => item.prep_time <= 15);
      default:
        return foodItems;
    }
  };

  const handleAddToCart = (item: FoodItem) => {
    addToCart(item, 1);
  };

  const handleFoodItemPress = (item: FoodItem) => {
    // Navigate to food item detail screen
    console.log('Navigate to food item:', item.name);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => {
    const cartItem = cartState.items.find(cartItem => cartItem.food_item.id === item.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    
    return (
      <FoodItemCard
        item={item}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onPress={handleFoodItemPress}
        cartQuantity={cartQuantity}
      />
    );
  };

  if (!user || !userProfile) {
    return null;
  }

  const isVendor = userProfile.role === 'vendor';
  const filteredItems = getFilteredItems(selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>
              Hello, {userProfile.full_name?.split(' ')[0] || 'there'}! 👋
            </Text>
            <Text style={styles.subtitle}>
              What would you like to eat today?
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => router.push('/cart')}
            >
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{cartState.items.length}</Text>
              </View>
              <Utensils size={24} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>

        {!isVendor && (
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TouchableOpacity
                style={styles.searchBar}
                onPress={() => router.push('/(tabs)/search')}
              >
                <Search size={20} color="#9CA3AF" />
                <Text style={styles.searchPlaceholder}>
                  Search for healthy meals...
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => router.push('/(tabs)/search')}
              >
                <Filter size={20} color="#10B981" />
              </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoriesContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {FOOD_CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.key;
                  
                  return (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categoryTab,
                        isSelected && styles.categoryTabActive
                      ]}
                      onPress={() => handleCategoryPress(category.key)}
                    >
                      <IconComponent 
                        size={20} 
                        color={isSelected ? '#FFFFFF' : category.color} 
                      />
                      <Text style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelActive
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Featured Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'trending' ? 'Trending Now' :
                   selectedCategory === 'healthy' ? 'Healthy Choices' :
                   selectedCategory === 'protein' ? 'Protein Power' :
                   selectedCategory === 'vegan' ? 'Plant-Based Delights' :
                   'Quick & Easy'}
                </Text>
                <TouchableOpacity 
                  style={styles.seeAllButton}
                  onPress={() => router.push('/(tabs)/search')}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <ArrowRight size={16} color="#10B981" />
                </TouchableOpacity>
              </View>

              {filteredItems.length > 0 ? (
                <FlatList
                  data={filteredItems}
                  renderItem={renderFoodItem}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.foodGrid}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Leaf size={48} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No items found in this category</Text>
                  <Text style={styles.emptySubtext}>Try selecting a different category</Text>
                </View>
              )}
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Heart size={20} color="#EF4444" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statNumber}>{foodItems.length}</Text>
                  <Text style={styles.statLabel}>Healthy Meals</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Clock size={20} color="#10B981" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statNumber}>
                    {foodItems.reduce((acc, item) => acc + item.prep_time, 0) / Math.max(foodItems.length, 1)}m
                  </Text>
                  <Text style={styles.statLabel}>Avg Prep Time</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Vendor Dashboard */}
        {isVendor && (
          <View style={styles.vendorDashboard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vendor Dashboard</Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Store size={20} color="#10B981" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statNumber}>{foodItems.length}</Text>
                  <Text style={styles.statLabel}>Menu Items</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Star size={20} color="#F59E0B" />
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statNumber}>4.8</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.manageButton}
              onPress={() => router.push('/dashboard')}
            >
              <Text style={styles.manageButtonText}>Manage Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    padding: 8,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cartCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  filterButton: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryTabActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  foodGrid: {
    justifyContent: 'space-between',
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  vendorDashboard: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  manageButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  manageButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});