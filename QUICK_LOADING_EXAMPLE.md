# Quick Loading Animation Examples

## 🚀 Fast Setup (Copy & Paste)

### Example 1: Product Grid with Loading
```javascript
'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/products';
import { SkeletonLoader } from '@/components/utility';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setProducts([
        { id: 1, image: '🌿', name: 'Product 1', price: 1000 },
        { id: 2, image: '🧴', name: 'Product 2', price: 1500 },
        // ... add more
      ]);
      setIsLoading(false);
    }, 2000); // Show loading for 2 seconds
  }, []);

  return (
    <div>
      {isLoading ? (
        <SkeletonLoader count={4} type="product" />
      ) : (
        <ProductGrid products={products} columns={4} />
      )}
    </div>
  );
}
```

---

### Example 2: Page Loading Overlay
```javascript
'use client';

import { useState, useEffect } from 'react';
import { PulseLoader } from '@/components/utility';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  return (
    <>
      {isLoading && <PulseLoader size="lg" fullScreen />}
      <div>Your page content here</div>
    </>
  );
}
```

---

### Example 3: Form Submission Loading
```javascript
'use client';

import { useState } from 'react';
import { PulseLoader } from '@/components/utility';
import { Button } from '@/components/ui';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert('Logged in!');
  };

  if (isLoading) {
    return <PulseLoader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Button type="submit" variant="primary" block>
        Login
      </Button>
    </form>
  );
}
```

---

### Example 4: Custom Content Loading
```javascript
'use client';

import { ShimmerCard } from '@/components/utility';

export function HeroLoading() {
  return (
    <div style={{ padding: '40px' }}>
      <ShimmerCard height="60px" width="60%" />
      <ShimmerCard height="20px" width="100%" />
      <ShimmerCard height="20px" width="80%" />
      <ShimmerCard height="40px" width="30%" />
    </div>
  );
}
```

---

### Example 5: Animated Content Entrance
```javascript
'use client';

import styles from '@/styles/components.module.css';

export function AnimatedProduct() {
  return (
    <div className={styles.fadeInAnimation}>
      <h1>Product Title</h1>
      <p>Product description with fade-in effect</p>
    </div>
  );
}
```

---

## 📦 Import Reference

```javascript
// All loaders in one import
import { 
  SkeletonLoader,    // Card placeholders
  PulseLoader,       // Spinning loader
  ShimmerCard,       // Custom shimmer
  Loader             // Simple spinner
} from '@/components/utility';

// CSS animations
import styles from '@/styles/components.module.css';
// Available classes: fadeInAnimation, slideInAnimation, bounceAnimation, pulseAnimation
```

---

## 🎨 Common Patterns

### Pattern 1: Show Loading, Then Content
```javascript
{isLoading ? <SkeletonLoader /> : <ProductGrid />}
```

### Pattern 2: Overlay Loading (Don't hide content)
```javascript
{isLoading && <PulseLoader fullScreen />}
<YourContent />
```

### Pattern 3: Loading with Fade Out
```javascript
<div style={{ opacity: isLoading ? 0.5 : 1 }}>
  {isLoading && <SkeletonLoader />}
  {!isLoading && <Content />}
</div>
```

### Pattern 4: Animated List
```javascript
{items.map((item, idx) => (
  <div key={idx} className={styles.fadeInAnimation}>
    {item.content}
  </div>
))}
```

---

## ⚡ Performance Tips

1. **Keep it short** - 2-3 seconds max
2. **Reduce on slow networks** - Use loading state from connection
3. **Combine effects** - Use SkeletonLoader + animations together
4. **Test on devices** - Check animation smoothness on mobile

---

## 🧪 Test Now

Just add this to any page:

```javascript
import { SkeletonLoader } from '@/components/utility';

export default function Test() {
  return <SkeletonLoader count={4} type="product" />;
}
```

See the shimmer animation! ✨
