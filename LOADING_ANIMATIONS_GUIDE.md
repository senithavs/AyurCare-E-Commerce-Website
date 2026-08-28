# Content Loading Animations Guide

This guide shows how to use the loading animation components in your AyurCare application.

## 📦 Available Loading Components

### 1. **SkeletonLoader** - Product Card Skeletons
Shows placeholder cards while content loads

**Usage:**
```javascript
import { SkeletonLoader } from '@/components/utility';

export function ProductListLoading() {
  return <SkeletonLoader count={4} type="product" />;
}
```

**Props:**
- `count` - Number of skeleton cards (default: 4)
- `type` - 'product' for product cards or 'list' for rows (default: 'product')

**Features:**
- Animated shimmer effect
- Realistic card layout
- Customizable count

---

### 2. **PulseLoader** - Spinning Loader with Dots
Animated spinner with pulsing dots

**Usage:**
```javascript
import { PulseLoader } from '@/components/utility';

export function LoadingPage() {
  return <PulseLoader size="md" />;
}
```

**Props:**
- `size` - 'sm', 'md', or 'lg' (default: 'md')
- `fullScreen` - Show as fixed overlay (default: false)

**Sizes:**
- `sm` - 24px (small buttons/cards)
- `md` - 40px (standard loading)
- `lg` - 56px (page loading)

---

### 3. **ShimmerCard** - Custom Shimmer
Generic shimmer effect for any content

**Usage:**
```javascript
import { ShimmerCard } from '@/components/utility';

export function CustomLoading() {
  return (
    <>
      <ShimmerCard height="60px" />
      <ShimmerCard height="100px" width="80%" />
    </>
  );
}
```

**Props:**
- `width` - CSS width (default: '100%')
- `height` - CSS height (default: '200px')

---

### 4. **Loader** - Existing Spinner
Simple loading spinner (already in your components)

**Usage:**
```javascript
import { Loader } from '@/components/utility';

export function PageLoading() {
  return <Loader size="md" label="Loading..." />;
}
```

---

## 🎯 Real-World Implementation Examples

### Example 1: Product Grid with Loading State
```javascript
'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/products';
import { SkeletonLoader } from '@/components/utility';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts([
        { id: 1, name: 'Product 1', price: 1000 },
        { id: 2, name: 'Product 2', price: 1500 },
        // ... more products
      ]);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader count={4} type="product" />;
  }

  return <ProductGrid products={products} columns={4} />;
}
```

---

### Example 2: Modal/Dialog Loading
```javascript
'use client';

import { useState } from 'react';
import { PulseLoader } from '@/components/utility';

export function CheckoutModal() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  if (isLoading) {
    return <PulseLoader size="md" />;
  }

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleSubmit}>Place Order</button>
    </div>
  );
}
```

---

### Example 3: Page Loading Overlay
```javascript
'use client';

import { useState, useEffect } from 'react';
import { PulseLoader } from '@/components/utility';

export function PageWithOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <PulseLoader size="lg" fullScreen />}
      
      <div style={{ opacity: isLoading ? 0.5 : 1 }}>
        <h1>Page Content</h1>
        {/* Your content here */}
      </div>
    </>
  );
}
```

---

### Example 4: Search Results Loading
```javascript
'use client';

import { useState } from 'react';
import { SkeletonLoader } from '@/components/utility';
import { ProductGrid } from '@/components/products';

export function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate search API call
    setTimeout(() => {
      setResults([
        // search results
      ]);
      setIsLoading(false);
    }, 1500);
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      
      {isLoading ? (
        <SkeletonLoader count={8} type="product" />
      ) : results.length > 0 ? (
        <ProductGrid products={results} columns={4} />
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
```

---

### Example 5: Checkout Steps Loading
```javascript
'use client';

import { useState } from 'react';
import { SkeletonLoader } from '@/components/utility';
import { CheckoutForm } from '@/components/forms';

export function CheckoutFlow() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  if (isLoading) {
    return <SkeletonLoader count={1} type="list" />;
  }

  return (
    <CheckoutForm onSubmit={handleCheckout} />
  );
}
```

---

## 🎨 Using Animation CSS Classes

Apply animations to any element using the CSS classes:

```javascript
import styles from '@/styles/components.module.css';

export function AnimatedContent() {
  return (
    <div>
      <div className={styles.fadeInAnimation}>
        <h1>Fade In Effect</h1>
      </div>
      
      <div className={styles.slideInAnimation}>
        <p>Slide In Effect</p>
      </div>
      
      <div className={styles.bounceAnimation}>
        <button>Bounce Effect</button>
      </div>
      
      <div className={styles.pulseAnimation}>
        <span>Pulse Effect</span>
      </div>
    </div>
  );
}
```

---

## 📊 Available Animations

| Animation | Effect | Duration | Use Case |
|-----------|--------|----------|----------|
| `fadeIn` | Fade in from bottom | 0.6s | Content appears |
| `slideIn` | Slide from left | 0.6s | Navigation items |
| `bounce` | Bounce up and down | 1s | CTA buttons |
| `shimmer` | Shimmer left to right | 2s | Loading placeholders |
| `pulse` | Pulse opacity | 1.5s | Loading states |
| `spin` | Spinning circle | 1s | Spinner animation |

---

## 🎯 Best Practices

1. **Use SkeletonLoader for:**
   - Product grids
   - Data tables
   - List items
   - Any grid layout

2. **Use PulseLoader for:**
   - Modal/dialog operations
   - Form submissions
   - Page transitions
   - Overlay states

3. **Use ShimmerCard for:**
   - Custom layouts
   - Hero sections
   - Banner areas

4. **Use CSS classes for:**
   - Content entrance animations
   - Button interactions
   - UI transitions

---

## 🚀 Quick Start

1. **Import the component:**
```javascript
import { SkeletonLoader, PulseLoader } from '@/components/utility';
```

2. **Add loading state:**
```javascript
const [isLoading, setIsLoading] = useState(true);
```

3. **Show loader during loading:**
```javascript
{isLoading ? (
  <SkeletonLoader count={4} />
) : (
  <YourContent />
)}
```

4. **Handle the async operation:**
```javascript
useEffect(() => {
  fetchData().then(() => setIsLoading(false));
}, []);
```

---

## 📝 Notes

- All loaders are fully responsive
- Animations are smooth and performant
- Compatible with all screen sizes
- Can be customized via CSS
- Works with Turbopack build system

---

## 💡 Tips

- Combine SkeletonLoader with actual content dimensions for better UX
- Use appropriate loader sizes for different contexts
- Add loading text for better UX
- Consider reducing animation duration on slow networks
- Test loaders on different devices for optimal performance
