# Li's Industrial Mart — 部署文档

> **项目名称：** ECP2 — Li's Industrial Supplies & Services Market  
> **技术栈：** Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS v4  
> **构建输出：** 静态 SPA（Single Page Application），输出至 `dist/` 目录  
> **版本：** 1.0.0

---

## 目录

1. [环境要求](#1-环境要求)
2. [开发环境运行](#2-开发环境运行)
3. [生产构建](#3-生产构建)
4. [部署方式](#4-部署方式)
   - [静态服务器部署（Nginx）](#41-nginx-部署)
   - [Vercel 部署](#42-vercel-部署)
   - [Netlify 部署](#43-netlify-部署)
   - [子目录部署](#44-子目录部署)
5. [环境变量配置](#5-环境变量配置)
6. [部署后验证](#6-部署后验证)
7. [常见问题](#7-常见问题)

---

## 1. 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| Node.js | >= 18.x | 推荐 v20 LTS |
| npm | >= 9.x | 随 Node.js 安装 |
| 内存 | >= 512MB | 构建时推荐 1GB+ |

**验证命令：**

```bash
node -v   # v20.17.0 或更高
npm -v    # 10.x 或更高
```

---

## 2. 开发环境运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（热更新）
npm run dev

# 3. 浏览器打开
# http://localhost:3000
```

开发服务器支持：
- **热模块替换（HMR）** — 代码修改后页面自动更新
- **TypeScript 实时编译**
- **Tailwind CSS 即时编译**
- 默认端口 3000，被占用时自动递增（3001、3002...）

---

## 3. 生产构建

```bash
# 构建生产版本
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

> **注意：** `dist/` 目录是纯静态文件，可以直接部署到任何静态托管服务。

---

## 4. 部署方式

### 4.1 Nginx 部署

**安装 Nginx 后，配置虚拟主机：**

```nginx
server {
    listen 80;
    server_name lisindustrial.gh www.lisindustrial.gh;

    root /var/www/ecp2/dist;
    index index.html;

    # 开启 Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1024;
    gzip_vary on;

    # 静态资源缓存（1 年）
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片缓存（30 天）
    location /images/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由重定向 — 所有非文件请求返回 index.html
    location / {
        try_files $uri $uri/ /index.html;

        # HTML 文件不缓存
        expires -1;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

**部署步骤：**

```bash
# 1. 构建
cd /path/to/ecp2
npm install && npm run build

# 2. 将 dist 复制到 web 目录
sudo cp -r dist/* /var/www/ecp2/

# 3. 设置权限
sudo chown -R www-data:www-data /var/www/ecp2/

# 4. 重载 Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### 4.2 Vercel 部署

本项目为 Vite 构建的纯静态 SPA，Vercel 可自动识别并配置构建命令和输出目录。

> **前置准备：** 项目根目录需包含以下两个文件（已创建）：

创建 `.vercelignore` — 排除 `node_modules`，让 Vercel 在 Linux 环境做干净的依赖安装：

```ignore
node_modules
.vercel
```

创建 `.npmrc` — 避免依赖版本冲突（如 `pinia` v2 与 `pinia-plugin-persistedstate` 新版 peer dependency 不兼容）：

```ini
legacy-peer-deps=true
```

---

**方式一：Vercel CLI（一行命令部署，推荐）**

```bash
# 1. 安装 Vercel CLI（仅首次）
npm install -g vercel

# 2. 构建并部署到生产环境
npm run build && vercel --prod --yes
```

**首次运行会进入设备认证流程：**

```
Vercel CLI 54.x.x
> Visit https://vercel.com/oauth/device?user_code=XXXX-XXXX
> Waiting for authentication...
```

浏览器打开显示的链接 → 用 GitHub 账号授权登录 → 终端自动继续部署。

**后续更新只需：**

```bash
npm run build && vercel --prod --yes
```

> **注意：** `--yes` 参数跳过交互式确认，适合脚本化部署。

---

**方式二：GitHub 自动部署（推送即更新）**

**第 1 步：** 在项目根目录创建 `vercel.json`：

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

**第 2 步：** 推送代码到 GitHub：

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

**第 3 步：** 打开 [vercel.com/new](https://vercel.com/new) → 用 GitHub 登录 → 导入刚推送的仓库 → Framework Preset 自动识别为 **Vite** → 点击 **Deploy**。

之后每次 `git push` 到 main 分支，Vercel 自动重新构建部署。

---

**自定义域名**

在 Vercel 项目设置 → **Domains** → 输入你的域名 → 按提示在阿里云 DNS 添加 CNAME 记录指向 `cname.vercel-dns.com`，Vercel 自动签发 HTTPS 证书。

### 4.3 Netlify 部署

创建 `netlify.toml`（已存在则无需创建）：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**部署步骤：**
1. 登录 Netlify → Add new site → Import an existing project
2. 连接 GitHub/GitLab 仓库
3. 构建命令：`npm run build`
4. 发布目录：`dist`
5. 部署完成

### 4.4 子目录部署

如果需要部署到子目录（如 `https://example.com/shop/`），需要：

**1. 修改 `vite.config.ts`：**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/shop/',  // ← 修改为实际子目录路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

**2. 重新构建：**

```bash
npm run build
```

**3. Nginx 配置：**

```nginx
location /shop/ {
    alias /var/www/ecp2/dist/;
    try_files $uri $uri/ /shop/index.html;
}
```

---

## 5. 环境变量配置

本项目为纯前端 SPA，当前无后端 API 依赖。如需添加环境变量，创建 `.env` 文件：

```bash
# .env (开发环境)
VITE_API_BASE_URL=https://api.lisindustrial.gh
VITE_APP_TITLE=Li's Industrial Mart

# .env.production (生产环境)
VITE_API_BASE_URL=https://api.lisindustrial.gh
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

---

## 6. 部署后验证

部署完成后，检查以下功能是否正常：

### 🔑 核心功能检查

| 功能 | 测试步骤 | 预期结果 |
|------|---------|----------|
| **首页访问** | 打开域名 | 首页完整渲染，轮播图正常 |
| **商品列表** | 点击"分类"或访问 `/products` | 商品列表显示，筛选/排序正常 |
| **商品详情** | 点击任意商品 | 详情页显示，图片可点击放大 |
| **购物车** | 添加商品 → 查看购物车 | 商品显示，数量可调整 |
| **结算流程** | 购物车 → 结算 → 提交订单 | 表单验证，跳转支付页 |
| **支付模拟** | 输入4位PIN | 支付成功页展示 |
| **多语言** | 点击顶部 中/EN 切换 | 页面内容中英文切换 |
| **联系我们** | 填写询盘表单 | 提交成功提示 |
| **用户注册** | 填写注册表单 | 注册成功跳转 |
| **用户登录** | 登录后查看"我的" | 显示个人信息和订单 |

### 🔐 后台检查

| 功能 | 测试步骤 | 预期结果 |
|------|---------|----------|
| **管理员登录** | 访问 `/admin/login` | 验证码+登录 |
| **数据看板** | 登录后首页 | 4个统计卡片、图表、最新订单 |
| **商品管理** | 查看/新增/编辑 | CRUD 操作正常 |
| **订单管理** | 查看/搜索/物流 | 订单列表、搜索、物流表单 |
| **询盘管理** | 查看/回复 | 状态筛选、回复功能 |
| **系统设置** | 个人资料/用户管理 | 信息修改、用户管理 |

---

## 7. 常见问题

### Q1: 部署后页面刷新出现 404

**原因：** SPA 路由需要服务端配置 fallback。  
**解决：** 确保 Web 服务器配置了 `try_files $uri $uri/ /index.html;`（Nginx）或对应的 rewrite 规则。

### Q2: 图片不显示

**原因：** 路径引用问题。  
**解决：**
- Logo 图片使用绝对路径 `/images/logo.png`
- 商品图片使用完整 URL（`picsum.photos`）
- 检查 `vite.config.ts` 中的 `base` 配置是否正确

### Q3: 构建报内存不足

**解决：**

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

### Q4: 如何更新项目？

```bash
# 拉取最新代码
git pull origin main

# 重新安装依赖（如有变更）
npm install

# 重新构建
npm run build

# 覆盖部署目录
cp -r dist/* /var/www/ecp2/
```

---

> **文档版本：** v1.0.0  
> **最后更新：** 2026-05-31  
> **如有问题，请联系：** [info@lisindustrial.gh](mailto:info@lisindustrial.gh)
