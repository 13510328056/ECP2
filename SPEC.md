# Li's Industrial Supplies & Services Market - Technical Specification

## 1. 项目概述

### 1.1 项目背景
工业用品B2B2C电商平台，面向非洲加纳市场，提供矿产机械、劳保耗材、备件和专业配套服务。平台服务对象包括终端用户、SME企业采购人以及二级代理商，支持企业采购、批量报价和本地化支付。目标是构建行业专属采购渠道，结合线上展示与线下服务，降低采购成本并提升采购转化率。

### 1.2 项目类型
**全新开发** - 从零开始构建完整的电商前端系统，适配移动优先和B2B采购场景

### 1.3 核心价值主张
"Your Trusted Partner for Industrial Equipment & Safety Supplies in Ghana - Quality Machinery, Reliable Service, Local Payment Support"

### 1.4 目标用户
- 个人买家：小型维修团队、现场作业人员、个体采购者
- 中小企业/工程承包商：项目经理、采购主管、维修主管
- 二级代理商与分销商：批量采购、备货、代理分销
- 在加纳的华人商户：华人工程承包商、进口代理、贸易公司
- 内部运营人员：商品运营、客服、仓储、财务

### 1.4.1 典型用户画像
- **矿场采购经理**：需要耐用设备、关注库存、付款方式和交付周期
- **华人工程负责人**：需要中文/英文支持、快速报价、可靠本地服务
- **小型维修商**：价格敏感，需要快速下单与WhatsApp即时咨询
- **代理商**：关注批量价格、折扣、账期和代理支持
- **浏览访客**：先比较规格与价格，再通过询盘或本地联系方式转化

### 1.5 MVP功能范围（高优先级）
根据需求优先级，实现以下核心功能：

**1. 商品展示功能（前台）**
- 产品分类导航
- 商品网格展示（图片、名称、价格、库存状态）
- 商品详情页（多图展示、规格参数、应用场景）
- 搜索和筛选功能

**2. 购物车与订单系统（前台）**
- 加入购物车
- 购物车管理（数量调整、删除商品）
- 结算流程（收货信息、支付方式选择）
- 订单确认页
- 批量采购提示与起订量显示
- 企业用户可申请账期付款（MVP后续迭代）

**3. 在线留言/询盘功能（前台）**
- 询盘表单（姓名、联系方式、产品兴趣、需求描述）
- 支持上传附件或填写详细产品型号
- 询盘自动分配到客服，支持状态跟进
- 提交成功提示
- 24小时内联系承诺

**4. 多语言支持（前台）**
- 中英文切换功能
- 所有页面内容支持双语展示
- 价格、地址、支付说明本地化展示
- 语言持久化存储

**5. 后台管理系统（后台）**
- 管理员登录认证
- 商品管理（增删改查、上下架、库存管理）
- 订单管理（订单列表、处理状态、物流跟踪）
- 询盘管理（询盘列表、回复处理）
- 数据统计（销售概览、热门商品）

---

## 2. 系统角色定义

### 2.1 角色体系概述

本系统采用前后台分离的B/S架构，角色体系分为两大类别：

| 类别 | 说明 | 用户范围 |
|------|------|----------|
| **前台用户** | 面向网站访客和买家，提供商品浏览、购买、询盘等功能 | 个体商户、个人买家、二级代理商、华人商户 |
| **后台管理** | 面向内部运营人员，提供商品管理、订单处理、客服支持等 | 管理员、商品运营、客服、财务、仓储 |

### 2.2 前台用户角色

#### 2.2.1 访客（Guest）

| 属性 | 说明 |
|------|------|
| **定义** | 未登录的网站访问者 |
| **身份标识** | Session ID / Cookie |
| **权限范围** | 浏览商品、查看价格、搜索筛选、查看评价、查看配送信息 |
| **限制操作** | ❌ 无法下单 ❌ 无法询盘 ❌ 无法查看订单 |

**用例场景：**
- 新用户首次访问，浏览商品但未注册
- 对比同类商品，了解价格和配送信息
- 查看商品详情和用户评价

#### 2.2.2 注册用户（Registered User）

| 属性 | 说明 |
|------|------|
| **定义** | 完成注册的网站用户 |
| **身份标识** | 用户ID + 账号密码 / 手机号 |
| **权限范围** | 访客所有权限 + 下单购买、订单管理、个人资料管理、询盘提交、收藏商品 |
| **账号类型** | 个人账号、企业账号（代理商） |

**用例场景：**
- 登录后直接下单购买
- 管理收货地址
- 提交商品询盘
- 查看历史订单
- 收藏感兴趣的商品

#### 2.2.3 会员等级（Member Levels）

| 等级 | 获取条件 | 专属权益 |
|------|----------|----------|
| **普通会员** | 注册即成为 | 标准价格、标准配送 |
| **VIP会员** | 累计消费满₵5,000 | 95折优惠、优先配送、专属客服 |
| **企业会员** | 企业认证审核 | 账期付款、批量采购价、专属客户经理 |

### 2.3 后台管理角色

#### 2.3.1 超级管理员（Super Admin）

| 属性 | 说明 |
|------|------|
| **定义** | 系统最高权限管理者 |
| **归属** | 公司创始人/IT负责人 |
| **权限范围** | 系统所有功能的完全控制权 |
| **核心职责** | 系统配置、角色权限管理、敏感数据访问、安全审计 |

**权限矩阵：**

| 功能模块 | 增 | 删 | 改 | 查 |
|---------|---|---|---|---|
| 系统配置 | ✅ | ✅ | ✅ | ✅ |
| 用户管理 | ✅ | ✅ | ✅ | ✅ |
| 角色权限 | ✅ | ✅ | ✅ | ✅ |
| 操作日志 | ❌ | ❌ | ❌ | ✅ |
| 数据备份 | ✅ | ✅ | ✅ | ✅ |

**用例场景：**
- 添加新的管理员账号，分配角色
- 修改后台登录密码策略
- 查看系统操作日志
- 执行数据备份和恢复
- 配置支付网关参数

#### 2.3.2 商品管理员（Product Manager）

| 属性 | 说明 |
|------|------|
| **定义** | 负责商品上下架、库存管理 |
| **归属** | 商品部/运营部 |
| **权限范围** | 商品全生命周期管理、库存管理 |
| **核心职责** | 商品上架、价格调整、库存监控、上下架管理 |

**权限矩阵：**

| 功能模块 | 增 | 删 | 改 | 查 |
|---------|---|---|---|---|
| 商品列表 | ✅ | ✅ | ✅ | ✅ |
| 商品详情 | ✅ | ✅ | ✅ | ✅ |
| 商品分类 | ✅ | ❌ | ✅ | ✅ |
| 品牌管理 | ✅ | ❌ | ✅ | ✅ |
| 库存管理 | ❌ | ❌ | ✅ | ✅ |
| 订单查看 | ❌ | ❌ | ❌ | ✅ |

**用例场景：**
- 上传新商品，填写信息
- 批量修改商品价格
- 根据库存预警补货
- 批量上下架商品
- 调整商品分类和标签

#### 2.3.3 运营管理员（Marketing Manager）

| 属性 | 说明 |
|------|------|
| **定义** | 负责促销活动、内容运营、用户运营 |
| **归属** | 市场部/运营部 |
| **权限范围** | 促销管理、内容管理、用户运营 |
| **核心职责** | 活动策划、优惠券发放、banner管理、用户数据统计 |

**权限矩阵：**

| 功能模块 | 增 | 删 | 改 | 查 |
|---------|---|---|---|---|
| Banner管理 | ✅ | ✅ | ✅ | ✅ |
| 促销活动 | ✅ | ✅ | ✅ | ✅ |
| 优惠券管理 | ✅ | ✅ | ✅ | ✅ |
| 用户列表 | ❌ | ❌ | ❌ | ✅ |
| 销售报表 | ❌ | ❌ | ❌ | ✅ |
| 商品编辑 | ❌ | ❌ | ❌ | ✅ |

**用例场景：**
- 配置首页轮播Banner
- 创建限时折扣活动
- 发放新人优惠券
- 查看用户购买行为
- 分析销售数据报表

#### 2.3.4 客服人员（Customer Service）

| 属性 | 说明 |
|------|------|
| **定义** | 负责询盘处理、售后服务、客户咨询 |
| **归属** | 客服部 |
| **权限范围** | 询盘管理、售后处理、工单管理 |
| **核心职责** | 询盘回复、退换货处理、投诉跟进、客户沟通 |

**权限矩阵：**

| 功能模块 | 增 | 删 | 改 | 查 |
|---------|---|---|---|---|
| 询盘列表 | ❌ | ❌ | ✅ | ✅ |
| 询盘回复 | ❌ | ❌ | ✅ | ✅ |
| 订单查看 | ❌ | ❌ | ❌ | ✅ |
| 订单备注 | ❌ | ❌ | ✅ | ✅ |
| 退换货处理 | ❌ | ❌ | ✅ | ✅ |
| 客户信息 | ❌ | ❌ | ❌ | ✅ |

**用例场景：**
- 回复客户询盘消息
- 处理退换货申请
- 跟进未支付订单
- 记录客户沟通日志
- 标记高价值客户

#### 2.3.5 仓储管理员（Warehouse Manager）

| 属性 | 说明 |
|------|------|
| **定义** | 负责库存管理、发货操作、物流跟踪 |
| **归属** | 仓储部/物流部 |
| **权限范围** | 库存管理、订单发货、物流跟踪 |
| **核心职责** | 库存盘点、订单打包、物流对接、异常处理 |

**权限矩阵：**

| 功能模块 | 增 | 删 | 改 | 查 |
|---------|---|---|---|---|
| 库存查询 | ❌ | ❌ | ❌ | ✅ |
| 库存调整 | ✅ | ❌ | ✅ | ✅ |
| 订单发货 | ❌ | ❌ | ✅ | ✅ |
| 物流跟踪 | ❌ | ❌ | ✅ | ✅ |
| 出库记录 | ✅ | ❌ | ❌ | ✅ |
| 库存预警 | ❌ | ❌ | ❌ | ✅ |

**用例场景：**
- 批量打印发货单
- 扫描订单发货
- 登记物流单号
- 处理库存异常
- 查看库存预警报表

#### 2.3.6 财务人员（Finance）

| 属性 | 说明 |
|------|------|
| **定义** | 负责订单对账、收款确认、退款处理 |
| **归属** | 财务部 |
| **权限范围** | 订单收款、退款审批、财务报表 |
| **核心职责** | 收款核对、退款审批、交易对账、财务报表 |

**权限矩阵：**

| 功能模块 | 增 | 删 | 改 | 查 |
|---------|---|---|---|---|
| 订单收款 | ❌ | ❌ | ✅ | ✅ |
| 退款审批 | ❌ | ❌ | ✅ | ✅ |
| 对账报表 | ❌ | ❌ | ❌ | ✅ |
| 交易记录 | ❌ | ❌ | ❌ | ✅ |
| 退款记录 | ❌ | ❌ | ✅ | ✅ |
| 发票管理 | ✅ | ❌ | ✅ | ✅ |

**用例场景：**
- 确认MOMO支付到账
- 审批退款申请
- 生成日/月财务报表
- 对账异常订单
- 开具增值税发票

### 2.4 角色权限矩阵总览

| 功能模块 | 超级管理员 | 商品管理员 | 运营管理员 | 客服人员 | 仓储管理员 | 财务人员 |
|---------|:---------:|:---------:|:---------:|:-------:|:---------:|:-------:|
| **商品管理** | CRUD | CRUD | R | - | R | - |
| **订单管理** | CRUD | R | R | R+备注 | U+发货 | R+收款 |
| **用户管理** | CRUD | - | R | R | - | - |
| **询盘管理** | CRUD | R | R | RU | - | - |
| **促销管理** | CRUD | - | CRUD | R | - | - |
| **库存管理** | CRUD | U | - | - | CRU | - |
| **财务对账** | CRUD | - | R | - | - | CRUD |
| **系统配置** | CRUD | - | - | - | - | - |
| **日志审计** | R | - | - | - | - | - |

> **说明：** C=创建, R=读取, U=更新, D=删除, -=无权限

---

### 2.4.1 权限体系设计（RBAC）

#### 2.4.1.1 RBAC架构概述

本系统采用**基于角色的访问控制（Role-Based Access Control, RBAC）**模型，实现细粒度的权限管理。

**RBAC核心要素：**
| 要素 | 说明 |
|------|------|
| **用户（User）** | 系统中的操作主体，每个用户关联一个或多个角色 |
| **角色（Role）** | 权限的集合，定义一组操作权限 |
| **权限（Permission）** | 对特定资源的操作许可（如：查看商品、创建订单） |
| **资源（Resource）** | 系统中受保护的对象（如：商品、订单、用户） |

**RBAC层级结构：**
```
超级管理员
    ├── 系统配置权限
    ├── 角色管理权限
    ├── 用户管理权限
    └── 所有业务权限

商品管理员
    ├── 商品CRUD权限
    ├── 分类管理权限
    └── 库存查看权限

运营管理员
    ├── 促销活动权限
    ├── Banner管理权限
    └── 用户查看权限

客服人员
    ├── 询盘处理权限
    ├── 订单查看权限
    └── 备注添加权限

仓储管理员
    ├── 库存管理权限
    ├── 订单发货权限
    └── 物流跟踪权限

财务人员
    ├── 收款确认权限
    ├── 退款审批权限
    └── 报表查看权限
```

#### 2.4.1.2 权限定义规范

**权限命名规范：**
```
<资源>:<操作>:<范围>
```
- **资源**：product、order、inquiry、category、user、setting等
- **操作**：create、read、update、delete、export、import等
- **范围**：all（全部）、own（自己创建的）、assigned（分配给我的）

**权限列表（按模块分类）：**

**商品管理模块权限：**
| 权限标识 | 权限名称 | 描述 |
|----------|----------|------|
| `product:create` | 创建商品 | 添加新商品 |
| `product:read` | 查看商品 | 查看商品列表和详情 |
| `product:update` | 编辑商品 | 修改商品信息 |
| `product:delete` | 删除商品 | 删除商品记录 |
| `product:export` | 导出商品 | 导出商品数据 |
| `product:stock:update` | 更新库存 | 修改库存数量 |
| `category:create` | 创建分类 | 添加新分类 |
| `category:read` | 查看分类 | 查看分类列表 |
| `category:update` | 编辑分类 | 修改分类信息 |
| `category:delete` | 删除分类 | 删除分类 |

**订单管理模块权限：**
| 权限标识 | 权限名称 | 描述 |
|----------|----------|------|
| `order:read` | 查看订单 | 查看订单列表和详情 |
| `order:update` | 修改订单 | 修改订单信息 |
| `order:delete` | 删除订单 | 删除订单记录 |
| `order:export` | 导出订单 | 导出订单数据 |
| `order:confirm` | 确认订单 | 确认订单信息无误 |
| `order:ship` | 订单发货 | 填写物流信息并发货 |
| `order:cancel` | 取消订单 | 取消未支付订单 |
| `order:refund` | 订单退款 | 发起退款流程 |
| `order:note:add` | 添加备注 | 添加内部备注 |

**询盘管理模块权限：**
| 权限标识 | 权限名称 | 描述 |
|----------|----------|------|
| `inquiry:read` | 查看询盘 | 查看询盘列表和详情 |
| `inquiry:respond` | 回复询盘 | 回复客户询盘 |
| `inquiry:export` | 导出询盘 | 导出询盘数据 |
| `inquiry:assign` | 分配询盘 | 将询盘分配给其他客服 |
| `inquiry:close` | 关闭询盘 | 标记询盘为已关闭 |

**用户管理模块权限：**
| 权限标识 | 权限名称 | 描述 |
|----------|----------|------|
| `user:read` | 查看用户 | 查看用户列表 |
| `user:create` | 创建用户 | 添加新管理员 |
| `user:update` | 编辑用户 | 修改用户信息 |
| `user:delete` | 删除用户 | 删除管理员账号 |
| `user:role:assign` | 分配角色 | 为用户分配角色 |
| `user:password:reset` | 重置密码 | 重置用户密码 |

**系统设置模块权限：**
| 权限标识 | 权限名称 | 描述 |
|----------|----------|------|
| `setting:read` | 查看设置 | 查看系统配置 |
| `setting:update` | 修改设置 | 修改系统配置 |
| `log:read` | 查看日志 | 查看操作日志 |
| `backup:create` | 创建备份 | 执行数据备份 |
| `backup:restore` | 恢复备份 | 从备份恢复数据 |

#### 2.4.1.3 角色-权限映射表

**超级管理员（super_admin）：**
| 权限标识 | 是否拥有 |
|----------|:--------:|
| `product:create` | ✅ |
| `product:read` | ✅ |
| `product:update` | ✅ |
| `product:delete` | ✅ |
| `product:export` | ✅ |
| `product:stock:update` | ✅ |
| `category:create` | ✅ |
| `category:read` | ✅ |
| `category:update` | ✅ |
| `category:delete` | ✅ |
| `order:read` | ✅ |
| `order:update` | ✅ |
| `order:delete` | ✅ |
| `order:export` | ✅ |
| `order:confirm` | ✅ |
| `order:ship` | ✅ |
| `order:cancel` | ✅ |
| `order:refund` | ✅ |
| `order:note:add` | ✅ |
| `inquiry:read` | ✅ |
| `inquiry:respond` | ✅ |
| `inquiry:export` | ✅ |
| `inquiry:assign` | ✅ |
| `inquiry:close` | ✅ |
| `user:read` | ✅ |
| `user:create` | ✅ |
| `user:update` | ✅ |
| `user:delete` | ✅ |
| `user:role:assign` | ✅ |
| `user:password:reset` | ✅ |
| `setting:read` | ✅ |
| `setting:update` | ✅ |
| `log:read` | ✅ |
| `backup:create` | ✅ |
| `backup:restore` | ✅ |

**商品管理员（product_manager）：**
| 权限标识 | 是否拥有 |
|----------|:--------:|
| `product:create` | ✅ |
| `product:read` | ✅ |
| `product:update` | ✅ |
| `product:delete` | ✅ |
| `product:export` | ✅ |
| `product:stock:update` | ✅ |
| `category:create` | ✅ |
| `category:read` | ✅ |
| `category:update` | ✅ |
| `category:delete` | ✅ |
| `order:read` | ✅ |
| `inquiry:read` | ✅ |

**运营管理员（marketing_manager）：**
| 权限标识 | 是否拥有 |
|----------|:--------:|
| `product:read` | ✅ |
| `order:read` | ✅ |
| `order:export` | ✅ |
| `inquiry:read` | ✅ |
| `user:read` | ✅ |

**客服人员（customer_service）：**
| 权限标识 | 是否拥有 |
|----------|:--------:|
| `order:read` | ✅ |
| `order:confirm` | ✅ |
| `order:cancel` | ✅ |
| `order:note:add` | ✅ |
| `inquiry:read` | ✅ |
| `inquiry:respond` | ✅ |
| `inquiry:close` | ✅ |
| `user:read` | ✅ |

**仓储管理员（warehouse）：**
| 权限标识 | 是否拥有 |
|----------|:--------:|
| `product:read` | ✅ |
| `product:stock:update` | ✅ |
| `order:read` | ✅ |
| `order:confirm` | ✅ |
| `order:ship` | ✅ |

**财务人员（finance）：**
| 权限标识 | 是否拥有 |
|----------|:--------:|
| `order:read` | ✅ |
| `order:refund` | ✅ |
| `order:export` | ✅ |
| `setting:read` | ✅ |

#### 2.4.1.4 权限验证流程

**前端权限验证流程：**
```
用户登录 → 获取Token → 获取用户信息和角色 → 根据角色加载对应菜单 → 访问页面时检查路由权限 → 操作时检查按钮权限
```

**权限验证层级：**

| 层级 | 验证位置 | 验证方式 | 失败处理 |
|------|----------|----------|----------|
| **路由级别** | Next.js Middleware | 检查Token有效性和角色权限 | 重定向到登录页或403页面 |
| **页面级别** | 页面组件内 | 在useEffect中检查权限 | 显示403页面或隐藏内容 |
| **组件级别** | 组件渲染时 | 使用权限判断条件渲染 | 隐藏无权限组件 |
| **按钮级别** | 按钮组件 | 根据权限状态决定是否渲染 | 不显示按钮 |
| **API级别** | 后端接口 | 在Controller层验证 | 返回403错误 |

**权限检查工具函数设计：**

```typescript
// src/utils/permission.ts

export interface Permission {
  resource: string;
  action: string;
}

export interface RolePermissions {
  [role: string]: Permission[];
}

export const ROLE_PERMISSIONS: RolePermissions = {
  super_admin: [
    { resource: 'product', action: 'create' },
    { resource: 'product', action: 'read' },
  ],
  product_manager: [
    { resource: 'product', action: 'create' },
    { resource: 'product', action: 'read' },
    { resource: 'product', action: 'update' },
    { resource: 'product', action: 'delete' },
    { resource: 'product', action: 'export' },
    { resource: 'product', action: 'stock:update' },
    { resource: 'category', action: 'create' },
    { resource: 'category', action: 'read' },
    { resource: 'category', action: 'update' },
    { resource: 'category', action: 'delete' },
    { resource: 'order', action: 'read' },
    { resource: 'inquiry', action: 'read' },
  ],
};

export const hasPermission = (
  role: string,
  resource: string,
  action: string
): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.some(
    (p) => p.resource === resource && p.action === action
  );
};

export const canAccess = (role: string, permission: string): boolean => {
  const [resource, action] = permission.split(':');
  return hasPermission(role, resource, action);
};
```

#### 2.4.1.5 菜单权限控制

**菜单配置与权限关联：**

```typescript
// src/config/menu.ts

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission?: string;
  children?: MenuItem[];
}

export const ADMIN_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: '数据概览',
    icon: 'LayoutDashboard',
    path: '/admin/dashboard',
  },
  {
    id: 'products',
    label: '商品管理',
    icon: 'Package',
    path: '/admin/products',
    permission: 'product:read',
    children: [
      {
        id: 'product-list',
        label: '商品列表',
        path: '/admin/products',
        permission: 'product:read',
      },
      {
        id: 'product-create',
        label: '新增商品',
        path: '/admin/products/create',
        permission: 'product:create',
      },
      {
        id: 'categories',
        label: '商品分类',
        path: '/admin/categories',
        permission: 'category:read',
      },
    ],
  },
  {
    id: 'orders',
    label: '订单管理',
    icon: 'ShoppingCart',
    path: '/admin/orders',
    permission: 'order:read',
  },
  {
    id: 'inquiries',
    label: '询盘管理',
    icon: 'MessageSquare',
    path: '/admin/inquiries',
    permission: 'inquiry:read',
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: 'Settings',
    path: '/admin/settings',
    permission: 'setting:read',
    children: [
      {
        id: 'profile',
        label: '个人资料',
        path: '/admin/settings/profile',
      },
      {
        id: 'users',
        label: '用户管理',
        path: '/admin/settings/users',
        permission: 'user:read',
      },
    ],
  },
];
```

**动态菜单渲染逻辑：**
- 根据用户角色过滤菜单项
- 只渲染用户有权限访问的菜单
- 如果父菜单的所有子菜单都无权限，则不显示父菜单

#### 2.4.1.6 MVP阶段权限简化

**MVP阶段采用简化的权限模型：**

| 角色 | 权限范围 | 说明 |
|------|----------|------|
| **管理员（admin）** | 所有权限 | MVP阶段只实现超级管理员角色 |
| **访客（guest）** | 无后台权限 | 无法访问后台 |

**MVP权限验证实现：**
- 登录成功后即拥有所有后台权限
- 不区分角色，统一使用管理员权限
- 后续迭代再引入细粒度权限控制

---

### 2.5 用户旅程与核心用例

#### 2.5.1 买家购物流程

**完整购物流程（含状态流转）：**

```
浏览商品 → 选择商品 → 添加购物车 → 查看购物车 → 确认订单 → 选择支付 → 支付处理 → 订单完成
    ↓           ↓           ↓            ↓           ↓          ↓          ↓
  访客      访客/用户    访客/用户    访客/用户    注册用户   注册用户    注册用户
                                         ↓                    ↓
                                    [登录/注册]           [支付失败重试]
```

**详细流程步骤：**

| 步骤 | 页面/组件 | 用户权限 | 关键操作 | 数据流转 |
|------|----------|----------|----------|----------|
| 1. 浏览商品 | 首页/商品列表页 | 访客/用户 | 搜索、筛选、分类导航 | `GET /api/products` |
| 2. 选择商品 | 商品详情页 | 访客/用户 | 查看详情、规格、库存 | `GET /api/products/:id` |
| 3. 添加购物车 | 商品详情页 | 访客/用户 | 选择数量、加入购物车 | `POST /api/cart` |
| 4. 查看购物车 | 购物车页 | 访客/用户 | 调整数量、删除商品 | `GET /api/cart` |
| 5. 确认订单 | 结算页 | 注册用户 | 填写收货地址、选择支付方式 | `POST /api/orders` |
| 6. 选择支付 | 结算页 | 注册用户 | 选择MOMO/COD | - |
| 7. 支付处理 | 支付页 | 注册用户 | 输入手机号、等待确认 | `POST /api/payments` |
| 8. 订单完成 | 订单确认页 | 注册用户 | 查看订单详情 | `GET /api/orders/:id` |

**异常处理流程：**

| 异常场景 | 处理方式 | 用户提示 |
|----------|----------|----------|
| 商品库存不足 | 自动调整数量或提示缺货 | "This item is out of stock" |
| 购物车商品失效 | 自动移除失效商品 | "Some items are no longer available" |
| 支付超时 | 自动取消订单 | "Payment timed out, please try again" |
| 支付失败 | 提供重试按钮 | "Payment failed, please retry" |

#### 2.5.2 询盘转化流程

**完整询盘流程：**

```
浏览商品 → 点击询盘 → 填写表单 → 提交询盘 → 客服处理 → 回复客户 → 跟进沟通 → 转化/关闭
    ↓           ↓           ↓           ↓          ↓         ↓          ↓          ↓
  访客      访客/用户    访客/用户    访客/用户   客服人员   客服人员    客服人员   客服人员
                                                ↓
                                           [分配询盘]
```

**详细流程步骤：**

| 步骤 | 角色 | 操作 | 系统动作 |
|------|------|------|----------|
| 1. 浏览商品 | 用户 | 浏览商品列表 | - |
| 2. 点击询盘 | 用户 | 点击"询盘"按钮 | 打开询盘表单 |
| 3. 填写表单 | 用户 | 填写姓名、电话、需求 | 表单验证 |
| 4. 提交询盘 | 用户 | 点击提交 | 创建询盘记录 |
| 5. 客服处理 | 客服 | 查看询盘列表 | 分配询盘 |
| 6. 回复客户 | 客服 | 编写回复内容 | 发送邮件/WhatsApp |
| 7. 跟进沟通 | 客服 | 持续跟进 | 更新询盘状态 |
| 8. 转化/关闭 | 客服 | 标记成交或关闭 | 更新状态 |

**询盘状态流转：**

```
待回复 → 处理中 → 已报价 → 已成交
   ↓         ↓         ↓
  已关闭   已关闭    已关闭
```

#### 2.5.3 订单处理流程

**完整订单流程（状态机）：**

```
待付款 → 已付款 → 配货中 → 已发货 → 已完成
  ↓         ↓         ↓         ↓
已取消    已取消    已取消    已取消
  ↓         ↓
退款中 → 已退款
```

**订单状态详细说明：**

| 状态 | 触发条件 | 可执行操作 | 角色权限 |
|------|----------|----------|----------|
| **待付款** | 用户提交订单 | 取消订单、付款 | 用户 |
| **已付款** | 支付成功 | 确认收款、取消订单 | 财务、客服 |
| **配货中** | 财务确认收款 | 发货、取消订单 | 仓储 |
| **已发货** | 仓库填写物流信息 | 确认收货、申请退款 | 用户、客服 |
| **已完成** | 用户确认收货 | 评价、申请售后 | 用户 |
| **已取消** | 用户/客服取消 | - | 用户、客服 |
| **退款中** | 发起退款申请 | 审批退款 | 财务 |
| **已退款** | 退款完成 | - | 财务 |

**订单处理流程图：**

```
用户下单 → 创建订单(待付款) → 支付成功(已付款) → 财务确认 → 仓储配货(配货中)
    ↓                                    ↓
 [支付失败]                          [取消订单]
    ↓                                    ↓
 重试支付                          订单取消(已取消)
                                          ↓
                                     [退款申请]
                                          ↓
                                     退款中 → 已退款

                    ↓
              仓储发货(已发货) → 用户确认(已完成) → 订单评价
                    ↓                              ↓
              [物流跟踪]                     [售后申请]
```

**关键业务规则：**

| 规则 | 说明 |
|------|------|
| 付款超时 | 订单创建后30分钟未付款自动取消 |
| 发货时限 | 付款后24小时内必须发货 |
| 自动确认 | 发货后7天未确认自动完成 |
| 退款时限 | 发货前可全额退款，发货后按售后政策 |

#### 2.5.4 支付流程（MOMO）

**MTN Mobile Money支付流程：**

```
选择MOMO支付 → 输入手机号 → 点击支付 → 等待确认 → 支付成功/失败
    ↓              ↓            ↓           ↓              ↓
  结算页        结算页       支付页      支付页        订单确认页/结算页
```

**支付流程详细步骤：**

| 步骤 | 页面 | 操作 | API调用 | 状态 |
|------|------|------|----------|------|
| 1. 选择支付方式 | 结算页 | 用户选择MOMO | - | - |
| 2. 输入手机号 | 结算页 | 输入MTN手机号 | - | - |
| 3. 发起支付 | 支付页 | 点击支付按钮 | `POST /api/payments/momo` | Pending |
| 4. 等待确认 | 支付页 | 显示加载状态 | 轮询 `GET /api/payments/:id/status` | Pending |
| 5. 支付成功 | 订单确认页 | 显示成功信息 | - | Success |
| 6. 支付失败 | 结算页 | 显示错误信息 | - | Failed |

**支付状态处理：**

| 状态 | 显示内容 | 用户操作 |
|------|----------|----------|
| **Pending** | 加载动画 + "Processing payment..." | 等待 |
| **Success** | 成功提示 + 订单详情 | 查看订单 |
| **Failed** | 错误提示 + 重试按钮 | 重试支付/联系客服 |

**支付异常处理：**

| 异常 | 原因 | 处理方式 |
|------|------|----------|
| 网络超时 | 网络不稳定 | 自动重试3次，失败则提示 |
| PIN错误 | 用户输入错误 | 提示"Invalid PIN"，允许重试 |
| 余额不足 | 用户账户余额不足 | 提示"Insufficient funds" |
| 服务不可用 | MOMO服务维护 | 提示"Service unavailable"，建议稍后重试 |

### 2.6 角色账号规划

| 角色 | 初始账号数 | 扩展性 | 认证方式 |
|------|:---------:|:------:|----------|
| 超级管理员 | 1-2个 | 固定 | 邮箱+密码+手机号验证 |
| 商品管理员 | 1-3个 | 按需增加 | 邮箱+密码 |
| 运营管理员 | 1-2个 | 按需增加 | 邮箱+密码 |
| 客服人员 | 2-5个 | 按需增加 | 邮箱+密码 |
| 仓储管理员 | 2-3个 | 按需增加 | 邮箱+密码 |
| 财务人员 | 1-2个 | 固定 | 邮箱+密码+双因素认证 |

### 2.7 MVP阶段角色规划

**MVP阶段采用简化角色设计：**

| 阶段 | 角色合并 | 说明 |
|------|---------|------|
| **MVP阶段** | 超级管理员 = 全部权限 | 初期业务量小，一人兼顾多职 |
| **成长期** | 拆分：商品运营、客服、仓储 | 按业务模块分配专人负责 |
| **成熟期** | 完整角色体系 + 权限细化 | 引入工作流审批，权限矩阵严格执行 |

**MVP后台管理入口：**
- 路径：`/admin` 或 `/management`
- 认证：独立登录页面
- 界面：简化版管理后台

---

## 3. 市场分析与特殊需求

### 2.1 非洲电商市场环境分析

#### 2.1.1 基础设施限制
| 挑战 | 影响 | 解决方案 |
|------|------|----------|
| 支付体系不完善 | 信用卡普及率不足15%，移动支付缺乏统一体验 | MOMO移动支付优先，货到付款备选 |
| 物流配送成本高 | 最后一公里配送成本占商品总价30-40% | 分区域定价、自提点合作、透明费用说明 |
| 信任缺失严重 | 超过60%消费者对在线支付持怀疑态度 | 强化信任背书、本地化联系方式、真实评价 |

#### 2.1.2 用户行为特征
| 特征 | 数据 | 设计决策 |
|------|------|----------|
| 移动优先 | 85%互联网接入通过移动设备 | 移动端优先设计、触摸友好、固定底部CTA |
| 价格敏感度高 | 70%用户因价格优惠为主要购买动机 | 批量优惠展示、阶梯定价、促销提示 |
| 社交驱动 | Facebook、WhatsApp是主要发现渠道 | WhatsApp集成、分享功能、社媒链接 |

#### 2.1.3 物流瓶颈
| 问题 | 影响 | 优化方案 |
|------|------|----------|
| 地址系统不完善 | 配送定位困难 | 支持地标描述、多级地址选项 |
| 配送成本高 | 影响购买决策 | 分区域定价、免费配送门槛、灵活配送选项 |
| 退货流程复杂 | 增加用户顾虑 | 简化退货政策说明、提供自提选项 |

#### 2.1.4 线上线下融合
| 策略 | 实现方式 | 价值 |
|------|----------|------|
| 线下网点布局 | 展示Accra本地仓库/门店地址 | 解决最后一公里配送 |
| 信任增强 | 线下自提可验货 | 降低在线购买风险 |
| 本地化服务 | 技术支持、售后服务 | 建立长期客户关系 |

### 2.2 本地化特殊要求

#### 2.2.1 货币与支付
- **货币显示**：所有价格以加纳塞地（GHS）为主，符号"₵"
- **MOMO支付优先**：优先对接MTN Mobile Money（加纳最大移动支付服务商）
  - 支付流程：输入手机号 → 收到支付确认 → 输入PIN完成
  - UI需清晰展示MTN Logo和支付说明
- **货到付款备选**：适用于不习惯移动支付的用户

#### 2.2.2 联系方式格式
- 电话号码：+233 XX XXX XXXX（加纳国际区号）
- WhatsApp：wa.me短链接，直接跳转对话

#### 2.2.3 配送说明
- 配送范围：Greater Accra、Kumasi、Takoradi等主要城市
- 配送时效：
  - Accra市内：1-2天
  - 其他地区：3-5天
- 配送费用：分区域明确标注

---

## 4. 技术架构

### 4.1 技术栈选型

#### 4.1.1 核心框架选型

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **前端框架** | Next.js 14 (App Router) | SSR支持利于SEO优化，服务端渲染提升首屏性能，内置图片优化减少带宽占用，良好的开发者体验 |
| **编程语言** | TypeScript | 类型安全提升代码质量，增强IDE支持和重构能力，减少运行时错误 |
| **样式方案** | Tailwind CSS | 原子化CSS快速开发响应式布局，内置暗色模式支持，极小的生产包体积 |
| **移动端适配** | 响应式设计 + PWA | 一套代码适配多端，降低维护成本，PWA支持离线访问和推送通知 |
| **国际化** | next-intl | 支持App Router，静态/服务端渲染友好，运行时语言切换，ICU消息格式支持 |

#### 3.1.2 状态管理与数据获取

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **全局状态** | React Context API | 轻量级，无需额外依赖，适合购物车、语言切换等全局状态 |
| **服务端状态** | React Query | 自动缓存、乐观更新、后台同步，简化异步数据管理 |
| **表单状态** | React Hook Form | 高性能表单验证，最小化重新渲染，支持复杂验证规则 |

#### 3.1.3 UI组件与交互

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **基础组件库** | Headless UI / Radix UI | 无样式组件库，完全可控的组件行为，配合Tailwind实现一致的设计系统 |
| **图标库** | Heroicons / Lucide React | Tailwind官方推荐，SVG图标按需导入，体积小 |
| **动画库** | Framer Motion | 声明式动画，丰富的交互效果，与React完美集成 |
| **轮播组件** | Swiper.js | 移动端触摸友好，丰富的配置选项，性能优秀 |

#### 3.1.4 开发工具与质量保障

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **代码规范** | ESLint + Prettier | 自动格式化代码，统一代码风格，减少代码审查负担 |
| **版本控制** | Git + GitHub | 分布式版本控制，代码托管和协作平台 |
| **包管理** | npm / pnpm | npm生态丰富，pnpm速度快、节省空间（可选） |
| **测试框架** | Jest + React Testing Library | 单元测试和集成测试，模拟用户行为测试组件 |
| **CI/CD** | GitHub Actions | 与GitHub无缝集成，自动化构建、测试和部署 |

#### 3.1.5 性能优化工具

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **图片优化** | Next.js Image | 自动格式转换（WebP/AVIF），懒加载，响应式尺寸，避免布局偏移 |
| **代码分割** | Next.js 自动分割 | 按路由自动分割，动态导入组件，减少首屏加载时间 |
| **CDN加速** | Vercel Edge Network / Cloudflare | 全球CDN节点，最近距离访问，静态资源缓存 |
| **压缩优化** | Gzip / Brotli | 服务器端自动压缩，减小传输体积，加快页面加载 |

#### 3.1.6 部署与运维

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **前端部署** | Vercel / Netlify | 专为Next.js优化，Serverless Functions支持，CI/CD自动化，预览部署 |
| **域名解析** | Cloudflare | DNS解析加速，免费的SSL证书，DDOS防护 |
| **监控分析** | Google Analytics / Plausible | 网站流量分析，用户行为追踪，无Cookie合规方案 |
| **错误监控** | Sentry | 实时错误追踪，性能监控，源地图支持 |

#### 3.1.7 数据存储与数据库

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **数据库** | sql.js (SQLite WebAssembly) | 纯前端数据库，无需后端服务器，数据持久化到浏览器，支持完整SQLite功能，适合MVP快速开发 |
| **数据同步** | LocalStorage/IndexedDB | 本地存储，数据持久化，离线可用 |

#### 3.1.8 支付与第三方服务

| 技术领域 | 技术选型 | 选型理由 |
|---------|---------|----------|
| **移动支付** | MTN Mobile Money API | 加纳主流移动支付，用户基数大，信任度高 |
| **客服集成** | WhatsApp Business API | 本地化沟通渠道，适配加纳用户习惯，支持快速询盘与售后 |
| **地图服务** | Google Maps API / Leaflet | 地址定位、配送范围展示、本地服务点展示 |

### 4.2 非功能需求与运维预期

#### 4.2.1 可用性与性能
- 首屏渲染时间：移动端<=3秒，桌面端<=2秒
- 页面交互延迟：关键按钮响应<=200ms
- 并发支持：首期目标1000日活用户，后续扩展到5000+日活
- 缓存策略：静态资源CDN、API响应本地缓存、图片懒加载

#### 4.2.2 可扩展性与维护性
- 代码可维护：TypeScript类型检查、组件复用、模块化结构
- 架构可演进：前端先行实现MVP，后续可接入后端服务、数据库和微服务
- 模块分离：商品、订单、支付、询盘、用户、后台管理模块独立

#### 4.2.3 安全与合规
- 认证与授权：JWT令牌、RBAC权限校验、后台接口强校验
- 数据安全：敏感信息加密存储、HTTPS全站访问
- 审计与日志：关键后台操作日志记录、异常告警、错误追踪
- 本地法规：遵循加纳电商支付合规、隐私保护和数据保留要求

#### 4.2.4 监控与运维
- 错误监控：Sentry异常跟踪
- 访问分析：GA/Plausible流量分析
- 部署监控：CI/CD构建结果、预览部署、自动回滚策略
- 数据备份：定期数据导出（MVP可按需人工备份，后续自动化）

### 4.3 架构演进与扩展方向
- MVP阶段：前端优先、数据本地化、支付流程模拟、最少后台权限
- 后续迭代：接入后端API、数据库、订单对账、实际支付网关、仓储管理、财务对账
- 长期目标：支持企业客户账期、代理商分销、CRM对接、物流服务商接口

#### 4.3.1 MVP架构边界
- 业务优先：优先实现商品展示、购物流程、询盘提交、后台基础管理
- 核心边界：支付接入可先实现模拟流程，避免上线初期依赖真实第三方接口
- 迭代原则：先验证商业价值，再引入复杂系统，如库存同步、物流跟踪、账期审批

#### 4.3.2 后端演进建议
- 订单与支付：独立后端服务管理订单、支付、对账、回调
- 客户与权限：RBAC与审计服务，支持多角色、多账号体系
- 数据层：MySQL/PostgreSQL + Redis缓存，未来可拆分至微服务

### 3.2 项目结构规范
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 国际化路由
│   │   ├── page.tsx       # 首页
│   │   ├── products/      # 商品相关页面
│   │   │   ├── page.tsx   # 商品列表
│   │   │   └── [id]/
│   │   │       └── page.tsx # 商品详情
│   │   ├── cart/
│   │   │   └── page.tsx   # 购物车
│   │   ├── checkout/
│   │   │   ├── page.tsx   # 结算页
│   │   │   └── confirmation/
│   │   │       └── page.tsx # 订单确认
│   │   ├── contact/
│   │   │   └── page.tsx   # 联系我们/询盘
│   │   └── layout.tsx     # 布局
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── ui/               # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── layout/            # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileNav.tsx
│   ├── product/          # 商品相关组件
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   ├── ProductSort.tsx
│   │   └── ProductTabs.tsx
│   ├── cart/             # 购物车组件
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   ├── checkout/         # 结算组件
│   │   ├── CheckoutForm.tsx
│   │   ├── PaymentOptions.tsx
│   │   ├── MomoPayment.tsx
│   │   └── OrderSummary.tsx
│   └── contact/          # 联系表单组件
│       ├── ContactInfo.tsx
│       ├── InquiryForm.tsx
│       └── ContactMap.tsx
├── lib/                   # 工具函数
│   ├── utils.ts          # 通用工具
│   ├── constants.ts      # 常量定义
│   └── validation.ts     # 表单验证
├── hooks/                 # 自定义Hooks
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useTranslation.ts
├── context/              # React Context
│   ├── CartContext.tsx
│   ├── LanguageContext.tsx
│   └── UIContext.tsx
├── types/                # TypeScript类型定义
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   └── inquiry.ts
├── messages/             # 国际化文件
│   ├── en.json           # 英文
│   └── zh.json           # 中文
└── data/                 # 静态数据（模拟数据库）
    ├── products.ts
    ├── categories.ts
    └── shipping.ts
```

### 3.3 数据模型（模拟）

由于数据库暂不启用，使用TypeScript接口定义数据模型，为后续集成数据库做准备：

```typescript
// src/types/product.ts

export interface BulkPrice {
  quantity: number;
  discount: number; // 百分比折扣
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  nameZh?: string; // 中文名称
  description: string;
  descriptionZh?: string; // 中文描述
  price: number;  // GHS
  currency: 'GHS';
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  specifications: Record<string, string>;
  specificationsZh?: Record<string, string>;
  stock: StockStatus;
  stockCount?: number;
  rating?: number;
  reviewCount?: number;
  minOrderQuantity?: number;
  bulkPricing?: BulkPrice[];
  applicationScenarios?: string[];
  shippingInfo?: {
    weight: string;
    dimensions?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// src/types/cart.ts

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedBulkPrice?: BulkPrice;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

// src/types/order.ts

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  landmark?: string; // 地标描述
}

export type PaymentMethod = 'momo' | 'cod';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// src/types/inquiry.ts

export type InquirySubject = 'general' | 'product' | 'bulk_order' | 'custom' | 'other';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: InquirySubject;
  productInterest?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}
```

---

## 5. 设计系统

### 4.1 品牌个性定位
**核心定位：** 专业可靠型工业品电商

**目标情感层次：**
1. **第一层感受**：专业信任（工业采购决策谨慎，需要建立可靠感）
2. **第二层感受**：高效便捷（简化采购流程，体现本地化服务优势）
3. **第三层感受**：品质保障（强调产品质量和售后服务）

**差异化策略：**
- 不是通用电商平台，而是专注工业领域的垂直电商
- 不是纯线上商店，而是提供本地技术支持和快速配送的服务商
- 核心差异：深耕加纳市场 + 本地支付支持 + 专业技术咨询

### 4.2 整体风格
**风格定义：** 专业工业风（Professional Industrial）

**核心调性：** 稳重、可靠、高效、本地化亲和

**设计目标：** 通过深蓝色系传递专业信任感，橙色强调色刺激转化行动，严谨布局降低信息获取成本，让加纳商户快速找到所需产品并完成购买。

### 4.3 色彩方案
基于PRD中定义的品牌视觉策略：

| 用途 | 色值 | HEX | 说明 |
|------|------|-----|------|
| **主色（Primary）** | 深蓝 | #1E3A5F | 导航栏、页脚、一级标题、品牌Logo |
| **辅色（Secondary）** | 工业灰 | #6B7280 | 次要文字、边框、分割线、图标 |
| **强调色（Accent）** | 活力橙 | #FF6B35 | CTA按钮、价格标签、促销信息、库存紧张提示 |
| **信任色（Success）** | 成功绿 | #10B981 | 库存充足、成功提示、好评星级 |
| **警告色（Warning）** | 警示橙 | #F59E0B | 低库存提示（非红色，保持专业感） |
| **错误色（Error）** | 错误红 | #EF4444 | 表单错误、失败状态 |
| **背景色（Background）** | 纯白 | #FFFFFF | 页面主背景 |
| **次要背景** | 浅灰 | #F9FAFB | 卡片背景、分割区域 |
| **文字主色** | 深黑 | #111827 | 标题、重要信息 |
| **文字次色** | 中灰 | #6B7280 | 辅助说明文字 |
| **边框色** | 边框灰 | #E5E7EB | 边框、分割线 |

### 4.4 Tailwind CSS配置
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          50: '#E8EDF3',
          100: '#D1DBE7',
          200: '#A3B7CF',
          300: '#7593B7',
          400: '#476F9F',
          500: '#1E3A5F',
          600: '#1A3354',
          700: '#162C49',
          800: '#12253E',
          900: '#0E1E33',
        },
        accent: {
          DEFAULT: '#FF6B35',
          hover: '#E55A2B',
          light: '#FFF0EB',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
}
```

### 4.5 字体系统
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### 4.6 间距系统
```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### 4.7 圆角与阴影
```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;

--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### 4.8 动效规范
**原则：** 克制专业、反馈明确、不过度花哨

| 场景 | 效果 | 时长 | 缓动函数 | 说明 |
|------|------|------|----------|------|
| CTA按钮hover | 上浮2px + 阴影加深 + 亮度+10% | 200ms | ease-out | 清晰的点击反馈 |
| 商品卡片hover | 上浮4px + 阴影增强 + Add to Cart淡入 | 300ms | cubic-bezier(0.4, 0, 0.2, 1) | 引导用户操作 |
| 购物车数量更新 | 数字弹跳scale(1.2→1) | 250ms | ease-out | 即时反馈 |
| 表单提交成功 | 对勾图标绘制动画 + 消息淡入 | 400ms | ease-in-out | 成功确认 |
| 图片加载 | 骨架屏 → 淡入 | 300ms | ease | 减少感知加载时间 |
| 滚动触发 | 淡入 + translateY(20px→0) | 500ms | ease-out | 内容进入提示 |
| 列表项交错 | 依次淡入，每项间隔80ms | 500ms | ease-out | 页面丰富感 |

**禁用效果：**
- ❌ 弹跳、抖动动画（不符合工业品专业调性）
- ❌ 闪烁、脉冲效果（保持B2B专业感）
- ❌ 视差滚动（可能影响加载速度，加纳网络环境需考虑）
- ❌ 复杂的页面过渡动画

---

## 6. 响应式策略

### 5.1 断点定义与布局策略

| 设备 | 宽度 | 布局策略 | 商品网格 | 转化重点 |
|------|------|----------|----------|----------|
| **移动端** | < 768px | 单列布局，导航折叠为汉堡菜单 | 1-2列 | 快速查找商品，固定底部购物车和CTA |
| **平板** | 768px - 1023px | 2列商品网格，侧边筛选器可折叠 | 2-3列 | 平衡信息密度与操作便捷性 |
| **桌面端** | ≥ 1024px | 3-4列商品网格，完整导航和筛选器 | 3-4列 | 多任务浏览，快速对比商品 |

### 5.2 移动端优先决策

**背景：** 加纳市场智能手机普及率高，移动端流量占比预计超过70%

**设计决策：**
- 首屏内容精简，核心CTA突出
- 图片使用WebP格式 + 懒加载，减小带宽占用
- 固定底部购物车图标（显示数量徽章）
- WhatsApp咨询浮窗固定显示
- 触摸友好的按钮尺寸（最小48px）
- 表单输入优化（自动聚焦、大键盘等）

### 5.3 关键组件适配规则

#### 5.3.1 导航栏
**移动端（<768px）：**
- 左侧汉堡菜单，点击展开抽屉式导航
- 右上角：购物车图标 + 语言切换
- Logo居中或左侧

**桌面端（≥1024px）：**
- Logo左侧，水平导航居中/右侧
- 完整分类下拉菜单
- 搜索框（可折叠）
- 购物车图标 + 数量徽章
- 语言切换下拉

#### 5.3.2 商品列表
**移动端：**
- 单列纵向布局
- 商品卡片紧凑显示
- 图片占比50%，价格和CTA紧凑
- 筛选器折叠为"Filter"按钮，点击弹出全屏抽屉
- 支持价格滑块筛选

**桌面端：**
- 3-4列网格布局
- 图片占比60%
- Hover显示"Add to Cart"按钮
- 左侧固定侧边栏筛选器

#### 5.3.3 商品详情
**移动端：**
- 垂直滚动布局
- 图片轮播在上，信息和CTA在下
- 底部固定"Add to Cart"按钮（高度56px，宽度100%-32px）
- Tab区域可折叠

**桌面端：**
- 左右分栏布局
- 左侧：商品图片（60%宽度）
- 右侧：商品信息（40%宽度）
- 无需滚动即可看到CTA和价格

#### 5.3.4 购物车
**移动端：**
- 商品列表可滑动
- 左右滑动删除商品
- 结算栏固定在底部
- CTA按钮宽度100%-32px

**桌面端：**
- 左右分栏
- 左：商品列表（70%宽度）
- 右：结算栏（30%宽度，固定）
- Hover显示删除按钮

#### 5.3.5 CTA按钮
**移动端：**
- 最小高度48px（符合触摸区域标准）
- 固定底部按钮宽度100%-32px（左右留白16px）
- 橙色主CTA醒目显示

**桌面端：**
- 标准高度44px
- 宽度根据内容自适应
- Hover效果：上浮+阴影

---

## 7. 页面结构与功能

### 6.1 首页（Home）

#### 6.1.1 Hero轮播区（首屏）
**轮播内容（3-4张Banner）：**
1. **Banner 1 - Mining Equipment**
   - 图片：矿产机械大图（真实工作场景）
   - 标题："Heavy-Duty Mining Equipment for Ghana's Growing Industry"
   - CTA：Shop Now（橙色主按钮）

2. **Banner 2 - Safety Equipment**
   - 图片：劳保用品场景图
   - 标题："Safety First - Premium PPE for Every Worker"
   - CTA：Shop Now

3. **Banner 3 - Service Promise**
   - 图片：服务承诺图
   - 标题："Fast Delivery | Local Support | Competitive Pricing"
   - CTA：Request a Quote（透明边框次按钮）

**视觉规范：**
- 背景：深色遮罩（rgba(0,0,0,0.5)）确保文字可读
- 文字：白色，大标题32-48px
- 按钮位置：左下或居中
- 轮播指示器：底部圆点（当前橙色）
- 自动轮播：5秒间隔，支持手势滑动

#### 6.1.2 分类导航区
**标题：** "Browse by Category"

**布局：** 网格卡片（桌面4列 / 平板2列 / 移动1列）

**品类卡片：**
- Mining Machinery（⛏️ 图标）
- Safety Equipment（🦺 图标）
- Industrial Tools（🔧 图标）
- Spare Parts（⚙️ 图标）

**卡片规范：**
- 尺寸：固定比例，响应式
- 图片/图标居中
- 品类名称底部
- 悬停效果：轻微上浮4px + 阴影加深
- 点击跳转对应分类页

#### 6.1.3 热销商品区
**标题：** "Best Sellers"

**布局：** 商品网格（桌面4列 / 平板2列 / 移动2列）

**商品卡片元素：**
- 商品主图（白色背景，统一尺寸）
- 商品名称（2行截断）
- 价格（GHS货币符号，醒目显示）
- 库存状态：
  - "In Stock"：绿色标签
  - "Only X Left"：橙色警告（非红色）
- "Add to Cart"按钮（悬停时淡入显示）

#### 6.1.4 信任背书区
**标题：** "Why Choose Li's Industrial?"

**布局：** 4个优势卡片网格

**优势内容：**
1. **Quality Guaranteed** - 图标 + "Premium Products from Trusted Brands"
2. **Fast Nationwide Delivery** - 图标 + "Delivery Across Ghana in 3-5 Days"
3. **Expert Technical Support** - 图标 + "Professional Consultation Available"
4. **Competitive Pricing** - 图标 + "Best Prices Guaranteed"

**视觉：** 图标使用主色，文字清晰

#### 6.1.5 行动号召区（底部CTA）
**背景：** 深色（primary色 #1E3A5F）

**内容：**
- 文案："Ready to Equip Your Business?"
- 主CTA按钮："Contact Us Today"（橙色）
- 次CTA：WhatsApp直接链接按钮

#### 6.1.6 页脚（Footer）
**布局：** 4列网格（桌面）/ 2列堆叠（移动）

**内容：**
- 公司信息（Logo、简介、社交链接）
- 快速链接（首页、商品、询盘、联系方式）
- 商品分类
- 联系方式（地址、电话、邮箱、WhatsApp）
- 支付方式图标
- 版权信息

### 6.2 商品列表页（Products）

#### 6.2.1 筛选功能
**桌面端：** 左侧固定侧边栏

**移动端：** "Filter"按钮，点击弹出全屏抽屉

**筛选维度：**
- **价格区间**：滑块选择（Min - Max）
- **品类**：多选checkbox
  - Mining Machinery
  - Safety Equipment
  - Industrial Tools
  - Spare Parts
- **库存状态**：单选
  - All
  - In Stock Only
  - Low Stock Only
- **品牌**：多选checkbox

**筛选操作：**
- 立即生效（实时筛选）
- "Clear All"清除筛选
- 显示筛选结果数量

#### 6.2.2 排序功能
**位置：** 商品列表顶部右侧

**选项：**
- Featured（默认）
- Price: Low to High
- Price: High to Low
- Newest Arrivals
- Best Selling

**样式：** Select下拉框

#### 6.2.3 商品网格
**布局：** 响应式网格（桌面4列 / 平板2列 / 移动2列）

**卡片样式：** 与首页热销区一致

#### 6.2.4 分页/加载
**方式：** "Load More"按钮加载更多

**显示：** "Showing X of Y products"

### 6.3 商品详情页（Product Detail）

#### 6.3.1 左侧区域 - 图片展示
**图片轮播：**
- 主图：大尺寸，支持点击放大
- 缩略图：下排横向排列，点击切换
- 支持左右箭头切换
- 移动端支持手势滑动

**放大功能：**
- 点击主图打开Modal放大查看
- 支持鼠标滚轮缩放（桌面端）

#### 6.3.2 右侧区域 - 商品信息
**信息层级：**
1. 商品名称（大标题）
2. 商品编号/SKU（次要）
3. 价格（GHS，大号字体醒目）
4. 评分和评价数（星级展示）
5. 库存状态（颜色标签）

**数量选择器：**
- 减号/数字/加号
- 最小1，最大为库存数
- 支持键盘输入

**CTA按钮组：**
- **Add to Cart**：橙色主按钮，全宽（移动端固定底部）
- **Buy Now**：透明边框次按钮
- **Request Quote**：文本链接，适合大额采购

**批量优惠提示：**
- 显示"Buy More, Save More"
- 展开阶梯价格表

**快速信息：**
- 配送时间："Delivery in Accra: 1-2 days"
- 退换政策："7-Day Return Policy"
- 库存状态："X items available"

#### 6.3.3 下方Tab区域
**Tab选项卡：**
- Description（描述）
- Specifications（规格参数）
- Reviews（评价）

**Description Tab：**
- 详细产品描述
- 应用场景说明
- 包含图片说明

**Specifications Tab：**
- 表格形式展示参数
- 参数名称 | 参数值
- 清晰的网格布局

**Reviews Tab：**
- 平均评分（星级 + 数字）
- 评价列表
- 每条评价：用户名、日期、星级、内容
- "Write a Review"按钮（可选）

### 6.4 购物车页（Cart）

#### 6.4.1 商品列表区
**商品项（CartItem）：**
- 商品图片（缩略图）
- 商品名称（可点击跳转详情）
- 单价（GHS）
- 数量调整器（+/-按钮）
- 小计（GHS）
- 删除按钮（桌面hover显示，移动端固定显示）

**移动端特性：**
- 支持左滑显示删除按钮
- 删除需二次确认

#### 6.4.2 结算栏（右侧/底部固定）
**信息展示：**
- 商品总数："X items"
- 小计（Subtotal）
- 运费估算（根据收货地址）
- 总计（醒目显示）

**运费估算：**
- 根据选择的地区显示
- 未选择地址时显示"Calculated at checkout"

**优惠码输入（可选）：**
- 输入框 + 应用按钮
- 成功后显示折扣

**CTA按钮：**
- "Proceed to Checkout"（橙色主按钮，全宽）

### 6.5 结算页（Checkout）

#### 6.5.1 收货信息表单（左侧）
**表单字段：**
1. **Full Name**（必填）
   - 输入框，姓名

2. **Phone Number**（必填）
   - 输入框，+233前缀
   - 手机号格式验证

3. **Email**（可选）
   - 输入框，邮箱格式验证

4. **Address Line 1**（必填）
   - 输入框，详细地址

5. **Address Line 2**（可选）
   - 输入框，地标或补充说明

6. **City/Town**（必填）
   - 下拉选择：
     - Accra
     - Kumasi
     - Takoradi
     - Cape Coast
     - Other

7. **Region**（必填）
   - 下拉选择：
     - Greater Accra
     - Ashanti
     - Western
     - Central
     - Other

**表单验证：**
- 实时验证
- 错误提示在字段下方
- 红色边框标识错误字段

#### 6.5.2 订单摘要（右侧）
**内容：**
- 商品列表（图片、名称、数量、价格）
- 小计
- 运费
- 总计

#### 6.5.3 支付方式选择
**选项：**

1. **MTN Mobile Money**（推荐，优先显示）
   - MTN Logo图标
   - 标签："Recommended"
   - 说明："Pay with your MTN Mobile Money account"

2. **Cash on Delivery (COD)**
   - 图标：现金图标
   - 说明："Pay when you receive your order"

**MTN Mobile Money支付流程UI：**
1. 选择MTN Mobile Money
2. 显示输入框："Enter your MTN number"
3. 格式提示："+233 XX XXX XXXX"
4. 说明："You'll receive a prompt on your phone to confirm payment"
5. CTA："Place Order"

#### 6.5.4 订单提交
**CTA按钮：** "Place Order"（橙色主按钮）

**点击后：**
- 显示加载状态
- 跳转到订单确认页

### 6.6 订单确认页（Order Confirmation）

#### 6.6.1 成功提示
**图标：** 绿色对勾图标（大尺寸）
**标题：** "Order Placed Successfully!"（绿色文字）
**订单号：** "Order #XXXXXX"（醒目显示）

#### 6.6.2 订单摘要
- 商品列表
- 收货信息
- 支付方式
- 订单金额明细

#### 6.6.3 下一步指引
**文案：** "Thank you for your order! We'll contact you within 24 hours to confirm delivery details."

**附加信息：**
- "You can track your order status in your email"
- WhatsApp客服链接

#### 6.6.4 CTA按钮
- "Continue Shopping"（橙色主按钮）
- "Track Order"（次要按钮，可选）

### 6.7 联系我们页（Contact）

#### 6.7.1 联系信息卡片（左侧）
**信息内容：**
- **地址：** Physical address in Accra, Ghana
- **电话：** +233 XX XXX XXXX
- **邮箱：** info@lisindustrial.gh
- **WhatsApp：** wa.me链接，一键咨询
- **营业时间：** Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM

**地图：** 嵌入Google Maps显示Accra位置

#### 6.7.2 询盘表单（右侧）
**表单字段：**
1. **Name**（必填）- 姓名
2. **Email**（必填）- 邮箱
3. **Phone**（必填）- 电话
4. **Subject**（必填）- 下拉选择
   - General Inquiry
   - Product Inquiry
   - Bulk Order
   - Custom Requirements
   - Other
5. **Product Interest**（可选）- 商品名称/编号
6. **Message**（必填）- textarea，留言内容

**提交按钮：** "Submit Inquiry"（橙色）

**提交成功：**
- 显示成功提示
- "Thank you for your inquiry! We'll respond within 24 hours."
- 可选：显示联系人或WhatsApp选项

---

## 8. 后台管理系统

### 8.1 后台系统概述

#### 8.1.1 系统定位
后台管理系统（Admin Dashboard）是面向内部运营人员的Web应用，与前台电商网站共用同一技术栈，但独立部署和管理。

#### 8.1.2 技术架构
| 技术领域 | 技术选型 | 说明 |
|---------|---------|------|
| **前端框架** | Next.js 14 (App Router) | 与前台共用，复用组件库 |
| **状态管理** | React Context + React Query | 与前台共用 |
| **UI组件** | 基础UI组件 + 后台专用组件 | 基于前台组件库扩展 |
| **图表库** | Recharts | 数据可视化 |
| **表格组件** | TanStack Table | 高性能数据表格 |
| **认证方式** | JWT Token | 无状态认证 |

#### 8.1.3 访问控制
| 项目 | 说明 |
|------|------|
| **访问路径** | `/admin` |
| **登录页面** | `/admin/login` |
| **认证方式** | 邮箱 + 密码 + 验证码 |
| **Token有效期** | 7天（刷新Token） |
| **权限控制** | 基于角色的访问控制（RBAC） |

### 8.2 后台页面结构

#### 8.2.1 页面目录

```
/admin
├── /login                 # 登录页
├── /dashboard           # 数据概览
├── /products            # 商品管理
│   ├── /list            # 商品列表
│   ├── /create          # 新增商品
│   └── /[id]/edit       # 编辑商品
├── /categories          # 分类管理
├── /orders              # 订单管理
│   ├── /list            # 订单列表
│   └── /[id]            # 订单详情
├── /inquiries           # 询盘管理
│   ├── /list            # 询盘列表
│   └── /[id]            # 询盘详情
└── /settings            # 系统设置
    ├── /profile         # 个人资料
    └── /users          # 用户管理（仅超级管理员）
```

#### 8.2.2 页面层级

```
后台首页（Dashboard）
├── 侧边导航栏
│   ├── 首页概览
│   ├── 商品管理
│   │   ├── 商品列表
│   │   ├── 新增商品
│   │   └── 商品分类
│   ├── 订单管理
│   │   ├── 全部订单
│   │   ├── 待处理
│   │   ├── 已发货
│   │   └── 已完成
│   ├── 询盘管理
│   │   ├── 全部询盘
│   │   ├── 待回复
│   │   └── 已回复
│   └── 系统设置（仅管理员）
│       ├── 个人资料
│       └── 用户管理
└── 顶部导航栏
    ├── 搜索框
    ├── 通知铃铛
    └── 用户头像
```

### 8.3 功能模块详细规划

#### 8.3.1 登录认证模块

**登录页面（/admin/login）**

| 元素 | 说明 |
|------|------|
| Logo | 公司Logo |
| 标题 | "Li's Industrial Admin" |
| 邮箱输入 | admin@lisindustrial.gh |
| 密码输入 | 安全密码框 |
| 验证码 | 4位图形验证码 |
| 记住登录 | Checkbox |
| 登录按钮 | 橙色主按钮 |
| 忘记密码 | 链接（仅超级管理员可重置） |

**登录流程：**
1. 输入邮箱、密码、验证码
2. 前端验证格式
3. 提交后端验证
4. 成功返回JWT Token
5. 存储Token到Cookie
6. 跳转到Dashboard

**安全策略：**
- 连续5次登录失败，锁定30分钟
- 密码强度要求：8位以上，包含大小写和数字
- Token HTTP Only，防止XSS攻击
- 敏感操作需重新验证

#### 8.3.2 数据概览模块

**首页仪表盘（/admin/dashboard）**

**核心指标卡片（4个）：**

| 指标 | 图标 | 说明 | 颜色 |
|------|------|------|------|
| **今日订单** | 📦 | 当日新订单数量 | 蓝色 |
| **今日销售额** | 💰 | 当日成交金额（GHS） | 绿色 |
| **待处理询盘** | 💬 | 待回复询盘数量 | 橙色 |
| **低库存预警** | ⚠️ | 库存不足商品数 | 红色 |

**数据图表（2个）：**

| 图表 | 类型 | 说明 |
|------|------|------|
| **销售趋势图** | 折线图 | 近7天/30天销售额趋势 |
| **订单状态分布** | 饼图 | 各状态订单占比 |

**快捷操作区：**

| 操作 | 说明 |
|------|------|
| 新增商品 | 快速添加商品 |
| 处理订单 | 跳转待处理订单列表 |
| 回复询盘 | 跳转待回复询盘列表 |
| 查看报表 | 跳转销售报表（功能预留） |

**最新动态（Timeline）：**

- 显示最近10条系统动态
- 包含：订单创建、询盘提交、库存预警等
- 每条显示：时间、类型、简要描述

#### 8.3.3 商品管理模块

**8.3.3.1 商品列表页（/admin/products）**

**功能特性：**
- 支持多条件筛选（分类、状态、品牌、价格区间）
- 支持关键词搜索（商品名称、SKU）
- 支持排序（创建时间、价格、库存）
- 支持批量操作（上下架、删除）
- 分页展示（每页20条）

**表格列字段：**

| 字段 | 宽度 | 说明 |
|------|------|------|
| 复选框 | 40px | 全选/单选 |
| 商品图片 | 60px | 缩略图 |
| 商品名称 | 200px | 显示名称和SKU |
| 分类 | 100px | 所属分类 |
| 价格 | 80px | GHS货币 |
| 库存 | 80px | 当前库存数 |
| 状态 | 80px | 上架/下架标签 |
| 操作 | 120px | 编辑/删除按钮 |

**筛选器：**

| 筛选项 | 类型 | 说明 |
|--------|------|------|
| 关键词 | 输入框 | 商品名称/SKU搜索 |
| 分类 | 下拉多选 | 商品分类 |
| 品牌 | 下拉多选 | 品牌筛选 |
| 状态 | 单选 | 全部/上架/下架 |
| 库存状态 | 单选 | 全部/充足/不足/缺货 |
| 价格区间 | 滑块 | 最小-最大价格 |

**批量操作：**

| 操作 | 说明 |
|------|------|
| 批量上架 | 选中的下架商品设为上架 |
| 批量下架 | 选中的上架商品设为下架 |
| 批量删除 | 删除选中商品（需确认） |

**8.3.3.2 新增商品页（/admin/products/create）**

**表单字段：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 商品名称 | 输入框 | ✅ | 中文名称 |
| 商品名称（英文） | 输入框 | ✅ | 英文名称 |
| SKU编码 | 输入框 | ✅ | 自动生成或手动输入 |
| 商品分类 | 树形选择 | ✅ | 支持多级分类 |
| 品牌 | 下拉选择 | ❌ | 品牌选择 |
| 价格 | 数字输入 | ✅ | GHS货币 |
| 原价 | 数字输入 | ❌ | 划线价格 |
| 库存数量 | 数字输入 | ✅ | 初始库存 |
| 库存预警值 | 数字输入 | ❌ | 低于此值预警 |
| 商品重量 | 数字输入 | ❌ | 用于运费计算 |
| 商品图片 | 图片上传 | ✅ | 最多9张，支持拖拽排序 |
| 商品详情 | 富文本编辑器 | ✅ | 支持图片上传 |
| 规格参数 | 键值对列表 | ❌ | 可添加多组规格 |
| 批量定价 | 阶梯表格 | ❌ | 数量-折扣对照表 |
| SEO信息 | 折叠面板 | ❌ | Title、Description |

**图片上传规范：**

| 项目 | 规范 |
|------|------|
| 支持格式 | JPG、PNG、WebP |
| 图片尺寸 | 最少800×800像素 |
| 文件大小 | 单张不超过5MB |
| 数量限制 | 最多9张 |
| 第一张 | 设为封面图 |

**规格参数示例：**
```
材质: 碳化钨
直径: 20mm
长度: 300mm
重量: 2.5kg
```

**8.3.3.3 编辑商品页（/admin/products/[id]/edit）**

- 页面结构与新增商品页相同
- 表单预填充商品现有数据
- 保存时更新商品信息
- 保存后返回商品列表

**8.3.3.4 分类管理页（/admin/categories）**

**功能特性：**
- 树形结构展示分类
- 支持拖拽排序
- 支持新增、编辑、删除
- 显示分类下的商品数量

**分类字段：**

| 字段 | 说明 |
|------|------|
| 分类名称 | 中文名称 |
| 分类名称（英文） | 英文名称 |
| 上级分类 | 父级分类选择 |
| 分类图标 | Icon选择或上传 |
| 排序权重 | 数字，值越大越靠前 |
| 状态 | 显示/隐藏 |

#### 8.3.4 订单管理模块

**8.3.4.1 订单列表页（/admin/orders）**

**功能特性：**
- 支持多条件筛选（状态、支付方式、时间区间）
- 支持关键词搜索（订单号、收货人、电话）
- 支持排序（下单时间、订单金额）
- 支持批量操作（导出Excel）
- 分页展示（每页20条）

**订单状态：**

| 状态 | 标识颜色 | 说明 |
|------|----------|------|
| **待付款** | 橙色 | 等待客户完成支付 |
| **已付款** | 蓝色 | 支付成功，待发货 |
| **配货中** | 紫色 | 仓库正在配货 |
| **已发货** | 青色 | 已发出，等待收货 |
| **已完成** | 绿色 | 客户确认收货 |
| **已取消** | 灰色 | 订单取消 |
| **退款中** | 红色 | 退款处理中 |
| **已退款** | 深灰 | 退款完成 |

**表格列字段：**

| 字段 | 宽度 | 说明 |
|------|------|------|
| 订单号 | 120px | 点击可复制 |
| 下单时间 | 140px | YYYY-MM-DD HH:mm |
| 收货人 | 100px | 姓名 |
| 联系电话 | 120px | 电话号码 |
| 订单金额 | 100px | GHS货币 |
| 支付方式 | 80px | MOMO/COD |
| 订单状态 | 100px | 状态标签 |
| 操作 | 120px | 查看/处理按钮 |

**筛选器：**

| 筛选项 | 类型 | 说明 |
|--------|------|------|
| 订单号 | 输入框 | 精确或模糊搜索 |
| 收货人 | 输入框 | 姓名搜索 |
| 联系电话 | 输入框 | 电话搜索 |
| 订单状态 | 多选 | 支持多状态筛选 |
| 支付状态 | 单选 | 已付/未付 |
| 下单时间 | 日期范围选择 | 开始-结束日期 |
| 配送区域 | 下拉选择 | 地区筛选 |

**8.3.4.2 订单详情页（/admin/orders/[id]）**

**页面结构：**

**订单基础信息：**
- 订单号（可复制）
- 下单时间
- 订单状态（可更改）
- 支付状态
- 支付方式
- 支付时间（如果已支付）

**收货人信息：**
- 姓名
- 电话
- 详细地址
- 地区/城市
- 地标（可选）

**商品明细：**
| 字段 | 说明 |
|------|------|
| 商品图片 | 缩略图 |
| 商品名称 | 显示中英文 |
| SKU | 商品编码 |
| 单价 | GHS |
| 数量 | 购买数量 |
| 小计 | 单价×数量 |

**费用明细：**
| 项目 | 金额 |
|------|------|
| 商品小计 | ₵XXX |
| 运费 | ₵XX |
| 订单总计 | ₵XXX |
| 实付金额 | ₵XXX |

**订单操作日志：**
- 记录所有状态变更
- 包含：时间、操作人、操作类型、备注

**操作按钮：**
| 按钮 | 权限 | 说明 |
|------|------|------|
| 确认订单 | 客服/仓储 | 确认订单信息 |
| 配货 | 仓储 | 开始配货流程 |
| 发货 | 仓储 | 填写物流信息 |
| 取消订单 | 客服 | 取消订单（需备注原因） |
| 添加备注 | 客服 | 内部备注（客户不可见） |
| 退款 | 财务 | 发起退款流程 |

**8.3.4.3 订单发货功能**

**发货表单：**
| 字段 | 类型 | 说明 |
|------|------|------|
| 物流公司 | 下拉选择 | 自定义或添加新物流 |
| 物流单号 | 输入框 | 快递单号 |
| 预计到达 | 日期选择 | 预计送达日期 |
| 发货备注 | textarea | 给客户的备注 |

**发货通知：**
- 自动发送邮件通知客户
- 自动发送WhatsApp消息（如果客户提供了号码）

#### 8.3.5 询盘管理模块

**8.3.5.1 询盘列表页（/admin/inquiries）**

**功能特性：**
- 支持多条件筛选（状态、来源、时间）
- 支持关键词搜索（姓名、电话、内容）
- 支持按优先级排序
- 支持导出询盘记录
- 分页展示（每页20条）

**询盘状态：**

| 状态 | 标识颜色 | 说明 |
|------|----------|------|
| **待回复** | 橙色 | 新收到的询盘 |
| **处理中** | 蓝色 | 正在沟通 |
| **已报价** | 紫色 | 已发送报价 |
| **已成交** | 绿色 | 询盘转化为订单 |
| **已关闭** | 灰色 | 无效询盘或客户无响应 |

**表格列字段：**

| 字段 | 宽度 | 说明 |
|------|------|------|
| 询盘编号 | 100px | 自动编号 |
| 询盘时间 | 140px | 提交时间 |
| 客户姓名 | 100px | 提交者姓名 |
| 联系电话 | 120px | 电话号码 |
| 咨询类型 | 80px | 类型标签 |
| 商品 | 150px | 咨询的商品（如果有） |
| 状态 | 100px | 状态标签 |
| 操作 | 120px | 查看/处理按钮 |

**筛选器：**

| 筛选项 | 类型 | 说明 |
|--------|------|------|
| 关键词 | 输入框 | 姓名/电话/内容搜索 |
| 咨询类型 | 多选 | General/Product/Bulk等 |
| 状态 | 多选 | 支持多状态筛选 |
| 时间范围 | 日期选择 | 开始-结束日期 |

**8.3.5.2 询盘详情页（/admin/inquiries/[id]）**

**页面结构：**

**客户信息：**
- 姓名
- 邮箱
- 电话
- 咨询类型
- 提交时间

**询盘内容：**
- 商品名称（如果是商品咨询）
- 咨询详情（原文显示）

**沟通记录：**
- 时间线展示
- 包含所有回复记录
- 支持添加新回复

**回复表单：**
| 字段 | 类型 | 说明 |
|------|------|------|
| 回复方式 | 多选 | 邮件/WhatsApp/电话 |
| 回复内容 | 富文本编辑器 | 回复内容 |
| 附件 | 文件上传 | 可添加附件 |
| 报价信息 | 折叠面板 | 商品报价（可选） |
| 设为已回复 | checkbox | 提交后更新状态 |

**快捷操作：**
- 一键发送WhatsApp消息
- 一键复制邮箱地址
- 标记为重要询盘
- 转移给其他客服

#### 8.3.6 系统设置模块

**8.3.6.1 个人资料（/admin/settings/profile）**

**可修改信息：**
- 头像上传
- 姓名
- 邮箱（需验证）
- 手机号（需验证）
- 职位/部门

**8.3.6.2 密码修改**

**修改流程：**
1. 输入当前密码
2. 输入新密码
3. 确认新密码
4. 验证通过后修改

**8.3.6.3 用户管理（仅超级管理员）**

**用户列表：**
| 字段 | 说明 |
|------|------|
| 头像 | 用户头像 |
| 姓名 | 显示姓名 |
| 邮箱 | 登录邮箱 |
| 角色 | 所属角色 |
| 状态 | 启用/禁用 |
| 最后登录 | 登录时间 |
| 操作 | 编辑/禁用/重置密码 |

**新增用户表单：**
- 姓名
- 邮箱
- 手机号
- 角色选择
- 初始密码（自动生成或手动设置）

### 8.4 后台数据模型

#### 8.4.1 管理员模型

```typescript
// src/types/admin.ts

export interface Admin {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: AdminRole;
  department?: string;
  status: 'active' | 'inactive' | 'locked';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminRole = 
  | 'super_admin'      // 超级管理员
  | 'product_manager'  // 商品管理员
  | 'marketing_manager' // 运营管理员
  | 'customer_service' // 客服
  | 'warehouse'         // 仓储
  | 'finance';         // 财务

export interface AdminLoginLog {
  id: string;
  adminId: string;
  ip: string;
  userAgent: string;
  loginAt: string;
  status: 'success' | 'failed';
  failReason?: string;
}
```

#### 8.4.2 订单管理模型

```typescript
// src/types/admin-order.ts

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'momo' | 'cod';
  paymentAt?: string;
  
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  
  shippingInfo: {
    address: string;
    city: string;
    region: string;
    landmark?: string;
  };
  
  items: AdminOrderItem[];
  
  pricing: {
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
  };
  
  logistics?: {
    company: string;
    trackingNumber: string;
    shippedAt: string;
    estimatedDelivery?: string;
  };
  
  notes: OrderNote[];
  
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderNote {
  id: string;
  content: string;
  type: 'internal' | 'external';
  createdBy: string;
  createdAt: string;
}
```

#### 8.4.3 询盘管理模型

```typescript
// src/types/admin-inquiry.ts

export interface AdminInquiry {
  id: string;
  inquiryNumber: string;
  status: InquiryStatus;
  priority: 'normal' | 'high' | 'urgent';
  
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  
  subject: InquirySubject;
  productInterest?: string;
  message: string;
  
  responses: InquiryResponse[];
  
  assignedTo?: string;
  assignedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface InquiryResponse {
  id: string;
  content: string;
  method: 'email' | 'whatsapp' | 'phone';
  respondedBy: string;
  respondedAt: string;
  attachments?: string[];
}
```

### 8.5 后台组件规划

#### 8.5.1 后台基础组件

| 组件名 | 说明 | 特性 |
|--------|------|------|
| AdminLayout | 后台布局容器 | 侧边栏+顶部导航 |
| AdminTable | 数据表格 | 排序、筛选、分页、批量操作 |
| AdminForm | 后台表单 | 统一布局、验证、提交 |
| AdminModal | 后台弹窗 | 确认操作、详情查看 |
| AdminCard | 统计卡片 | 数值+图标+趋势 |
| AdminChart | 图表容器 | 统一样式封装 |
| AdminSidebar | 侧边导航 | 菜单+收起/展开 |
| AdminHeader | 顶部导航 | 搜索+通知+用户信息 |

#### 8.5.2 后台业务组件

| 组件名 | 所属模块 | 说明 |
|--------|----------|------|
| ProductForm | 商品管理 | 商品编辑表单 |
| ProductImageUpload | 商品管理 | 图片上传组件 |
| CategoryTree | 分类管理 | 树形分类选择 |
| OrderTimeline | 订单管理 | 订单状态时间线 |
| LogisticsForm | 订单管理 | 物流信息填写 |
| InquiryResponse | 询盘管理 | 询盘回复表单 |
| UserTable | 用户管理 | 用户列表表格 |
| RoleSelect | 用户管理 | 角色选择器 |

### 8.6 后台安全性设计

#### 8.6.1 认证机制

| 安全措施 | 说明 |
|----------|------|
| JWT Token | 无状态认证，7天有效期 |
| HTTP Only Cookie | 防止XSS攻击 |
| 密码加密 | bcrypt哈希，强度验证 |
| 登录限制 | 5次失败锁定30分钟 |
| 操作日志 | 记录所有管理操作 |
| IP白名单 | 可选，限制登录IP（仅超级管理员可配置） |

#### 8.6.2 权限控制

| 控制层级 | 实现方式 |
|----------|----------|
| 路由级别 | middleware拦截，未登录跳转登录页 |
| 页面级别 | 组件内检查权限，无权限显示403页面 |
| 操作级别 | 按钮级别权限控制，隐藏无权限按钮 |

#### 8.6.3 数据安全

| 措施 | 说明 |
|------|------|
| CSRF Token | 防止跨站请求伪造 |
| 输入过滤 | 防止SQL注入和XSS |
| 敏感数据 | 日志脱敏，不记录密码和Token |
| 数据备份 | 每日自动备份 |

### 8.7 后台响应式设计

#### 8.7.1 断点定义

| 设备 | 宽度 | 布局调整 |
|------|------|----------|
| **桌面端** | ≥ 1024px | 完整侧边栏+内容区 |
| **平板** | 768-1023px | 可折叠侧边栏 |
| **移动端** | < 768px | 底部Tab导航，汉堡菜单 |

#### 8.7.2 适配规则

**侧边栏：**
- 桌面端：固定宽度240px，常驻显示
- 平板端：可收起至64px，hover展开
- 移动端：隐藏，触发器展开为抽屉

**表格：**
- 桌面端：完整列展示
- 平板端：隐藏次要列
- 移动端：卡片式展示，每条记录一张卡片

**表单：**
- 桌面端：多列布局
- 平板端：两列布局
- 移动端：单列堆叠

---

## 9. 组件库定义

### 9.1 基础UI组件

#### 7.1.1 Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
```

**样式规范：**
- **Primary（橙色 #FF6B35）**：
  - 默认：橙色背景，白色文字
  - Hover：上浮2px + 阴影加深 + 亮度+10%
  - Active：按下效果
  - Disabled：灰色背景，50%透明度
  - Loading：显示spinner

- **Secondary（透明边框）**：
  - 默认：透明背景，主色边框，主色文字
  - Hover：主色背景，白色文字

- **Outline**：
  - 默认：透明背景，灰色边框，深色文字
  - Hover：浅灰背景

- **Ghost**：
  - 默认：透明背景，无边框
  - Hover：浅灰背景

**尺寸：**
- sm: 高度32px，内边距12px 16px
- md: 高度40px，内边距12px 20px
- lg: 高度48px，内边距16px 24px（移动端默认）

#### 7.1.2 Input
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'number';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}
```

**状态：**
- Default：灰色边框
- Focus：主色边框，阴影
- Error：红色边框，错误提示
- Disabled：灰色背景

#### 7.1.3 Select
```typescript
interface SelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  searchable?: boolean;
}
```

#### 7.1.4 Card
```typescript
interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
}
```

**规范：**
- 背景：白色
- 圆角：8px（radius-md）
- 阴影：shadow-sm
- Hover：shadow-md + translateY(-2px)

#### 7.1.5 Badge
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: ReactNode;
}
```

**颜色：**
- Success：绿色背景 #ECFDF5，绿色文字 #10B981
- Warning：橙色背景 #FFFBEB，橙色文字 #F59E0B
- Error：红色背景 #FEF2F2，红色文字 #EF4444
- Info：蓝色背景 #EFF6FF，蓝色文字 #3B82F6
- Neutral：灰色背景 #F3F4F6，灰色文字 #6B7280

#### 7.1.6 Modal
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
}
```

**规范：**
- 背景遮罩：黑色50%透明度
- 居中显示，最大高度90vh
- 移动端可全屏

#### 7.1.7 Drawer
```typescript
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  title?: string;
  children: ReactNode;
}
```

**规范：**
- 移动端全屏或80%宽度
- 桌面端固定宽度（如400px）
- 背景遮罩
- 关闭按钮

#### 7.1.8 Skeleton
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}
```

**动画：** 脉冲效果（opacity 0.7 → 1）

#### 7.1.9 Toast
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}
```

**规范：**
- 位置：顶部居中或右下角
- 自动消失：3-5秒
- 支持手动关闭

### 7.2 业务组件

#### 7.2.1 ProductCard
**功能：**
- 商品图片展示（hover放大效果）
- 商品名称（2行截断）
- 价格展示（GHS符号）
- 库存状态标签
- 评分展示（可选）
- Add to Cart按钮（hover显示）
- 点击跳转详情页

**状态：**
- Default：正常展示
- Hover：阴影加深，Add to Cart显示
- Out of Stock：灰色显示，不可点击

#### 7.2.2 ProductGrid
**功能：**
- 响应式网格布局
- 加载状态骨架屏
- 空状态提示（"No products found"）
- 错误状态提示

#### 7.2.3 CartItem
**功能：**
- 商品缩略图
- 商品名称
- 单价
- 数量调整（+/-按钮）
- 小计计算
- 删除操作

**状态：**
- Default：正常展示
- Updating：数量显示loading
- Deleting：淡出动画

#### 7.2.4 CartSummary
**功能：**
- 商品总数
- 小计计算
- 运费估算
- 总计
- 优惠码输入（可选）
- 结算按钮

#### 7.2.5 LanguageSwitcher
**功能：**
- EN | CN 切换
- 当前语言高亮
- 点击切换
- 持久化存储（localStorage）

**样式：** 下拉菜单或平铺按钮

#### 7.2.6 Header
**功能：**
- Logo（左侧）
- 导航菜单（桌面端）
- 移动端汉堡菜单触发器
- 搜索框（桌面端，可折叠）
- 购物车图标 + 数量徽章
- 语言切换
- WhatsApp按钮（可选）

**响应式：**
- 移动端：简化布局，汉堡菜单
- 桌面端：完整导航

#### 7.2.7 Footer
**功能：**
- 公司信息区
- 快速链接区
- 商品分类区
- 联系方式区
- 支付方式图标
- 社交媒体链接
- 版权信息

#### 7.2.8 WhatsAppFloat
**功能：**
- 固定位置浮动按钮
- WhatsApp图标
- 点击跳转wa.me链接

**位置：**
- 移动端：右下角，固定
- 桌面端：右下角

**样式：**
- 绿色背景（WhatsApp品牌色 #25D366）
- 圆形按钮，阴影
- Hover：放大效果

#### 7.2.9 QuantitySelector
**功能：**
- 减号按钮
- 数量显示
- 加号按钮
- 支持键盘输入
- 最小/最大限制

**状态：**
- Default：正常可点击
- Min reached：减号禁用
- Max reached：加号禁用

---

## 10. 国际化策略

### 10.1 语言配置
- **默认语言：** 英文（EN）
- **辅助语言：** 中文（CN）
- **路由方案：** `/en/...` 和 `/zh/...`
- **语言检测：** 基于URL路径，服务端/客户端自动检测

### 8.2 翻译范围
- 所有静态文案（导航、按钮、表单标签、提示）
- 商品名称、描述、规格（需双语数据支持）
- 页面元数据（Title、Description）
- 错误消息和通知
- 邮件模板（订单确认、询盘回复）

### 8.3 实现方式
使用 next-intl 库：
- JSON文件存储翻译内容（messages/en.json, messages/zh.json）
- 组件内使用 `useTranslations` hook
- 服务端组件使用 `getTranslations`
- 支持ICU消息格式（复数、性别等）

### 8.4 翻译文件结构
```json
// messages/en.json
{
  "common": {
    "addToCart": "Add to Cart",
    "buyNow": "Buy Now",
    "requestQuote": "Request a Quote",
    "continueShopping": "Continue Shopping"
  },
  "nav": {
    "home": "Home",
    "products": "Products",
    "contact": "Contact Us"
  },
  "product": {
    "inStock": "In Stock",
    "lowStock": "Only {count} Left in Stock",
    "outOfStock": "Out of Stock"
  }
}
```

---

## 11. 支付集成策略

### 11.1 支付方式优先级

**主要方式：MTN Mobile Money（优先实现）**
- 加纳最大移动支付服务商
- 用户基数大，信任度高
- 移动端友好

**备选方式：Cash on Delivery**
- 适用于不熟悉移动支付的用户
- 降低在线支付风险感知
- 可标注额外手续费

### 9.2 MOMO支付UI设计

#### 9.2.1 结算页支付选择
**MTN Mobile Money选项：**
- 突出显示（卡片样式，带边框）
- MTN Logo
- "Recommended"标签
- 简要说明："Pay with your MTN Mobile Money account"

#### 9.2.2 MOMO支付表单
**输入字段：**
- 手机号输入框（+233前缀）
- 实时格式验证
- 错误提示

**说明文字：**
> "You'll receive a payment prompt on your phone. Enter your PIN to confirm the transaction."

**CTA按钮：**
- "Pay ₵XXX with MTN"（橙色主按钮）

#### 9.2.3 支付状态处理
**Pending状态：**
- 显示加载动画
- 说明："Processing payment..."

**Success状态：**
- 跳转订单确认页
- 显示成功提示

**Failed状态：**
- 显示错误消息
- 提供重试按钮
- 客服联系方式

### 9.3 货到付款UI设计

**COD选项：**
- 卡片样式（不带边框）
- 现金图标
- 说明："Pay cash when your order is delivered"
- 提示："Additional handling fee may apply"

### 9.4 支付安全提示
- SSL加密标识
- MOMO官方认证标识
- "Secure Payment"徽章

---

## 12. 信任体系建设

### 12.1 数据背书（首页/页脚展示）
- **"500+ Products Available"** - 商品数量
- **"XX Years Experience"** - 行业经验
- **"10,000+ Happy Customers"** - 客户数量
- **"Nationwide Delivery in Ghana"** - 配送范围

### 10.2 支付与安全保障
- **MOMO官方标识** - MTN Logo + "Secure Payment"
- **SSL认证徽章** - 网站安全标识
- **退换货政策** - "7-Day Return Policy"简要说明

### 10.3 本地化信任要素
- **加纳本地联系方式** - +233电话、Accra地址
- **本地配送说明** - "Delivery within 1-2 days in Accra, 3-5 days nationwide"
- **本地支付方式** - MTN Mobile Money（当地主流）

### 10.4 客户评价体系
- **星级评分** - 1-5星，可视化展示
- **评价内容** - 简短文字评价
- **评价数量** - "Based on XX reviews"
- **评价展示位置** - 商品详情页、首页热销区

### 10.5 转化元素优化

#### 10.5.1 批量优惠展示
- **标题：** "Buy More, Save More"
- **样式：** 阶梯价格表
- **示例：**
  - 10+ units: 5% off
  - 25+ units: 10% off
  - 50+ units: 15% off

#### 10.5.2 库存紧迫感
- **低库存提示：** "Only X Left in Stock"（橙色，非红色）
- **显示条件：** 库存数 ≤ 10

#### 10.5.3 新用户优惠
- **首页Banner：** "New Customer? Get 5% Off Your First Order"
- **触发条件：** 首次访问（localStorage记录）

---

## 13. 物流与配送策略

### 13.1 核心问题分析（加纳市场）

**物流基础设施挑战：**
| 挑战 | 影响 | 解决方案 |
|------|------|----------|
| **最后一公里配送成本高** | 占商品总价30-40% | 线下网点自提 + 区域定价 |
| **地址系统不完善** | 配送定位困难 | 地标描述 + 网点自提 |
| **配送时效不可预测** | 影响购买决策 | 分区域承诺时效 + 网点自提 |
| **信任缺失** | 在线支付顾虑 | 线下验货自提 + 网点服务 |

### 13.2 线下网点功能规划

**线下网点定位：**
- **核心价值**：解决最后一公里配送难题，增强用户信任，提升转化率
- **功能定位**：自提服务、售后服务、信任背书、本地化支持

**网点类型：**
| 类型 | 定位 | 功能 |
|------|------|------|
| **旗舰店** | 品牌展示 + 仓储 | 全功能服务、商品展示、自提、售后 |
| **自提点** | 社区覆盖 | 自提服务、基础售后 |
| **合作网点** | 第三方合作 | 自提服务、代收款 |

**功能模块：**

#### 13.2.1 网点管理模块

**网点信息管理：**
| 字段 | 说明 | 必填 |
|------|------|------|
| 网点名称 | 中文/英文名称 | ✅ |
| 网点类型 | 旗舰店/自提点/合作网点 | ✅ |
| 地址 | 详细地址 | ✅ |
| 区域 | 所属城市/区域 | ✅ |
| 坐标 | GPS坐标（用于地图显示） | ✅ |
| 营业时间 | 周一至周日时段 | ✅ |
| 联系方式 | 电话/WhatsApp | ✅ |
| 服务范围 | 自提、售后、维修等 | ✅ |
| 状态 | 营业中/休息中/关闭 | ✅ |

**网点搜索功能：**
- 根据用户位置搜索附近网点
- 根据区域筛选网点
- 搜索结果按距离排序

**网点详情展示：**
- 地图位置展示
- 营业时间和联系方式
- 提供的服务列表
- 用户评价和评分

#### 13.2.2 自提服务模块

**自提流程设计：**

```
下单时选择自提 → 选择网点 → 支付完成 → 收到取货通知 → 到店取货 → 验货签收
```

**自提流程步骤：**

| 步骤 | 用户操作 | 系统动作 |
|------|----------|----------|
| 1. 选择配送方式 | 选择"自提"选项 | 显示可选网点列表 |
| 2. 选择网点 | 从列表中选择网点 | 保存网点信息到订单 |
| 3. 完成支付 | 支付订单 | 生成取货码 |
| 4. 取货通知 | 等待通知 | 发送短信/WhatsApp通知 |
| 5. 到店取货 | 到网点出示取货码 | 验证取货码 |
| 6. 验货签收 | 检查商品后签收 | 完成订单 |

**取货码设计：**
- 6位数字码
- 关联订单号和网点
- 有效期7天

**自提优势：**
- 免运费或低运费
- 可现场验货
- 即时取货（网点有库存时）

#### 13.2.3 网点库存管理

**网点库存同步：**
- 总部库存与网点库存联动
- 支持库存调拨
- 实时库存查询

**库存预警：**
- 低库存预警通知
- 自动补货提醒

#### 13.2.4 售后服务模块

**网点售后功能：**
| 服务类型 | 说明 |
|----------|------|
| 退换货 | 现场办理退换货 |
| 商品维修 | 基础维修服务 |
| 技术支持 | 产品使用指导 |
| 发票开具 | 现场开具发票 |

**售后流程：**
```
申请售后 → 选择网点 → 到店办理 → 完成售后
```

### 13.3 配送区域划分

**主配送区域：**
| 区域 | 城市 | 预计时效 | 运费标准 | 网点覆盖 |
|------|------|----------|----------|----------|
| **Greater Accra** | Accra, Tema, East Legon | 1-2天 | ₵10-₵20 | ✅ |
| **Ashanti** | Kumasi, Obuasi | 2-3天 | ₵15-₵30 | ✅ |
| **Western** | Takoradi, Sekondi | 3-4天 | ₵20-₵40 | ✅ |
| **Central** | Cape Coast, Elmina | 3-4天 | ₵20-₵40 | ⚠️ |
| **Volta** | Ho, Keta | 4-5天 | ₵25-₵50 | ⚠️ |
| **Northern** | Tamale, Bolgatanga | 5-7天 | 自提建议 | ❌ |
| **Other Regions** | 其他城市 | 5-7天 | 高运费或自提 | ❌ |

**配送方式选择：**
| 配送方式 | 适用区域 | 费用 | 优势 |
|----------|----------|------|------|
| 送货上门 | Greater Accra | 标准运费 | 便捷 |
| 网点自提 | 所有有网点区域 | 免费/优惠 | 验货、省钱 |
| 货到付款 | Greater Accra | 额外手续费 | 安全放心 |

### 13.4 运费计算策略

**运费计算公式：**
```
运费 = 基础运费 × 区域系数 + 重量附加费 + 处理费
```

**参数说明：**
| 参数 | 说明 | 取值 |
|------|------|------|
| 基础运费 | 标准配送费 | ₵10 |
| 区域系数 | 根据配送区域调整 | 1.0-3.0 |
| 重量附加费 | 每公斤附加 | ₵2/kg |
| 处理费 | COD额外费用 | ₵5 |

**免费配送门槛：**
- Greater Accra：订单满₵200免运费
- 其他区域：订单满₵500免运费

**运费显示策略：**
- 商品列表页显示预估运费
- 商品详情页显示详细运费计算
- 结算页实时计算并显示明细

### 13.5 地址系统优化

**地址输入优化：**
| 字段 | 类型 | 说明 |
|------|------|------|
| 区域 | 下拉选择 | 预定义区域列表 |
| 城市 | 下拉选择 | 根据区域联动 |
| 街道 | 输入框 | 支持地标描述 |
| 地标 | 输入框 | 便于定位 |
| 联系方式 | 输入框 | 手机号 |

**地址示例：**
```
Region: Greater Accra
City: Accra
Street: Near Accra Mall
Landmark: Opposite Shell Station
Phone: +233 24 XXX XXXX
```

**地址验证：**
- 格式验证
- 区域城市联动验证
- 地标字符限制

### 13.6 线下网点用户体验优化

**网点查找功能：**

**入口位置：**
- 首页底部导航
- 商品详情页配送信息区域
- 结算页配送方式选择

**查找方式：**
- 自动定位附近网点
- 手动选择区域查找
- 搜索网点名称

**网点展示：**
| 信息项 | 展示内容 |
|--------|----------|
| 距离 | 显示与用户的距离 |
| 状态 | 营业中/休息中 |
| 评分 | 用户评分 |
| 服务 | 提供的服务标签 |

**地图集成：**
- 显示网点位置
- 导航到网点
- 显示周边信息

### 13.7 线下网点核心价值

**对用户的价值：**
| 价值点 | 说明 |
|--------|------|
| **降低成本** | 自提免运费 |
| **提升信任** | 可现场验货 |
| **灵活便捷** | 多种取货方式 |
| **即时服务** | 现场售后支持 |

**对商家的价值：**
| 价值点 | 说明 |
|--------|------|
| **降低配送成本** | 集中自提减少配送次数 |
| **提升转化率** | 解决信任顾虑 |
| **增强品牌形象** | 实体网点展示实力 |
| **收集用户反馈** | 面对面交流了解需求 |

**对市场的价值：**
| 价值点 | 说明 |
|--------|------|
| **填补物流空白** | 解决最后一公里难题 |
| **促进电商发展** | 提升线上购物体验 |
| **创造就业机会** | 网点运营人员 |

### 13.8 MVP线下网点功能范围

**必实现功能：**
- [ ] 网点信息展示（名称、地址、营业时间、联系方式）
- [ ] 网点搜索（按区域/距离）
- [ ] 下单时选择自提方式
- [ ] 取货码生成与验证
- [ ] 自提订单状态追踪

**后续扩展功能：**
- [ ] 网点库存管理
- [ ] 线下售后服务
- [ ] 网点评价系统
- [ ] 合作网点管理
- [ ] 库存调拨功能

---

## 14. 性能优化策略

### 14.1 图片优化
- **Next.js Image组件** - 自动优化
- **WebP格式** - 减小文件体积
- **懒加载** - 非首屏图片延迟加载
- **响应式尺寸** - 根据设备加载合适尺寸
- **图片压缩** - 上传前压缩处理

### 12.2 加载体验
- **骨架屏占位** - 图片、文字加载前显示骨架
- **图片淡入动画** - 300ms ease
- **首屏优先加载** - 关键内容优先渲染
- **预加载** - 预加载下一页商品

### 12.3 JavaScript优化
- **代码分割** - 路由级分割
- **组件懒加载** - 非首屏组件延迟加载
- **第三方库按需引入** - 只引入使用的部分

### 12.4 缓存策略
- **静态资源** - 长期缓存（1年）
- **API响应** - 适当缓存
- **浏览器缓存** - Service Worker（可选）

### 12.5 网络环境适配
- **优化首屏加载** - 目标 < 3秒（3G网络）
- **减少HTTP请求** - 合并资源
- **Gzip压缩** - 服务器端启用

---

## 15. 实现计划

### Phase 1: 项目初始化（第1天）
**目标：** 建立开发环境，创建项目结构

**任务清单：**
- [ ] 初始化Next.js 14项目（App Router）
- [ ] 配置TypeScript（strict模式）
- [ ] 配置ESLint、Prettier
- [ ] 配置Tailwind CSS
- [ ] 配置next-intl国际化
- [ ] 创建项目目录结构
- [ ] 创建Git仓库（可选）
- [ ] 配置环境变量（.env.local）

### Phase 2: 设计系统（第2天）
**目标：** 建立设计系统和基础组件库

**任务清单：**
- [ ] 定义Tailwind配置（颜色、字体、间距）
- [ ] 创建全局CSS变量
- [ ] 实现基础UI组件：
  - [ ] Button
  - [ ] Input
  - [ ] Select
  - [ ] Card
  - [ ] Badge
  - [ ] Modal
  - [ ] Drawer
  - [ ] Skeleton
  - [ ] Toast
- [ ] 创建组件文档（Storybook，可选）

### Phase 3: 布局组件（第2-3天）
**目标：** 完成响应式布局组件

**任务清单：**
- [ ] Header组件（桌面/移动）
- [ ] Footer组件
- [ ] 导航组件（Navigation）
- [ ] 移动端菜单（MobileNav）
- [ ] 响应式布局容器
- [ ] 语言切换组件（LanguageSwitcher）
- [ ] WhatsApp浮动按钮

### Phase 4: 首页开发（第3-4天）
**目标：** 完成首页所有区域

**任务清单：**
- [ ] Hero轮播组件（3-4张Banner）
- [ ] 分类导航区（CategoryGrid）
- [ ] 热销商品区（ProductGrid + ProductCard）
- [ ] 信任背书区（TrustBadges）
- [ ] CTA区域（底部行动号召）
- [ ] Mock数据准备（products.ts）

### Phase 5: 商品模块（第4-5天）
**目标：** 完成商品展示和筛选功能

**任务清单：**
- [ ] 商品列表页（/products）
- [ ] 商品筛选组件（ProductFilter）
- [ ] 商品排序组件（ProductSort）
- [ ] 商品详情页（/products/[id]）
- [ ] 图片轮播组件（ImageGallery）
- [ ] 商品Tabs组件（Description/Specs/Reviews）
- [ ] 数量选择器组件（QuantitySelector）

### Phase 6: 购物车与订单（第5-6天）
**目标：** 完成购物流程

**任务清单：**
- [ ] CartContext状态管理
- [ ] 购物车页面（/cart）
- [ ] CartItem组件（数量调整、删除）
- [ ] CartSummary组件（结算栏）
- [ ] 结算页面（/checkout）
- [ ] CheckoutForm组件（收货信息表单）
- [ ] 支付方式选择（PaymentOptions）
- [ ] MOMO支付UI（MomoPayment）
- [ ] 订单确认页（/checkout/confirmation）

### Phase 7: 联系与询盘（第6-7天）
**目标：** 完成联系和询盘功能

**任务清单：**
- [ ] 联系我们页面（/contact）
- [ ] 联系信息组件（ContactInfo）
- [ ] 地图嵌入组件（ContactMap）
- [ ] 询盘表单（InquiryForm）
- [ ] 表单验证（useForm hook）
- [ ] 提交成功反馈

### Phase 8: 国际化与优化（第7-8天）
**目标：** 完成多语言和性能优化

**任务清单：**
- [ ] 翻译文件创建（en.json, zh.json）
- [ ] 多语言切换功能
- [ ] 所有页面内容翻译
- [ ] 图片懒加载优化
- [ ] 骨架屏实现
- [ ] 响应式测试（移动/平板/桌面）
- [ ] 浏览器兼容性测试
- [ ] 移动端触控测试
- [ ] Lighthouse性能测试

---

## 16. sql.js 数据库架构

### 16.1 数据库选型说明

**MVP阶段采用 sql.js (SQLite WebAssembly)：**
- **优势**：纯前端数据库，无需后端服务器，数据持久化到浏览器，支持完整SQLite功能
- **适用场景**：MVP快速开发、演示、测试
- **数据持久化**：IndexedDB/LocalStorage存储，刷新页面数据不丢失
- **后续扩展**：可轻松迁移到Node.js + PostgreSQL/MySQL

### 16.2 数据库初始化（src/db/index.ts）

```typescript
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

// 数据库文件存储键
const DB_KEY = 'lis_industrial_db';
const DB_VERSION = 1;

let sql: SqlJsStatic;
let db: Database | null = null;

// 初始化数据库
export async function initDatabase() {
  if (db) return db;

  try {
    // 初始化sql.js
    sql = await initSqlJs({
      locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });

    // 尝试从IndexedDB恢复数据库
    const savedDb = await loadDatabase();

    if (savedDb) {
      db = new sql.Database(savedDb);
    } else {
      db = new sql.Database();
      createTables();
      insertInitialData();
      await saveDatabase();
    }

    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// 创建表结构
function createTables() {
  const sqlStatements = `
    -- 商品表
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_zh TEXT,
      description TEXT,
      description_zh TEXT,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'GHS',
      category TEXT NOT NULL,
      brand TEXT,
      stock TEXT NOT NULL,
      stock_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      min_order_quantity INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 商品图片表
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 商品规格表
    CREATE TABLE IF NOT EXISTS product_specifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      spec_key TEXT NOT NULL,
      spec_value TEXT NOT NULL,
      spec_key_zh TEXT,
      spec_value_zh TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- 商品分类表
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_zh TEXT,
      description TEXT,
      description_zh TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 购物车表
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    -- 订单表
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending',
      total_amount REAL NOT NULL,
      currency TEXT DEFAULT 'GHS',
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      shipping_address TEXT NOT NULL,
      shipping_city TEXT NOT NULL,
      shipping_region TEXT NOT NULL,
      shipping_landmark TEXT,
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      payment_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 订单商品表
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_name_zh TEXT,
      product_image TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    -- 自提网点表
    CREATE TABLE IF NOT EXISTS pickup_locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_zh TEXT,
      type TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      region TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      phone TEXT,
      whatsapp TEXT,
      opening_hours TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 管理员表
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT,
      avatar TEXT,
      role TEXT NOT NULL DEFAULT 'admin',
      status TEXT DEFAULT 'active',
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login_at TEXT
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_pickup_locations_region ON pickup_locations(region);
  `;

  const statements = sqlStatements.split(';').map(s => s.trim()).filter(s => s);
  for (const statement of statements) {
    db!.run(statement);
  }
}

// 保存数据库到IndexedDB
async function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = new Uint8Array(data);
  localStorage.setItem(DB_KEY, JSON.stringify(Array.from(buffer)));
}

// 从IndexedDB加载数据库
async function loadDatabase(): Promise<Uint8Array | null> {
  const saved = localStorage.getItem(DB_KEY);
  if (!saved) return null;
  try {
    const bufferArray = JSON.parse(saved);
    return new Uint8Array(bufferArray);
  } catch {
    return null;
  }
}

// 插入初始数据
function insertInitialData() {
  insertCategories();
  insertProducts();
  insertPickupLocations();
  insertDefaultAdmin();
}

export function getDatabase(): Database | null {
  return db;
}
```

### 16.3 商品数据（src/db/seeds/products.ts）

```typescript
export const seedProducts = (db: Database) => {
  // 商品数据
  const products = [
    {
      id: 'mining-drill-001',
      name: 'Heavy Duty Mining Drill Bit X200',
      name_zh: '重型采矿钻头 X200',
      description: 'Professional grade carbide-tipped drill bit designed for heavy-duty mining operations. Features high durability and precision drilling capability.',
      description_zh: '专业级碳化钨钻头，专为重型采矿作业设计。具有高耐久性和精确钻探能力。',
      price: 450,
      currency: 'GHS',
      category: 'mining-machinery',
      brand: 'ProDrill',
      stock: 'in_stock',
      stock_count: 45,
      rating: 4.5,
      review_count: 23,
      min_order_quantity: 1
    },
    {
      id: 'safety-helmet-001',
      name: 'Industrial Safety Helmet - Premium',
      name_zh: '工业安全帽 - 高级版',
      description: 'High-visibility safety helmet with impact protection. Certified for industrial use.',
      description_zh: '高能见度安全帽，带冲击保护。工业使用认证。',
      price: 85,
      currency: 'GHS',
      category: 'safety-equipment',
      brand: 'SafeGuard',
      stock: 'low_stock',
      stock_count: 8,
      rating: 4.8,
      review_count: 156,
      min_order_quantity: 1
    }
  ];

  // 插入商品
  const productStmt = db.prepare(`
    INSERT INTO products (
      id, name, name_zh, description, description_zh,
      price, currency, category, brand, stock, stock_count,
      rating, review_count, min_order_quantity, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  for (const product of products) {
    productStmt.run([
      product.id,
      product.name,
      product.name_zh,
      product.description,
      product.description_zh,
      product.price,
      product.currency,
      product.category,
      product.brand,
      product.stock,
      product.stock_count,
      product.rating,
      product.review_count,
      product.min_order_quantity
    ]);
  }

  productStmt.free();

  // 插入商品图片
  const productImages = [
    { product_id: 'mining-drill-001', url: '/images/products/drill-1.jpg', sort_order: 0 },
    { product_id: 'mining-drill-001', url: '/images/products/drill-2.jpg', sort_order: 1 },
    { product_id: 'mining-drill-001', url: '/images/products/drill-3.jpg', sort_order: 2 },
    { product_id: 'safety-helmet-001', url: '/images/products/helmet-1.jpg', sort_order: 0 }
  ];

  const imageStmt = db.prepare(`
    INSERT INTO product_images (product_id, url, sort_order)
    VALUES (?, ?, ?)
  `);

  for (const image of productImages) {
    imageStmt.run([image.product_id, image.url, image.sort_order]);
  }

  imageStmt.free();
};
```

### 16.4 数据操作API（src/db/queries.ts）

```typescript
import { Database } from 'sql.js';
import { getDatabase } from './index';
import type { Product, Category, Order, PickupLocation } from '@/types';

// 商品查询
export async function getProducts(params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<Product[]> {
  const db = getDatabase();
  if (!db) return [];

  let sql = 'SELECT * FROM products WHERE 1=1';
  const args: any[] = [];

  if (params.category) {
    sql += ' AND category = ?';
    args.push(params.category);
  }

  if (params.search) {
    sql += ' AND (name LIKE ? OR name_zh LIKE ? OR description LIKE ? OR description_zh LIKE ?)';
    const searchTerm = `%${params.search}%`;
    args.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  sql += ' ORDER BY created_at DESC';

  if (params.limit) {
    sql += ' LIMIT ? OFFSET ?';
    const page = params.page || 1;
    args.push(params.limit, (page - 1) * params.limit);
  }

  const stmt = db.prepare(sql);
  const results = stmt.getAsObject(args);
  stmt.free();

  return results.map((row: any) => formatProductRow(row));
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getDatabase();
  if (!db) return null;

  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const results = stmt.getAsObject([id]);
  stmt.free();

  if (results.length === 0) return null;

  const product = formatProductRow(results[0]);
  
  // 获取商品图片
  const imgStmt = db.prepare('SELECT url, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order');
  const images = imgStmt.getAsObject([id]);
  imgStmt.free();
  product.images = images.map((img: any) => img.url);

  return product;
}

function formatProductRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    nameZh: row.name_zh,
    description: row.description,
    descriptionZh: row.description_zh,
    price: row.price,
    currency: row.currency,
    category: row.category,
    brand: row.brand,
    stock: row.stock,
    stockCount: row.stock_count,
    rating: row.rating,
    reviewCount: row.review_count,
    minOrderQuantity: row.min_order_quantity,
    images: []
  };
}

// 分类查询
export async function getCategories(): Promise<Category[]> {
  const db = getDatabase();
  if (!db) return [];

  const stmt = db.prepare('SELECT * FROM categories ORDER BY sort_order');
  const results = stmt.getAsObject([]);
  stmt.free();

  return results.map((row: any) => ({
    id: row.id,
    name: row.name,
    nameZh: row.name_zh,
    description: row.description,
    descriptionZh: row.description_zh,
    icon: row.icon,
    sortOrder: row.sort_order
  }));
}

// 订单操作
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = getDatabase();
  if (!db) throw new Error('Database not initialized');

  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const stmt = db.prepare(`
    INSERT INTO orders (
      id, order_number, status, total_amount, currency,
      customer_name, customer_phone, customer_email,
      shipping_address, shipping_city, shipping_region, shipping_landmark,
      payment_method, payment_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  stmt.run([
    orderId,
    order.orderNumber,
    'pending',
    order.totalAmount,
    order.currency,
    order.customerName,
    order.customerPhone,
    order.customerEmail || '',
    order.shippingAddress,
    order.shippingCity,
    order.shippingRegion,
    order.shippingLandmark || '',
    order.paymentMethod,
    'pending'
  ]);
  stmt.free();

  // 保存数据库
  await saveDatabase();

  return orderId;
}
```

### 16.5 项目依赖安装

```bash
npm install sql.js
npm install -D @types/sql.js
```

**package.json依赖更新：**
```json
{
  "dependencies": {
    "sql.js": "^1.10.3"
  },
  "devDependencies": {
    "@types/sql.js": "^1.4.9"
  }
}
```

### 16.6 数据库初始化流程

```typescript
// src/app/providers/db-provider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initDatabase } from '@/db';

export default function DbProvider({ children }: { children: ReactNode }) {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        setDbReady(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError('Database initialization failed');
      }
    };

    init();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!dbReady) {
    return <div className="text-center p-4">Loading database...</div>;
  }

  return <>{children}</>;
}
```

### 16.7 后续迁移路径

**MVP完成后，当需要后端服务时：**
1. 保持现有SQL语句基本不变
2. 切换到Node.js + PostgreSQL/MySQL
3. 数据迁移：导出sql.js数据，导入到后端数据库
4. 调整API调用：从直接调用SQL改为REST API

---

## 17. 技术约束与注意事项

### 17.1 浏览器支持
- Chrome/Edge（最新2个版本）
- Safari（最新2个版本）
- Firefox（最新2个版本）
- 移动端Safari（iOS 14+）
- Chrome Android（最新版本）

### 17.2 网络环境适配
- 优化首屏加载时间（目标 < 3秒 3G网络）
- 图片压缩和懒加载
- 减少HTTP请求
- 考虑加纳网络环境

### 17.3 无障碍（Accessibility）
- 语义化HTML标签
- ARIA标签（按钮、表单、导航）
- 键盘导航支持
- 足够的颜色对比度（WCAG AA标准）
- 表单标签和错误提示

### 17.4 SEO基础
- 语义化标签（H1-H6、article、section）
- Meta标签配置（Title、Description）
- Open Graph标签（社交分享）
- 结构化数据（LocalBusiness schema，可选）
- 图片alt属性

### 17.5 安全考虑
- HTTPS（生产环境）
- 表单CSRF防护
- 输入验证（客户端+服务端）
- 敏感信息不暴露在客户端

---

## 18. 验收标准

### 18.1 功能验收
- [x] 所有页面可正常访问（/en, /zh路由）
- [x] 商品展示完整（图片、价格、规格）
- [x] 商品筛选和排序功能正常
- [x] 购物车添加/删除/修改数量正常
- [x] 结算流程完整（表单验证、支付选择）
- [x] MOMO支付UI正常展示
- [x] 询盘表单提交成功
- [x] 中英文切换正常
- [x] WhatsApp链接正常跳转
- [x] 后台管理系统登录正常
- [x] 商品管理功能正常
- [x] 订单管理功能正常
- [x] 询盘管理功能正常

### 18.2 响应式验收
- [x] 移动端（<768px）布局正常
- [x] 平板端（768-1023px）布局正常
- [x] 桌面端（≥1024px）布局正常
- [x] 触摸操作正常（按钮点击、滑动删除）
- [x] 固定底部CTA正常显示（移动端）

### 18.3 性能验收
- [x] Lighthouse Performance > 80
- [x] 首屏加载 < 3秒（3G网络）
- [x] 图片懒加载正常（loading="lazy"已配置）
- [x] 无布局偏移（CLS < 0.1）
- [x] 骨架屏正常显示（LoadingSkeleton组件就绪）
- [ ] sql.js数据库初始化正常（纯前端MVP暂不涉及）

### 18.4 质量验收
- [x] 无Console错误（构建/测试均通过）
- [x] 表单验证正常工作（phone、email、required全覆盖）
- [x] 加载状态正确显示（loading/submitting状态处理）
- [x] 错误处理完善（try/catch、toast通知）
- [x] 所有按钮可点击
- [x] 所有链接可跳转
- [x] 数据持久化正常工作（categories本地存储、inquiries localStorage同步）

### 18.5 浏览器兼容性
- [x] Chrome最新版本测试通过
- [x] Safari最新版本测试通过
- [x] Firefox最新版本测试通过
- [x] 移动端Safari测试通过
- [x] Chrome Android测试通过

---

*本文档为技术实现规范，基于PRD文档定义的需求进行细化，并结合用户交互反馈完善。*
*文档版本：1.6*
*最后更新：2026-05-31*
