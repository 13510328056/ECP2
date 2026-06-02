# 测试指南

## 测试框架

本项目使用 **Vitest** 作为测试框架，配合 `@vue/test-utils` 进行 Vue 组件测试。

### 当前配置

```json
{
  "devDependencies": {
    "@vue/test-utils": "^2.4.10",
    "happy-dom": "^20.9.0",
    "jsdom": "^27.0.1",
    "vitest": "^4.1.7"
  }
}
```

## 运行测试

```bash
# 运行所有测试
npx vitest

# 运行测试并显示覆盖率
npx vitest --coverage

# 监听模式
npx vitest --watch
```

## 测试目录结构

测试文件位于 `src/__tests__/` 目录：

```
src/__tests__/
├── components/        # 组件测试
├── stores/           # Store 测试
├── utils/            # 工具函数测试
└── ...
```

## 测试范围

### 单元测试

- **工具函数测试：** 验证 `src/utils/` 中的纯函数
  - `formatPrice` — 价格格式化
  - `formatDate` — 日期格式化
  - `generateOrderNumber` — 订单号生成
  - `getStockStatusText` — 库存状态文本
  - `isValidPhone` — 手机号验证
  - `isValidEmail` — 邮箱验证
  - `isRequired` — 必填项验证

- **Store 测试：** 验证 Pinia store 状态变更
  - `useCartStore` — 购物车增删改查
  - `useUserStore` — 用户登录/注册/注销
  - `useAdminStore` — 管理员登录/注销
  - `useLanguageStore` — 语言切换

- **组件测试：** 验证组件渲染和交互
  - UI 组件（Badge, EmptyState, LoadingSkeleton, Modal, ProductCard, QuantitySelector）
  - 布局组件（AppHeader, AppFooter, BottomNav）

## 测试示例

### 工具函数测试

```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice, isValidPhone, generateOrderNumber } from '@/utils/format'

describe('formatPrice', () => {
  it('should format price with GHS currency symbol', () => {
    expect(formatPrice(1500.5)).toBe('₵1,500.50')
  })

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('₵0.00')
  })
})

describe('isValidPhone', () => {
  it('should validate Ghana phone numbers', () => {
    expect(isValidPhone('+233 24 123 4567')).toBe(true)
    expect(isValidPhone('0241234567')).toBe(true)
    expect(isValidPhone('+233 50 987 6543')).toBe(true)
  })

  it('should reject invalid phone numbers', () => {
    expect(isValidPhone('12345')).toBe(false)
    expect(isValidPhone('')).toBe(false)
  })
})

describe('generateOrderNumber', () => {
  it('should generate order number starting with GH', () => {
    const number = generateOrderNumber()
    expect(number.startsWith('GH')).toBe(true)
    expect(number.length).toBe(20)
  })
})
```

### Store 测试

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { products } from '@/data/products'

describe('CartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add item to cart', () => {
    const cart = useCartStore()
    cart.addItem(products[0], 2)
    expect(cart.items.length).toBe(1)
    expect(cart.totalItems).toBe(2)
  })

  it('should increase quantity for existing item', () => {
    const cart = useCartStore()
    cart.addItem(products[0], 1)
    cart.addItem(products[0], 2)
    expect(cart.items.length).toBe(1)
    expect(cart.totalItems).toBe(3)
  })

  it('should remove item from cart', () => {
    const cart = useCartStore()
    cart.addItem(products[0], 1)
    cart.removeItem(products[0].id)
    expect(cart.items.length).toBe(0)
  })
})
```

## 端到端测试

> ⬜ E2E 测试尚未配置。建议集成 [Playwright](https://playwright.dev/) 或 [Cypress](https://www.cypress.io/) 进行完整的用户流程测试。

### 建议覆盖的用户流程

1. **买家完整购物流程：** 浏览商品 → 查看详情 → 加入购物车 → 结算 → 支付 → 查看订单
2. **询盘流程：** 填写询盘表单 → 提交 → 管理员查看 → 回复处理
3. **后台管理流程：** 管理员登录 → 商品管理 → 订单处理 → 询盘回复
4. **多语言切换：** 中英文切换 → 验证所有页面内容切换
