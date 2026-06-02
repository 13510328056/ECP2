# 系统设置

**路由：** `/admin/settings`

**对应页面：** `AdminSettings.vue`

## 功能概览

| 功能 | 说明 | 状态 |
|------|------|------|
| 个人资料编辑 | 修改管理员姓名、电话、部门 | ✅ 已完成 |
| 邮箱展示 | 显示当前管理员邮箱 | ✅ 已完成 |
| 角色展示 | 显示管理员角色 | ✅ 已完成 |
| 密码修改 | 修改登录密码 | ✅ 已完成 |
| 用户管理 | 查看/新增/编辑/删除系统用户 | ✅ 已完成 |
| 用户状态管理 | 启用/停用账号 | ✅ 已完成 |
| 保存反馈 | Toast 提示操作结果 | ✅ 已完成 |

## 个人资料

### 信息展示

| 字段 | 说明 | 可编辑 |
|------|------|--------|
| 管理员姓名 | 当前登录管理员的姓名 | ✅ 是 |
| 邮箱 | 登录邮箱（只读展示） | ❌ 否 |
| 联系电话 | 管理员联系方式 | ✅ 是 |
| 部门 | 所属部门 | ✅ 是 |
| 角色 | 管理员角色（只读展示） | ❌ 否 |

### 保存操作

```typescript
function saveProfile() {
  showToast('个人资料已更新', 'success')
}
```

## 密码修改

### 表单字段

| 字段 | 说明 | 验证 |
|------|------|------|
| 当前密码 | 输入当前密码 | 必填 |
| 新密码 | 输入新密码 | 必填 |
| 确认新密码 | 再次输入新密码 | 必填 + 与新密码一致 |

### 验证逻辑

```typescript
function savePassword() {
  if (!passwordForm.value.current) {
    showToast('请输入当前密码', 'error')
    return
  }
  if (!passwordForm.value.newPassword) {
    showToast('请输入新密码', 'error')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirm) {
    showToast('两次密码输入不一致', 'error')
    return
  }
  showToast('密码已更新', 'success')
  passwordForm.value = { current: '', newPassword: '', confirm: '' }
}
```

## 用户管理

### 用户列表

| 列 | 说明 |
|------|------|
| 姓名 | 用户显示名 |
| 邮箱 | 登录邮箱 |
| 角色 | 管理员角色标签 |
| 状态 | 启用/停用 状态标签 |
| 最后登录 | 最后登录时间 |
| 操作 | 编辑 / 删除 |

### 用户角色

| 角色 | 英文标识 | 说明 |
|------|---------|------|
| 超级管理员 | super_admin | 全部权限 |
| 商品管理员 | product_manager | 商品管理权限 |
| 客服 | customer_service | 询盘客服权限 |
| 营销经理 | marketing_manager | 营销管理权限 |
| 仓储 | warehouse | 库存和发货权限 |
| 财务 | finance | 财务对账权限 |

### 新建/编辑用户表单

| 字段 | 必填 | 说明 |
|------|------|------|
| 姓名 | 是 | 用户显示名 |
| 邮箱 | 是 | 登录邮箱 |
| 电话 | 否 | 联系电话 |
| 角色 | 是 | 选择管理员角色 |
| 状态 | 是 | 启用/停用 |

### 创建用户

```typescript
function openNewUser() {
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    role: 'customer_service',
    status: 'active',
  }
  showUserModal.value = true
}
```

### 删除用户

删除前显示确认弹窗，防止误操作。

---

## 覆盖状态

| 功能点 | 状态 |
|--------|------|
| 个人资料编辑 | ✅ 已完成 |
| 密码修改（含确认验证） | ✅ 已完成 |
| 用户列表展示 | ✅ 已完成 |
| 用户角色标签 | ✅ 已完成 |
| 用户状态管理 | ✅ 已完成 |
| 新增用户 | ✅ 已完成 |
| 编辑用户 | ✅ 已完成 |
| 删除用户（确认弹窗） | ✅ 已完成 |
| 操作反馈（Toast） | ✅ 已完成 |
| 权限细粒度控制 | ⚠️ 基础角色定义 |
| 操作日志审计 | ❌ 待开发 |
