'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import styles from '@/styles/layout.module.css';

export default function Header({
  cartCount = 0,
  onAccountClick,
  searchQuery = '',
  onSearchChange,
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.siteHeader} style={{ position: 'relative' }}>
      <Link href="/" className={styles.logo}>
        <img src='/logo.png' alt="AyurCare Logo"></img>
      </Link>

      {/* Hamburger Menu Button - Mobile Only */}
      <button
        className={styles.hamburger}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Desktop Navigation */}
      <nav className={styles.navLinks} style={{
        order: 2,
      }}>
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

      {/* Mobile Navigation Menu */}
      <nav className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.navLink} onClick={closeMobileMenu}>
          Home
        </Link>
        <Link href="/shop" className={styles.navLink} onClick={closeMobileMenu}>
          Shop
        </Link>
        <Link href="/categories" className={styles.navLink} onClick={closeMobileMenu}>
          Categories
        </Link>
        <Link href="/about" className={styles.navLink} onClick={closeMobileMenu}>
          About
        </Link>
        <Link href="/contact" className={styles.navLink} onClick={closeMobileMenu}>
          Contact
        </Link>
      </nav>

      {/* Search Bar & Actions */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        order: 3,
        marginLeft: 'auto',
        flexWrap: 'wrap',
        width: '100%',
      }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          style={{
            border: '1px solid var(--line)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            width: '180px',
            fontFamily: 'inherit',
            color: 'var(--charcoal)',
            flex: '0 0 auto',
          }}
        />

        <div className={styles.navActions}>
          <span role="button" aria-label="Wishlist" style={{ cursor: 'pointer' }}>
            <img src='/wishlist.png' style={{ width: '24px', height: '24px' }} />
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
          <Button variant="outline" size="sm" onClick={onAccountClick}>
            Account
          </Button>
        </div>
      </div>
    </header>
  );
}
