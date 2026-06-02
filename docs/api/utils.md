# 工具函数

## 格式化函数

**文件：** `src/utils/format.ts`

### formatPrice

格式化金额为加纳塞地（GHS）价格字符串。

```typescript
/**
 * @param amount - 金额数值
 * @returns 格式化后的价格字符串
 * @example formatPrice(1500.5) // returns "₵1,500.50"
 */
export function formatPrice(amount: number): string {
  return `₵${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
```

**示例：**

| 输入 | 输出 |
|------|------|
| `1500.5` | `₵1,500.50` |
| `0` | `₵0.00` |
| `4850` | `₵4,850.00` |
| `55` | `₵55.00` |

---

### formatDate

将 ISO 日期字符串格式化为人类可读日期。

```typescript
/**
 * @param date - ISO 日期字符串
 * @returns 格式化后的日期字符串
 * @example formatDate('2025-06-15T10:30:00Z') // returns "Jun 15, 2025"
 */
export function formatDate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
```

**示例：**

| 输入 | 输出 |
|------|------|
| `'2025-06-15T10:30:00Z'` | `Jun 15, 2025` |
| `'2025-05-01T10:30:00Z'` | `May 1, 2025` |
| `'invalid-date'` | `invalid-date`（回退） |

---

### generateOrderNumber

生成唯一订单号。

```typescript
/**
 * @returns 订单号（GH + 8位日期 + 9位随机数，共20位）
 * @example generateOrderNumber() // returns "GH202505301234567890"
 */
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

**格式：** `GH` + `YYYYMMDD` + `9位随机数`

**示例：** `GH202505301234567890`

---

### getStockStatusText

获取库存状态的本地化文本和颜色。

```typescript
/**
 * @param status - 库存状态
 * @returns 包含文本和颜色的对象
 */
export function getStockStatusText(
  status: StockStatus
): { text: string; color: string } {
  const map: Record<StockStatus, { text: string; color: string }> = {
    in_stock: { text: 'In Stock', color: '#22c55e' },
    low_stock: { text: 'Low Stock', color: '#f59e0b' },
    out_of_stock: { text: 'Out of Stock', color: '#ef4444' },
  }
  return map[status]
}
```

| 状态 | 文本 | 颜色 |
|------|------|------|
| `in_stock` | In Stock | `#22c55e` (绿) |
| `low_stock` | Low Stock | `#f59e0b` (橙) |
| `out_of_stock` | Out of Stock | `#ef4444` (红) |

---

## 验证函数

**文件：** `src/utils/validation.ts`

### isValidPhone

验证加纳手机号格式。

```typescript
/**
 * 支持格式：
 * - +233 XX XXX XXXX
 * - 0XX XXX XXXX
 * - 0XXXXXXXXX
 *
 * @param phone - 手机号字符串
 * @returns 是否有效
 * @example isValidPhone('+233 24 123 4567') // true
 * @example isValidPhone('0241234567') // true
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  const ghanaPhoneRegex = /^(\+233|0)[234]\d{8}$/
  return ghanaPhoneRegex.test(cleaned)
}
```

**有效格式：**

| 输入 | 结果 |
|------|------|
| `+233 24 123 4567` | ✅ 有效 |
| `0241234567` | ✅ 有效 |
| `0556789012` | ✅ 有效 |
| `+233 50 987 6543` | ✅ 有效 |
| `12345` | ❌ 无效 |
| `''` | ❌ 无效 |

**规则说明：**
- 国家代码：`+233`（加纳）或 `0`
- 网络前缀：`2`, `3`, `4`, `5`
- 后跟 8 位数字
- 总共 12 位数字（含国家代码）或 10 位数字（以 0 开头）

---

### isValidEmail

验证邮箱格式。

```typescript
/**
 * @param email - 邮箱字符串
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

**示例：**

| 输入 | 结果 |
|------|------|
| `user@example.com` | ✅ 有效 |
| `kwame.asante@email.com` | ✅ 有效 |
| `invalid-email` | ❌ 无效 |
| `@domain.com` | ❌ 无效 |

---

### isRequired

检查字符串是否非空。

```typescript
/**
 * @param value - 字符串
 * @returns 是否非空
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}
```

| 输入 | 结果 |
|------|------|
| `'hello'` | ✅ 非空 |
| `'  '` | ❌ 空 |
| `''` | ❌ 空 |

---

## 组合式函数

**文件：** `src/composables/useToast.ts`

### useToast

全局 Toast 消息提示。

```typescript
export function useToast() {
  const toast = reactive({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  })
  let timeout: number | null = null

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    toast.message = message
    toast.type = type
    toast.show = true
    if (timeout) clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      toast.show = false
    }, 2500)
  }

  return { toast, showToast }
}
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `message` | string | — | 提示消息内容 |
| `type` | `'success'` / `'error'` / `'info'` | `'success'` | 提示类型 |
| 自动隐藏 | — | 2500ms | 2.5秒后自动消失 |

**使用示例：**

```typescript
const { showToast } = useToast()
showToast('操作成功！', 'success')
showToast('出错了！', 'error')
showToast('提示信息', 'info')
```
