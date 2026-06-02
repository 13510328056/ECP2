import { describe, it, expect } from 'vitest'
import { isValidPhone, isValidEmail, isRequired } from '@/utils/validation'

describe('isValidPhone', () => {
  it('accepts +233 format with spaces', () => {
    expect(isValidPhone('+233 24 123 4567')).toBe(true)
  })

  it('accepts 0XX format', () => {
    expect(isValidPhone('0241234567')).toBe(true)
  })

  it('accepts +233 format without spaces', () => {
    expect(isValidPhone('+233241234567')).toBe(true)
  })

  it('accepts MTN number (024)', () => {
    expect(isValidPhone('0241234567')).toBe(true)
  })

  it('accepts Vodafone number (020)', () => {
    expect(isValidPhone('0201234567')).toBe(true)
  })

  it('accepts AirtelTigo number (027)', () => {
    expect(isValidPhone('0271234567')).toBe(true)
  })

  it('rejects number with wrong prefix (050)', () => {
    expect(isValidPhone('0501234567')).toBe(false)
  })

  it('rejects too short number', () => {
    expect(isValidPhone('024123456')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidPhone('')).toBe(false)
  })

  it('rejects number with letters', () => {
    expect(isValidPhone('024abc4567')).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('accepts a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })

  it('accepts email with plus sign', () => {
    expect(isValidEmail('user+tag@example.com')).toBe(true)
  })

  it('rejects email without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('rejects email without domain', () => {
    expect(isValidEmail('user@.com')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejects email with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false)
  })
})

describe('isRequired', () => {
  it('returns true for a non-empty string', () => {
    expect(isRequired('hello')).toBe(true)
  })

  it('returns false for an empty string', () => {
    expect(isRequired('')).toBe(false)
  })

  it('returns false for whitespace-only string', () => {
    expect(isRequired('   ')).toBe(false)
  })

  it('returns true for a string with leading/trailing spaces', () => {
    expect(isRequired('  hello  ')).toBe(true)
  })
})
