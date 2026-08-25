'use client';

import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children, hideHeader = false, hideFooter = false }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideHeader && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
