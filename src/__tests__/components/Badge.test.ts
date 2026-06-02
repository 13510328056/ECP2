import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '@/components/ui/Badge.vue'

describe('Badge', () => {
  it('renders slot content', () => {
    const wrapper = mount(Badge, {
      slots: { default: 'In Stock' },
    })
    expect(wrapper.text()).toContain('In Stock')
  })

  it('applies success color styles', () => {
    const wrapper = mount(Badge, {
      props: { type: 'success' },
      slots: { default: 'Success' },
    })
    expect(wrapper.classes()).toContain('text-green-700')
  })

  it('applies warning color styles', () => {
    const wrapper = mount(Badge, {
      props: { type: 'warning' },
      slots: { default: 'Warning' },
    })
    expect(wrapper.classes()).toContain('text-orange-600')
  })

  it('applies error color styles', () => {
    const wrapper = mount(Badge, {
      props: { type: 'error' },
      slots: { default: 'Error' },
    })
    expect(wrapper.classes()).toContain('text-red-600')
  })

  it('applies info color styles', () => {
    const wrapper = mount(Badge, {
      props: { type: 'info' },
      slots: { default: 'Info' },
    })
    expect(wrapper.classes()).toContain('text-blue-700')
  })

  it('applies default color styles when no type specified', () => {
    const wrapper = mount(Badge, {
      slots: { default: 'Default' },
    })
    expect(wrapper.classes()).toContain('text-gray-600')
  })

  it('renders with sm size classes', () => {
    const wrapper = mount(Badge, {
      props: { size: 'sm' },
      slots: { default: 'Small' },
    })
    expect(wrapper.classes()).toContain('text-[10px]')
  })

  it('renders with md size classes', () => {
    const wrapper = mount(Badge, {
      props: { size: 'md' },
      slots: { default: 'Medium' },
    })
    expect(wrapper.classes()).toContain('text-xs')
  })

  it('has rounded-full class for pill shape', () => {
    const wrapper = mount(Badge, {
      slots: { default: 'Pill' },
    })
    expect(wrapper.classes()).toContain('rounded-full')
  })
})
