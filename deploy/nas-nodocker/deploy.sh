#!/bin/bash
# =========================================================
# ECP2 - 绿联 NAS 部署脚本（无 Docker 版）
# 使用 Caddy 作为 Web 服务器
# =========================================================

set -e

# ====== 配置（按你的环境修改）=====
CADDY_VERSION="2.9.1"
CADDY_DIR="/volume1/docker/ecp2"
CADDY_PORT="8080"
# ==================================

echo "========================================"
echo "  ECP2 - 绿联 NAS 一键部署脚本"
echo "========================================"

# 1. 创建目录
echo "[1/5] 创建部署目录..."
mkdir -p "$CADDY_DIR"
mkdir -p "$CADDY_DIR/dist"
mkdir -p "$CADDY_DIR/caddy_data"

# 2. 下载 Caddy（x86_64 版，单文件）
echo "[2/5] 下载 Caddy v$CADDY_VERSION..."
if [ ! -f "$CADDY_DIR/caddy" ]; then
    wget -q "https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_amd64.tar.gz" -O /tmp/caddy.tar.gz
    tar xzf /tmp/caddy.tar.gz -C "$CADDY_DIR" caddy
    chmod +x "$CADDY_DIR/caddy"
    rm /tmp/caddy.tar.gz
    echo "  ✓ Caddy 下载完成"
else
    echo "  ✓ Caddy 已存在，跳过下载"
fi

# 3. 部署静态文件
echo "[3/5] 部署静态文件..."
echo "  请将 dist/ 文件夹的内容复制到: $CADDY_DIR/dist/"
echo "  (然后用 scp 或 Samba 复制)"

# 4. 配置 Caddyfile
echo "[4/5] 配置 Caddyfile..."
# Caddyfile 应已放置在 $CADDY_DIR/Caddyfile

# 5. 启动 Caddy
echo "[5/5] 启动 Caddy 服务..."
cd "$CADDY_DIR"

# 停止已有实例
if [ -f caddy.pid ]; then
    kill $(cat caddy.pid) 2>/dev/null || true
    sleep 1
fi

# 前台启动（测试用）
# $CADDY_DIR/caddy run --config Caddyfile

# 后台启动（生产用）
$CADDY_DIR/caddy start --config Caddyfile --adapter caddyfile --pidfile caddy.pid

echo ""
echo "========================================"
echo "  ✅ 部署完成！"
echo "========================================"
echo "  访问地址: http://$(hostname -I | awk '{print $1}'):$CADDY_PORT"
echo "  管理命令:"
echo "    启动: $CADDY_DIR/caddy start --config $CADDY_DIR/Caddyfile"
echo "    停止: $CADDY_DIR/caddy stop"
echo "    重启: $CADDY_DIR/caddy reload --config $CADDY_DIR/Caddyfile"
echo "    日志: $CADDY_DIR/access.log"
echo "========================================"
