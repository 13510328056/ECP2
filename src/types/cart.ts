import type { Product, BulkPrice } from './product'

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedBulkPrice?: BulkPrice;
  selectedSku?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}
