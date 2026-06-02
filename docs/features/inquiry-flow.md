# 询盘转化流程

## 流程概览

```
填写表单 → 主题选择 → 表单验证 → 提交成功 → 管理员处理 → 客户回复
```

## 询盘主题

| 主题 | 英文标识 | 适用场景 |
|------|---------|---------|
| 一般咨询 | general | 常规问题和信息咨询 |
| 产品咨询 | product | 对特定产品的咨询 |
| 批量询价 | bulk_order | 批量采购和批发询价 |
| 定制需求 | custom | 定制产品和服务需求 |
| 其他 | other | 其他类型的咨询 |

## 步骤详解

### 第一步：填写询盘表单

**入口：** 点击「联系我们」→ `/contact`

**表单字段：**

| 字段 | 类型 | 验证规则 | 说明 |
|------|------|---------|------|
| 姓名 | 文本 | 必填 | 联系人姓名 |
| 邮箱 | 文本 | 必填 + 邮箱格式 | 联系邮箱 |
| 电话 | 文本 | 必填 + 加纳手机格式 | 默认前缀 `+233 ` |
| 主题 | 下拉选择 | 必选 | 5种主题选项 |
| 产品型号 | 文本 | 选填 | 感兴趣的产品 |
| 需求描述 | 多行文本 | 必填 | 需求详细描述 |

**覆盖状态：** ✅ 已完成

**对应页面：** `Contact.vue`

---

### 第二步：表单验证

**验证规则：**

```typescript
// src/utils/validation.ts

// 加纳手机号验证（支持 +233/0 开头）
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  const ghanaPhoneRegex = /^(\+233|0)[234]\d{8}$/
  return ghanaPhoneRegex.test(cleaned)
}

// 邮箱格式验证
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 必填字段验证
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}
```

**覆盖状态：** ✅ 已完成

---

### 第三步：提交与存储

**提交逻辑：**

```typescript
function submitForm() {
  if (!validateForm()) return

  submitting.value = true

  // 将询盘存储到 localStorage（MVP 实现）
  const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]')
  inquiries.push({
    id: Date.now(),
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    subject: form.value.subject,
    productInterest: form.value.productInterest,
    message: form.value.message,
    status: 'new',
    createdAt: new Date().toISOString()
  })
  localStorage.setItem('inquiries', JSON.stringify(inquiries))

  // 模拟提交延迟
  setTimeout(() => {
    submitting.value = false
    submitted.value = true
    showToast('询盘提交成功！我们将在24小时内联系您。', 'success')
  }, 1500)
}
```

**覆盖状态：** ✅ 已完成

---

### 第四步：管理员处理

**入口：** 后台管理 → 询盘管理 (`/admin/inquiries`)

**管理员操作：**
1. 查看询盘列表（按状态筛选、搜索）
2. 进入询盘详情
3. 查看客户信息和需求描述
4. 更新询盘状态
5. 回复询盘（选择回复方式）
6. 关闭处理完成的询盘

**覆盖状态：** ✅ 已完成

**对应页面：** `AdminInquiries.vue`, `AdminInquiryDetail.vue`

---

### 第五步：多渠道回复

管理员可以通过以下方式回复客户：

| 方式 | 图标 | 说明 |
|------|------|------|
| WhatsApp | 💬 | 通过 WhatsApp 即时沟通 |
| 邮件 | 📧 | 发送电子邮件回复 |
| 电话 | 📞 | 电话联系客户 |

**覆盖状态：** ✅ 已完成

---

## 询盘状态流转

```
                        ┌─────────┐
                        │   新建   │  (new)
                        └────┬────┘
                             │ 客服查看并联系
                             ▼
                        ┌─────────┐
                        │  处理中  │  (contacted)
                        └────┬────┘
                           /     \
                    已报价/       \无需报价
                         ▼         ▼
                  ┌─────────┐  ┌─────────┐
                  │  已报价  │  │  已关闭  │
                  │(resolved)│  │ (closed) │
                  └────┬────┘  └─────────┘
                       │ 客户确认
                       ▼
                  ┌─────────┐
                  │  已关闭  │
                  │ (closed) │
                  └─────────┘
```

## 数据模型

```typescript
// src/types/inquiry.ts
export type InquirySubject = 'general' | 'product' | 'bulk_order' | 'custom' | 'other'

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: InquirySubject
  productInterest?: string
  message: string
  status: 'new' | 'contacted' | 'resolved' | 'closed'
  createdAt: string
}
```

## 前台客服入口

| 入口 | 位置 | 说明 |
|------|------|------|
| 联系我们 | 底部导航栏 | 完整询盘表单 |
| WhatsApp 浮动按钮 | 所有页面右下角 | 即时通讯（管理后台隐藏） |
| 商品详情页 | 商品详情页 | 可联系咨询商品信息 |

## 覆盖状态

| 功能点 | 状态 |
|--------|------|
| 询盘表单（主题选择、字段验证） | ✅ 已完成 |
| 表单提交成功提示 | ✅ 已完成 |
| 询盘存储到 localStorage | ✅ 已完成 |
| 24小时联系承诺展示 | ✅ 已完成 |
| WhatsApp 浮动按钮 | ✅ 已完成 |
| 管理员询盘列表 | ✅ 已完成 |
| 管理员询盘详情回复 | ✅ 已完成 |
| 询盘状态管理 | ✅ 已完成 |
| 附件上传 | ⚠️ 预留字段 |
| 邮件自动通知 | ❌ 待开发 |
