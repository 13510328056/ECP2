# 买家购物流程

## 流程概览

```
浏览商品 → 商品详情 → 加入购物车 → 结算 → 支付 → 订单确认
```

## 步骤详解

### 第一步：浏览商品

**入口：** 首页 (`/`) 或 商品列表页 (`/products`)

**用户操作：**
- 首页轮播图展示促销信息
- 分类网格导航（矿产机械、劳保用品、工业工具、备件配件）
- 畅销产品推荐（按评分排序 Top 8）
- 搜索框支持输入关键词搜索
- 底部导航栏快速切换到各页面

**覆盖状态：** ✅ 已完成

**对应页面：** `Home.vue`, `Products.vue`

**技术实现：**
- `HeroCarousel.vue` — 首页轮播图
- `CategoryGrid.vue` — 分类网格导航
- `ProductCard.vue` — 商品卡片组件
- `ProductFilter.vue` — 商品筛选/排序组件

---

### 第二步：查看商品详情

**入口：** 点击商品卡片进入 `/product/:id`

**用户操作：**
- 查看商品多图展示（点击可放大）
- 查看规格参数（双语）
- 查看批量价格阶梯
- 查看应用场景描述
- 查看用户评价和评分
- 选择购买数量
- 了解配送信息（重量、尺寸）

**覆盖状态：** ✅ 已完成

**对应页面：** `ProductDetail.vue`

**界面元素：**
- 图片轮播 + 放大模态框
- 规格标签切换（描述/规格/评价）
- 批量折扣表格
- 起订量显示
- 评价列表

---

### 第三步：加入购物车

**入口：** 商品详情页「加入购物车」按钮

**用户操作：**
- 选择数量（受起订量和库存限制）
- 点击「加入购物车」（触发 Toast 提示）
- 或点击「立即购买」（直接跳转结算）
- 在购物车页可管理商品

**覆盖状态：** ✅ 已完成

**对应组件：** `QuantitySelector.vue`, `CartItemRow.vue`

**技术实现：**
```typescript
// stores/cart.ts
function addItem(product: Product, quantity: number = 1, sku?: string) {
  const existing = items.value.find(i => i.productId === product.id && i.selectedSku === sku)
  if (existing) {
    existing.quantity += quantity
  } else {
    items.value.push({ productId: product.id, product, quantity, selectedSku: sku })
  }
}
```

---

### 第四步：购物车管理

**入口：** 底部导航栏「购物车」→ `/cart`

**用户操作：**
- 查看购物车商品列表
- 勾选/取消勾选商品（支持全选）
- 调整商品数量
- 删除商品
- 输入优惠码（模拟功能）
- 查看选中商品总价
- 点击「结算」按钮

**覆盖状态：** ✅ 已完成

**对应页面：** `Cart.vue`

**购物车数据模型：**
```typescript
interface CartItem {
  productId: string
  product: Product
  quantity: number
  selectedBulkPrice?: BulkPrice
  selectedSku?: string
}

interface Cart {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  total: number
}
```

---

### 第五步：结算

**入口：** 购物车页「结算」→ `/checkout`

**用户操作：**
- 填写/选择收货地址（姓名、电话、地址、城市、大区）
- 选择支付方式（MOMO / 货到付款）
- 核对订单商品
- 查看运费
- 提交订单

**表单验证规则：**
- 姓名：必填
- 电话：必填，需为加纳手机号格式
- 邮箱：选填，需为有效邮箱格式
- 地址：必填
- 城市：必选

**覆盖状态：** ✅ 已完成

**对应页面：** `Checkout.vue`

---

### 第六步：支付

**入口：** 提交订单后跳转 `/payment`

**用户操作（MOMO 支付模拟）：**
- 查看支付金额
- 输入 4 位 PIN 码
- 数字键盘输入体验
- 点击退格删除
- 自动提交（输入完 4 位后）

**支付状态流转：**
```
开始 → 输入PIN → 处理中(2.5秒) → 支付成功/失败
```

**覆盖状态：** ✅ 已完成

**对应页面：** `Payment.vue`

---

### 第七步：订单确认

**入口：** 支付成功后跳转 `/order-confirmation`

**用户操作：**
- 查看成功提示和订单号
- 查看支付金额和方式
- 查看配送地址和预计送达时间
- 点击「查看详情」进入订单详情页
- 点击「继续购物」返回首页

**覆盖状态：** ✅ 已完成

**对应页面：** `OrderConfirmation.vue`, `OrderDetail.vue`

**订单状态时间线：**
```
已提交 → 已支付 → 配货中 → 已发货 → 已送达
```

## 完整数据流

```
用户操作             前端状态                   数据持久化
───────             ────────                  ────────
浏览商品      →  products (静态数据)            data/products.ts
加入购物车    →  cart Store                    Pinia (persisted)
填写地址      →  checkout form                 Session (临时)
提交订单      →  generateOrderNumber()          Session Storage
支付          →  PIN输入模拟                    Session Storage
确认          →  清空购物车 + 跳转               Session Storage
```

## 系统边界

| 步骤 | 当前实现 | 未来计划 |
|------|---------|---------|
| 商品数据 | Mock 数据 (`data/products.ts`) | 后端 API 接口对接 |
| 用户登录 | Store 本地状态模拟 | JWT 认证 |
| 支付 | 前端模拟 PIN 输入 | 真实 MOMO API 对接 |
| 订单持久化 | Session Storage | 后端数据库 |
| 物流追踪 | Mock 数据 | 真实物流 API 集成 |
