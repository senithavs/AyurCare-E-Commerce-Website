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
            <img src='/footerLogo.png'></img>
          </div>
          <p className={styles.footerText}>
            Authentic Ayurvedic and herbal wellness, delivered with casre.
          </p>
          <div className={styles.socialRow}>
            <button className={styles.socialIcon} aria-label="Facebook">
              f
            </button>
            <button className={styles.socialIcon} aria-label="Instagram">
              ig
            </button>
            <button className={styles.socialIcon} aria-label="Twitter">
              x
            </button>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h5>Customer Service</h5>
          <Link href="/shipping" className={styles.footerLink}>
            Shipping Info
          </Link>
          <Link href="/returns" className={styles.footerLink}>
            Returns
          </Link>
          <Link href="/faq" className={styles.footerLink}>
            FAQ
          </Link>
          <Link href="/contact" className={styles.footerLink}>
            Contact Us
          </Link>
        </div>

        <div className={styles.footerSection}>
          <h5>Quick Links</h5>
          <Link href="/shop" className={styles.footerLink}>
            Shop All
          </Link>
          <Link href="/about" className={styles.footerLink}>
            About Us
          </Link>
          <Link href="/orders" className={styles.footerLink}>
            Track Order
          </Link>
          <Link href="/account" className={styles.footerLink}>
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
          <Link href="/privacy" style={{ color: 'inherit' }}>
            Privacy Policy
          </Link>
          {' · '}
          <Link href="/terms" style={{ color: 'inherit' }}>
            Terms &amp; Conditions
          </Link>
        </span>
      </div>
    </>
  );
}
