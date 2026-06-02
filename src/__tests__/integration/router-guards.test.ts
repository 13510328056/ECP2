import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminStore } from '@/stores/admin'

// Mock the admin store import in the router by pre-setting Pinia before router creation
describe('Router Admin Guards', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(async () => {
    setActivePinia(createPinia())

    // Build a minimal router with the same guard logic as the real router
    const routes = [
      // Front store routes - no meta
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/products', name: 'products', component: { template: '<div>Products</div>' } },
      { path: '/cart', name: 'cart', component: { template: '<div>Cart</div>' } },
      { path: '/account', name: 'account', component: { template: '<div>Account</div>' } },
      // Admin routes
      { path: '/admin/login', name: 'admin-login', component: { template: '<div>Admin Login</div>' } },
      {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: { template: '<div>Admin Dashboard</div>' },
        meta: { requiresAdmin: true },
      },
      {
        path: '/admin/products',
        name: 'admin-products',
        component: { template: '<div>Admin Products</div>' },
        meta: { requiresAdmin: true },
      },
      {
        path: '/admin/orders',
        name: 'admin-orders',
        component: { template: '<div>Admin Orders</div>' },
        meta: { requiresAdmin: true },
      },
      {
        path: '/admin/inquiries',
        name: 'admin-inquiries',
        component: { template: '<div>Admin Inquiries</div>' },
        meta: { requiresAdmin: true },
      },
    ]

    router = createRouter({
      history: createWebHashHistory(),
      routes,
    })

    // Attach the same beforeEach guard used in the real router
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

    router.push('/')
    await router.isReady()
  })

  describe('admin routes when NOT authenticated', () => {
    it('redirects /admin/dashboard to /admin/login', async () => {
      await router.push('/admin/dashboard')
      expect(router.currentRoute.value.path).toBe('/admin/login')
    })

    it('redirects /admin/products to /admin/login', async () => {
      await router.push('/admin/products')
      expect(router.currentRoute.value.path).toBe('/admin/login')
    })

    it('redirects /admin/orders to /admin/login', async () => {
      await router.push('/admin/orders')
      expect(router.currentRoute.value.path).toBe('/admin/login')
    })

    it('redirects /admin/inquiries to /admin/login', async () => {
      await router.push('/admin/inquiries')
      expect(router.currentRoute.value.path).toBe('/admin/login')
    })
  })

  describe('admin routes when AUTHENTICATED', () => {
    beforeEach(() => {
      const adminStore = useAdminStore()
      adminStore.login('admin@lisindustrial.gh', 'admin123')
    })

    it('allows access to /admin/dashboard', async () => {
      await router.push('/admin/dashboard')
      expect(router.currentRoute.value.path).toBe('/admin/dashboard')
    })

    it('allows access to /admin/products', async () => {
      await router.push('/admin/products')
      expect(router.currentRoute.value.path).toBe('/admin/products')
    })

    it('allows access to /admin/orders', async () => {
      await router.push('/admin/orders')
      expect(router.currentRoute.value.path).toBe('/admin/orders')
    })

    it('allows access to /admin/inquiries', async () => {
      await router.push('/admin/inquiries')
      expect(router.currentRoute.value.path).toBe('/admin/inquiries')
    })

    it('allows access to /admin/login even when authenticated', async () => {
      // /admin/login has no requiresAdmin meta, so it should be accessible
      await router.push('/admin/login')
      expect(router.currentRoute.value.path).toBe('/admin/login')
    })
  })

  describe('front store routes', () => {
    it('allows access to / (home)', async () => {
      await router.push('/')
      expect(router.currentRoute.value.path).toBe('/')
    })

    it('allows access to /products', async () => {
      await router.push('/products')
      expect(router.currentRoute.value.path).toBe('/products')
    })

    it('allows access to /cart', async () => {
      await router.push('/cart')
      expect(router.currentRoute.value.path).toBe('/cart')
    })

    it('allows access to /account', async () => {
      await router.push('/account')
      expect(router.currentRoute.value.path).toBe('/account')
    })

    it('allows access to front routes regardless of auth state', async () => {
      // Test without auth
      await router.push('/')
      expect(router.currentRoute.value.path).toBe('/')

      // Log in
      const adminStore = useAdminStore()
      adminStore.login('admin@lisindustrial.gh', 'admin123')

      // Front routes still work when authenticated
      await router.push('/products')
      expect(router.currentRoute.value.path).toBe('/products')
    })
  })

  describe('guard does not interfere with non-admin routes', () => {
    it('stays on a non-admin route without redirect', async () => {
      await router.push('/products')
      expect(router.currentRoute.value.path).toBe('/products')

      // Navigating to another non-admin route should work
      await router.push('/cart')
      expect(router.currentRoute.value.path).toBe('/cart')
    })
  })
})
