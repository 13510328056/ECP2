# 数据模型

## Product（商品）

**文件：** `src/types/product.ts`

```typescript
export interface BulkPrice {
  quantity: number      // 批量数量
  discount: number      // 折扣百分比（如 10 表示 10% 折扣）
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface Product {
  id: string                    // 商品唯一标识
  name: string                  // 英文名称
  nameZh: string                // 中文名称
  description: string           // 英文描述
  descriptionZh: string         // 中文描述
  price: number                 // 价格（GHS）
  currency: 'GHS'               // 货币单位
  category: string              // 英文分类
  categoryZh: string            // 中文分类
  subcategory?: string          // 英文子分类
  brand?: string                // 品牌
  images: string[]              // 图片URL数组
  specifications: Record<string, string>     // 英文规格键值对
  specificationsZh: Record<string, string>   // 中文规格键值对
  stock: StockStatus            // 库存状态
  stockCount: number            // 库存数量
  rating: number                // 评分（1-5）
  reviewCount: number           // 评价数
  minOrderQuantity: number      // 最低起订量
  bulkPricing: BulkPrice[]      // 批量价格阶梯
  applicationScenarios: string[] // 应用场景
  shippingInfo: {
    weight: string
    dimensions?: string
  }
  createdAt: string             // 创建时间 ISO
  updatedAt: string             // 更新时间 ISO
}
```

## CartItem & Cart（购物车）

**文件：** `src/types/cart.ts`

```typescript
export interface CartItem {
  productId: string          // 商品ID
  product: Product           // 商品完整对象
  quantity: number           // 数量
  selectedBulkPrice?: BulkPrice  // 选中的批量价格
  selectedSku?: string       // 选中的SKU
}

export interface Cart {
  items: CartItem[]          // 购物车项列表
  subtotal: number           // 小计
  shippingCost: number       // 运费
  total: number              // 总计
}
```

## Order（订单）

**文件：** `src/types/order.ts`

```typescript
export interface ShippingInfo {
  fullName: string           // 收件人姓名
  phone: string              // 联系电话
  email?: string             // 电子邮箱
  addressLine1: string       // 地址行1
  addressLine2?: string      // 地址行2
  city: string               // 城市
  region: string             // 大区
  landmark?: string          // 地标
}

export type PaymentMethod = 'momo' | 'cod'
export type OrderStatus =
  | 'pending_payment'  // 待付款
  | 'paid'             // 已支付
  | 'processing'       // 处理中
  | 'shipped'          // 已发货
  | 'delivered'        // 已送达
  | 'completed'        // 已完成
  | 'cancelled'        // 已取消
  | 'refunding'        // 退款中
  | 'refunded'         // 已退款

export interface Order {
  id: string
  orderNumber: string          // 订单号（GH + 日期 + 随机数）
  items: CartItem[]
  shippingInfo: ShippingInfo
  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  shippingCost: number
  total: number
  status: OrderStatus
  notes?: string
  createdAt: string
  updatedAt: string
  logistics?: {
    company: string            // 物流公司
    trackingNumber: string     // 运单号
    shippedAt: string          // 发货时间
    estimatedDelivery?: string // 预计送达
  }
}
```

## Inquiry（询盘）

**文件：** `src/types/inquiry.ts`

```typescript
export type InquirySubject =
  | 'general'       // 一般咨询
  | 'product'       // 产品咨询
  | 'bulk_order'    // 批量询价
  | 'custom'        // 定制需求
  | 'other'         // 其他

export interface Inquiry {
  id: string
  name: string                  // 联系人姓名
  email: string                 // 联系邮箱
  phone: string                 // 联系电话
  subject: InquirySubject       // 询盘主题
  productInterest?: string      // 感兴趣的产品
  message: string               // 需求描述
  status: 'new' | 'contacted' | 'resolved' | 'closed'
  createdAt: string             // 创建时间
}
```

## Admin（管理员）

**文件：** `src/types/admin.ts`

```typescript
export type AdminRole =
  | 'super_admin'         // 超级管理员
  | 'product_manager'     // 商品管理员
  | 'marketing_manager'   // 营销经理
  | 'customer_service'    // 客服
  | 'warehouse'           // 仓储
  | 'finance'             // 财务

export interface AdminUser {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: AdminRole
  status: 'active' | 'inactive' | 'locked'
  lastLoginAt?: string
  createdAt: string
}
```

## Category（分类）

**文件：** `src/data/categories.ts`

```typescript
export interface Category {
  id: string
  name: string          // 英文名称
  nameZh: string        // 中文名称
  icon: string           // 图标标识
  children?: Category[]  // 子分类（支持多级嵌套）
}
```

## 类型统一导出

**文件：** `src/types/index.ts`

```typescript
export type { BulkPrice, StockStatus, Product } from './product'
export type { CartItem, Cart } from './cart'
export type { ShippingInfo, PaymentMethod, OrderStatus, Order } from './order'
export type { InquirySubject, Inquiry } from './inquiry'
export type { AdminRole, AdminUser } from './admin'
```
