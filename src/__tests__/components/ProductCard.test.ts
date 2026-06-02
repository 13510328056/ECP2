import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '@/components/ui/ProductCard.vue'
import { useLanguageStore } from '@/stores/language'
import type { SupportedLocale } from '@/stores/language'
import type { Product } from '@/types'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({}),
}))

function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    name: 'Test Product',
    nameZh: '测试产品',
    description: 'A test product',
    descriptionZh: '一个测试产品',
    price: 150,
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

describe('ProductCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Default locale to 'en' for test assertions expecting English text
    const langStore = useLanguageStore()
    langStore.setLocale('en')
  })

  it('renders the product name', () => {
    const product = createMockProduct()
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    expect(wrapper.text()).toContain('Test Product')
  })

  it('renders the formatted price with cedi symbol', () => {
    const product = createMockProduct({ price: 150 })
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    expect(wrapper.text()).toContain('₵150.00')
  })

  it('renders the product image with correct src and alt', () => {
    const product = createMockProduct({ images: ['/images/test.jpg'] })
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/images/test.jpg')
    expect(img.attributes('alt')).toBe('Test Product')
  })

  it('shows In Stock badge for in_stock status', () => {
    const product = createMockProduct({ stock: 'in_stock' })
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    expect(wrapper.text()).toContain('In Stock')
  })

  it('shows Low Stock badge for low_stock status', () => {
    const product = createMockProduct({ stock: 'low_stock' })
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    expect(wrapper.text()).toContain('Low Stock')
  })

  it('shows Out of Stock badge for out_of_stock status', () => {
    const product = createMockProduct({ stock: 'out_of_stock' })
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    expect(wrapper.text()).toContain('Out of Stock')
  })

  it('emits add-to-cart event with the product when button is clicked', async () => {
    const product = createMockProduct()
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
    expect(wrapper.emitted('add-to-cart')![0]).toEqual([product])
  })

  it('navigates to product detail page when card is clicked', async () => {
    const product = createMockProduct()
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    await wrapper.trigger('click')
    expect(push).toHaveBeenCalledWith('/product/prod-1')
  })

  it('does not render the add-to-cart button when showAddToCart is false', () => {
    const product = createMockProduct()
    const wrapper = mount(ProductCard, {
      props: { product, showAddToCart: false },
    })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('shows discount badge when bulk pricing has discounts', () => {
    const product = createMockProduct({
      bulkPricing: [{ quantity: 10, discount: 15 }],
    })
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    expect(wrapper.text()).toContain('-15%')
  })

  it('does not show discount badge when bulk pricing is empty', () => {
    const product = createMockProduct({ bulkPricing: [] })
    const wrapper = mount(ProductCard, {
      props: { product },
    })
    expect(wrapper.text()).not.toContain('-')
  })
})
