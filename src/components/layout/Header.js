'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import styles from '@/styles/layout.module.css';

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  onAccountClick,
  searchQuery = '',
  onSearchChange,
}) {
  const router = useRouter();

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleWishlistClick = () => {
    router.push('/wishlist');
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
          }}
        />

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
          <Button variant="outline" size="sm" onClick={onAccountClick}>
            Account
          </Button>
        </div>
      </div>
    </header>
  );
}
