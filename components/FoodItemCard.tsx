import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Plus, Minus, Clock, Zap, Target, Thermometer } from 'lucide-react-native';

interface FoodItemCardProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
    dietary_tags: string[];
    nutritional_info: any;
    allergens: string[];
    prep_time: number;
    image_url?: string | null;
  };
  onAddToCart: (item: any) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onPress: (item: any) => void;
  cartQuantity?: number;
}

export default function FoodItemCard({ 
  item, 
  onAddToCart, 
  onRemoveFromCart, 
  onUpdateQuantity, 
  onPress, 
  cartQuantity = 0 
}: FoodItemCardProps) {

  const getDietaryIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vegan':
        return '🌱';
      case 'vegetarian':
        return '🥬';
      case 'gluten-free':
        return '🌾';
      case 'dairy-free':
        return '🥛';
      case 'high-protein':
        return '💪';
      case 'low-carb':
        return '🥑';
      case 'organic':
        return '🌿';
      default:
        return '🍽️';
    }
  };

  const getDietaryColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vegan':
        return '#10B981';
      case 'vegetarian':
        return '#059669';
      case 'gluten-free':
        return '#F59E0B';
      case 'dairy-free':
        return '#3B82F6';
      case 'high-protein':
        return '#EF4444';
      case 'low-carb':
        return '#8B5CF6';
      case 'organic':
        return '#84CC16';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      {/* Food Image */}
      <View style={styles.imageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}
        
        {/* Preparation Time Badge */}
        <View style={styles.prepTimeBadge}>
          <Clock size={12} color="#FFFFFF" />
          <Text style={styles.prepTimeText}>{item.prep_time}m</Text>
        </View>
      </View>

      {/* Food Information */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Dietary Tags */}
        <View style={styles.tagsContainer}>
          {item.dietary_tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                { backgroundColor: `${getDietaryColor(tag)}20` }
              ]}
            >
              <Text style={styles.tagEmoji}>{getDietaryIcon(tag)}</Text>
              <Text style={[styles.tagText, { color: getDietaryColor(tag) }]}>
                {tag}
              </Text>
            </View>
          ))}
          {item.dietary_tags.length > 3 && (
            <View style={styles.moreTagsBadge}>
              <Text style={styles.moreTagsText}>+{item.dietary_tags.length - 3}</Text>
            </View>
          )}
        </View>

        {/* Nutritional Information */}
        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionItem}>
                            <Thermometer size={14} color="#EF4444" />
            <Text style={styles.nutritionText}>{item.nutritional_info.calories} cal</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Zap size={14} color="#F59E0B" />
            <Text style={styles.nutritionText}>{item.nutritional_info.protein}g protein</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Target size={14} color="#10B981" />
            <Text style={styles.nutritionText}>{item.nutritional_info.carbs}g carbs</Text>
          </View>
        </View>

        {/* Allergens Warning */}
        {item.allergens.length > 0 && (
          <View style={styles.allergensContainer}>
            <Text style={styles.allergensLabel}>⚠️ Contains:</Text>
            <Text style={styles.allergensText}>
              {item.allergens.join(', ')}
            </Text>
          </View>
        )}

        {/* Price and Cart Controls */}
        <View style={styles.footer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          
          {cartQuantity > 0 ? (
            <View style={styles.cartControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onUpdateQuantity(item.id, cartQuantity - 1)}
              >
                <Minus size={16} color="#10B981" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{cartQuantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onUpdateQuantity(item.id, cartQuantity + 1)}
              >
                <Plus size={16} color="#10B981" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onAddToCart(item)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  prepTimeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prepTimeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagEmoji: {
    fontSize: 12,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
  moreTagsBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreTagsText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nutritionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  allergensContainer: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  allergensLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
    marginBottom: 2,
  },
  allergensText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  addButton: {
    backgroundColor: '#10B981',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
});
