# AyurCare Component Structure

This document outlines the modular Next.js component architecture built from the design system reference HTML.

## 📁 Directory Structure

```
src/
├── components/
│   ├── ui/                 # Base reusable UI components
│   ├── layout/             # Layout & page structure components
│   ├── products/           # Product-related components
│   ├── forms/              # Form components
│   ├── utility/            # Utility & helper components
│   ├── admin/              # Admin dashboard components
│   └── pages/              # Full page components
├── styles/
│   ├── globals.css         # Global styles & CSS variables
│   ├── components.module.css # Component-specific styles
│   └── layout.module.css   # Layout-specific styles
└── lib/
    └── designSystem.js     # Design tokens & constants
```

## 🎨 Design System

### Colors
Located in `src/lib/designSystem.js` and `src/styles/globals.css` (CSS variables)

- **Primary**: Green 900, 700, 500
- **Accents**: Sage, Gold
- **Neutrals**: Charcoal, Beige, Cream
- **Semantic**: Danger red

### Typography
- **Display**: Poppins (700, 600, 500)
- **Body**: Inter (700, 600, 500, 400)

### Spacing & Radii
- **Spacing**: xs (6px) → 6xl (64px)
- **Radii**: small (6px), medium (12px), large (20px), round (999px)

## 🧩 Component Categories

### 1. UI Components (`src/components/ui/`)
Basic, reusable components for building pages.

| Component | Props | Usage |
|-----------|-------|-------|
| `Button` | variant, size, block, disabled, icon | CTA actions |
| `Card` | padded, hover, className | Content containers |
| `Badge` | variant (8 status types) | Status indicators |
| `Pagination` | currentPage, totalPages, onPageChange | Navigation |
| `Chip` | active, onClick | Filter buttons |
| `FormField` | label, type, value, onChange, error | Form inputs |
| `Avatar` | size (sm/lg), src, initials | User images |
| `QtyBox` | value, onChange, min, max | Quantity selectors |
| `Breadcrumb` | items: [{href, label}] | Navigation trail |

**Import:**
```javascript
import { Button, Card, Badge, ... } from '@/components/ui';
```

### 2. Layout Components (`src/components/layout/`)
Structural components for page layout.

| Component | Props | Usage |
|-----------|-------|-------|
| `Header` | cartCount, onAccountClick, onSearchChange | Top navigation |
| `Footer` | - | Page footer |
| `Sidebar` | items, activeItem, onItemClick, type | Navigation sidebar |
| `LayoutWrapper` | hideHeader, hideFooter | Wraps page content |
| `Container` | className | Max-width container |
| `Hero` | badge, title, description, ctaButtons | Hero section |
| `Section` | title, subtitle, id | Content section wrapper |

**Import:**
```javascript
import { Header, Footer, Hero, Section, ... } from '@/components/layout';
```

### 3. Product Components (`src/components/products/`)
Product display and discovery components.

| Component | Props | Usage |
|-----------|-------|-------|
| `ProductCard` | id, image, category, name, rating, price, discount, onAddToCart, onWishlistToggle | Product item |
| `ProductGrid` | products, columns (4/3/2), onAddToCart, onWishlistToggle | Product listings |
| `CategoryCard` | icon, name, onClick | Category button |
| `CategoryGrid` | categories, onCategoryClick | Category browsing |
| `FeatureCard` | icon, title, description | Feature highlight |
| `FeatureGrid` | features | Feature showcase |
| `PromoCard` | title, description, buttonLabel, onButtonClick | Promotional banner |

**Import:**
```javascript
import { ProductCard, ProductGrid, CategoryGrid, ... } from '@/components/products';
```

### 4. Form Components (`src/components/forms/`)
Pre-built forms for common user flows.

| Component | Props | Usage |
|-----------|-------|-------|
| `LoginForm` | onSubmit | User login |
| `RegisterForm` | onSubmit | User registration |
| `CheckoutForm` | currentStep, onStepChange, onSubmit, totalPrice, orderItems | Multi-step checkout |
| `AddressForm` | initialData, onSubmit, onCancel | Address entry/edit |

**Import:**
```javascript
import { LoginForm, RegisterForm, CheckoutForm, AddressForm } from '@/components/forms';
```

### 5. Utility Components (`src/components/utility/`)
Helper and utility components.

| Component | Props | Usage |
|-----------|-------|-------|
| `EmptyState` | icon, title, description, actionLabel, onAction | No-data state |
| `LeafDivider` | label | Section divider |
| `Tracker` | steps, currentStep | Progress tracking |
| `Loader` | size, fullScreen, label | Loading indicator |
| `DataTable` | columns, data | Data display |
| `CartRow` | id, name, meta, qty, onQtyChange, price, onRemove | Cart item row |
| `OrderSummary` | items, subtotal, deliveryFee, discount, total | Price breakdown |

**Import:**
```javascript
import { EmptyState, Tracker, Loader, CartRow, OrderSummary, ... } from '@/components/utility';
```

### 6. Admin Components (`src/components/admin/`)
Dashboard and admin-specific components.

| Component | Props | Usage |
|-----------|-------|-------|
| `KPICard` | label, value, trend, icon | Metric display |
| `AdminTopBar` | title, onSearch, searchPlaceholder | Admin header |
| `AdminPanel` | title, children | Admin section wrapper |
| `ChartArea` | label | Gradient chart visualization |
| `BarChart` | data, maxValue | Horizontal bar chart |

**Import:**
```javascript
import { KPICard, AdminTopBar, ChartArea, BarChart, ... } from '@/components/admin';
```

### 7. Page Components (`src/components/pages/`)
Full-page compositions using smaller components.

| Component | Usage |
|-----------|-------|
| `HomePage` | Landing page |
| `ShopPage` | Product listing with filters |
| `CartPage` | Shopping cart |
| `ProductDetailPage` | Product details & reviews |
| `AccountPage` | User account dashboard |

**Import:**
```javascript
import { HomePage, ShopPage, CartPage, ... } from '@/components/pages';
```

## 📦 Common Usage Patterns

### Basic Page Layout
```javascript
import { LayoutWrapper, Header, Footer } from '@/components/layout';
import { HomePage } from '@/components/pages';

export default function Home() {
  return (
    <LayoutWrapper>
      <HomePage />
    </LayoutWrapper>
  );
}
```

### Product Display
```javascript
import { ProductGrid } from '@/components/products';

const products = [
  { id: 1, name: 'Product', price: 1000, ... }
];

export default function Shop() {
  return <ProductGrid products={products} columns={4} />;
}
```

### Form Integration
```javascript
import { LoginForm } from '@/components/forms';

export default function Login() {
  const handleSubmit = (formData) => {
    console.log('Login:', formData);
  };
  
  return <LoginForm onSubmit={handleSubmit} />;
}
```

### Empty State
```javascript
import { EmptyState } from '@/components/utility';

export default function NoResults() {
  return (
    <EmptyState
      icon="🔍"
      title="No products found"
      description="Try adjusting your filters"
      actionLabel="Clear Filters"
      onAction={() => {}}
    />
  );
}
```

## 🎯 Component Variants & Props

### Button Variants
- `primary` - Green primary button
- `gold` - Gold accent button
- `outline` - Outlined button
- `outlineLight` - Light outlined button
- `ghost` - Subtle background button
- `danger` - Danger/delete button

### Badge Variants
- `pending` - Pending status
- `processing` - Processing status
- `shipped` - Shipped status
- `delivered` - Delivered status
- `cancelled` - Cancelled status
- `active` - Active status
- `low` - Low stock
- `out` - Out of stock

### Form Field Types
- `text`
- `email`
- `password`
- `tel`
- `textarea`
- `select`

## 🔄 State Management Tips

### Using React State with Components
```javascript
const [qty, setQty] = useState(1);
const [filters, setFilters] = useState({});
const [cartItems, setCartItems] = useState([]);
```

### Form Handling
```javascript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

## 📱 Responsive Behavior

All components are responsive by default:
- Mobile: 1 column for grids
- Tablet (768px): 2 columns
- Desktop (1024px+): 3-4 columns

CSS media queries are in `src/styles/layout.module.css`

## 🎨 Customization

### Using CSS Variables
```css
--green-900: #1E332A;
--green-700: #2F4A3D;
--radius-m: 12px;
```

### Extending Components
```javascript
import { Button } from '@/components/ui';

export function CustomButton(props) {
  return <Button {...props} className={`custom-class ${props.className}`} />;
}
```

## 🚀 Getting Started

1. Import components from their category
2. Pass required props (refer to usage tables)
3. Handle callbacks (`onClick`, `onChange`, `onSubmit`)
4. Components handle their own styling via CSS modules

## 📋 Component Checklist

- ✅ 9 UI Components
- ✅ 7 Layout Components
- ✅ 7 Product Components
- ✅ 4 Form Components
- ✅ 7 Utility Components
- ✅ 5 Admin Components
- ✅ 5 Page Components
- ✅ Design System (colors, typography, spacing)
- ✅ Global Styles & CSS Variables
- **Total: 55+ components**

## 📖 Next Steps

1. Create API integration layer
2. Add state management (Context API or Zustand)
3. Set up authentication flow
4. Create additional pages (checkout, admin dashboard)
5. Add data fetching with async/await
6. Implement error boundaries
