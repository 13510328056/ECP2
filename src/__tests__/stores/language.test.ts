import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLanguageStore } from '@/stores/language'

describe('language store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has default locale set to zh', () => {
    const store = useLanguageStore()
    expect(store.locale).toBe('zh')
  })

  it('setLocale changes locale to en', () => {
    const store = useLanguageStore()
    store.setLocale('en')
    expect(store.locale).toBe('en')
  })

  it('setLocale changes locale to zh', () => {
    const store = useLanguageStore()
    store.setLocale('en')
    store.setLocale('zh')
    expect(store.locale).toBe('zh')
  })

  it('toggleLocale switches from zh to en', () => {
    const store = useLanguageStore()
    store.toggleLocale()
    expect(store.locale).toBe('en')
  })

  it('toggleLocale switches back from en to zh', () => {
    const store = useLanguageStore()
    store.setLocale('en')
    store.toggleLocale()
    expect(store.locale).toBe('zh')
  })

  it('toggleLocale toggles back and forth repeatedly', () => {
    const store = useLanguageStore()
    expect(store.locale).toBe('zh')
    store.toggleLocale()
    expect(store.locale).toBe('en')
    store.toggleLocale()
    expect(store.locale).toBe('zh')
    store.toggleLocale()
    expect(store.locale).toBe('en')
  })
})
