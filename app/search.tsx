import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, Clock } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import type { Database } from '@/types/database';
import FoodItemCard from '@/components/FoodItemCard';
import AdvancedFilters from '@/components/AdvancedFilters';

type FoodItem = Database['public']['Tables']['food_items']['Row'];



export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<{
    dietary: string[];
    priceRange: [number, number];
    maxPrepTime: number;
    nutritionalGoals: {
      maxCalories: number;
      minProtein: number;
      maxCarbs: number;
      maxFat: number;
    };
    excludeAllergens: string[];
    categories: string[];
  }>({
    dietary: [],
    priceRange: [0, 50],
    maxPrepTime: 30,
    nutritionalGoals: {
      maxCalories: 1000,
      minProtein: 0,
      maxCarbs: 100,
      maxFat: 50,
    },
    excludeAllergens: [],
    categories: [],
  });

  const getActiveFilterCount = () => {
    let count = 0;
    if (advancedFilters.dietary.length > 0) count++;
    if (advancedFilters.priceRange[1] < 50) count++;
    if (advancedFilters.maxPrepTime < 30) count++;
    if (advancedFilters.nutritionalGoals.maxCalories < 1000) count++;
    if (advancedFilters.nutritionalGoals.minProtein > 0) count++;
    if (advancedFilters.nutritionalGoals.maxCarbs < 100) count++;
    if (advancedFilters.excludeAllergens.length > 0) count++;
    if (advancedFilters.categories.length > 0) count++;
    return count;
  };
  const { addToCart, removeFromCart, updateQuantity, state: cartState } = useCart();

  useEffect(() => {
    fetchFoodItems();
  }, []);

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

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Advanced filters
    const matchesAdvancedDietary = advancedFilters.dietary.length === 0 || 
                                  item.dietary_tags.some(tag => 
                                    advancedFilters.dietary.includes(tag.toLowerCase())
                                  );
    
    const matchesPrice = item.price >= advancedFilters.priceRange[0] && 
                        item.price <= advancedFilters.priceRange[1];
    
    const matchesPrepTime = item.prep_time <= advancedFilters.maxPrepTime;
    
    const matchesNutrition = item.nutritional_info.calories <= advancedFilters.nutritionalGoals.maxCalories &&
                            item.nutritional_info.protein >= advancedFilters.nutritionalGoals.minProtein &&
                            item.nutritional_info.carbs <= advancedFilters.nutritionalGoals.maxCarbs &&
                            item.nutritional_info.fat <= advancedFilters.nutritionalGoals.maxFat;
    
    const matchesAllergens = advancedFilters.excludeAllergens.length === 0 || 
                             !item.allergens.some(allergen => 
                               advancedFilters.excludeAllergens.includes(allergen)
                             );
    
    const matchesAdvancedCategory = advancedFilters.categories.length === 0 || 
                                   advancedFilters.categories.includes(item.category);

    return matchesSearch && matchesAdvancedDietary && matchesPrice && matchesPrepTime && 
           matchesNutrition && matchesAllergens && matchesAdvancedCategory;
  });

  const handleAddToCart = (item: FoodItem) => {
    addToCart(item, 1);
    // Could add a toast notification here
  };

  const handleApplyAdvancedFilters = (filters: any) => {
    setAdvancedFilters(filters);
  };

  const handleFoodItemPress = (item: FoodItem) => {
    // Navigate to food item detail screen
    console.log('Navigate to food item:', item.name);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search healthy meals..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowAdvancedFilters(true)}
          >
            <Filter size={20} color="#10B981" />
            <Text style={styles.filterButtonText}>
              Filters {getActiveFilterCount() > 0 ? `(${getActiveFilterCount()})` : ''}
            </Text>
          </TouchableOpacity>
        </View>


      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </Text>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        visible={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        currentFilters={advancedFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filterButton: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
  },
  filtersContainer: {
    marginTop: 16,
    gap: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#10B981',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  foodImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  foodInfo: {
    padding: 12,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  nutritionalInfo: {
    marginBottom: 8,
  },
  calorieInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calories: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#059669',
  },
  prepTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prepTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#D97706',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  addButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});