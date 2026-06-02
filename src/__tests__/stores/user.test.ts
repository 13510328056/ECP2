import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

describe('user store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with user not logged in', () => {
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)
    expect(store.userName).toBe('')
    expect(store.userEmail).toBe('')
    expect(store.userPhone).toBe('')
  })

  describe('login', () => {
    it('succeeds with valid email and password length >= 6', () => {
      const store = useUserStore()
      const result = store.login('user@example.com', 'password123')
      expect(result).toBe(true)
      expect(store.isLoggedIn).toBe(true)
      expect(store.userEmail).toBe('user@example.com')
      expect(store.userName).toBe('user')
      expect(store.userPhone).toBe('+233 24 000 0000')
    })

    it('fails with password length < 6', () => {
      const store = useUserStore()
      const result = store.login('user@example.com', '12345')
      expect(result).toBe(false)
      expect(store.isLoggedIn).toBe(false)
    })

    it('fails with empty email', () => {
      const store = useUserStore()
      const result = store.login('', 'password123')
      expect(result).toBe(false)
      expect(store.isLoggedIn).toBe(false)
    })
  })

  describe('register', () => {
    it('succeeds with valid info and password length >= 6', () => {
      const store = useUserStore()
      const result = store.register(
        'John',
        'john@example.com',
        '+233 24 123 4567',
        'password123'
      )
      expect(result).toBe(true)
      expect(store.isLoggedIn).toBe(true)
      expect(store.userName).toBe('John')
      expect(store.userEmail).toBe('john@example.com')
      expect(store.userPhone).toBe('+233 24 123 4567')
    })

    it('fails with empty name', () => {
      const store = useUserStore()
      const result = store.register('', 'john@example.com', '+233 24 123 4567', 'password123')
      expect(result).toBe(false)
      expect(store.isLoggedIn).toBe(false)
    })

    it('fails with empty email', () => {
      const store = useUserStore()
      const result = store.register('John', '', '+233 24 123 4567', 'password123')
      expect(result).toBe(false)
      expect(store.isLoggedIn).toBe(false)
    })

    it('fails with short password', () => {
      const store = useUserStore()
      const result = store.register('John', 'john@example.com', '+233 24 123 4567', '12345')
      expect(result).toBe(false)
      expect(store.isLoggedIn).toBe(false)
    })

    it('fails with empty phone', () => {
      const store = useUserStore()
      const result = store.register('John', 'john@example.com', '', 'password123')
      expect(result).toBe(false)
      expect(store.isLoggedIn).toBe(false)
    })
  })

  describe('logout', () => {
    it('resets all user state after login', () => {
      const store = useUserStore()
      store.login('user@example.com', 'password123')
      expect(store.isLoggedIn).toBe(true)

      store.logout()
      expect(store.isLoggedIn).toBe(false)
      expect(store.userName).toBe('')
      expect(store.userEmail).toBe('')
      expect(store.userPhone).toBe('')
    })
  })
})
