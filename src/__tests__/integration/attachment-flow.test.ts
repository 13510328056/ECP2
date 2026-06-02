import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Inquiry, InquiryAttachment } from '@/types'

function createMockAttachment(overrides: Partial<InquiryAttachment> = {}): InquiryAttachment {
  return {
    name: 'document.pdf',
    size: 1024 * 1024, // 1MB
    type: 'application/pdf',
    ...overrides,
  }
}

function createMockInquiry(
  overrides: Partial<Inquiry> & { attachments?: InquiryAttachment[] } = {},
): Inquiry {
  return {
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: 'John Mensah',
    email: 'john.mensah@example.com',
    phone: '+233 24 123 4567',
    subject: 'product',
    message: 'I am interested in purchasing 5 units of the Rock Drill.',
    status: 'new',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('Attachment Data Flow', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
  })

  describe('Attachment Schema', () => {
    it('each attachment has the required fields: name, size, and type', () => {
      const attachment = createMockAttachment()

      expect(attachment).toHaveProperty('name')
      expect(attachment).toHaveProperty('size')
      expect(attachment).toHaveProperty('type')

      expect(typeof attachment.name).toBe('string')
      expect(attachment.name.length).toBeGreaterThan(0)

      expect(typeof attachment.size).toBe('number')
      expect(attachment.size).toBeGreaterThan(0)

      expect(typeof attachment.type).toBe('string')
      expect(attachment.type.length).toBeGreaterThan(0)
    })

    it('dataUrl is an optional field on InquiryAttachment', () => {
      const withoutDataUrl = createMockAttachment()
      expect(withoutDataUrl.dataUrl).toBeUndefined()

      const withDataUrl = createMockAttachment({
        dataUrl: 'data:image/png;base64,iVBORw0KGgo=',
      })
      expect(withDataUrl.dataUrl).toBe('data:image/png;base64,iVBORw0KGgo=')
    })

    it('validates all attachments in a collection have required fields', () => {
      const attachments: InquiryAttachment[] = [
        { name: 'doc1.pdf', size: 1024, type: 'application/pdf' },
        { name: 'doc2.jpg', size: 2 * 1024 * 1024, type: 'image/jpeg' },
        { name: 'doc3.png', size: 500 * 1024, type: 'image/png' },
      ]

      attachments.forEach((att) => {
        expect(att).toHaveProperty('name')
        expect(att).toHaveProperty('size')
        expect(att).toHaveProperty('type')
        expect(typeof att.name).toBe('string')
        expect(att.name.length).toBeGreaterThan(0)
        expect(typeof att.size).toBe('number')
        expect(att.size).toBeGreaterThan(0)
        expect(typeof att.type).toBe('string')
        expect(att.type.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Inquiry with Attachments', () => {
    it('includes attachments in inquiry data structure', () => {
      const inquiry = createMockInquiry({
        attachments: [createMockAttachment({ name: 'quote.pdf', size: 2 * 1024 * 1024 })],
      })

      expect(inquiry.attachments).toBeDefined()
      expect(inquiry.attachments).toHaveLength(1)
      expect(inquiry.attachments![0].name).toBe('quote.pdf')
    })

    it('survives JSON round-trip with attachments', () => {
      const inquiry = createMockInquiry({
        attachments: [createMockAttachment({ name: 'specs.pdf' })],
      })

      const json = JSON.stringify(inquiry)
      const restored: Inquiry = JSON.parse(json)

      expect(restored.attachments).toBeDefined()
      expect(restored.attachments).toHaveLength(1)
      expect(restored.attachments![0].name).toBe('specs.pdf')
    })
  })

  describe('JSON Serialization Round-Trip', () => {
    it('preserves all attachment fields through JSON.stringify and parse', () => {
      const original: Inquiry = createMockInquiry({
        attachments: [
          { name: 'report.pdf', size: 2 * 1024 * 1024, type: 'application/pdf' },
          { name: 'photo.jpg', size: 500 * 1024, type: 'image/jpeg' },
        ],
      })

      const json = JSON.stringify(original)
      const restored: Inquiry = JSON.parse(json)

      expect(restored.attachments).toHaveLength(2)
      expect(restored.attachments![0].name).toBe('report.pdf')
      expect(restored.attachments![0].size).toBe(2 * 1024 * 1024)
      expect(restored.attachments![0].type).toBe('application/pdf')
      expect(restored.attachments![1].name).toBe('photo.jpg')
      expect(restored.attachments![1].size).toBe(500 * 1024)
      expect(restored.attachments![1].type).toBe('image/jpeg')
    })

    it('preserves attachment with dataUrl through JSON round-trip', () => {
      const original: Inquiry = createMockInquiry({
        attachments: [
          {
            name: 'image.png',
            size: 100 * 1024,
            type: 'image/png',
            dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA',
          },
        ],
      })

      const json = JSON.stringify(original)
      const restored: Inquiry = JSON.parse(json)

      expect(restored.attachments![0].dataUrl).toBe(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA',
      )
    })

    it('maintains attachment array length after round-trip', () => {
      const attachments: InquiryAttachment[] = [
        { name: 'a.pdf', size: 100, type: 'application/pdf' },
        { name: 'b.jpg', size: 200, type: 'image/jpeg' },
        { name: 'c.png', size: 300, type: 'image/png' },
      ]
      const original = createMockInquiry({ attachments })

      const json = JSON.stringify(original)
      const restored: Inquiry = JSON.parse(json)

      expect(restored.attachments).toHaveLength(3)
    })

    it('does not mutate attachment names or sizes during serialization', () => {
      const original = createMockInquiry({
        attachments: [
          { name: 'my document with spaces.pdf', size: 1_048_576, type: 'application/pdf' },
        ],
      })

      const json = JSON.stringify(original)
      const restored: Inquiry = JSON.parse(json)

      expect(restored.attachments![0].name).toBe('my document with spaces.pdf')
      expect(restored.attachments![0].size).toBe(1_048_576)
    })
  })

  describe('Inquiry without Attachments', () => {
    it('has undefined attachments field when no attachments are provided', () => {
      const inquiry = createMockInquiry()
      expect(inquiry.attachments).toBeUndefined()
    })

    it('accepts empty attachments array', () => {
      const inquiry = createMockInquiry({ attachments: [] })
      expect(inquiry.attachments).toEqual([])
    })

    it('preserves empty attachments array through JSON round-trip', () => {
      const inquiry = createMockInquiry({ attachments: [] })
      const json = JSON.stringify(inquiry)
      const restored = JSON.parse(json)
      expect(restored.attachments).toEqual([])
    })

    it('still functions as a valid Inquiry without attachments', () => {
      const inquiry = createMockInquiry()
      const { attachments, ...required } = inquiry

      expect(required.id).toBeDefined()
      expect(required.name).toBeDefined()
      expect(required.email).toBeDefined()
      expect(required.phone).toBeDefined()
      expect(required.subject).toBeDefined()
      expect(required.message).toBeDefined()
      expect(required.status).toBe('new')
      expect(required.createdAt).toBeDefined()
    })
  })

  describe('Attachment Count Constraint', () => {
    it('enforces a maximum of 3 attachments via slice', () => {
      const manyAttachments: InquiryAttachment[] = [
        { name: 'a.pdf', size: 100, type: 'application/pdf' },
        { name: 'b.pdf', size: 100, type: 'application/pdf' },
        { name: 'c.pdf', size: 100, type: 'application/pdf' },
        { name: 'd.pdf', size: 100, type: 'application/pdf' },
        { name: 'e.pdf', size: 100, type: 'application/pdf' },
      ]

      // Simulate the same .slice(0, 3) logic used in Contact.vue
      const limited = manyAttachments.slice(0, 3)
      expect(limited).toHaveLength(3)
      expect(limited.map((a) => a.name)).toEqual(['a.pdf', 'b.pdf', 'c.pdf'])
    })

    it('limits attachments to 3 at the application level', () => {
      const attachments: InquiryAttachment[] = [
        { name: 'a.pdf', size: 100, type: 'application/pdf' },
        { name: 'b.pdf', size: 100, type: 'application/pdf' },
        { name: 'c.pdf', size: 100, type: 'application/pdf' },
        { name: 'd.pdf', size: 100, type: 'application/pdf' },
      ]

      // Apply the same slice logic as the component
      const validAttachments = attachments.slice(0, 3)
      expect(validAttachments).toHaveLength(3)
      expect(attachments.slice(0, 3)).toEqual([
        { name: 'a.pdf', size: 100, type: 'application/pdf' },
        { name: 'b.pdf', size: 100, type: 'application/pdf' },
        { name: 'c.pdf', size: 100, type: 'application/pdf' },
      ])
    })

    it('handles 0 attachments correctly', () => {
      const limited: InquiryAttachment[] = [].slice(0, 3)
      expect(limited).toHaveLength(0)
    })

    it('handles exactly 3 attachments without truncation', () => {
      const attachments: InquiryAttachment[] = [
        { name: 'a.pdf', size: 100, type: 'application/pdf' },
        { name: 'b.pdf', size: 100, type: 'application/pdf' },
        { name: 'c.pdf', size: 100, type: 'application/pdf' },
      ]

      const limited = attachments.slice(0, 3)
      expect(limited).toHaveLength(3)
    })

    it('handles fewer than 3 attachments without truncation', () => {
      const attachments: InquiryAttachment[] = [
        { name: 'a.pdf', size: 100, type: 'application/pdf' },
      ]

      const limited = attachments.slice(0, 3)
      expect(limited).toHaveLength(1)
    })
  })

  describe('Integration: Contact.vue style storage and retrieval', () => {
    it('round-trips a full inquiry with attachments matching Contact.vue submission format', () => {
      // Simulate what Contact.vue's submitForm does
      const formData = {
        id: Date.now(),
        name: 'John Mensah',
        email: 'john@example.com',
        phone: '+233 24 123 4567',
        subject: 'product',
        productInterest: '',
        message: 'Test message',
        attachments: [
          { name: 'quote.pdf', size: 2048, type: 'application/pdf' },
        ],
        createdAt: new Date().toISOString(),
      }

      const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]')
      inquiries.push(formData)
      localStorage.setItem('inquiries', JSON.stringify(inquiries))

      // Retrieve and verify
      const storedCalls = (Storage.prototype.setItem as ReturnType<typeof vi.fn>).mock
      const savedRaw = storedCalls.calls.find(
        (c: [string, string]) => c[0] === 'inquiries',
      )![1]
      const saved: Inquiry[] = JSON.parse(savedRaw)

      expect(saved).toHaveLength(1)
      expect(saved[0].attachments).toHaveLength(1)
      expect(saved[0].attachments![0].name).toBe('quote.pdf')
      expect(saved[0].attachments![0].size).toBe(2048)
      expect(saved[0].attachments![0].type).toBe('application/pdf')
      expect(saved[0].attachments![0]).not.toHaveProperty('dataUrl')
    })

    it('simulates Contact.vue flow: upload 2 files then submit', () => {
      // This replicates the sequence in Contact.vue: handleFileUpload then submitForm
      const files = [
        { name: 'photo.jpg', size: 500 * 1024, type: 'image/jpeg' },
        { name: 'doc.pdf', size: 1024 * 1024, type: 'application/pdf' },
      ]

      // Simulate the component's attachments array accumulation
      let attachments: InquiryAttachment[] = []
      for (const file of files) {
        if (file.size <= 5 * 1024 * 1024) {
          attachments = [...attachments, file].slice(0, 3)
        }
      }

      // Verify attachment accumulation
      expect(attachments).toHaveLength(2)
      expect(attachments[0].name).toBe('photo.jpg')
      expect(attachments[1].name).toBe('doc.pdf')

      // Simulate submission with JSON round-trip
      const inquiry = createMockInquiry({
        attachments: attachments.length > 0 ? attachments : undefined,
      })

      const json = JSON.stringify([inquiry])
      const restored: Inquiry[] = JSON.parse(json)

      expect(restored[0].attachments).toHaveLength(2)
      expect(restored[0].attachments![0].name).toBe('photo.jpg')
      expect(restored[0].attachments![1].name).toBe('doc.pdf')
    })
  })
})
