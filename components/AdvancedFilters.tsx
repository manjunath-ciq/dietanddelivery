import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import { X, Filter, Sliders, DollarSign, Clock, Target, ChevronDown } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

interface FilterOptions {
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
}

interface AdvancedFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const DIETARY_OPTIONS = [
  { key: 'vegan', label: 'Vegan', emoji: '🌱' },
  { key: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { key: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { key: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { key: 'high-protein', label: 'High Protein', emoji: '💪' },
  { key: 'low-carb', label: 'Low Carb', emoji: '🥑' },
  { key: 'organic', label: 'Organic', emoji: '🌿' },
  { key: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
];

const ALLERGEN_OPTIONS = [
  { key: 'nuts', label: 'Tree Nuts', emoji: '🥜' },
  { key: 'peanuts', label: 'Peanuts', emoji: '🥜' },
  { key: 'dairy', label: 'Dairy', emoji: '🥛' },
  { key: 'eggs', label: 'Eggs', emoji: '🥚' },
  { key: 'soy', label: 'Soy', emoji: '🫘' },
  { key: 'wheat', label: 'Wheat', emoji: '🌾' },
  { key: 'fish', label: 'Fish', emoji: '🐟' },
  { key: 'shellfish', label: 'Shellfish', emoji: '🦐' },
];

const CATEGORY_OPTIONS = [
  'bowls', 'burgers', 'curry', 'pasta', 'salads', 'soups', 'smoothies', 'desserts'
];

export default function AdvancedFilters({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const toggleDietary = (diet: string) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet]
    }));
  };

  const toggleAllergen = (allergen: string) => {
    setFilters(prev => ({
      ...prev,
      excludeAllergens: prev.excludeAllergens.includes(allergen)
        ? prev.excludeAllergens.filter(a => a !== allergen)
        : [...prev.excludeAllergens, allergen]
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
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
    };
    setFilters(defaultFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Filter size={24} color="#10B981" />
            <Text style={styles.headerTitle}>Advanced Filters</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Dietary Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            <View style={styles.optionsGrid}>
              {DIETARY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionChip,
                    filters.dietary.includes(option.key) && styles.selectedChip
                  ]}
                  onPress={() => toggleDietary(option.key)}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.optionText,
                    filters.dietary.includes(option.key) && styles.selectedChipText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Price Range</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.rangeText}>
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={50}
                value={filters.priceRange[1]}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], value]
                }))}
                minimumTrackTintColor="#10B981"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Preparation Time */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Max Preparation Time</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.rangeText}>{filters.maxPrepTime} minutes</Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={60}
                value={filters.maxPrepTime}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  maxPrepTime: value
                }))}
                minimumTrackTintColor="#10B981"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Nutritional Goals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Nutritional Goals</Text>
            </View>
            
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Max Calories</Text>
              <Text style={styles.nutritionValue}>{filters.nutritionalGoals.maxCalories}</Text>
              <Slider
                style={styles.nutritionSlider}
                minimumValue={200}
                maximumValue={2000}
                value={filters.nutritionalGoals.maxCalories}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  nutritionalGoals: { ...prev.nutritionalGoals, maxCalories: value }
                }))}
                minimumTrackTintColor="#EF4444"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Min Protein (g)</Text>
              <Text style={styles.nutritionValue}>{filters.nutritionalGoals.minProtein}</Text>
              <Slider
                style={styles.nutritionSlider}
                minimumValue={0}
                maximumValue={50}
                value={filters.nutritionalGoals.minProtein}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  nutritionalGoals: { ...prev.nutritionalGoals, minProtein: value }
                }))}
                minimumTrackTintColor="#F59E0B"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>

            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionLabel}>Max Carbs (g)</Text>
              <Text style={styles.nutritionValue}>{filters.nutritionalGoals.maxCarbs}</Text>
              <Slider
                style={styles.nutritionSlider}
                minimumValue={10}
                maximumValue={200}
                value={filters.nutritionalGoals.maxCarbs}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  nutritionalGoals: { ...prev.nutritionalGoals, maxCarbs: value }
                }))}
                minimumTrackTintColor="#10B981"
                maximumTrackTintColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Exclude Allergens */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exclude Allergens</Text>
            <View style={styles.optionsGrid}>
              {ALLERGEN_OPTIONS.map((allergen) => (
                <TouchableOpacity
                  key={allergen.key}
                  style={[
                    styles.optionChip,
                    filters.excludeAllergens.includes(allergen.key) && styles.selectedChip
                  ]}
                  onPress={() => toggleAllergen(allergen.key)}
                >
                  <Text style={styles.optionEmoji}>{allergen.emoji}</Text>
                  <Text style={[
                    styles.optionText,
                    filters.excludeAllergens.includes(allergen.key) && styles.selectedChipText
                  ]}>
                    {allergen.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.optionsGrid}>
              {CATEGORY_OPTIONS.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.optionChip,
                    filters.categories.includes(category) && styles.selectedChip
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[
                    styles.optionText,
                    filters.categories.includes(category) && styles.selectedChipText
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Scroll Indicator */}
        <View style={styles.scrollIndicator}>
          <Text style={styles.scrollIndicatorText}>Scroll for more options</Text>
          <ChevronDown size={16} color="#10B981" />
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  selectedChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  optionEmoji: {
    fontSize: 14,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedChipText: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
  },
  sliderContainer: {
    marginTop: 4,
  },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    minWidth: 40,
    textAlign: 'right',
  },
  nutritionSlider: {
    flex: 1,
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 48,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  scrollIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  scrollIndicatorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
});
