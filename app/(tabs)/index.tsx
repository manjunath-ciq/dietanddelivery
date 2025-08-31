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
  Alert,
  Modal,
  TextInput,
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
  Store,
  X
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import FoodItemCard from '@/components/FoodItemCard';
import AdvancedFilters from '@/components/AdvancedFilters';
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
  const { addToCart, state: cartState } = useCart();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dietary: [] as string[],
    priceRange: [0, 50] as [number, number],
    maxPrepTime: 60,
    nutritionalGoals: {
      maxCalories: 1000,
      minProtein: 0,
      maxCarbs: 100,
      maxFat: 50,
    },
    excludeAllergens: [] as string[],
    categories: [] as string[],
  });

  useEffect(() => {
    if (!user) {
      router.replace('/welcome');
    } else {
      fetchFoodItems();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [foodItems, selectedCategory, searchQuery, advancedFilters]);

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

  const applyFilters = () => {
    let filtered = [...foodItems];

    // Apply category filter
    switch (selectedCategory) {
      case 'trending':
        filtered = filtered.slice(0, 6);
        break;
      case 'healthy':
        filtered = filtered.filter(item => 
          item.dietary_tags.some(tag => 
            ['healthy', 'organic', 'low-calorie'].includes(tag.toLowerCase())
          )
        );
        break;
      case 'protein':
        filtered = filtered.filter(item => 
          item.dietary_tags.some(tag => 
            ['high-protein', 'protein'].includes(tag.toLowerCase())
          )
        );
        break;
      case 'vegan':
        filtered = filtered.filter(item => 
          item.dietary_tags.some(tag => 
            ['vegan', 'plant-based'].includes(tag.toLowerCase())
          )
        );
        break;
      case 'quick':
        filtered = filtered.filter(item => item.prep_time <= 15);
        break;
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dietary_tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply advanced filters
    if (advancedFilters.dietary.length > 0) {
      filtered = filtered.filter(item =>
        advancedFilters.dietary.some(pref =>
          item.dietary_tags.some(tag => 
            tag.toLowerCase().includes(pref.toLowerCase())
          )
        )
      );
    }

    if (advancedFilters.priceRange[1] < 50) {
      filtered = filtered.filter(item =>
        item.price >= advancedFilters.priceRange[0] &&
        item.price <= advancedFilters.priceRange[1]
      );
    }

    if (advancedFilters.nutritionalGoals.maxCalories < 1000) {
      filtered = filtered.filter(item =>
        item.nutritional_info?.calories <= advancedFilters.nutritionalGoals.maxCalories
      );
    }

    // Note: Allergen filtering removed as allergen_info property doesn't exist in current schema

    setFilteredItems(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFoodItems();
    setRefreshing(false);
  };

  const handleAddToCart = (item: FoodItem) => {
    addToCart(item, 1);
    Alert.alert(
      'Added to Cart! 🛒',
      `${item.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
      ]
    );
  };

  const handleFoodItemPress = (item: FoodItem) => {
    // Navigate to food item detail screen
    console.log('Navigate to food item:', item.name);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleFilterPress = () => {
    setShowFilters(true);
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <FoodItemCard
      item={item}
      onAddToCart={handleAddToCart}
      onPress={handleFoodItemPress}
    />
  );

  if (!user || !userProfile) {
    return null;
  }

  const isVendor = userProfile.role === 'vendor';

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
              onPress={() => router.push('/(tabs)/cart')}
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
                onPress={handleSearchPress}
              >
                <Search size={20} color="#9CA3AF" />
                <Text style={styles.searchPlaceholder}>
                  {searchQuery || 'Search for healthy meals...'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={handleFilterPress}
              >
                <Filter size={20} color="#10B981" />
              </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoryContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {FOOD_CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.key;
                  
                  return (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categoryChip,
                        isSelected && styles.categoryChipActive
                      ]}
                      onPress={() => handleCategoryPress(category.key)}
                    >
                      <IconComponent 
                        size={16} 
                        color={isSelected ? '#FFFFFF' : category.color} 
                      />
                      <Text style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Food Items */}
            <View style={styles.foodSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'trending' ? 'Trending Now' : 
                   selectedCategory === 'healthy' ? 'Healthy Options' :
                   selectedCategory === 'protein' ? 'High Protein' :
                   selectedCategory === 'vegan' ? 'Vegan Delights' :
                   selectedCategory === 'quick' ? 'Quick Meals' : 'All Items'}
                </Text>
                <Text style={styles.itemCount}>{filteredItems.length} items</Text>
              </View>
              
              {filteredItems.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No items found</Text>
                  <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredItems}
                  renderItem={renderFoodItem}
                  keyExtractor={(item) => item.id}
                  horizontal={false}
                  numColumns={2}
                  columnWrapperStyle={styles.foodGrid}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              )}
            </View>
          </>
        )}

        {isVendor && (
          <View style={styles.vendorMessage}>
            <Store size={48} color="#10B981" />
            <Text style={styles.vendorTitle}>Vendor Dashboard</Text>
            <Text style={styles.vendorSubtitle}>
              Switch to your dashboard to manage your menu and orders
            </Text>
            <TouchableOpacity 
              style={styles.dashboardButton}
              onPress={() => router.push('/(tabs)/dashboard')}
            >
              <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSearchModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Search</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for healthy meals..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredItems}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id}
            horizontal={false}
            numColumns={2}
            columnWrapperStyle={styles.foodGrid}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.searchResults}
          />
        </SafeAreaView>
      </Modal>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        visible={showFilters}
        currentFilters={advancedFilters}
        onApplyFilters={setAdvancedFilters}
        onClose={() => setShowFilters(false)}
      />
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
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
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
  categoryChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  foodSection: {
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
  itemCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  searchResults: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  vendorMessage: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F0FDF4',
  },
  vendorTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  vendorSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  dashboardButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dashboardButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});