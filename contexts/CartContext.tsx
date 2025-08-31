import React, { createContext, useContext, useReducer } from 'react';
import type { Database } from '@/types/database';

type FoodItem = Database['public']['Tables']['food_items']['Row'];

interface CartItem {
  food_item: FoodItem;
  quantity: number;
  special_instructions?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  nutritionalSummary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { food_item: FoodItem; quantity?: number; special_instructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: { food_item_id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { food_item_id: string; quantity: number } }
  | { type: 'UPDATE_INSTRUCTIONS'; payload: { food_item_id: string; special_instructions: string } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addToCart: (food_item: FoodItem, quantity?: number, special_instructions?: string) => void;
  removeFromCart: (food_item_id: string) => void;
  updateQuantity: (food_item_id: string, quantity: number) => void;
  updateInstructions: (food_item_id: string, special_instructions: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { food_item, quantity = 1, special_instructions } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.food_item.id === food_item.id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          special_instructions: special_instructions || newItems[existingItemIndex].special_instructions,
        };
      } else {
        newItems = [...state.items, { food_item, quantity, special_instructions }];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.food_item.price * item.quantity,
        0
      );

      const nutritionalSummary = newItems.reduce(
        (summary, item) => ({
          totalCalories: summary.totalCalories + (item.food_item.nutritional_info?.calories || 0) * item.quantity,
          totalProtein: summary.totalProtein + (item.food_item.nutritional_info?.protein || 0) * item.quantity,
          totalCarbs: summary.totalCarbs + (item.food_item.nutritional_info?.carbs || 0) * item.quantity,
          totalFat: summary.totalFat + (item.food_item.nutritional_info?.fat || 0) * item.quantity,
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      );

      return { items: newItems, total, nutritionalSummary };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => item.food_item.id !== action.payload.food_item_id
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.food_item.price * item.quantity,
        0
      );
      
      const nutritionalSummary = newItems.reduce(
        (summary, item) => ({
          totalCalories: summary.totalCalories + (item.food_item.nutritional_info?.calories || 0) * item.quantity,
          totalProtein: summary.totalProtein + (item.food_item.nutritional_info?.protein || 0) * item.quantity,
          totalCarbs: summary.totalCarbs + (item.food_item.nutritional_info?.carbs || 0) * item.quantity,
          totalFat: summary.totalFat + (item.food_item.nutritional_info?.fat || 0) * item.quantity,
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      );
      
      return { items: newItems, total, nutritionalSummary };
    }

    case 'UPDATE_QUANTITY': {
      const { food_item_id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { food_item_id } });
      }

      const newItems = state.items.map(item =>
        item.food_item.id === food_item_id
          ? { ...item, quantity }
          : item
      );

      const total = newItems.reduce(
        (sum, item) => sum + item.food_item.price * item.quantity,
        0
      );

      const nutritionalSummary = newItems.reduce(
        (summary, item) => ({
          totalCalories: summary.totalCalories + (item.food_item.nutritional_info?.calories || 0) * item.quantity,
          totalProtein: summary.totalProtein + (item.food_item.nutritional_info?.protein || 0) * item.quantity,
          totalCarbs: summary.totalCarbs + (item.food_item.nutritional_info?.carbs || 0) * item.quantity,
          totalFat: summary.totalFat + (item.food_item.nutritional_info?.fat || 0) * item.quantity,
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      );

      return { items: newItems, total, nutritionalSummary };
    }

    case 'UPDATE_INSTRUCTIONS': {
      const { food_item_id, special_instructions } = action.payload;
      const newItems = state.items.map(item =>
        item.food_item.id === food_item_id
          ? { ...item, special_instructions }
          : item
      );
      return { ...state, items: newItems };
    }

    case 'CLEAR_CART':
      return { 
        items: [], 
        total: 0, 
        nutritionalSummary: { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    nutritionalSummary: { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  });

  const addToCart = (food_item: FoodItem, quantity = 1, special_instructions?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { food_item, quantity, special_instructions } });
  };

  const removeFromCart = (food_item_id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { food_item_id } });
  };

  const updateQuantity = (food_item_id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { food_item_id, quantity } });
  };

  const updateInstructions = (food_item_id: string, special_instructions: string) => {
    dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { food_item_id, special_instructions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTotal = () => {
    return state.total;
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateInstructions,
        clearCart,
        getItemCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};