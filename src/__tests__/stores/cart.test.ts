import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
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

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with an empty cart', () => {
    const store = useCartStore()
    expect(store.items).toHaveLength(0)
    expect(store.totalItems).toBe(0)
    expect(store.subtotal).toBe(0)
    expect(store.total).toBe(25) // Shipping cost when below 200
  })

  describe('addItem', () => {
    it('adds a new product to the cart', () => {
      const store = useCartStore()
      const product = createMockProduct()
      store.addItem(product, 2)
      expect(store.items).toHaveLength(1)
      expect(store.items[0].productId).toBe('prod-1')
      expect(store.items[0].quantity).toBe(2)
      expect(store.totalItems).toBe(2)
    })

    it('increments quantity when adding an existing product', () => {
      const store = useCartStore()
      const product = createMockProduct()
      store.addItem(product, 1)
      store.addItem(product, 2)
      expect(store.items).toHaveLength(1)
      expect(store.items[0].quantity).toBe(3)
    })

    it('adds with default quantity of 1', () => {
      const store = useCartStore()
      const product = createMockProduct()
      store.addItem(product)
      expect(store.items[0].quantity).toBe(1)
    })

    it('differentiates items by SKU', () => {
      const store = useCartStore()
      const product = createMockProduct()
      store.addItem(product, 1, 'sku-A')
      store.addItem(product, 2, 'sku-B')
      expect(store.items).toHaveLength(2)
      expect(store.items[0].quantity).toBe(1)
      expect(store.items[1].quantity).toBe(2)
    })
  })

  describe('updateQuantity', () => {
    it('updates quantity for an existing item', () => {
      const store = useCartStore()
      const product = createMockProduct()
      store.addItem(product, 1)
      store.updateQuantity('prod-1', 5)
      expect(store.items[0].quantity).toBe(5)
    })

    it('clamps quantity to minimum of 1', () => {
      const store = useCartStore()
      const product = createMockProduct()
      store.addItem(product, 3)
      store.updateQuantity('prod-1', 0)
      expect(store.items[0].quantity).toBe(1)
    })

    it('clamps quantity to stockCount maximum', () => {
      const store = useCartStore()
      const product = createMockProduct({ stockCount: 10 })
      store.addItem(product, 1)
      store.updateQuantity('prod-1', 100)
      expect(store.items[0].quantity).toBe(10)
    })

    it('does nothing for a non-existent product', () => {
      const store = useCartStore()
      store.updateQuantity('nonexistent', 5)
      expect(store.items).toHaveLength(0)
    })
  })

  describe('removeItem', () => {
    it('removes an item by productId', () => {
      const store = useCartStore()
      const product = createMockProduct()
      store.addItem(product, 1)
      store.removeItem('prod-1')
      expect(store.items).toHaveLength(0)
      expect(store.totalItems).toBe(0)
    })
  })

  describe('clearCart', () => {
    it('removes all items from the cart', () => {
      const store = useCartStore()
      store.addItem(createMockProduct({ id: 'prod-1' }), 1)
      store.addItem(createMockProduct({ id: 'prod-2' }), 2)
      expect(store.items).toHaveLength(2)
      store.clearCart()
      expect(store.items).toHaveLength(0)
    })
  })

  describe('computed values', () => {
    it('calculates totalItems correctly', () => {
      const store = useCartStore()
      store.addItem(createMockProduct({ id: 'prod-1', price: 100 }), 2)
      store.addItem(createMockProduct({ id: 'prod-2', price: 50 }), 3)
      expect(store.totalItems).toBe(5)
    })

    it('calculates subtotal correctly', () => {
      const store = useCartStore()
      store.addItem(createMockProduct({ id: 'prod-1', price: 100 }), 2)
      store.addItem(createMockProduct({ id: 'prod-2', price: 50 }), 3)
      expect(store.subtotal).toBe(350)
    })

    it('applies free shipping when subtotal >= 200', () => {
      const store = useCartStore()
      store.addItem(createMockProduct({ id: 'prod-1', price: 200 }), 1)
      expect(store.shippingCost).toBe(0)
    })

    it('charges shipping when subtotal < 200', () => {
      const store = useCartStore()
      store.addItem(createMockProduct({ id: 'prod-1', price: 50 }), 1)
      expect(store.shippingCost).toBe(25)
    })

    it('calculates total as subtotal + shipping', () => {
      const store = useCartStore()
      store.addItem(createMockProduct({ id: 'prod-1', price: 100 }), 1)
      expect(store.total).toBe(125) // 100 + 25 shipping
    })

    it('returns only items with quantity > 0 as selectedItems', () => {
      const store = useCartStore()
      store.addItem(createMockProduct({ id: 'prod-1', price: 100 }), 1)
      expect(store.selectedItems).toHaveLength(1)
    })
  })
})
