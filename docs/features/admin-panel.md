# 后台管理

## 概览

后台管理系统为内部运营人员提供完整的商品、订单、询盘和系统管理功能。

### 访问方式

**地址：** `/admin/login`

**默认管理员账号：**
| 字段 | 值 |
|------|-----|
| 邮箱 | admin@lisindustrial.gh |
| 密码 | admin123 |

### 管理角色

| 角色 | 英文标识 | 职责 |
|------|---------|------|
| 超级管理员 | super_admin | 系统全部功能管理 |
| 商品管理员 | product_manager | 商品上下架、分类管理 |
| 营销经理 | marketing_manager | 营销活动、内容管理 |
| 客服 | customer_service | 询盘回复、客户沟通 |
| 仓储 | warehouse | 库存管理、发货处理 |
| 财务 | finance | 订单对账、退款处理 |

## 模块总览

| 模块 | 路由 | 功能 |
|------|------|------|
| 数据看板 | `/admin/dashboard` | 销售统计、热门商品、最新订单 |
| 商品管理 | `/admin/products` | 商品增删改查、上下架、批量操作 |
| 商品编辑 | `/admin/products/create` | 创建新商品 |
| 商品编辑 | `/admin/products/:id/edit` | 编辑现有商品 |
| 分类管理 | `/admin/categories` | 分类树形管理、排序 |
| 订单管理 | `/admin/orders` | 订单列表、状态筛选、搜索 |
| 订单详情 | `/admin/orders/:id` | 订单处理、物流录入、状态操作 |
| 询盘管理 | `/admin/inquiries` | 询盘列表、状态筛选 |
| 询盘详情 | `/admin/inquiries/:id` | 询盘回复、状态更新 |
| 系统设置 | `/admin/settings` | 个人资料、密码修改、用户管理 |

## 管理员登录流程

```
访问 /admin/login
    │
    ├── 输入邮箱 + 密码
    ├── 输入图形验证码（4位数字）
    │
    ▼
验证码校验 → 账号密码校验
    │
    ├── 成功 → 跳转 /admin/dashboard
    │
    └── 失败 → 刷新验证码 + 错误提示
```

## 数据看板

**路由：** `/admin/dashboard`

**统计卡片（4个）：**
- 今日订单数
- 本月销售额
- 活跃商品数
- 待处理询盘数

**销售趋势图：**
- 7日销售趋势（柱状图/CSS实现）
- 每日销售数据可视化

**最新订单：**
- 最近4笔订单概览
- 订单号、客户名、金额、状态

## 导航布局

后台采用独立布局 (`AdminLayout.vue`)：
- 顶部：Logo + 标题 + 管理员信息
- 中间：内容区域
- 底部：导航标签（仪表盘、商品、订单、询盘、设置）

## 路由守卫

```typescript
// src/router/index.ts
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAdmin) {
    const adminStore = useAdminStore()
    if (!adminStore.isAuthenticated) {
      next('/admin/login')
      return
    }
  }
  next()
})
```

所有后台管理路由（除 `/admin/login`）均受 `requiresAdmin` 元字段保护，未登录时自动重定向到登录页。

## 覆盖状态

| 功能点 | 状态 |
|--------|------|
| 管理员登录（验证码） | ✅ 已完成 |
| 路由守卫 | ✅ 已完成 |
| 数据看板统计卡片 | ✅ 已完成 |
| 销售趋势图表 | ✅ 已完成 |
| 最新订单列表 | ✅ 已完成 |
| 后台导航布局 | ✅ 已完成 |
| 商品管理 CRUD | ✅ 已完成 |
| 分类管理 | ✅ 已完成 |
| 订单管理 | ✅ 已完成 |
| 询盘管理 | ✅ 已完成 |
| 系统设置 | ✅ 已完成 |
| 用户管理 | ✅ 已完成 |
| 权限细分 | ⚠️ 基础角色预留 |
| 真实数据统计 | ❌ 待开发 |
