import type { CartItem } from './cart'

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  landmark?: string;
}

export type PaymentMethod = 'momo' | 'cod';
export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunding' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  logistics?: {
    company: string;
    trackingNumber: string;
    shippedAt: string;
    estimatedDelivery?: string;
  };
}
