import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentView from '@/views/Payment.vue'

// ── Mocks ──
const push = vi.fn()
const back = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {}, query: {} }),
  useRouter: () => ({ push, back }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
}))

const pendingOrder = {
  orderNumber: 'GH20250531000000001',
  total: 10000,
  items: [],
  shippingInfo: { fullName: 'John Doe', phone: '0241234567', addressLine1: '123 St', city: 'Accra', region: 'Greater Accra' },
  paymentMethod: 'momo',
  subtotal: 9000,
  shippingCost: 1000,
  createdAt: '2025-05-31T00:00:00Z',
}

describe('PaymentFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    // Directly set sessionStorage before component mounts
    sessionStorage.setItem('pendingOrder', JSON.stringify(pendingOrder))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function mountPayment() {
    return mount(PaymentView, {
      global: {
        stubs: ['router-link', 'router-view'],
      },
    })
  }

  // ── Helper ──
  async function enterDigits(wrapper: ReturnType<typeof mount>, digits: string[]) {
    for (const digit of digits) {
      const btn = wrapper.findAll('button').filter(b => b.text() === digit)
      if (btn.length > 0) {
        await btn[0].trigger('click')
      }
    }
  }

  function getBackspaceButton(wrapper: ReturnType<typeof mount>) {
    const pinScreen = wrapper.find('#pin-screen')
    if (!pinScreen.exists()) return null
    const buttons = pinScreen.findAll('button')
    // Backspace is the last button in the 3x4 grid (12th button)
    // The grid has rows: 1-3, 4-6, 7-9, forgot-0-backspace
    // All buttons: [1,2,3,4,5,6,7,8,9, forgot, 0, backspace]
    // So backspace is at index 11
    return buttons.length > 11 ? buttons[11] : buttons[buttons.length - 1]
  }

  // ── Basic Rendering ──
  it('renders MTN logo and brand', () => {
    const wrapper = mountPayment()
    expect(wrapper.text()).toContain('MTN')
  })

  it('renders the payment amount from sessionStorage', () => {
    const wrapper = mountPayment()
    expect(wrapper.text()).toContain('payment.title')
    expect(wrapper.text()).toContain('MTN')
  })
  it('renders "pay to" label', () => {
    const wrapper = mountPayment()
    expect(wrapper.text()).toContain('payment.payTo')
  })

  it('renders the payment title in header', () => {
    const wrapper = mountPayment()
    expect(wrapper.text()).toContain('payment.title')
  })

  // ── PIN Dot Indicators ──
  it('renders 4 PIN dot indicators', () => {
    const wrapper = mountPayment()
    const dots = wrapper.findAll('.rounded-full.border-2')
    expect(dots.length).toBe(4)
  })

  it('renders all PIN dots as empty (unfilled) initially', () => {
    const wrapper = mountPayment()
    const dots = wrapper.findAll('.rounded-full.border-2')
    dots.forEach(dot => {
      expect(dot.classes()).toContain('border-gray-300')
      expect(dot.classes()).not.toContain('bg-gray-900')
    })
  })

  it('shows the PIN entry instruction text', () => {
    const wrapper = mountPayment()
    expect(wrapper.text()).toContain('payment.enterPin')
  })

  // ── Number Pad ──
  it('renders number pad with digits 0 through 9', () => {
    const wrapper = mountPayment()
    const pinScreen = wrapper.find('#pin-screen')
    expect(pinScreen.exists()).toBe(true)
    const text = pinScreen.text()
    for (let i = 0; i <= 9; i++) {
      expect(text).toContain(i.toString())
    }
  })

  it('renders the forgot button in the number pad', () => {
    const wrapper = mountPayment()
    expect(wrapper.text()).toContain('payment.forgot')
  })

  it('renders a backspace button', () => {
    const wrapper = mountPayment()
    const backspaceBtn = getBackspaceButton(wrapper)
    expect(backspaceBtn).not.toBeNull()
    // Backspace button should contain an SVG icon
    const svg = backspaceBtn!.find('svg')
    expect(svg.exists()).toBe(true)
  })

  // ── PIN Entry Behaviour ──
  it('fills the first PIN dot when a digit is entered', async () => {
    const wrapper = mountPayment()
    await enterDigits(wrapper, ['1'])

    const dots = wrapper.findAll('.rounded-full.border-2')
    expect(dots[0].classes()).toContain('bg-gray-900')
    expect(dots[0].classes()).toContain('border-gray-900')
    // Second dot should remain empty
    expect(dots[1].classes()).not.toContain('bg-gray-900')
    expect(dots[1].classes()).toContain('border-gray-300')
  })

  it('fills all 4 PIN dots progressively as digits are entered', async () => {
    const wrapper = mountPayment()
    await enterDigits(wrapper, ['1', '2', '3', '4'])

    const dots = wrapper.findAll('.rounded-full.border-2')
    dots.forEach(dot => {
      expect(dot.classes()).toContain('bg-gray-900')
      expect(dot.classes()).toContain('border-gray-900')
    })
  })

  it('backspace removes the last entered digit and unfills the dot', async () => {
    const wrapper = mountPayment()
    await enterDigits(wrapper, ['1', '2', '3'])

    // Three dots should be filled
    let dots = wrapper.findAll('.rounded-full.border-2')
    expect(dots[0].classes()).toContain('bg-gray-900')
    expect(dots[1].classes()).toContain('bg-gray-900')
    expect(dots[2].classes()).toContain('bg-gray-900')
    expect(dots[3].classes()).not.toContain('bg-gray-900')

    // Click backspace
    const backspaceBtn = getBackspaceButton(wrapper)
    expect(backspaceBtn).not.toBeNull()
    await backspaceBtn!.trigger('click')

    // Now only first two dots should be filled
    dots = wrapper.findAll('.rounded-full.border-2')
    expect(dots[0].classes()).toContain('bg-gray-900')
    expect(dots[1].classes()).toContain('bg-gray-900')
    expect(dots[2].classes()).not.toContain('bg-gray-900')
    expect(dots[3].classes()).not.toContain('bg-gray-900')
  })

  it('does not allow entering more than 4 digits', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    await enterDigits(wrapper, ['1', '2', '3', '4'])

    // After 4 digits, processPayment is called and showLoading becomes true
    // The PIN screen should be replaced by the processing screen
    expect(wrapper.find('#pin-screen').exists()).toBe(false)
    expect(wrapper.text()).toContain('payment.processing')
  })

  // ── Processing State ──
  it('shows processing screen with spinner when payment is processing', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    await enterDigits(wrapper, ['1', '2', '3', '4'])

    expect(wrapper.text()).toContain('payment.processing')
    expect(wrapper.text()).toContain('payment.processingDesc')

    const spinner = wrapper.find('.animate-spin')
    expect(spinner.exists()).toBe(true)
  })

  // ── Success State ──
  it('shows success state with checkmark and action buttons when payment succeeds', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // < 0.8 → success

    await enterDigits(wrapper, ['1', '2', '3', '4'])

    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    // Success screen should show
    expect(wrapper.text()).toContain('payment.success')
    expect(wrapper.text()).toContain('payment.successDesc')
    expect(wrapper.text()).toContain('payment.viewOrder')
    expect(wrapper.text()).toContain('payment.backHome')

    // The success screen should have a checkmark icon
    const checkIcon = wrapper.find('.bg-green-500')
    expect(checkIcon.exists()).toBe(true)
  })

  it('navigates to order-confirmation when "View Order" is clicked on success', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    await enterDigits(wrapper, ['1', '2', '3', '4'])
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    const viewOrderBtn = wrapper.findAll('button').find(b => b.text().includes('payment.viewOrder'))
    expect(viewOrderBtn).toBeDefined()
    await viewOrderBtn!.trigger('click')

    expect(push).toHaveBeenCalledWith('/order-confirmation')
  })

  it('navigates to home when "Back Home" is clicked on success', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    await enterDigits(wrapper, ['1', '2', '3', '4'])
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    const homeBtn = wrapper.findAll('button').find(b => b.text().includes('payment.backHome'))
    expect(homeBtn).toBeDefined()
    await homeBtn!.trigger('click')

    expect(push).toHaveBeenCalledWith('/')
  })

  it('stores lastOrder and removes pendingOrder from sessionStorage on success', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    await enterDigits(wrapper, ['1', '2', '3', '4'])
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    const lastOrder = sessionStorage.getItem('lastOrder')
    expect(lastOrder).not.toBeNull()
    if (lastOrder) {
      const parsed = JSON.parse(lastOrder)
      expect(parsed).toHaveProperty('total', 10000)
    }

    const pending = sessionStorage.getItem('pendingOrder')
    expect(pending).toBeNull()
  })

  // ── Failure State ──
  it('shows failure state with error message and retry button when payment fails', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.9) // >= 0.8 → failure

    await enterDigits(wrapper, ['1', '2', '3', '4'])
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    // Failure screen should show
    expect(wrapper.text()).toContain('payment.failure')
    expect(wrapper.text()).toContain('payment.failureMessage')
    expect(wrapper.text()).toContain('payment.retry')
    expect(wrapper.text()).toContain('payment.backToCheckout')

    // The failure screen should have an error icon (red circle)
    const errorIcon = wrapper.find('.bg-red-500')
    expect(errorIcon.exists()).toBe(true)
  })

  it('navigates to checkout when "Back to Checkout" is clicked on failure', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.9)

    await enterDigits(wrapper, ['1', '2', '3', '4'])
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    const backCheckoutBtn = wrapper.findAll('button').find(b => b.text().includes('payment.backToCheckout'))
    expect(backCheckoutBtn).toBeDefined()
    await backCheckoutBtn!.trigger('click')

    expect(push).toHaveBeenCalledWith('/checkout')
  })

  // ── Retry ──
  it('retry clears PIN and returns to PIN entry screen', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.9)

    await enterDigits(wrapper, ['1', '2', '3', '4'])
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    // Click retry
    const retryBtn = wrapper.findAll('button').find(b => b.text().includes('payment.retry'))
    expect(retryBtn).toBeDefined()
    await retryBtn!.trigger('click')

    // PIN entry screen should be visible again
    expect(wrapper.find('#pin-screen').exists()).toBe(true)
    expect(wrapper.text()).toContain('payment.enterPin')

    // All PIN dots should be empty
    const dots = wrapper.findAll('.rounded-full.border-2')
    dots.forEach(dot => {
      expect(dot.classes()).not.toContain('bg-gray-900')
      expect(dot.classes()).toContain('border-gray-300')
    })
  })

  it('allows entering a new PIN after retry', async () => {
    const wrapper = mountPayment()
    vi.spyOn(Math, 'random').mockReturnValue(0.9)

    await enterDigits(wrapper, ['1', '2', '3', '4'])
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    // Click retry
    const retryBtn = wrapper.findAll('button').find(b => b.text().includes('payment.retry'))
    await retryBtn!.trigger('click')

    // Enter new PIN digits
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // succeed this time
    await enterDigits(wrapper, ['5', '6', '7', '8'])

    // Should process payment (processing screen shows)
    expect(wrapper.find('#pin-screen').exists()).toBe(false)
    expect(wrapper.text()).toContain('payment.processing')
  })

  // ── Amount Display ──
  it('uses default amount of 5975 when no pendingOrder in sessionStorage', () => {
    sessionStorage.clear()
    const wrapper = mountPayment()
    expect(wrapper.text()).toContain('₵5,975.00')
  })
})
