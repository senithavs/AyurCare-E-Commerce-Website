'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Get localStorage key based on user
  const getCartKey = (userId) => {
    return userId ? `ayurcare_cart_user_${userId}` : 'ayurcare_cart_guest';
  };

  // Hydrate from localStorage on mount and when user changes
  useEffect(() => {
    const loadCart = () => {
      const cartKey = getCartKey(user?.id);
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage:', e);
          setCartItems([]);
        }
      } else {
        // If user just signed in and has no cart, try to migrate from guest cart
        if (user?.id && isAuthenticated) {
          const guestCart = localStorage.getItem('ayurcare_cart_guest');
          if (guestCart) {
            try {
              const guestItems = JSON.parse(guestCart);
              setCartItems(guestItems);
              // Save to user's cart
              localStorage.setItem(cartKey, JSON.stringify(guestItems));
              // Optionally clear guest cart
              localStorage.removeItem('ayurcare_cart_guest');
            } catch (e) {
              console.error('Failed to migrate guest cart:', e);
              setCartItems([]);
            }
          }
        } else {
          setCartItems([]);
        }
      }
      setIsHydrated(true);
    };

    loadCart();
  }, [user?.id, isAuthenticated]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isHydrated) {
      const cartKey = getCartKey(user?.id);
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated, user?.id]);

  // Helper to get consistent product ID
  const getProductId = (product) => {
    return product._id || product.id || product.product_id;
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      // Normalize product ID
      const productId = getProductId(product);
      const cartProduct = { ...product, id: productId };
      
      const existingItem = prev.find((item) => getProductId(item) === productId);
      if (existingItem) {
        return prev.map((item) =>
          getProductId(item) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, cartProduct];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => getProductId(item) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          getProductId(item) === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length; // Number of unique products
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0); // Total items
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount, // Number of unique products
        cartItemCount, // Total item quantity
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
