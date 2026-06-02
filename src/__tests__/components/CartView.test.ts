import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CartView from '@/views/Cart.vue'
import { useCartStore } from '@/stores/cart'
import { useLanguageStore } from '@/stores/language'
import type { Product, CartItem } from '@/types'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {}, query: {} }),
  useRouter: () => ({ push, back: vi.fn() }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
  createI18n: () => ({ install: () => {} }),
}))

const toastSpy = vi.fn()

function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    name: 'Heavy-Duty Rock Drill YT28',
    nameZh: '重型气腿式凿岩机 YT28',
    description: 'A test product',
    descriptionZh: '一个测试产品',
    price: 4850,
    currency: 'GHS',
    category: 'Mining Machinery',
    categoryZh: '矿产机械',
    images: ['/images/drill.jpg'],
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
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-05-20T14:30:00Z',
    ...overrides,
  }
}

function createMockCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: 'prod-1',
    product: createMockProduct({ id: 'prod-1' }),
    quantity: 2,
    ...overrides,
  }
}

const defaultCartItems: CartItem[] = [
  createMockCartItem(),
  createMockCartItem({
    productId: 'prod-2',
    product: createMockProduct({
      id: 'prod-2',
      name: 'Safety Helmet ABS',
      nameZh: '安全帽',
      price: 55,
      images: ['/images/helmet.jpg'],
    }),
    quantity: 3,
  }),
]

function mountCart(overrides: { cartItems?: CartItem[]; locale?: string } = {}) {
  const { cartItems = defaultCartItems, locale = 'en' } = overrides
  const pinia = createPinia()
  setActivePinia(pinia)
  const cartStore = useCartStore()
  for (const item of cartItems) {
    cartStore.addItem(item.product, item.quantity, item.selectedSku)
  }
  const langStore = useLanguageStore()
  langStore.$patch({ locale })
  return mount(CartView, {
    global: {
      plugins: [pinia],
      stubs: { BottomNav: true, 'router-link': true, 'router-view': true },
      provide: { showToast: toastSpy },
    },
  })
}

describe('CartView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the cart title with total item count', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('cart.title')
    expect(wrapper.text()).toContain('(5)')
  })

  it('renders the edit/done toggle button', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('cart.edit')
  })

  it('renders product images for cart items', () => {
    const wrapper = mountCart()
    const imgs = wrapper.findAll('img')
    const srcValues = imgs.map(i => i.attributes('src'))
    expect(srcValues).toContain('/images/drill.jpg')
    expect(srcValues).toContain('/images/helmet.jpg')
  })

  it('renders product names for cart items', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('Heavy-Duty Rock Drill YT28')
    expect(wrapper.text()).toContain('Safety Helmet ABS')
  })

  it('renders formatted prices for cart items', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('\u20b54,850.00')
    expect(wrapper.text()).toContain('\u20b555.00')
  })

  it('renders quantity for each cart item', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
  })

  it('increments quantity when plus button is clicked', async () => {
    const wrapper = mountCart()
    const cartStore = useCartStore()
    const allButtons = wrapper.findAll('button')
    const incrementBtns = allButtons.filter(b => {
      const svg = b.find('svg')
      if (!svg.exists()) return false
      const pathD = svg.find('path')?.attributes('d') || ''
      return pathD.includes('M12 4v16m8-8H4')
    })
    expect(incrementBtns.length).toBeGreaterThan(0)
    await incrementBtns[0].trigger('click')
    const item = cartStore.items.find(i => i.productId === 'prod-1')
    expect(item).toBeDefined()
    expect(item!.quantity).toBe(3)
  })

  it('decrements quantity when minus button is clicked', async () => {
    const wrapper = mountCart()
    const cartStore = useCartStore()
    const allButtons = wrapper.findAll('button')
    const decrementBtns = allButtons.filter(b => {
      const svg = b.find('svg')
      if (!svg.exists()) return false
      const pathD = svg.find('path')?.attributes('d') || ''
      return pathD.includes('M20 12H4')
    })
    expect(decrementBtns.length).toBeGreaterThan(0)
    await decrementBtns[0].trigger('click')
    const item = cartStore.items.find(i => i.productId === 'prod-1')
    expect(item).toBeDefined()
    expect(item!.quantity).toBe(1)
  })

  it('does not decrement below 1', async () => {
    const wrapper = mountCart({ cartItems: [createMockCartItem({ quantity: 1 })] })
    const cartStore = useCartStore()
    const allButtons = wrapper.findAll('button')
    const decrementBtns = allButtons.filter(b => {
      const svg = b.find('svg')
      if (!svg.exists()) return false
      const pathD = svg.find('path')?.attributes('d') || ''
      return pathD.includes('M20 12H4')
    })
    if (decrementBtns.length > 0) await decrementBtns[0].trigger('click')
    const item = cartStore.items.find(i => i.productId === 'prod-1')
    expect(item).toBeDefined()
    expect(item!.quantity).toBe(1)
  })

  it('removes item from cart when delete is clicked in edit mode', async () => {
    const wrapper = mountCart({ cartItems: [createMockCartItem()] })
    const cartStore = useCartStore()
    const editBtn = wrapper.findAll('button').find(b => b.text().includes('cart.edit'))
    await editBtn!.trigger('click')
    const deleteBtn = wrapper.findAll('button').find(b => b.text().includes('cart.delete'))
    await deleteBtn!.trigger('click')
    expect(cartStore.items.length).toBe(0)
  })

  it('shows delete confirmation toast when item is removed', async () => {
    const wrapper = mountCart({ cartItems: [createMockCartItem()] })
    const editBtn = wrapper.findAll('button').find(b => b.text().includes('cart.edit'))
    await editBtn!.trigger('click')
    const deleteBtn = wrapper.findAll('button').find(b => b.text().includes('cart.delete'))
    await deleteBtn!.trigger('click')
    expect(toastSpy).toHaveBeenCalledWith('cart.deleteConfirm', 'warning')
  })

  it('shows empty cart state when there are no items', () => {
    const wrapper = mountCart({ cartItems: [] })
    expect(wrapper.text()).toContain('cart.empty')
    expect(wrapper.text()).toContain('cart.emptyDesc')
    expect(wrapper.text()).toContain('cart.goShopping')
  })

  it('shows no checkout bar when cart is empty', () => {
    const wrapper = mountCart({ cartItems: [] })
    expect(wrapper.text()).not.toContain('cart.checkout')
  })

  it('displays the selected total price', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('\u20b59,865.00')
  })

  it('displays the total label in the checkout bar', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('cart.total')
  })

  it('renders select all checkbox', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('cart.selectAll')
  })

  it('renders the checkout button with selected item count', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('cart.checkout')
    expect(wrapper.text()).toContain('(5)')
  })

  it('navigates to /checkout when checkout button is clicked', async () => {
    const wrapper = mountCart()
    const checkoutBtn = wrapper.findAll('button').find(b => b.text().includes('cart.checkout'))
    await checkoutBtn!.trigger('click')
    expect(push).toHaveBeenCalledWith('/checkout')
  })

  it('shows coupon code section when there are items in cart', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('Enter Coupon Code')
  })

  it('opens coupon input when coupon section is clicked', async () => {
    const wrapper = mountCart()
    const couponHeader = wrapper.findAll('button').find(b => b.text().includes('Enter Coupon Code'))
    await couponHeader!.trigger('click')
    const couponInput = wrapper.findAll('input').find(i => (i.attributes('placeholder') || '').includes('Enter coupon code'))
    expect(couponInput).toBeDefined()
  })

  it('applies valid coupon SAVE10 for 10% discount', async () => {
    const wrapper = mountCart()
    const couponHeader = wrapper.findAll('button').find(b => b.text().includes('Enter Coupon Code'))
    await couponHeader!.trigger('click')
    const couponInput = wrapper.findAll('input').find(i => (i.attributes('placeholder') || '').includes('Enter coupon code'))
    await couponInput!.setValue('SAVE10')
    const applyBtn = wrapper.findAll('button').find(b => b.text() === 'Apply')
    await applyBtn!.trigger('click')
    expect(wrapper.text()).toContain('SAVE10')
    expect(wrapper.text()).toContain('\u20b58,878.50')
  })

  it('shows toast error for invalid coupon code', async () => {
    const wrapper = mountCart()
    const couponHeader = wrapper.findAll('button').find(b => b.text().includes('Enter Coupon Code'))
    await couponHeader!.trigger('click')
    const couponInput = wrapper.findAll('input').find(i => (i.attributes('placeholder') || '').includes('Enter coupon code'))
    await couponInput!.setValue('INVALID99')
    const applyBtn = wrapper.findAll('button').find(b => b.text() === 'Apply')
    await applyBtn!.trigger('click')
    expect(toastSpy).toHaveBeenCalledWith('Invalid coupon code', 'warning')
  })

  it('shows clear button after coupon is applied', async () => {
    const wrapper = mountCart()
    const couponHeader = wrapper.findAll('button').find(b => b.text().includes('Enter Coupon Code'))
    await couponHeader!.trigger('click')
    const couponInput = wrapper.findAll('input').find(i => (i.attributes('placeholder') || '').includes('Enter coupon code'))
    await couponInput!.setValue('SAVE10')
    const applyBtn = wrapper.findAll('button').find(b => b.text() === 'Apply')
    await applyBtn!.trigger('click')
    expect(wrapper.text()).toContain('Clear')
  })

  it('clears coupon when Clear button is clicked', async () => {
    const wrapper = mountCart()
    const couponHeader = wrapper.findAll('button').find(b => b.text().includes('Enter Coupon Code'))
    await couponHeader!.trigger('click')
    const couponInput = wrapper.findAll('input').find(i => (i.attributes('placeholder') || '').includes('Enter coupon code'))
    await couponInput!.setValue('SAVE10')
    const applyBtn = wrapper.findAll('button').find(b => b.text() === 'Apply')
    await applyBtn!.trigger('click')
    const clearBtn = wrapper.findAll('button').find(b => b.text().includes('Clear'))
    await clearBtn!.trigger('click')
    expect(wrapper.text()).toContain('\u20b59,865.00')
    expect(toastSpy).toHaveBeenCalledWith('Coupon cleared', 'info')
  })

  it('shows discounted total with strikethrough original price when coupon applied', async () => {
    const wrapper = mountCart()
    const couponHeader = wrapper.findAll('button').find(b => b.text().includes('Enter Coupon Code'))
    await couponHeader!.trigger('click')
    const couponInput = wrapper.findAll('input').find(i => (i.attributes('placeholder') || '').includes('Enter coupon code'))
    await couponInput!.setValue('SAVE10')
    const applyBtn = wrapper.findAll('button').find(b => b.text() === 'Apply')
    await applyBtn!.trigger('click')
    const lineThrough = wrapper.find('.line-through')
    expect(lineThrough.exists()).toBe(true)
    expect(lineThrough.text()).toContain('\u20b59,865.00')
  })

  it('shows hint text for SAVE10 coupon when input is empty', async () => {
    const wrapper = mountCart()
    const couponHeader = wrapper.findAll('button').find(b => b.text().includes('Enter Coupon Code'))
    await couponHeader!.trigger('click')
    expect(wrapper.text()).toContain('SAVE10')
  })

  it('removes out-of-stock items on mount', async () => {
    const staleItem = createMockCartItem({
      productId: 'prod-stale',
      product: createMockProduct({ id: 'prod-stale', name: 'Out of Stock Item', stock: 'out_of_stock', stockCount: 0 }),
    })
    const wrapper = mountCart({ cartItems: [staleItem, ...defaultCartItems] })
    await wrapper.vm.$nextTick()
    // The stale item should have been removed from the store
    const staleExists = useCartStore().items.find(i => i.productId === 'prod-stale')
    expect(staleExists).toBeUndefined()
    // Remaining items should be the non-stale ones
    expect(useCartStore().items.length).toBe(2)
  })

  it('removes stale items with stockCount 0 on mount', async () => {
    const staleItem = createMockCartItem({
      productId: 'prod-stale',
      product: createMockProduct({ id: 'prod-stale', name: 'Zero Stock Item', stock: 'in_stock', stockCount: 0 }),
    })
    const wrapper = mountCart({ cartItems: [staleItem, ...defaultCartItems] })
    await wrapper.vm.$nextTick()
    const staleExists = useCartStore().items.find(i => i.productId === 'prod-stale')
    expect(staleExists).toBeUndefined()
  })

  it('does not show stale warning when all items are in stock', () => {
    const wrapper = mountCart()
    expect(wrapper.text()).not.toContain('Some items are out of stock')
  })

  it('dismisses stale warning when close button is clicked', async () => {
    const staleItem = createMockCartItem({
      productId: 'prod-stale',
      product: createMockProduct({ id: 'prod-stale', name: 'Out of Stock Item', stock: 'out_of_stock', stockCount: 0 }),
    })
    const wrapper = mountCart({ cartItems: [staleItem, ...defaultCartItems] })
    await wrapper.vm.$nextTick()
    const closeBtn = wrapper.findAll('button').find(b => {
      const svg = b.find('path')
      return svg.exists() && (svg.attributes('d') || '').includes('M6 18L18 6')
    })
    if (closeBtn) await closeBtn.trigger('click')
    expect(wrapper.text()).not.toContain('Some items are out of stock')
  })

  it('toggles edit mode when Edit/Done button is clicked', async () => {
    const wrapper = mountCart()
    expect(wrapper.text()).toContain('cart.edit')
    const editBtn = wrapper.findAll('button').find(b => b.text().includes('cart.edit'))
    await editBtn!.trigger('click')
    expect(wrapper.text()).toContain('cart.done')
  })

  it('shows delete button when in edit mode', async () => {
    const wrapper = mountCart()
    const editBtn = wrapper.findAll('button').find(b => b.text().includes('cart.edit'))
    await editBtn!.trigger('click')
    const deleteBtns = wrapper.findAll('button').filter(b => b.text().includes('cart.delete'))
    expect(deleteBtns.length).toBeGreaterThan(0)
  })

  it('navigates to home when Go Shopping is clicked in empty cart', async () => {
    const wrapper = mountCart({ cartItems: [] })
    const goShoppingBtn = wrapper.findAll('button').find(b => b.text().includes('cart.goShopping'))
    await goShoppingBtn!.trigger('click')
    expect(push).toHaveBeenCalledWith('/')
  })
})
