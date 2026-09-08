'use client';

import Header from './Header';
import Footer from './Footer';
import { useCart } from '@/lib/CartContext';

export default function LayoutWrapper({ children, hideHeader = false, hideFooter = false }) {
  const { cartCount, isHydrated } = useCart();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideHeader && <Header cartCount={isHydrated ? cartCount : 0} />}
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
