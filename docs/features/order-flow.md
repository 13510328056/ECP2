# 订单处理流程

## 订单状态

订单采用**状态机模型**，支持以下状态流转：

```typescript
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
```

## 状态流转图

```
                        ┌──────────────────┐
                        │   等待支付         │
                        │ (pending_payment) │
                        └────────┬─────────┘
                              │
                          支付成功
                              │
                              ▼
                        ┌──────────────────┐
                        │   已支付           │
                        │ (paid)            │
                        └────────┬─────────┘
                              │
                          商家确认
                              │
                              ▼
                        ┌──────────────────┐
                        │   处理中           │
                        │ (processing)      │
                        └────────┬─────────┘
                              │
                          发货
                              │
                              ▼
                        ┌──────────────────┐
                        │   已发货           │
                        │ (shipped)         │
                        └────────┬─────────┘
                              │
                          客户签收
                              │
                              ▼
                        ┌──────────────────┐
                        │   已送达           │
                        │ (delivered)       │
                        └────────┬─────────┘
                              │
                          完成
                              │
                              ▼
                        ┌──────────────────┐
                        │   已完成           │
                        │ (completed)       │
                        └──────────────────┘

           取消流程:
           pending_payment ───→ cancelled
           paid ───→ refunding ───→ refunded
```

## 订单数据模型

```typescript
// src/types/order.ts
export interface ShippingInfo {
  fullName: string
  phone: string
  email?: string
  addressLine1: string
  addressLine2?: string
  city: string
  region: string
  landmark?: string
}

export type PaymentMethod = 'momo' | 'cod'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  orderNumber: string        // 格式: GH + 日期 + 9位随机数
  items: CartItem[]
  shippingInfo: ShippingInfo
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  subtotal: number
  shippingCost: number
  total: number
  status: OrderStatus
  notes?: string
  createdAt: string
  updatedAt: string
  logistics?: {
    company: string
    trackingNumber: string
    shippedAt: string
    estimatedDelivery?: string
  }
}
```

## 订单号生成规则

订单号格式：`GH + YYYYMMDD + 9位随机数`

```typescript
// src/utils/format.ts
export function generateOrderNumber(): string {
  const now = new Date()
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  const randomPart = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, '0')
  return `GH${datePart}${randomPart}`
}
```

**示例：** `GH202505300123456789`

## 订单管理功能（前台）

### 订单确认页

**入口：** 支付成功后跳转 `/order-confirmation`

**展示信息：**
- 成功状态提示（绿色对勾动画）
- 订单号
- 支付金额
- 支付方式（MOMO/COD）
- 配送地址
- 预计送达时间
- 客服帮助信息（WhatsApp/电话）

**覆盖状态：** ✅ 已完成

**对应页面：** `OrderConfirmation.vue`

### 订单详情页

**入口：** 账户 → 订单 → `/order/:id`

**展示信息：**
- 订单状态时间线
- 商品列表（含图片、数量、价格）
- 收货地址
- 支付信息
- 物流信息（公司、单号、预计送达）
- 订单备注

**状态时间线：**
```
已提交 → 已支付 → 配货中 → 已发货 → 已送达
```

每个步骤显示：标签、描述、完成状态、时间戳

**覆盖状态：** ✅ 已完成

**对应页面：** `OrderDetail.vue`

## 订单管理功能（后台）

| 功能 | 说明 | 状态 |
|------|------|------|
| 订单列表 | 按状态筛选、关键词搜索、日期范围筛选 | ✅ 已完成 |
| 订单详情 | 完整订单信息查看 | ✅ 已完成 |
| 状态操作 | 确认订单、标记发货、完成订单 | ✅ 已完成 |
| 物流录入 | 填写物流公司、运单号、预计送达 | ✅ 已完成 |
| 状态彩色标签 | 7种状态不同颜色标识 | ✅ 已完成 |

**对应页面：** `AdminOrders.vue`, `AdminOrderDetail.vue`

## 覆盖状态

| 功能点 | 状态 |
|--------|------|
| 订单号生成 | ✅ 已完成 |
| 订单确认页面 | ✅ 已完成 |
| 订单详情时间线 | ✅ 已完成 |
| 购物车清空（下单后） | ✅ 已完成 |
| 管理员订单列表 | ✅ 已完成 |
| 管理员订单详情 | ✅ 已完成 |
| 物流信息录入 | ✅ 已完成 |
| 状态操作流转 | ✅ 已完成 |
| 真实物流追踪 | ❌ 待开发 |
| 退款流程 | ❌ 待开发 |
