import { createRouter, createWebHashHistory } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // Front store routes
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetail.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/Cart.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/Checkout.vue'),
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('@/views/Payment.vue'),
    },
    {
      path: '/order-confirmation',
      name: 'order-confirmation',
      component: () => import('@/views/OrderConfirmation.vue'),
    },
    {
      path: '/order/:id',
      name: 'order-detail',
      component: () => import('@/views/OrderDetail.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/Products.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/Account.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/Orders.vue'),
    },
    {
      path: '/addresses',
      name: 'addresses',
      component: () => import('@/views/Addresses.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
    },

    // Admin routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLogin.vue'),
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard',
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('@/views/admin/AdminProducts.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/products/create',
      name: 'admin-product-create',
      component: () => import('@/views/admin/AdminProductCreate.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/products/:id/edit',
      name: 'admin-product-edit',
      component: () => import('@/views/admin/AdminProductCreate.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: () => import('@/views/admin/AdminCategories.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('@/views/admin/AdminOrders.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/orders/:id',
      name: 'admin-order-detail',
      component: () => import('@/views/admin/AdminOrderDetail.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/inquiries',
      name: 'admin-inquiries',
      component: () => import('@/views/admin/AdminInquiries.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/inquiries/:id',
      name: 'admin-inquiry-detail',
      component: () => import('@/views/admin/AdminInquiryDetail.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('@/views/admin/AdminSettings.vue'),
      meta: { requiresAdmin: true },
    },
    // 404 catch-all
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

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

export default router
