# Store API

## 概述

状态管理使用 **Pinia**（Vue 3 官方状态管理库），配合 `pinia-plugin-persistedstate` 实现状态持久化。

## Cart Store（购物车）

**文件：** `src/stores/cart.ts`

### 状态

```typescript
const items = ref<CartItem[]>([])  // 购物车商品列表
```

### 计算属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `totalItems` | `number` | 购物车商品总数量 |
| `subtotal` | `number` | 商品总价（未含运费） |
| `shippingCost` | `number` | 运费（满200GHS免运费） |
| `total` | `number` | 总计（商品总价 + 运费） |
| `selectedItems` | `CartItem[]` | 选中的商品列表 |
| `selectedCount` | `number` | 选中商品数量 |
| `selectedTotal` | `number` | 选中商品总价 |

### 方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `addItem(product, quantity?, sku?)` | Product, number, string | 添加商品到购物车 |
| `updateQuantity(productId, quantity)` | string, number | 更新商品数量 |
| `removeItem(productId)` | string | 从购物车移除商品 |
| `clearCart()` | — | 清空购物车 |

### 使用示例

```typescript
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

// 添加商品
cartStore.addItem(product, 2)

// 更新数量
cartStore.updateQuantity('prod-001', 5)

// 移除商品
cartStore.removeItem('prod-001')

// 获取总价
console.log(cartStore.total)
```

## User Store（用户）

**文件：** `src/stores/user.ts`

### 状态

```typescript
const isLoggedIn = ref(false)    // 是否已登录
const userName = ref('')         // 用户名
const userEmail = ref('')        // 用户邮箱
const userPhone = ref('')        // 用户手机号
```

### 方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `login(email, password)` | string, string | `boolean` | 用户登录（Mock验证） |
| `register(name, email, phone, password)` | string, string, string, string | `boolean` | 用户注册 |
| `logout()` | — | `void` | 用户退出登录 |

### 使用示例

```typescript
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 登录（Mock：任意邮箱 + 密码>=6位）
const success = userStore.login('user@example.com', 'password123')

// 注册
userStore.register('Kwame', 'kwame@example.com', '+233 24 123 4567', 'password123')

// 退出
userStore.logout()
```

## Admin Store（管理员）

**文件：** `src/stores/admin.ts`

### 状态

```typescript
const isAuthenticated = ref(false)  // 是否已认证
const adminName = ref('')           // 管理员姓名
const adminEmail = ref('')          // 管理员邮箱
```

### 计算属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `isLoggedIn` | `boolean` | 是否已登录 |

### 方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `login(email, password)` | string, string | `boolean` | 管理员登录 |
| `logout()` | — | `void` | 管理员退出登录 |

### 默认管理员

```typescript
// 仅在 email === 'admin@lisindustrial.gh' && password === 'admin123' 时登录成功
```

### 使用示例

```typescript
import { useAdminStore } from '@/stores'

const adminStore = useAdminStore()

// 登录
const success = adminStore.login('admin@lisindustrial.gh', 'admin123')

// 退出
adminStore.logout()
```

## Language Store（语言）

**文件：** `src/stores/language.ts`

### 类型

```typescript
export type SupportedLocale = 'zh' | 'en'
```

### 状态

```typescript
const locale = ref<SupportedLocale>('zh')  // 当前语言
```

### 方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `setLocale(lang)` | SupportedLocale | 设置语言 |
| `toggleLocale()` | — | 切换中英文 |

### 使用示例

```typescript
import { useLanguageStore } from '@/stores/language'

const langStore = useLanguageStore()

// 切换到英文
langStore.setLocale('en')

// 切换中英文
langStore.toggleLocale()

// 获取当前语言
console.log(langStore.locale)
```

## Store 统一导出

**文件：** `src/stores/index.ts`

```typescript
export { useLanguageStore } from './language'
export type { SupportedLocale } from './language'
export { useCartStore } from './cart'
export { useAdminStore } from './admin'
// useUserStore 在各组件中直接导入
```

## 持久化配置

本项目使用 `pinia-plugin-persistedstate` 进行状态持久化。各 Store 的持久化配置待完善，当前依赖浏览器 Session Storage 或 Local Storage 的实现分散在各视图组件中。
