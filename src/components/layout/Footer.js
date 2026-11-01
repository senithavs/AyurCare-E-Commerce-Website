'use client';

import Link from 'next/link';
import styles from '@/styles/layout.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className={styles.siteFooter}>
        <div>
          <div className={styles.logo} style={{ color: '#fff', marginBottom: '14px' }}>
            <img src='https://xrejvwbivhtfnblavofv.supabase.co/storage/v1/object/public/Images/Logo/Footer%20logo/footerLogo.png'></img>
          </div>
          <p className={styles.footerText}>
            Authentic Ayurvedic and herbal wellness, delivered with casre.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h5>Customer Service</h5>
          <Link href="/contact" className={styles.footerLink}>
            Contact Us
          </Link>
          <Link href="/about" className={styles.footerLink}>
            About Us
          </Link>
          <Link href="/categories" className={styles.footerLink}>
            Categories
          </Link>
        </div>

        <div className={styles.footerSection}>
          <h5>Quick Links</h5>
          <Link href="/shop" className={styles.footerLink}>
            Shop All
          </Link>
          <Link href="/cart" className={styles.footerLink}>
            Shopping Cart
          </Link>
          <Link href="/profile" className={styles.footerLink}>
            My Account
          </Link>
        </div>

        <div className={styles.footerSection}>
          <h5>Get In Touch</h5>
          <p className={styles.footerText}>123 Herbal Lane, Colombo</p>
          <p className={styles.footerText}>hello@ayurcare.lk</p>
          <p className={styles.footerText}>+94 77 000 0000</p>
        </div>
      </footer>

      <div className={styles.footerBottom}>
        <span>© {currentYear} AyurCare. All rights reserved.</span>
        <span>
          <Link href="/" style={{ color: 'inherit' }}>
            Home
          </Link>
          {' · '}
          <Link href="/contact" style={{ color: 'inherit' }}>
            Contact
          </Link>
          {' · '}
          <Link href="/shop" style={{ color: 'inherit' }}>
            Shop
          </Link>
        </span>
      </div>
    </>
  );
}
