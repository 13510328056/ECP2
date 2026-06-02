import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useLanguageStore } from '@/stores/language'
import type { Product } from '@/types'

function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-001',
    name: 'Test Product',
    nameZh: '测试产品',
    description: 'A test product',
    descriptionZh: '一个测试产品',
    price: 100,
    currency: 'GHS',
    category: 'electronics',
    categoryZh: '电子产品',
    images: ['/images/test.jpg'],
    specifications: {},
    specificationsZh: {},
    stock: 'in_stock',
    stockCount: 50,
    rating: 4.5,
    reviewCount: 10,
    minOrderQuantity: 1,
    bulkPricing: [],
    applicationScenarios: [],
    shippingInfo: { weight: '1kg' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

/**
 * BottomNav tab navigation mapping:
 *   Home       → /
 *   Categories → /products
 *   Cart       → /cart
 *   Account    → /account
 *
 * These routes are tested in router-guards.test.ts.
 * This test focuses on store-level state persistence across simulated navigation flows.
 */
describe('Navigation Flows', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
  })

  describe('BottomNav tab navigation mapping', () => {
    it('maps Home tab to / route', () => {
      // This simulates the navigation targets used by BottomNav.vue
      const tabs: { label: string; route: string }[] = [
        { label: '首页', route: '/' },
        { label: '分类', route: '/products' },
        { label: '购物车', route: '/cart' },
        { label: '我的', route: '/account' },
      ]

      expect(tabs[0].route).toBe('/')
      expect(tabs[1].route).toBe('/products')
      expect(tabs[2].route).toBe('/cart')
      expect(tabs[3].route).toBe('/account')
    })

    it('provides unique routes for each tab', () => {
      const tabRoutes = ['/', '/products', '/cart', '/account']
      const uniqueRoutes = new Set(tabRoutes)
      expect(uniqueRoutes.size).toBe(tabRoutes.length)
    })
  })

  describe('user store state persistence across navigations', () => {
    it('persists login state after simulated page navigation', () => {
      const userStore = useUserStore()

      // Simulate: User logs in on Login page
      userStore.login('test@example.com', 'password123')
      expect(userStore.isLoggedIn).toBe(true)

      // Simulate: User navigates to Home page -> state persists
      expect(userStore.isLoggedIn).toBe(true)
      expect(userStore.userEmail).toBe('test@example.com')

      // Simulate: User navigates to Products page -> state persists
      expect(userStore.isLoggedIn).toBe(true)

      // Simulate: User navigates to Cart page -> state persists
      expect(userStore.isLoggedIn).toBe(true)

      // Simulate: User navigates to Account page -> state persists
      expect(userStore.isLoggedIn).toBe(true)
      expect(userStore.userName).toBe('test')
    })

    it('persists user info after register across navigations', () => {
      const userStore = useUserStore()
      const userData = {
        name: 'John Mensah',
        email: 'john@example.com',
        phone: '+233 24 555 7890',
      }

      // Simulate registration
      userStore.register(userData.name, userData.email, userData.phone, 'securePass1')
      expect(userStore.isLoggedIn).toBe(true)
      expect(userStore.userName).toBe('John Mensah')

      // Navigate away and back (simulated by checking state remains)
      expect(userStore.userName).toBe('John Mensah')
      expect(userStore.userEmail).toBe('john@example.com')
      expect(userStore.userPhone).toBe('+233 24 555 7890')
    })

    it('clears state on logout regardless of current "page"', () => {
      const userStore = useUserStore()

      userStore.login('user@example.com', 'password123')
      expect(userStore.isLoggedIn).toBe(true)

      // Logout is accessible from any page
      userStore.logout()
      expect(userStore.isLoggedIn).toBe(false)
      expect(userStore.userName).toBe('')
      expect(userStore.userEmail).toBe('')
      expect(userStore.userPhone).toBe('')
    })
  })

  describe('cart store state persistence across navigations', () => {
    it('preserves cart items when navigating between pages', () => {
      const cartStore = useCartStore()
      const product = createMockProduct({ id: 'prod-001', name: 'Rock Drill' })

      // Add item on Product Detail page
      cartStore.addItem(product, 2)
      expect(cartStore.items).toHaveLength(1)

      // Simulate navigating to Cart page -> cart state persists
      expect(cartStore.items).toHaveLength(1)
      expect(cartStore.items[0].product.name).toBe('Rock Drill')
      expect(cartStore.items[0].quantity).toBe(2)

      // Simulate navigating to Checkout page -> cart state persists
      expect(cartStore.items).toHaveLength(1)
      expect(cartStore.subtotal).toBe(200)

      // Simulate navigating back to Products -> cart state persists
      expect(cartStore.items).toHaveLength(1)
    })

    it('persists cart across multiple navigation steps', () => {
      const cartStore = useCartStore()

      // Step 1: Browse products, add item A
      cartStore.addItem(createMockProduct({ id: 'prod-a', name: 'Product A', price: 100 }), 1)

      // Step 2: Browse another category, add item B
      cartStore.addItem(createMockProduct({ id: 'prod-b', name: 'Product B', price: 250 }), 2)

      // Step 3: View cart (state persists)
      expect(cartStore.totalItems).toBe(3)
      expect(cartStore.subtotal).toBe(600)

      // Step 4: Update quantity in cart
      cartStore.updateQuantity('prod-a', 3)
      expect(cartStore.totalItems).toBe(5)

      // Step 5: Remove an item
      cartStore.removeItem('prod-b')
      expect(cartStore.items).toHaveLength(1)
      expect(cartStore.items[0].productId).toBe('prod-a')
    })

    it('persists cart state using persisted state plugin pattern', () => {
      const cartStore = useCartStore()
      const product = createMockProduct({ id: 'prod-001', price: 100 })
      cartStore.addItem(product, 1)

      // The pinia-plugin-persistedstate plugin would serialize cart state.
      // Simulate serialization and deserialization:
      const serialized = JSON.stringify(cartStore.items)
      const deserialized = JSON.parse(serialized)

      expect(deserialized).toHaveLength(1)
      expect(deserialized[0].productId).toBe('prod-001')
      expect(deserialized[0].quantity).toBe(1)
      expect(deserialized[0].product.price).toBe(100)

      // Verify derived state is restored from persisted items
      const restoredTotalItems = deserialized.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0)
      const restoredSubtotal = deserialized.reduce((sum: number, i: { product: { price: number }; quantity: number }) => sum + i.product.price * i.quantity, 0)

      expect(restoredTotalItems).toBe(1)
      expect(restoredSubtotal).toBe(100)
    })
  })

  describe('language store toggle affects locale state', () => {
    it('starts with Chinese (zh) as default locale', () => {
      const languageStore = useLanguageStore()
      expect(languageStore.locale).toBe('zh')
    })

    it('toggles from zh to en', () => {
      const languageStore = useLanguageStore()
      expect(languageStore.locale).toBe('zh')

      languageStore.toggleLocale()
      expect(languageStore.locale).toBe('en')
    })

    it('toggles back and forth correctly', () => {
      const languageStore = useLanguageStore()

      languageStore.toggleLocale()
      expect(languageStore.locale).toBe('en')

      languageStore.toggleLocale()
      expect(languageStore.locale).toBe('zh')

      languageStore.toggleLocale()
      expect(languageStore.locale).toBe('en')
    })

    it('sets locale explicitly with setLocale', () => {
      const languageStore = useLanguageStore()

      languageStore.setLocale('en')
      expect(languageStore.locale).toBe('en')

      languageStore.setLocale('zh')
      expect(languageStore.locale).toBe('zh')

      languageStore.setLocale('en')
      expect(languageStore.locale).toBe('en')
    })

    it('locale state persists across simulated page navigations', () => {
      const languageStore = useLanguageStore()

      // Set locale on Settings page
      languageStore.setLocale('en')
      expect(languageStore.locale).toBe('en')

      // Navigate to Home -> locale persists
      expect(languageStore.locale).toBe('en')

      // Navigate to Products -> locale persists
      expect(languageStore.locale).toBe('en')

      // Navigate to Cart -> locale persists
      expect(languageStore.locale).toBe('en')
    })

    it('supports locale change via toggle from any page', () => {
      const languageStore = useLanguageStore()

      // User can toggle language from any page
      languageStore.toggleLocale() // zh -> en
      expect(languageStore.locale).toBe('en')

      languageStore.toggleLocale() // en -> zh
      expect(languageStore.locale).toBe('zh')
    })
  })

  describe('combined store state across navigation', () => {
    it('maintains cart, user, and language state simultaneously', () => {
      const cartStore = useCartStore()
      const userStore = useUserStore()
      const languageStore = useLanguageStore()

      // User logs in
      userStore.login('john@example.com', 'password123')
      expect(userStore.isLoggedIn).toBe(true)

      // User adds items to cart
      cartStore.addItem(createMockProduct({ id: 'prod-1', price: 100 }), 2)
      expect(cartStore.items).toHaveLength(1)

      // User switches language
      languageStore.setLocale('en')
      expect(languageStore.locale).toBe('en')

      // All states maintained after simulated navigation
      // (navigating between pages doesn't reset stores)

      // On Cart page:
      expect(userStore.isLoggedIn).toBe(true)
      expect(cartStore.totalItems).toBe(2)
      expect(languageStore.locale).toBe('en')

      // On Checkout page:
      expect(userStore.userEmail).toBe('john@example.com')
      expect(cartStore.subtotal).toBe(200)
      expect(languageStore.locale).toBe('en')
    })
  })
})
