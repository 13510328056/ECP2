# 支付流程

## 支付方式

| 方式 | 标识 | 说明 | 状态 |
|------|------|------|------|
| MTN MOMO | momo | 移动货币支付（模拟） | ✅ 已完成 |
| 货到付款 | cod | 现金支付 | ✅ 已完成 |

## MOMO 支付体验流程

### 步骤一：选择支付方式

**位置：** 结算页 (`/checkout`)

用户在结算时选择支付方式：
- **MTN MOMO：** 输入 MOMO 钱包手机号
- **货到付款：** 直接提交订单

**覆盖状态：** ✅ 已完成

---

### 步骤二：跳转支付页

**位置：** `/payment`

**数据传递：**
```typescript
// 提交订单时将数据存入 Session Storage
sessionStorage.setItem('pendingOrder', JSON.stringify(orderData))
```

**支付页展示：**
- MTN MOMO 品牌 Logo
- 支付金额（大写醒目显示）
- "请输入4位PIN码完成支付" 提示

**覆盖状态：** ✅ 已完成

---

### 步骤三：输入 PIN 码

**交互设计：**
- 4 位数字 PIN 码输入点（圆点指示器）
- 自定义数字键盘（非系统键盘）
- 数字 0-9 按钮
- 退格删除按钮
- "忘记密码" 按钮

**自动提交逻辑：**
```typescript
function addPin(num: number) {
  if (pin.value.length >= 4) return
  pin.value += String(num)
  if (pin.value.length === 4) {
    processPayment()  // 自动触发支付处理
  }
}
```

**覆盖状态：** ✅ 已完成

---

### 步骤四：支付处理

```typescript
function processPayment() {
  showLoading.value = true

  // 模拟 2.5 秒支付处理延迟
  setTimeout(() => {
    showLoading.value = false
    showSuccess.value = true

    // 将订单移至已确认
    if (orderData.value) {
      sessionStorage.setItem('lastOrder', JSON.stringify(orderData.value))
      sessionStorage.removeItem('pendingOrder')
    }
  }, 2500)
}
```

**处理中界面：**
- 全屏加载遮罩
- 旋转加载动画（黄白配色）
- "正在处理您的支付..." 文字
- "请耐心等待，不要关闭页面" 提示

**覆盖状态：** ✅ 已完成

---

### 步骤五：支付成功

**成功界面：**
- 绿色对勾动画（带弹跳效果）
- "支付成功！" 主标题
- "您的订单已确认，我们将尽快为您安排发货" 副标题
- "查看订单" 按钮 → 跳转订单确认页
- "返回首页" 按钮 → 回到首页

**覆盖状态：** ✅ 已完成

---

## 支付状态流转

```
结算页提交
    │
    ▼
待支付 ───→ 支付处理中 ───→ 支付成功
(pending)    (2.5s模拟)     (paid)
    │
    ▼
支付失败
(failed - 暂未实现)
```

## 数据流

```typescript
// 结算提交 → 存储
sessionStorage.setItem('pendingOrder', JSON.stringify({
  orderNumber: generateOrderNumber(),
  items: cartStore.items,
  shippingInfo: shippingAddress,
  paymentMethod: 'momo',
  subtotal: cartStore.subtotal,
  shippingCost: shippingCost.value,
  total: total.value
}))

// 支付成功 → 转移
sessionStorage.setItem('lastOrder', JSON.stringify(orderData.value))
sessionStorage.removeItem('pendingOrder')

// 订单确认页 → 读取
const stored = sessionStorage.getItem('lastOrder')
```

## 覆盖状态

| 功能点 | 状态 |
|--------|------|
| MOMO 支付选项选择 | ✅ 已完成 |
| 货到付款选项 | ✅ 已完成 |
| 支付页金额展示 | ✅ 已完成 |
| 自定义数字键盘 | ✅ 已完成 |
| 4位PIN码输入 | ✅ 已完成 |
| 自动提交支付 | ✅ 已完成 |
| 支付处理中动画 | ✅ 已完成 |
| 支付成功动画 | ✅ 已完成 |
| 订单数据持久化（Session） | ✅ 已完成 |
| 支付失败处理 | ❌ 待开发 |
| 真实MOMO API对接 | ❌ 待开发 |
| 支付超时处理 | ❌ 待开发 |
| 交易记录查询 | ❌ 待开发 |
