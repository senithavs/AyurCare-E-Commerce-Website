'use client';

import Header from './Header';
import Footer from './Footer';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';

export default function LayoutWrapper({ children, hideHeader = false, hideFooter = false }) {
  const { cartCount, isHydrated: cartHydrated } = useCart();
  const { wishlistCount, isHydrated: wishlistHydrated } = useWishlist();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideHeader && (
        <Header 
          cartCount={cartHydrated ? cartCount : 0}
          wishlistCount={wishlistHydrated ? wishlistCount : 0}
        />
      )}
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
