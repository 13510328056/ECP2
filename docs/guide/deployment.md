# 部署指南

> 详细部署文档请参考项目根目录的 `DEPLOY.md` 文件。

## 概述

ECP2 是一个纯静态 SPA（Single Page Application），构建输出为 `dist/` 目录，可直接部署到任何静态托管服务。

## 构建

```bash
# 安装依赖
npm install

# 生产构建
npm run build
```

构建产物输出到 `dist/` 目录：

```
dist/
├── index.html           # 入口 HTML
├── assets/              # 静态资源（JS/CSS/图片）
│   ├── index-xxxx.js    # 主应用 bundle
│   ├── index-xxxx.css   # 全局样式
│   ├── Home-xxxx.js     # 首页（懒加载）
│   ├── Products-xxxx.js # 商品列表（懒加载）
│   ├── admin/...        # 后台页面（懒加载）
│   └── logo.png         # Logo 图片
└── images/
    └── logo.png
```

## 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| Node.js | >= 18.x | 推荐 v20 LTS |
| npm | >= 9.x | 随 Node.js 安装 |
| 内存 | >= 512MB | 构建时推荐 1GB+ |

## 部署方式

### Nginx 部署

```nginx
server {
    listen 80;
    server_name lisindustrial.gh www.lisindustrial.gh;

    root /var/www/ecp2/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1024;
    gzip_vary on;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片缓存
    location /images/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由重定向
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Vercel 部署

项目根目录创建 `vercel.json`：

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify 部署

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 部署后验证

### 核心功能检查

| 功能 | 测试步骤 | 预期结果 |
|------|---------|----------|
| 首页访问 | 打开域名 | 首页完整渲染，轮播图正常 |
| 商品列表 | 点击"分类"或访问 `/products` | 商品列表显示，筛选/排序正常 |
| 商品详情 | 点击任意商品 | 详情页显示，图片可点击放大 |
| 购物车 | 添加商品 → 查看购物车 | 商品显示，数量可调整 |
| 结算流程 | 购物车 → 结算 → 提交订单 | 表单验证，跳转支付页 |
| 支付模拟 | 输入4位PIN | 支付成功页展示 |
| 多语言 | 点击顶部 中/EN 切换 | 页面内容中英文切换 |
| 联系我们 | 填写询盘表单 | 提交成功提示 |
| 用户注册 | 填写注册表单 | 注册成功跳转 |
| 用户登录 | 登录后查看"我的" | 显示个人信息和订单 |

### 后台检查

| 功能 | 测试步骤 | 预期结果 |
|------|---------|----------|
| 管理员登录 | 访问 `/admin/login` | 验证码+登录 |
| 数据看板 | 登录后首页 | 4个统计卡片、图表、最新订单 |
| 商品管理 | 查看/新增/编辑 | CRUD 操作正常 |
| 订单管理 | 查看/搜索/物流 | 订单列表、搜索、物流表单 |
| 询盘管理 | 查看/回复 | 状态筛选、回复功能 |
| 系统设置 | 个人资料/用户管理 | 信息修改、用户管理 |

## 常见问题

### 部署后页面刷新出现 404

**原因：** SPA 路由需要服务端配置 fallback。  
**解决：** 确保 Web 服务器配置了 `try_files $uri $uri/ /index.html;`

### 图片不显示

**原因：** 路径引用问题。  
**解决：**
- Logo 图片使用绝对路径 `/images/logo.png`
- 商品图片使用完整 URL（`picsum.photos`）
- 检查 `vite.config.ts` 中的 `base` 配置

### 构建报内存不足

```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```
