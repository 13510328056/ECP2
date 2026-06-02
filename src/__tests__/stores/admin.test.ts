import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminStore } from '@/stores/admin'

describe('admin store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts not authenticated', () => {
    const store = useAdminStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.adminName).toBe('')
    expect(store.adminEmail).toBe('')
    expect(store.isLoggedIn).toBe(false)
  })

  describe('login', () => {
    it('succeeds with valid credentials (admin@lisindustrial.gh / admin123)', () => {
      const store = useAdminStore()
      const result = store.login('admin@lisindustrial.gh', 'admin123')
      expect(result).toBe(true)
      expect(store.isAuthenticated).toBe(true)
      expect(store.adminName).toBe('Administrator')
      expect(store.adminEmail).toBe('admin@lisindustrial.gh')
      expect(store.isLoggedIn).toBe(true)
    })

    it('fails with wrong email', () => {
      const store = useAdminStore()
      const result = store.login('wrong@email.com', 'admin123')
      expect(result).toBe(false)
      expect(store.isAuthenticated).toBe(false)
    })

    it('fails with wrong password', () => {
      const store = useAdminStore()
      const result = store.login('admin@lisindustrial.gh', 'wrongpass')
      expect(result).toBe(false)
      expect(store.isAuthenticated).toBe(false)
    })

    it('fails with empty credentials', () => {
      const store = useAdminStore()
      const result = store.login('', '')
      expect(result).toBe(false)
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('resets admin state after successful login', () => {
      const store = useAdminStore()
      store.login('admin@lisindustrial.gh', 'admin123')
      expect(store.isAuthenticated).toBe(true)

      store.logout()
      expect(store.isAuthenticated).toBe(false)
      expect(store.adminName).toBe('')
      expect(store.adminEmail).toBe('')
      expect(store.isLoggedIn).toBe(false)
    })
  })
})
