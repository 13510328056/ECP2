export interface BulkPrice {
  quantity: number;
  discount: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  price: number;
  currency: 'GHS';
  category: string;
  categoryZh: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  specifications: Record<string, string>;
  specificationsZh: Record<string, string>;
  stock: StockStatus;
  stockCount: number;
  rating: number;
  reviewCount: number;
  minOrderQuantity: number;
  bulkPricing: BulkPrice[];
  applicationScenarios: string[];
  shippingInfo: { weight: string; dimensions?: string };
  createdAt: string;
  updatedAt: string;
}
