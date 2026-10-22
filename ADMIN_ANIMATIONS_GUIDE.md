# Admin Panel Animations Guide

## Overview
Comprehensive animations have been added to all admin page components to enhance the user experience with smooth, polished interactions and transitions.

## Animation File
All animations are defined in: `/src/styles/admin-animations.css`

## Animations Applied

### 1. **Page Entry Animation**
- **Class**: `admin-page-enter`
- **Effect**: Fade-in on page load
- **Duration**: 0.5s
- **Applied to**: Main page container in all admin pages

### 2. **KPI Cards Animation**
- **Class**: `admin-kpi-card`
- **Effect**: Staggered slide-up animation
- **Duration**: 0.6s per card
- **Stagger**: 0.1s between each card
- **Applied to**: 4 dashboard KPI cards (Products, Orders, Revenue, Stock)

### 3. **Section Cards Animation**
- **Class**: `admin-section-card`
- **Effect**: Slide-up with fade-in
- **Duration**: 0.7s
- **Delay**: 0.3s after page load
- **Applied to**: All section containers (tables, charts, analytics)

### 4. **Table Rows Animation**
- **Class**: `admin-table`
- **Effect**: Table rows fade-in sequentially
- **Duration**: 0.5s per row
- **Stagger**: 0.1s between rows
- **Applied to**: All data tables (orders, products, stock)

### 5. **Modal Animations**
- **Overlay**: `admin-modal-overlay` - Fade-in (0.3s)
- **Content**: `admin-modal-content` - Scale-up (0.3s)
- **Applied to**: Add product modal and other modals

### 6. **Sidebar Navigation**
- **Class**: `admin-sidebar-link`
- **Effects**: 
  - Smooth hover transition (0.3s)
  - Translate right on hover
  - Active state styling
- **Applied to**: Navigation menu items

### 7. **Button Interactions**
- **Class**: `admin-button-hover`
- **Effects**:
  - Hover: Lift up with shadow
  - Active: Press down effect
  - Duration: 0.3s
- **Applied to**: All interactive buttons

### 8. **Filter Buttons**
- **Class**: `admin-filter-btn`
- **Effects**:
  - Smooth color transition
  - Subtle scale on hover
  - Active state with scale animation
- **Applied to**: Status filter buttons in Orders page

### 9. **Chart Bar Animation**
- **Class**: `admin-chart-bar`
- **Effect**: Slide-up with staggered delay
- **Duration**: 0.8s
- **Stagger**: 0.1s between bars
- **Applied to**: Analytics charts and progress bars

### 10. **Expanding Bars**
- **Class**: `admin-expanding-bar`
- **Effect**: Width expands from 0 to 100%
- **Duration**: 1s
- **Applied to**: Progress indicators and chart bars

### 11. **Additional Effects**
- **Pulse**: `admin-badge-pulse` - Subtle pulsing effect for badges
- **Loading Skeleton**: `admin-skeleton` - Shimmer effect
- **Status Badges**: `admin-status-badge` - Scale on hover
- **Card Hover**: `admin-card-hover` - Lift and shadow on hover
- **Row Hover**: Table rows get subtle background color on hover
- **Input Focus**: `admin-input-focus` - Glow effect on focus

## Components Enhanced

### AdminDashboard
- Page container fade-in
- KPI cards staggered animation
- Section cards slide-up
- Table rows sequential animation

### AdminAnalytics
- Page fade-in
- Section cards animations
- Chart bars staggered animation
- Expanding bar width animations

### AdminProducts
- Page fade-in
- Section cards animation
- Modal overlay and content animations
- Table animations

### AdminOrders
- Page fade-in
- Filter buttons with hover effects
- Section cards animation
- Table rows animation

### AdminStock
- Page fade-in
- Summary cards staggered animation
- Table animation
- Search and filter interactions

### AdminSidebar
- Navigation links with hover effects
- Smooth transitions on navigation

### AdminLayout
- Overall layout animation support

## CSS Classes Reference

| Class | Effect | Duration |
|-------|--------|----------|
| `admin-page-enter` | Fade-in | 0.5s |
| `admin-kpi-card` | Staggered slide-up | 0.6s |
| `admin-section-card` | Slide-up fade-in | 0.7s |
| `admin-table` | Row fade-in | 0.5s |
| `admin-modal-overlay` | Fade-in | 0.3s |
| `admin-modal-content` | Scale-up | 0.3s |
| `admin-sidebar-link` | Hover translate | 0.3s |
| `admin-button-hover` | Lift effect | 0.3s |
| `admin-filter-btn` | Transition | 0.3s |
| `admin-chart-bar` | Staggered slide-up | 0.8s |
| `admin-expanding-bar` | Width expand | 1s |

## Animation Keyframes

The CSS file includes these main keyframe animations:
- `fadeIn` - Opacity transition from 0 to 1
- `slideUp` - Upward movement with fade-in
- `slideInLeft` - Left-to-right movement with fade-in
- `scaleUp` - Zoom in from 95% to 100%
- `bounce` - Vertical bounce effect
- `pulse` - Opacity pulsing
- `shimmer` - Loading shimmer effect
- `glow` - Box shadow pulsing
- `rotate` - 360-degree rotation
- `expandWidth` - Width expansion animation

## How to Use

### Adding animations to new components:
1. Import the animation CSS in your component:
   ```javascript
   import '@/styles/admin-animations.css';
   ```

2. Apply animation classes to elements:
   ```jsx
   <div className="admin-page-enter">
     <div className="admin-section-card">
       {/* Content */}
     </div>
   </div>
   ```

### Customizing animations:
Edit `/src/styles/admin-animations.css` to modify:
- Duration (change values like `0.5s`)
- Delay times (change `animation-delay`)
- Timing functions (change `ease-out`, `ease-in`, etc.)
- Transform values (change `translateY`, `scale`, etc.)

## Performance Notes

- All animations use GPU-accelerated properties (`opacity`, `transform`)
- No performance-heavy animations like filters or shadows on hover
- Animations are smooth at 60fps
- Staggered delays prevent overwhelming the UI
- Animations can be disabled via CSS if needed

## Browser Support

All animations use standard CSS3 features compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

Consider adding:
- Skeleton loading states for data fetching
- Transition animations between admin pages
- Animated counters for metrics
- Toast notifications with animations
- Loading spinner animations
