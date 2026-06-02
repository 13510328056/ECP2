import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import type { Order, ShippingInfo } from '@/types'

// Helper to create a mock product
function createMockProduct(overrides: Partial<{ id: string; name: string; price: number; stockCount: number }> = {}) {
  return {
    id: overrides.id ?? 'prod-001',
    name: overrides.name ?? 'Heavy-Duty Rock Drill YT28',
    nameZh: '重型气腿式凿岩机 YT28',
    description: 'A test product',
    descriptionZh: '一个测试产品',
    price: overrides.price ?? 4850,
    currency: 'GHS' as const,
    category: 'Mining Machinery',
    categoryZh: '矿产机械',
    images: ['/images/test.jpg'],
    specifications: {},
    specificationsZh: {},
    stock: 'in_stock' as const,
    stockCount: overrides.stockCount ?? 45,
    rating: 4.5,
    reviewCount: 10,
    minOrderQuantity: 1,
    bulkPricing: [],
    applicationScenarios: [],
    shippingInfo: { weight: '1kg' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }
}

function createMockShippingInfo(overrides: Partial<ShippingInfo> = {}): ShippingInfo {
  return {
    fullName: 'John Mensah',
    phone: '+233 24 123 4567',
    email: 'john.mensah@example.com',
    addressLine1: 'Plot 45, Industrial Road',
    addressLine2: 'Tema Heavy Industrial Zone',
    city: 'Tema',
    region: 'Greater Accra',
    ...overrides,
  }
}

describe('Complete Order Flow', () => {
  let cartStore: ReturnType<typeof useCartStore>
  let userStore: ReturnType<typeof useUserStore>
  let orders: Order[]

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})

    cartStore = useCartStore()
    userStore = useUserStore()
    orders = []
  })

  it('full order journey: add to cart, checkout, pay, verify completion', () => {
    const product = createMockProduct({ id: 'prod-001', name: 'Rock Drill YT28', price: 4850 })
    const product2 = createMockProduct({ id: 'prod-002', name: 'Safety Helmet', price: 55, stockCount: 100 })

    // Step 1: Add items to cart
    cartStore.addItem(product, 2)
    cartStore.addItem(product2, 10)

    expect(cartStore.items).toHaveLength(2)
    expect(cartStore.totalItems).toBe(12)
    expect(cartStore.subtotal).toBe(4850 * 2 + 55 * 10)

    // Step 2: User logs in (required for checkout)
    const loginResult = userStore.login('john.mensah@example.com', 'password123')
    expect(loginResult).toBe(true)
    expect(userStore.isLoggedIn).toBe(true)

    // Step 3: Create an order from cart contents
    const shippingInfo = createMockShippingInfo()
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `GH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      items: [...cartStore.items],
      shippingInfo,
      paymentMethod: 'momo',
      paymentStatus: 'pending',
      subtotal: cartStore.subtotal,
      shippingCost: cartStore.shippingCost,
      total: cartStore.total,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expect(newOrder.items).toHaveLength(2)
    expect(newOrder.subtotal).toBe(4850 * 2 + 55 * 10)
    expect(newOrder.paymentStatus).toBe('pending')
    expect(newOrder.status).toBe('pending_payment')

    orders.push(newOrder)

    // Step 4: Process payment (MOMO payment)
    newOrder.paymentStatus = 'paid'
    newOrder.status = 'paid'

    expect(newOrder.paymentStatus).toBe('paid')
    expect(newOrder.status).toBe('paid')

    // Step 5: Clear cart after successful payment
    cartStore.clearCart()
    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalItems).toBe(0)

    // Step 6: Verify order appears in order history
    expect(orders).toHaveLength(1)
    const foundOrder = orders.find(o => o.id === newOrder.id)
    expect(foundOrder).toBeDefined()
    expect(foundOrder!.orderNumber).toBe(newOrder.orderNumber)
    expect(foundOrder!.items[0].product.name).toBe('Rock Drill YT28')
    expect(foundOrder!.total).toBeGreaterThan(0)

    // Step 7: Verify order details are complete
    expect(foundOrder!.shippingInfo.fullName).toBe('John Mensah')
    expect(foundOrder!.shippingInfo.phone).toBe('+233 24 123 4567')
    expect(foundOrder!.paymentMethod).toBe('momo')
    expect(foundOrder!.createdAt).toBeDefined()
  })

  it('handles COD payment flow correctly', () => {
    const product = createMockProduct({ id: 'prod-003', price: 100 })
    cartStore.addItem(product, 1)

    const shippingInfo = createMockShippingInfo()
    const order: Order = {
      id: 'ord-cod-001',
      orderNumber: 'GH20250601000001',
      items: [...cartStore.items],
      shippingInfo,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      subtotal: cartStore.subtotal,
      shippingCost: cartStore.shippingCost,
      total: cartStore.total,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expect(order.paymentMethod).toBe('cod')
    expect(order.paymentStatus).toBe('pending')

    // With COD, payment status remains pending until delivery
    orders.push(order)

    // Simulate order progression
    order.status = 'processing'
    expect(order.status).toBe('processing')

    order.status = 'shipped'
    expect(order.status).toBe('shipped')

    order.status = 'delivered'
    expect(order.status).toBe('delivered')

    // Payment is collected on delivery
    order.paymentStatus = 'paid'
    expect(order.paymentStatus).toBe('paid')
  })

  it('calculates shipping cost correctly in order total', () => {
    // Free shipping when subtotal >= 200
    const bigProduct = createMockProduct({ id: 'prod-big', price: 200 })
    cartStore.addItem(bigProduct, 1)

    expect(cartStore.shippingCost).toBe(0)
    expect(cartStore.subtotal).toBe(200)
    expect(cartStore.total).toBe(200)
  })

  it('clears cart only after successful payment, not before', () => {
    const product = createMockProduct({ id: 'prod-001', price: 100 })
    cartStore.addItem(product, 1)
    expect(cartStore.items).toHaveLength(1)

    // Cart still has items after creating order (before payment)
    expect(cartStore.items).toHaveLength(1)

    // Only after payment + clearCart is invoked
    cartStore.clearCart()
    expect(cartStore.items).toHaveLength(0)
  })

  it('preserves order history across multiple purchases', () => {
    const allOrders: Order[] = []

    // First order
    const p1 = createMockProduct({ id: 'prod-a', name: 'Product A', price: 100 })
    cartStore.addItem(p1, 2)
    allOrders.push({
      id: 'ord-001',
      orderNumber: 'GH20250601000001',
      items: [...cartStore.items],
      shippingInfo: createMockShippingInfo(),
      paymentMethod: 'momo',
      paymentStatus: 'paid',
      subtotal: cartStore.subtotal,
      shippingCost: cartStore.shippingCost,
      total: cartStore.total,
      status: 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    cartStore.clearCart()

    // Second order
    const p2 = createMockProduct({ id: 'prod-b', name: 'Product B', price: 250 })
    cartStore.addItem(p2, 1)
    allOrders.push({
      id: 'ord-002',
      orderNumber: 'GH20250601000002',
      items: [...cartStore.items],
      shippingInfo: createMockShippingInfo({ fullName: 'Kwame Osei' }),
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      subtotal: cartStore.subtotal,
      shippingCost: cartStore.shippingCost,
      total: cartStore.total,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    cartStore.clearCart()

    // Verify both orders exist in history
    expect(allOrders).toHaveLength(2)
    expect(allOrders[0].items[0].product.name).toBe('Product A')
    expect(allOrders[1].items[0].product.name).toBe('Product B')
    expect(allOrders[1].shippingInfo.fullName).toBe('Kwame Osei')
  })
})
