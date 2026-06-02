import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Li's Industrial Mart",
  description: 'Industrial Supplies & Services Market - Ghana',
  lang: 'zh-CN',
  themeConfig: {
    logo: '/images/logo.png',
    siteTitle: 'ECP2 Docs',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction' },
      { text: '用户故事', link: '/features/user-stories' },
      { text: 'API', link: '/api/overview' },
    ],
    sidebar: {
      '/guide/': [
        { text: '简介', link: '/guide/introduction' },
        { text: '快速开始', link: '/guide/quickstart' },
        { text: '项目结构', link: '/guide/project-structure' },
        { text: '部署指南', link: '/guide/deployment' },
        { text: '测试指南', link: '/guide/testing' },
      ],
      '/features/': [
        { text: '用户故事总览', link: '/features/user-stories' },
        { text: '买家购物流程', link: '/features/buyer-journey' },
        { text: '询盘转化流程', link: '/features/inquiry-flow' },
        { text: '订单处理流程', link: '/features/order-flow' },
        { text: '支付流程', link: '/features/payment-flow' },
        { text: '后台管理', link: '/features/admin-panel' },
        { text: '多语言支持', link: '/features/i18n' },
      ],
      '/api/': [
        { text: '数据模型', link: '/api/overview' },
        { text: 'Stores', link: '/api/stores' },
        { text: '工具函数', link: '/api/utils' },
      ],
      '/admin/': [
        { text: '管理后台总览', link: '/admin/overview' },
        { text: '商品管理', link: '/admin/products' },
        { text: '订单管理', link: '/admin/orders' },
        { text: '询盘管理', link: '/admin/inquiries' },
        { text: '系统设置', link: '/admin/settings' },
      ],
    },
    socialLinks: [
      { icon: 'github', link: '#' },
    ],
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright 2026 LIS Industrial Supply',
    },
  },
})
