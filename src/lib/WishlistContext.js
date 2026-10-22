'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Get localStorage key based on user
  const getWishlistKey = (userId) => {
    return userId ? `ayurcare_wishlist_user_${userId}` : 'ayurcare_wishlist_guest';
  };

  // Hydrate from localStorage on mount and when user changes
  useEffect(() => {
    const loadWishlist = () => {
      const wishlistKey = getWishlistKey(user?.id);
      const savedWishlist = localStorage.getItem(wishlistKey);
      
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (e) {
          console.error('Failed to parse wishlist from localStorage:', e);
          setWishlistItems([]);
        }
      } else {
        // If user just signed in and has no wishlist, try to migrate from guest wishlist
        if (user?.id && isAuthenticated) {
          const guestWishlist = localStorage.getItem('ayurcare_wishlist_guest');
          if (guestWishlist) {
            try {
              const guestItems = JSON.parse(guestWishlist);
              setWishlistItems(guestItems);
              // Save to user's wishlist
              localStorage.setItem(wishlistKey, JSON.stringify(guestItems));
              // Optionally clear guest wishlist
              localStorage.removeItem('ayurcare_wishlist_guest');
            } catch (e) {
              console.error('Failed to migrate guest wishlist:', e);
              setWishlistItems([]);
            }
          }
        } else {
          setWishlistItems([]);
        }
      }
      setIsHydrated(true);
    };

    loadWishlist();
  }, [user?.id, isAuthenticated]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isHydrated) {
      const wishlistKey = getWishlistKey(user?.id);
      localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isHydrated, user?.id]);

  // Helper to get consistent product ID
  const getProductId = (product) => {
    return product._id || product.id || product.product_id;
  };

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const productId = getProductId(product);
      const exists = prev.find((item) => getProductId(item) === productId);
      if (!exists) {
        return [...prev, { ...product, id: productId }];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => getProductId(item) !== productId));
  };

  const toggleWishlist = (product) => {
    const productId = getProductId(product);
    const isWishlisted = wishlistItems.some((item) => getProductId(item) === productId);
    if (isWishlisted) {
      removeFromWishlist(productId);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => getProductId(item) === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        isHydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
