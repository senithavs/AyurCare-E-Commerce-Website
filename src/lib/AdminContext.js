'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts } from './productsData';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize with sample data on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('admin_products');
    const savedOrders = localStorage.getItem('admin_orders');

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error('Failed to parse products:', e);
        setProducts(getAllProducts());
      }
    } else {
      setProducts(getAllProducts());
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed to parse orders:', e);
        setOrders(generateSampleOrders());
      }
    } else {
      setOrders(generateSampleOrders());
    }

    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('admin_products', JSON.stringify(products));
      localStorage.setItem('admin_orders', JSON.stringify(orders));
    }
  }, [products, orders, isHydrated]);

  // Add new product
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `PROD-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  // Update product
  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  // Delete product
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Update stock quantity
  const updateStock = (productId, quantity) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: quantity } : p))
    );
  };

  // Add order
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalQuantitySold = orders.reduce((sum, order) => sum + (order.quantity || 1), 0);
    const lowStockProducts = products.filter((p) => p.stockCount < 10).length;

    const ordersByStatus = {
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    };

    const topProducts = products
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 5);

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalQuantitySold,
      lowStockProducts,
      ordersByStatus,
      topProducts,
    };
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addOrder,
        updateOrderStatus,
        calculateAnalytics,
        isHydrated,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

// Generate sample orders for demo
function generateSampleOrders() {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const orders = [];

  for (let i = 1; i <= 15; i++) {
    orders.push({
      id: `ORD-${100 + i}`,
      customerName: ['Priya Kumar', 'Rajesh Singh', 'Amelia Torres', 'Deepak Patel', 'Sneha Sharma'][
        i % 5
      ],
      email: `customer${i}@example.com`,
      total: Math.floor(Math.random() * 50000) + 5000,
      quantity: Math.floor(Math.random() * 5) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          name: 'Ashwagandha Capsules',
          quantity: 1,
          price: 1450,
        },
      ],
    });
  }

  return orders;
}
