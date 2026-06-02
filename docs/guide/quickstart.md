# 快速开始

## 环境要求

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

## 安装与运行

### 1. 克隆项目

```bash
cd E:\PythonPrj\ECP2
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

默认开发服务器地址：`http://localhost:3000`

### 4. 生产构建

```bash
npm run build
```

构建产物输出至 `dist/` 目录。

### 5. 预览构建结果

```bash
npm run preview
```

## 文档开发

### 启动文档站点

```bash
npx vitepress dev docs
```

文档站点默认地址：`http://localhost:5173`

### 构建文档站点

```bash
npx vitepress build docs
```

构建产物输出至 `docs/.vitepress/dist/` 目录。

## 项目脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（热更新） |
| `npm run build` | 执行 TypeScript 检查并构建生产版本 |
| `npm run preview` | 预览构建后的 SPA |
| `npx vitepress dev docs` | 启动 VitePress 文档站点 |
| `npx vitepress build docs` | 构建 VitePress 文档站点 |
| `npx vitest` | 运行单元测试 |

## 开发服务器功能

- **热模块替换（HMR）** — 代码修改后页面自动更新
- **TypeScript 实时编译**
- **Tailwind CSS 即时编译**
- 默认端口 3000，被占用时自动递增（3001、3002...）
