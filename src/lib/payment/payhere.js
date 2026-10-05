/**
 * PayHere Payment Gateway Utilities
 * 
 * This module provides server-side utilities for PayHere integration.
 * The Merchant Secret is NEVER exposed to the client.
 * 
 * References:
 * - PayHere Documentation: https://www.payhere.lk/
 * - Sandbox: https://sandbox.payhere.lk/
 */

import crypto from 'crypto';

/**
 * Generate MD5 hash for PayHere
 * PayHere uses MD5 for transaction hashing
 * 
 * @param {string} input - The input string to hash
 * @returns {string} - MD5 hash in lowercase
 */
function md5Hash(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Generate PayHere payment hash for payment initialization
 * 
 * Hash is calculated as: md5(merchant_id + order_id + total_amount + merchant_secret)
 * 
 * According to PayHere documentation:
 * @see https://developers.payhere.lk/docs/payment-request
 * 
 * @param {string} merchantId - Your PayHere Merchant ID
 * @param {string} orderId - Unique order identifier
 * @param {number} totalAmount - Total amount to charge (in LKR, as integer)
 * @param {string} merchantSecret - Your PayHere Merchant Secret (server-side only)
 * @returns {string} - Payment hash to send to PayHere
 */
export function generatePaymentHash(merchantId, orderId, totalAmount, merchantSecret) {
  if (!merchantId || !orderId || !totalAmount || !merchantSecret) {
    throw new Error('Missing required parameters for hash generation');
  }

  // PayHere requires the amount as an integer (no decimals)
  const amount = Math.round(totalAmount);
  
  // Hash format: md5(merchant_id + order_id + total_amount + merchant_secret)
  const hashInput = `${merchantId}${orderId}${amount}${merchantSecret}`;
  
  return md5Hash(hashInput);
}

/**
 * Validate PayHere payment notification hash
 * 
 * Used to verify that payment notifications from PayHere are authentic.
 * Validates the hash sent by PayHere's notify endpoint.
 * 
 * @see https://developers.payhere.lk/docs/payment-notification
 * 
 * @param {string} merchantId - Your PayHere Merchant ID
 * @param {string} orderId - Order ID from notification
 * @param {number} totalAmount - Total amount from notification (in LKR, as integer)
 * @param {string} paymentId - PayHere payment ID from notification
 * @param {string} merchantSecret - Your PayHere Merchant Secret (server-side only)
 * @param {string} providedHash - The hash provided by PayHere in the notification
 * @returns {boolean} - True if hash is valid (notification is authentic)
 */
export function validateNotificationHash(
  merchantId,
  orderId,
  totalAmount,
  paymentId,
  merchantSecret,
  providedHash
) {
  if (!merchantId || !orderId || !totalAmount || !paymentId || !merchantSecret || !providedHash) {
    throw new Error('Missing required parameters for hash validation');
  }

  // PayHere requires the amount as an integer (no decimals)
  const amount = Math.round(totalAmount);
  
  // Notification hash format: md5(merchant_id + order_id + total_amount + payment_id + merchant_secret)
  const hashInput = `${merchantId}${orderId}${amount}${paymentId}${merchantSecret}`;
  
  const calculatedHash = md5Hash(hashInput);
  
  // Use constant-time comparison to prevent timing attacks
  return constantTimeCompare(calculatedHash, providedHash.toLowerCase());
}

/**
 * Constant-time string comparison to prevent timing attacks
 * 
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - True if strings are equal
 */
function constantTimeCompare(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate a unique order ID for temporary/mock orders
 * 
 * Format: ORD-YYYYMMDD-RANDOM
 * Example: ORD-20261005-ABC123
 * 
 * This is suitable for development/testing. When you implement a database,
 * replace this with database-generated IDs.
 * 
 * @returns {string} - Unique order ID
 */
export function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const date = `${year}${month}${day}`;
  
  // Generate random 6-character alphanumeric string
  const random = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
  
  return `ORD-${date}-${random}`;
}

/**
 * Validate checkout data
 * Ensures all required fields are present and valid
 * 
 * @param {Object} checkoutData - Checkout form data
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export function validateCheckoutData(checkoutData) {
  const errors = {};

  // Customer information validation
  if (!checkoutData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!checkoutData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!checkoutData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.email)) {
    errors.email = 'Invalid email address';
  }
  if (!checkoutData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  }
  if (!checkoutData.address?.trim()) {
    errors.address = 'Address is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculate order total from cart items
 * 
 * This should ONLY be called on the server.
 * Server must recalculate to prevent client-side manipulation.
 * 
 * For now, uses mock prices. When you implement a database,
 * this should fetch prices from the database.
 * 
 * @param {Array} cartItems - Array of cart items with { id, quantity, price }
 * @param {number} deliveryFee - Fixed delivery fee in LKR
 * @param {number} taxRate - Tax rate (0-1, e.g., 0.1 for 10%)
 * @returns {Object} - { subtotal, tax, total, currency }
 */
export function calculateOrderTotal(cartItems, deliveryFee = 350, taxRate = 0.1) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  const subtotal = cartItems.reduce((sum, item) => {
    if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
    }
    return sum + item.price * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax + deliveryFee;

  return {
    subtotal: Math.round(subtotal),
    tax,
    deliveryFee,
    total: Math.round(total),
    currency: 'LKR',
  };
}

/**
 * Format payment status for display
 * 
 * PayHere status values:
 * - 'completed' or '2': Payment successful
 * - 'failed' or '0': Payment failed
 * - 'pending' or '1': Payment pending
 * - 'cancelled': Payment cancelled by user
 * 
 * @param {string|number} status - PayHere status value
 * @returns {Object} - { status, displayText, color }
 */
export function formatPaymentStatus(status) {
  const statusMap = {
    '2': { status: 'completed', displayText: 'Payment Successful', color: '#4CAF50' },
    'completed': { status: 'completed', displayText: 'Payment Successful', color: '#4CAF50' },
    '0': { status: 'failed', displayText: 'Payment Failed', color: '#F44336' },
    'failed': { status: 'failed', displayText: 'Payment Failed', color: '#F44336' },
    '1': { status: 'pending', displayText: 'Payment Pending', color: '#FF9800' },
    'pending': { status: 'pending', displayText: 'Payment Pending', color: '#FF9800' },
    'cancelled': { status: 'cancelled', displayText: 'Payment Cancelled', color: '#9E9E9E' },
  };

  return statusMap[status] || {
    status: 'unknown',
    displayText: 'Unknown Status',
    color: '#9E9E9E',
  };
}

/**
 * Create a temporary in-memory order storage
 * 
 * NOTE: This is temporary/mock storage for development.
 * When you implement a database, this should be replaced with:
 * - database INSERT statement
 * - actual order persistence
 * 
 * @type {Map}
 */
const tempOrders = new Map();

/**
 * Store temporary order data
 * 
 * @param {string} orderId - Order ID
 * @param {Object} orderData - Order data to store
 */
export function storeTemporaryOrder(orderId, orderData) {
  tempOrders.set(orderId, {
    ...orderData,
    createdAt: new Date().toISOString(),
    status: 'pending',
  });
}

/**
 * Retrieve temporary order data
 * 
 * @param {string} orderId - Order ID
 * @returns {Object|null} - Order data or null if not found
 */
export function getTemporaryOrder(orderId) {
  return tempOrders.get(orderId) || null;
}

/**
 * Update temporary order status
 * 
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {Object} additionalData - Any additional data to update
 */
export function updateTemporaryOrderStatus(orderId, status, additionalData = {}) {
  const order = tempOrders.get(orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  tempOrders.set(orderId, {
    ...order,
    status,
    ...additionalData,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Get all temporary orders (for debugging/monitoring)
 * 
 * @returns {Array} - Array of all stored orders
 */
export function getAllTemporaryOrders() {
  return Array.from(tempOrders.values());
}

/**
 * Clear all temporary orders (for testing)
 */
export function clearTemporaryOrders() {
  tempOrders.clear();
}
