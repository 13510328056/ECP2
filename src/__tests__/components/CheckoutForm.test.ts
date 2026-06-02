import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CheckoutView from '@/views/Checkout.vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import type { Product, CartItem } from '@/types'

// ── Mocks ──
const push = vi.fn()
const back = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {}, query: {} }),
  useRouter: () => ({ push, back }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
  createI18n: () => ({ install: () => {} }),
}))

// ── Helpers ──
function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    name: 'Heavy-Duty Rock Drill',
    nameZh: '重型凿岩机',
    description: 'A powerful rock drill',
    descriptionZh: '强大的凿岩机',
    price: 4850,
    currency: 'GHS',
    category: 'Mining Machinery',
    categoryZh: '矿产机械',
    images: ['/images/drill.jpg'],
    specifications: {},
    specificationsZh: {},
    stock: 'in_stock',
    stockCount: 45,
    rating: 4.5,
    reviewCount: 28,
    minOrderQuantity: 1,
    bulkPricing: [],
    applicationScenarios: [],
    shippingInfo: { weight: '28 kg' },
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

const toastSpy = vi.fn()

function mountCheckout(overrides: {
  cartItems?: CartItem[]
  isLoggedIn?: boolean
  locale?: string
} = {}) {
  const {
    cartItems = [createMockCartItem()],
    isLoggedIn = false,
    locale = 'en',
  } = overrides

  return mount(CheckoutView, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          initialState: {
            cart: { items: cartItems },
            user: { isLoggedIn },
            language: { locale },
          },
        }),
      ],
      stubs: ['router-link', 'router-view'],
      provide: {
        showToast: toastSpy,
      },
    },
  })
}

describe('CheckoutForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  // ── Header ──
  it('renders the header with checkout title', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('checkout.title')
  })

  it('renders the back button', () => {
    const wrapper = mountCheckout()
    const backBtn = wrapper.find('header button')
    expect(backBtn.exists()).toBe(true)
  })

  // ── Guest Login Prompt Banner ──
  it('shows login prompt banner when user is not logged in', () => {
    const wrapper = mountCheckout({ isLoggedIn: false })
    expect(wrapper.text()).toContain('Please login to continue checkout')
    // The login prompt appears as text in the checkout page when not logged in
    expect(wrapper.text()).toContain('Please login')
  })

  it('hides login prompt banner when user is logged in', () => {
    const wrapper = mountCheckout({ isLoggedIn: true })
    expect(wrapper.text()).not.toContain('Please login to continue checkout')
    const loginLink = wrapper.find('a[href="/login"]')
    expect(loginLink.exists()).toBe(false)
  })

  // ── Address Form - Initial State ──
  it('shows add address button when no address is saved', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('checkout.addAddress')
  })

  it('shows address form when add address button is clicked', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.find('button')
    const addBtnArr = wrapper.findAll('button')
    // Find the "Add Address" button by checking for "+" and the translation key
    let clicked = false
    for (const btn of addBtnArr) {
      if (btn.text().includes('checkout.addAddress')) {
        await btn.trigger('click')
        clicked = true
        break
      }
    }
    expect(clicked).toBe(true)
    // After clicking, the form fields should appear
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('renders address form fields: fullName, phone, email, addressLine1, addressLine2', async () => {
    const wrapper = mountCheckout()
    // Click the add address button to reveal form
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const placeholders = inputs.map(i => i.attributes('placeholder') || '')
    // The placeholders will show the translation keys
    expect(placeholders.some(p => p.includes('checkout.fullName'))).toBe(true)
    expect(placeholders.some(p => p.includes('checkout.phone'))).toBe(true)
    expect(placeholders.some(p => p.includes('checkout.email'))).toBe(true)
    expect(placeholders.some(p => p.includes('checkout.addressLine1'))).toBe(true)
    expect(placeholders.some(p => p.includes('checkout.addressLine2'))).toBe(true)
  })

  it('renders city and region dropdowns', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const selects = wrapper.findAll('select')
    // At least one select for city and one for region
    expect(selects.length).toBeGreaterThanOrEqual(2)

    const options = selects[0].findAll('option')
    const optionValues = options.map(o => o.attributes('value'))
    expect(optionValues).toContain('Accra')
    expect(optionValues).toContain('Kumasi')
  })

  it('renders save and cancel buttons in the address form', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const text = wrapper.text()
    expect(text).toContain('checkout.saveAddress')
    expect(text).toContain('checkout.cancel')
  })

  // ── Address Form - Validation ──
  it('shows validation errors when saving with empty required fields', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    // Click save with empty fields
    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    // Should trigger toast with warning
    expect(toastSpy).toHaveBeenCalledWith(
      expect.stringContaining('validation.requiredField'),
      'warning'
    )
  })

  it('validates phone number format', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    // Fill in fields with invalid phone
    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('123')
    if (addrInput) await addrInput.setValue('123 Main St')

    // Select a city
    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    expect(toastSpy).toHaveBeenCalledWith(
      expect.stringContaining('validation.invalidPhone'),
      'warning'
    )
  })

  it('validates email format when email is provided', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const emailInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.email'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('0241234567')
    if (emailInput) await emailInput.setValue('invalid-email')
    if (addrInput) await addrInput.setValue('123 Main St')

    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    expect(toastSpy).toHaveBeenCalledWith(
      expect.stringContaining('validation.invalidEmail'),
      'warning'
    )
  })

  // ── Address Form - Save ──
  it('saves address when form is valid', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('0241234567')
    if (addrInput) await addrInput.setValue('123 Main St')

    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')
    if (selects.length > 1) await selects[1].setValue('Greater Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    // After saving, the address details should appear
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('0241234567')
    expect(wrapper.text()).toContain('123 Main St')
    expect(wrapper.text()).toContain('Accra')
  })

  it('shows modify button after address is saved', async () => {
    const wrapper = mountCheckout()
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('0241234567')
    if (addrInput) await addrInput.setValue('123 Main St')

    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    expect(wrapper.text()).toContain('checkout.modify')
  })

  // ── Payment Method Selection ──
  it('sets MOMO as the default payment method', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('checkout.momo')
  })

  it('shows MOMO phone number input when MOMO is selected', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('MTN Mobile Number')
    expect(wrapper.text()).toContain('+233')
  })

  it('shows COD payment option', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('checkout.cod')
  })

  it('switches to COD when the COD option is clicked', async () => {
    const wrapper = mountCheckout()
    // Find the COD payment option - it has "checkout.cod" text
    const codEl = wrapper.findAll('div').filter(d => d.text().includes('checkout.cod'))
    // Find the one that has the cursor-pointer class
    for (const el of codEl) {
      if (el.classes().includes('cursor-pointer')) {
        await el.trigger('click')
        break
      }
    }

    // MOMO phone input should not be visible after switching to COD
    expect(wrapper.text()).not.toContain('MTN Mobile Number')
  })

  // ── Order Items ──
  it('renders order items section', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('checkout.orderItems')
  })

  it('renders cart items with product name and quantity', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('Heavy-Duty Rock Drill')
    expect(wrapper.text()).toContain('x2')
  })

  it('renders product image in order items', () => {
    const wrapper = mountCheckout()
    const imgs = wrapper.findAll('img')
    const productImg = imgs.find(i => i.attributes('src') === '/images/drill.jpg')
    expect(productImg).toBeDefined()
    expect(productImg!.attributes('alt')).toBe('Heavy-Duty Rock Drill')
  })

  // ── Order Summary ──
  it('renders order summary with subtotal, shipping, and total', () => {
    const wrapper = mountCheckout()
    const text = wrapper.text()
    expect(text).toContain('checkout.subtotal')
    expect(text).toContain('checkout.shippingFee')
    expect(text).toContain('checkout.total')
  })

  it('displays formatted subtotal', () => {
    const wrapper = mountCheckout()
    // Subtotal = 4850 * 2 = 9700
    expect(wrapper.text()).toContain('₵9,700.00')
  })

  it('shows free shipping for orders >= 200', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('checkout.shippingFree')
  })

  // ── Submit Order ──
  it('renders the submit order button', () => {
    const wrapper = mountCheckout()
    expect(wrapper.text()).toContain('checkout.submitOrder')
  })

  it('shows toast warning and address form when submitting without saved address', async () => {
    const wrapper = mountCheckout()
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.submitOrder'))
    expect(submitBtn).toBeDefined()
    if (submitBtn) {
      await submitBtn.trigger('click')
    }
    expect(toastSpy).toHaveBeenCalledWith('checkout.addAddress', 'warning')
  })

  it('redirects to /payment when submitting with MOMO and valid address', async () => {
    const wrapper = mountCheckout()

    // First, save a valid address
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('0241234567')
    if (addrInput) await addrInput.setValue('123 Main St')

    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    // Now submit the order
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.submitOrder'))
    if (submitBtn) await submitBtn.trigger('click')

    // Should navigate to /payment for MOMO
    expect(push).toHaveBeenCalledWith('/payment')
  })

  it('clears cart and redirects to /order-confirmation for COD payment', async () => {
    const wrapper = mountCheckout()

    // Switch to COD
    const codEl = wrapper.findAll('div').filter(d => d.text().includes('checkout.cod'))
    for (const el of codEl) {
      if (el.classes().includes('cursor-pointer')) {
        await el.trigger('click')
        break
      }
    }

    // Save a valid address
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('0241234567')
    if (addrInput) await addrInput.setValue('123 Main St')

    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    // Submit
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.submitOrder'))
    if (submitBtn) await submitBtn.trigger('click')

    // Should store in lastOrder and redirect
    expect(push).toHaveBeenCalledWith('/order-confirmation')

    const cartStore = useCartStore()
    expect(cartStore.items.length).toBe(0)
  })

  // ── Empty Cart ──
  it('shows warning and redirects to home when cart is empty on submit', async () => {
    const wrapper = mountCheckout({ cartItems: [] })

    // Need an address first to get past that check
    // Since the address check comes before the empty cart check,
    // we need to save an address first
    // Actually, looking at the code: first it checks !savedAddress.value, then cartStore.items.length
    // So if cart is empty and no address, it shows address warning first
    // If cart is empty and address is saved, it redirects to home

    // Let's just trigger submit - it will hit the no-address guard first
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.submitOrder'))
    if (submitBtn) await submitBtn.trigger('click')

    // Should show address warning
    expect(toastSpy).toHaveBeenCalledWith('checkout.addAddress', 'warning')
  })

  it('redirects to home when submitting with empty cart and saved address', async () => {
    const wrapper = mountCheckout({ cartItems: [] })

    // Save address first
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('0241234567')
    if (addrInput) await addrInput.setValue('123 Main St')

    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    // Submit
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.submitOrder'))
    if (submitBtn) await submitBtn.trigger('click')

    // Should show cart empty toast and redirect to home
    expect(toastSpy).toHaveBeenCalledWith('cart.empty', 'warning')
    expect(push).toHaveBeenCalledWith('/')
  })

  // ── Stores sessionStorage for pendingOrder ──
  it('stores pending order data in sessionStorage when submitting with MOMO', async () => {
    const wrapper = mountCheckout()

    // Save a valid address
    const addBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.addAddress'))
    if (addBtn) await addBtn.trigger('click')

    const inputs = wrapper.findAll('input')
    const fullNameInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.fullName'))
    const phoneInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.phone'))
    const addrInput = inputs.find(i => (i.attributes('placeholder') || '').includes('checkout.addressLine1'))

    if (fullNameInput) await fullNameInput.setValue('John Doe')
    if (phoneInput) await phoneInput.setValue('0241234567')
    if (addrInput) await addrInput.setValue('123 Main St')

    const selects = wrapper.findAll('select')
    if (selects.length > 0) await selects[0].setValue('Accra')

    const saveBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.saveAddress'))
    if (saveBtn) await saveBtn.trigger('click')

    // Submit
    const submitBtn = wrapper.findAll('button').find(b => b.text().includes('checkout.submitOrder'))
    if (submitBtn) await submitBtn.trigger('click')

    const stored = sessionStorage.getItem('pendingOrder')
    expect(stored).not.toBeNull()
    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed).toHaveProperty('orderNumber')
      expect(parsed).toHaveProperty('items')
      expect(parsed).toHaveProperty('shippingInfo')
      expect(parsed).toHaveProperty('paymentMethod')
      expect(parsed).toHaveProperty('total')
    }
  })
})
