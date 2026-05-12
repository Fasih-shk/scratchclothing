'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,
      setIsCartOpen: (value) => set({ isCartOpen: value }),
      addToCart: (product, variant, selectedImageUrl) => {
        set((state) => {
          const existing = state.cartItems.find(
            (item) => item.id === product.id && item.variant === variant
          );

          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id && item.variant === variant
                  ? { ...item, quantity: item.quantity + 1, selectedImageUrl: selectedImageUrl || item.selectedImageUrl }
                  : item
              ),
              isCartOpen: true,
            };
          }

          return {
            cartItems: [...state.cartItems, { ...product, variant, quantity: 1, selectedImageUrl }],
            isCartOpen: true,
          };
        });
      },
      removeFromCart: (id, variant) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => !(item.id === id && item.variant === variant)
          ),
        })),
      updateQuantity: (id, variant, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(id, variant);
          return;
        }

        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id && item.variant === variant ? { ...item, quantity } : item
          ),
        }));
      },
      updateCustomText: (id, variant, text) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id && item.variant === variant ? { ...item, customText: text } : item
          ),
        }));
      },
    }),
    {
      name: 'munidrip_cart',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);

export function useCart() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCustomText,
  } = useCartStore();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCustomText,
  };
}
