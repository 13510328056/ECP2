import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuantitySelector from '@/components/ui/QuantitySelector.vue'

describe('QuantitySelector', () => {
  it('renders with the given modelValue', () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 5 },
    })
    expect(wrapper.text()).toContain('5')
  })

  it('emits decremented value when minus button is clicked', async () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 5 },
    })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
  })

  it('emits incremented value when plus button is clicked', async () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 5 },
    })
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([6])
  })

  it('disables minus button at minimum value', () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 1, min: 1 },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons[0].attributes('disabled')).toBeDefined()
  })

  it('disables plus button at maximum value', () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 10, max: 10 },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons[1].attributes('disabled')).toBeDefined()
  })

  it('does not emit below minimum', async () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 1, min: 1 },
    })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not emit above maximum', async () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 10, max: 10 },
    })
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('uses default min of 1 and max of 999', () => {
    const wrapper = mount(QuantitySelector, {
      props: { modelValue: 1 },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons[0].attributes('disabled')).toBeDefined()
    // At value 1 with default max 999, plus should be enabled
    expect(buttons[1].attributes('disabled')).toBeUndefined()
  })
})
