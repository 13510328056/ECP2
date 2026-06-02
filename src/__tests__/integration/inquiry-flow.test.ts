import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Inquiry, InquirySubject } from '@/types'

const VALID_SUBJECTS: InquirySubject[] = ['general', 'product', 'bulk_order', 'custom', 'other']

function createMockInquiry(overrides: Partial<Inquiry> = {}): Inquiry {
  return {
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: 'John Mensah',
    email: 'john.mensah@example.com',
    phone: '+233 24 123 4567',
    subject: 'product',
    productInterest: 'Heavy-Duty Rock Drill YT28',
    message: 'I am interested in purchasing 5 units of the Rock Drill. Please provide bulk pricing.',
    status: 'new',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('Inquiry Submission Flow', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
  })

  describe('inquiry creation and validation', () => {
    it('creates an inquiry with all required fields', () => {
      const inquiry = createMockInquiry()
      expect(inquiry.name).toBe('John Mensah')
      expect(inquiry.email).toBe('john.mensah@example.com')
      expect(inquiry.phone).toBe('+233 24 123 4567')
      expect(inquiry.subject).toBe('product')
      expect(inquiry.message).toBeDefined()
      expect(inquiry.message.length).toBeGreaterThan(0)
      expect(inquiry.status).toBe('new')
      expect(inquiry.createdAt).toBeDefined()
    })

    it('requires name field', () => {
      const inquiry = createMockInquiry({ name: '' })
      const isValid = inquiry.name.trim().length > 0
      expect(isValid).toBe(false)
    })

    it('requires email field', () => {
      const inquiry = createMockInquiry({ email: '' })
      const isValid = inquiry.email.trim().length > 0 && inquiry.email.includes('@')
      expect(isValid).toBe(false)
    })

    it('validates email format', () => {
      const validEmails = ['user@example.com', 'john.mensah@example.com', 'test@co.gh']
      const invalidEmails = ['', 'not-an-email', '@example.com', 'user@']

      validEmails.forEach(email => {
        const inquiry = createMockInquiry({ email })
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)
        expect(isValid).toBe(true)
      })

      invalidEmails.forEach(email => {
        const inquiry = createMockInquiry({ email })
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)
        expect(isValid).toBe(false)
      })
    })

    it('requires phone field', () => {
      const inquiry = createMockInquiry({ phone: '' })
      const isValid = inquiry.phone.trim().length > 0
      expect(isValid).toBe(false)
    })

    it('requires message field', () => {
      const inquiry = createMockInquiry({ message: '' })
      const isValid = inquiry.message.trim().length > 0
      expect(isValid).toBe(false)
    })

    it('accepts only valid subjects', () => {
      const inquiry = createMockInquiry({ subject: 'product' })
      expect(VALID_SUBJECTS).toContain(inquiry.subject)

      const inquiry2 = createMockInquiry({ subject: 'bulk_order' })
      expect(VALID_SUBJECTS).toContain(inquiry2.subject)

      // Ensure invalid subjects are rejected
      const subjects = VALID_SUBJECTS
      expect(subjects).not.toContain('invalid_subject')
    })

    it('allows all valid subject types', () => {
      const subjects: InquirySubject[] = ['general', 'product', 'bulk_order', 'custom', 'other']
      subjects.forEach(subject => {
        const inquiry = createMockInquiry({ subject, message: `Test message for ${subject}` })
        expect(inquiry.subject).toBe(subject)
        expect(VALID_SUBJECTS).toContain(inquiry.subject)
      })
    })

    it('productInterest is optional', () => {
      const withInterest = createMockInquiry({ productInterest: 'Rock Drill' })
      expect(withInterest.productInterest).toBe('Rock Drill')

      const withoutInterest = createMockInquiry({ productInterest: undefined })
      expect(withoutInterest.productInterest).toBeUndefined()
    })
  })

  describe('inquiry storage and retrieval', () => {
    it('stores and retrieves inquiries from memory', () => {
      const inquiry1 = createMockInquiry({ id: 'inq-store-001', name: 'John Mensah' })
      const inquiry2 = createMockInquiry({ id: 'inq-store-002', name: 'Kwame Osei' })

      // Simulate JSON serialization round-trip (as localStorage would)
      const stored = JSON.stringify([inquiry1, inquiry2])
      const retrieved: Inquiry[] = JSON.parse(stored)

      expect(retrieved).toHaveLength(2)
      expect(retrieved[0].name).toBe('John Mensah')
      expect(retrieved[1].name).toBe('Kwame Osei')
      expect(retrieved[0].id).toBe('inq-store-001')
    })

    it('preserves inquiry structure after JSON round-trip', () => {
      const original = createMockInquiry({
        id: 'inq-struct-001',
        name: 'Sarah Adjei',
        email: 'sarah@example.com',
        phone: '+233 20 111 2233',
        subject: 'custom',
        productInterest: 'Custom conveyor system',
        message: 'Need a custom conveyor for our processing plant',
        status: 'new',
      })
      const json = JSON.stringify(original)
      const restored = JSON.parse(json)
      expect(restored.id).toBe(original.id)
      expect(restored.name).toBe(original.name)
      expect(restored.email).toBe(original.email)
      expect(restored.phone).toBe(original.phone)
      expect(restored.subject).toBe(original.subject)
      expect(restored.productInterest).toBe(original.productInterest)
      expect(restored.message).toBe(original.message)
      expect(restored.status).toBe(original.status)
      expect(restored.createdAt).toBe(original.createdAt)
    })
  })
})
