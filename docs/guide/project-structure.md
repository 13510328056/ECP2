# 项目结构

## 目录树

```
ECP2/
├── docs/                          # VitePress 文档站点
│   ├── .vitepress/
│   │   └── config.ts             # VitePress 配置
│   ├── index.md                  # 文档首页
│   ├── guide/                    # 指南文档
│   ├── features/                 # 功能特性文档
│   ├── api/                      # API 文档
│   └── admin/                    # 管理后台文档
├── pages/                        # 静态 HTML 原型页面
│   ├── home.html
│   ├── product-detail.html
│   ├── cart.html
│   ├── checkout.html
│   ├── payment.html
│   ├── order-confirmation.html
│   ├── order-detail.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── admin-products.html
│   ├── admin-product-create.html
│   ├── admin-categories.html
│   ├── admin-orders.html
│   ├── admin-order-detail.html
│   └── contact.html
├── src/                          # 源代码目录
│   ├── App.vue                   # 根组件（全局 Toast + WhatsApp 浮动按钮）
│   ├── main.ts                   # 应用入口
│   ├── style.css                 # 全局样式（Tailwind CSS）
│   ├── env.d.ts                  # TypeScript 声明
│   ├── components/               # 可复用组件
│   │   ├── admin/               # 后台管理组件
│   │   ├── layout/              # 布局组件（AppHeader, AppFooter, BottomNav, AdminLayout）
│   │   ├── cart/                # 购物车组件（CartItemRow）
│   │   ├── checkout/            # 结算组件（PaymentOptions）
│   │   ├── home/                # 首页组件（HeroCarousel, CategoryGrid）
│   │   ├── product/             # 商品组件（ProductFilter）
│   │   └── ui/                  # UI 组件（Badge, EmptyState, LoadingSkeleton, Modal, ProductCard, QuantitySelector）
│   ├── composables/              # 组合式函数
│   │   └── useToast.ts          # Toast 消息提示
│   ├── data/                     # Mock 数据层
│   │   ├── products.ts          # 商品 mock 数据（8 个示例商品）
│   │   ├── orders.ts            # 订单 mock 数据（4 个示例订单）
│   │   ├── categories.ts        # 分类 mock 数据（4 大分类）
│   │   ├── inquiries.ts         # 询盘 mock 数据（5 个示例询盘）
│   │   └── index.ts             # 数据统一导出
│   ├── i18n/                     # 国际化配置
│   │   ├── index.ts             # Vue I18n 初始化
│   │   ├── zh.json              # 中文语言包（~300条翻译）
│   │   └── en.json              # 英文语言包
│   ├── router/                   # Vue Router 路由配置
│   │   └── index.ts             # 路由定义 + 管理员守卫
│   ├── stores/                   # Pinia 状态管理
│   │   ├── index.ts             # Store 统一导出
│   │   ├── cart.ts              # 购物车 Store
│   │   ├── user.ts              # 用户 Store
│   │   ├── admin.ts             # 管理员 Store
│   │   └── language.ts          # 语言 Store
│   ├── types/                    # TypeScript 类型定义
│   │   ├── index.ts             # 类型统一导出
│   │   ├── product.ts           # 商品类型（Product, BulkPrice, StockStatus）
│   │   ├── cart.ts              # 购物车类型（CartItem, Cart）
│   │   ├── order.ts             # 订单类型（Order, ShippingInfo, OrderStatus）
│   │   ├── inquiry.ts           # 询盘类型（Inquiry, InquirySubject）
│   │   └── admin.ts             # 管理员类型（AdminUser, AdminRole）
│   ├── utils/                    # 工具函数
│   │   ├── format.ts            # 格式化函数（formatPrice, formatDate, generateOrderNumber, getStockStatusText）
│   │   └── validation.ts        # 验证函数（isValidPhone, isValidEmail, isRequired）
│   └── views/                    # 页面视图
│       ├── Home.vue             # 首页（轮播图、分类网格、畅销产品、评价）
│       ├── Products.vue         # 商品列表页（分类筛选、排序、搜索）
│       ├── ProductDetail.vue    # 商品详情页（多图、规格、批量价格、评价）
│       ├── Cart.vue             # 购物车页（商品选择、数量调整、优惠码）
│       ├── Checkout.vue         # 结算页（收货地址、支付方式选择）
│       ├── Payment.vue          # MOMO 支付模拟页（4位PIN输入）
│       ├── OrderConfirmation.vue# 订单确认页（成功提示、订单摘要）
│       ├── OrderDetail.vue      # 订单详情页（状态时间线、商品列表、物流信息）
│       ├── Contact.vue          # 询盘/联系我们页（表单验证、本地存储）
│       ├── Login.vue            # 用户登录页
│       ├── Register.vue         # 用户注册页
│       ├── Account.vue          # 用户账户页
│       └── admin/               # 后台管理视图
│           ├── AdminLogin.vue         # 管理员登录（验证码）
│           ├── AdminDashboard.vue     # 数据看板（统计卡片、销售图表、最新订单）
│           ├── AdminProducts.vue      # 商品管理（CRUD、筛选、批量操作）
│           ├── AdminProductCreate.vue # 商品编辑/创建表单
│           ├── AdminCategories.vue    # 分类管理（树形结构）
│           ├── AdminOrders.vue        # 订单管理（状态筛选、搜索）
│           ├── AdminOrderDetail.vue   # 订单详情（物流录入、状态操作）
│           ├── AdminInquiries.vue     # 询盘列表（状态标签、搜索）
│           ├── AdminInquiryDetail.vue # 询盘详情（回复、状态更新）
│           └── AdminSettings.vue      # 系统设置（个人资料、密码修改、用户管理）
├── images/                       # 静态图片资源
│   └── logo.png                  # 平台 Logo
├── dist/                         # 构建输出目录
├── index.html                    # 入口 HTML
├── package.json                  # 项目配置与依赖
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
├── tsconfig.app.json             # TypeScript 应用配置
├── tsconfig.node.json            # TypeScript Node 配置
├── DEPLOY.md                     # 部署文档
├── README.md                     # 项目 README
└── SPEC.md                       # 完整技术规格文档
```

## 目录结构说明

### `src/` — 核心源代码

采用**按功能分层 + 按业务模块组织**的混合结构：

- **components/** — 可复用 UI 组件，按业务模块划分子目录
- **composables/** — Vue 3 组合式函数，封装可复用逻辑
- **data/** — Mock 数据层，模拟后端 API 返回的数据
- **i18n/** — 国际化配置和语言包（中文/英文）
- **router/** — 路由定义，包含管理员权限守卫
- **stores/** — Pinia 状态管理，管理全局状态
- **types/** — TypeScript 类型定义，确保类型安全
- **utils/** — 纯工具函数，无副作用
- **views/** — 页面级组件，按路由组织，后台管理视图独立子目录

### `pages/` — 静态原型

存放开发初期的 HTML 原型文件，用于快速验证页面设计和交互流程。

### `docs/` — 项目文档

基于 VitePress 构建的文档站点，涵盖项目指南、功能特性、API 参考和管理后台使用手册。
