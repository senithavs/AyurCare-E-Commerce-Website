'use client';

import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';
import PulseLoader from './PulseLoader';

export default function LoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '40px' }}>
        <SkeletonLoader count={4} type="product" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--green-900)' }}>✅ Content Loaded!</h2>
      <p style={{ color: 'var(--charcoal-60)' }}>Your products are ready to display</p>
    </div>
  );
}
