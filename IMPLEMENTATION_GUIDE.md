# AyurCare Implementation Guide

This guide demonstrates how to implement the AyurCare component library and integrate it into Next.js pages.

## 🚀 Quick Start

### 1. Import the Layout Wrapper
All pages should be wrapped with `LayoutWrapper` to include header and footer:

```javascript
'use client';

import { LayoutWrapper } from '@/components/layout';
import { HomePage } from '@/components/pages';

export default function Home() {
  return (
    <LayoutWrapper>
      <HomePage />
    </LayoutWrapper>
  );
}
```

### 2. Create Route Pages

#### `/app/page.js` - Home Page
```javascript
'use client';
import { LayoutWrapper } from '@/components/layout';
import { HomePage } from '@/components/pages';

export default function Home() {
  return (
    <LayoutWrapper>
      <HomePage />
    </LayoutWrapper>
  );
}
```

#### `/app/shop/page.js` - Shop Page
```javascript
'use client';
import { LayoutWrapper } from '@/components/layout';
import { ShopPage } from '@/components/pages';

export default function Shop() {
  return (
    <LayoutWrapper>
      <ShopPage />
    </LayoutWrapper>
  );
}
```

#### `/app/cart/page.js` - Cart Page
```javascript
'use client';
import { LayoutWrapper } from '@/components/layout';
import { CartPage } from '@/components/pages';

export default function Cart() {
  return (
    <LayoutWrapper>
      <CartPage />
    </LayoutWrapper>
  );
}
```

#### `/app/product/[id]/page.js` - Product Detail
```javascript
'use client';
import { LayoutWrapper } from '@/components/layout';
import { ProductDetailPage } from '@/components/pages';

export default function ProductDetail({ params }) {
  return (
    <LayoutWrapper>
      <ProductDetailPage productId={params.id} />
    </LayoutWrapper>
  );
}
```

#### `/app/account/page.js` - Account Page
```javascript
'use client';
import { LayoutWrapper } from '@/components/layout';
import { AccountPage } from '@/components/pages';

export default function Account() {
  return (
    <LayoutWrapper>
      <AccountPage />
    </LayoutWrapper>
  );
}
```

#### `/app/auth/login/page.js` - Login Page
```javascript
'use client';
import { LoginForm } from '@/components/forms';
import { LayoutWrapper } from '@/components/layout';

export default function Login() {
  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      // Handle response
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <LayoutWrapper hideFooter>
      <LoginForm onSubmit={handleSubmit} />
    </LayoutWrapper>
  );
}
```

#### `/app/auth/register/page.js` - Register Page
```javascript
'use client';
import { RegisterForm } from '@/components/forms';
import { LayoutWrapper } from '@/components/layout';

export default function Register() {
  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      // Handle response
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <LayoutWrapper hideFooter>
      <RegisterForm onSubmit={handleSubmit} />
    </LayoutWrapper>
  );
}
```

#### `/app/checkout/page.js` - Checkout Page
```javascript
'use client';
import { useState } from 'react';
import { CheckoutForm } from '@/components/forms';
import { LayoutWrapper, Section } from '@/components/layout';

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (formData) => {
    // Handle order placement
    console.log('Order placed:', formData);
  };

  const orderItems = [
    { name: 'Ashwagandha Capsules', qty: 1, total: 1450 },
    { name: 'Bhringraj Hair Oil', qty: 2, total: 1960 },
  ];

  return (
    <LayoutWrapper>
      <Section>
        <CheckoutForm
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onSubmit={handleSubmit}
          totalPrice={3760}
          orderItems={orderItems}
        />
      </Section>
    </LayoutWrapper>
  );
}
```

#### `/app/admin/dashboard/page.js` - Admin Dashboard
```javascript
'use client';
import { AdminTopBar, KPICard, AdminPanel, ChartArea, BarChart } from '@/components/admin';
import { Section } from '@/components/layout';
import { DataTable } from '@/components/utility';

export default function AdminDashboard() {
  const kpis = [
    { label: 'Total Revenue', value: 'Rs. 124,500', trend: '+12% this month', icon: '💰' },
    { label: 'Orders', value: '1,240', trend: '+8% this month', icon: '📦' },
    { label: 'Customers', value: '845', trend: '+5% this month', icon: '👥' },
    { label: 'Products', value: '234', trend: '+2 new', icon: '🛍️' },
  ];

  const chartData = [
    { label: 'Supplements', value: 45 },
    { label: 'Oils', value: 32 },
    { label: 'Skincare', value: 28 },
    { label: 'Teas', value: 22 },
  ];

  const recentOrders = [
    { orderId: '#AC-1042', date: '18 Aug 2026', status: 'Processing', total: 'Rs. 3,760' },
    { orderId: '#AC-1039', date: '17 Aug 2026', status: 'Shipped', total: 'Rs. 1,450' },
  ];

  return (
    <Section>
      <AdminTopBar title="Dashboard" />
      
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px' }}>
        <AdminPanel title="Revenue Trend">
          <ChartArea label="Last 30 days" />
        </AdminPanel>

        <AdminPanel title="Sales by Category">
          <BarChart data={chartData} maxValue={50} />
        </AdminPanel>
      </div>

      {/* Recent Orders */}
      <AdminPanel title="Recent Orders" style={{ marginTop: '18px' }}>
        <DataTable
          columns={[
            { key: 'orderId', label: 'Order ID' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status' },
            { key: 'total', label: 'Total' },
          ]}
          data={recentOrders}
        />
      </AdminPanel>
    </Section>
  );
}
```

## 🎯 Common Implementation Patterns

### Using State with Components

```javascript
import { useState } from 'react';
import { ProductGrid } from '@/components/products';

export function ProductFilter() {
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 5000],
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <ProductGrid
      products={filteredProducts}
      onAddToCart={(id) => console.log('Added:', id)}
    />
  );
}
```

### Form Validation

```javascript
import { useState } from 'react';
import { FormField, Button } from '@/components/ui';

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name required';
    if (!formData.email) newErrors.email = 'Email required';
    if (!formData.message) newErrors.message = 'Message required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        error={errors.name}
        required
      />
      <Button type="submit" variant="primary">Send</Button>
    </form>
  );
}
```

### API Integration

```javascript
'use client';
import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/products';
import { Loader, EmptyState } from '@/components/utility';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <EmptyState icon="❌" title="Error" description={error} />;
  if (products.length === 0) return <EmptyState />;

  return <ProductGrid products={products} />;
}
```

## 📁 Recommended File Structure

```
src/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── auth/
│   │   ├── login/page.js
│   │   └── register/page.js
│   ├── shop/
│   │   └── page.js
│   ├── product/
│   │   └── [id]/page.js
│   ├── cart/page.js
│   ├── checkout/page.js
│   ├── account/page.js
│   └── admin/
│       └── dashboard/page.js
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   ├── forms/
│   ├── utility/
│   ├── admin/
│   └── pages/
├── styles/
│   ├── globals.css
│   ├── components.module.css
│   └── layout.module.css
└── lib/
    └── designSystem.js
```

## 🔧 Configuration Tips

### jsconfig.json Aliases
Ensure your `jsconfig.json` has these path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Environment Variables
Create `.env.local` for API endpoints:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎨 Customization

### Custom Button
```javascript
import { Button } from '@/components/ui';

export function CustomPrimaryButton(props) {
  return (
    <Button
      {...props}
      variant="primary"
      style={{ borderRadius: '4px', ...props.style }}
    />
  );
}
```

### Custom Theme
Override CSS variables in `src/styles/globals.css`:
```css
:root {
  --green-900: #YourColor;
  --gold: #YourColor;
}
```

## ✅ Verification Checklist

- [ ] All components import correctly
- [ ] Layout wraps pages with header/footer
- [ ] Forms handle submissions
- [ ] State updates trigger re-renders
- [ ] API endpoints are configured
- [ ] Images load properly
- [ ] Mobile responsive (test on 480px, 768px, 1024px)
- [ ] No console errors or warnings
- [ ] CSS variables applied correctly
- [ ] Components display with correct colors/spacing

## 📚 Additional Resources

- Design System: `src/lib/designSystem.js`
- Component Guide: `COMPONENT_STRUCTURE.md`
- Styles Reference: `src/styles/`
- Example Pages: `src/components/pages/`

## 🤝 Support

For component issues:
1. Check `COMPONENT_STRUCTURE.md` for component props
2. Verify CSS module imports
3. Check browser console for errors
4. Ensure `'use client'` directive for client components
