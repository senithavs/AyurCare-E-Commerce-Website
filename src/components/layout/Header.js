'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/AuthContext';
import styles from '@/styles/layout.module.css';

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  onAccountClick,
  searchQuery = '',
  onSearchChange,
}) {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleWishlistClick = () => {
    router.push('/wishlist');
  };

  const handleSignInClick = () => {
    router.push('/signin');
  };

  const handleSignOut = () => {
    signOut();
    setShowProfileMenu(false);
    // Refresh the page after sign out
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <header className={styles.siteHeader}>
      <Link href="/" className={styles.logo}>
        <img src='/logo.png' alt="AyurCare Logo"></img>
      </Link>

      <nav className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/shop" className={styles.navLink}>
          Shop
        </Link>
        <Link href="/categories" className={styles.navLink}>
          Categories
        </Link>
        <Link href="/about" className={styles.navLink}>
          About
        </Link>
        <Link href="/contact" className={styles.navLink}>
          Contact
        </Link>
      </nav>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>

        <div className={styles.navActions}>
          <span
            role="button"
            aria-label="Wishlist"
            onClick={handleWishlistClick}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <img src='/wishlist.png' style={{ width: '24px', height: '24px' }} />
            {wishlistCount > 0 && <span className={styles.badgeCount}>{wishlistCount}</span>}
          </span>
          <span
            role="button"
            aria-label="Shopping cart"
            onClick={handleCartClick}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <img src='/cart.png' style={{ width: '24px', height: '24px' }} />
            {cartCount > 0 && <span className={styles.badgeCount}>{cartCount}</span>}
          </span>

          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleProfileClick}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--green-700)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  boxShadow: showProfileMenu ? '0 0 0 3px rgba(106, 168, 79, 0.2)' : 'none',
                }}
                title={user.name}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </button>

              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    minWidth: '200px',
                    zIndex: 1000,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'var(--line)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green-900)' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--charcoal-60)', marginTop: '4px' }}>
                      {user.email}
                    </div>
                  </div>

                  <div style={{ padding: '8px 0' }}>
                    <Link
                      href="/profile"
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: 'var(--charcoal)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--cream)';
                        e.currentTarget.style.color = 'var(--green-700)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--charcoal)';
                      }}
                    >
                      👤 My Profile
                    </Link>

                    <Link
                      href="/orders"
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: 'var(--charcoal)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--cream)';
                        e.currentTarget.style.color = 'var(--green-700)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--charcoal)';
                      }}
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      href="/settings"
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: 'var(--charcoal)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--cream)';
                        e.currentTarget.style.color = 'var(--green-700)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--charcoal)';
                      }}
                    >
                      ⚙️ Settings
                    </Link>

                    <button
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSignInClick}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
