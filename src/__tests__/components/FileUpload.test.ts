import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useLanguageStore } from '@/stores/language'
import ContactView from '@/views/Contact.vue'

// ── Mocks ──
const push = vi.fn()
const back = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {}, query: {} }),
  useRouter: () => ({ push, back }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
  createI18n: () => ({ install: () => {} }),
}))

const toastSpy = vi.fn()

// ── Helpers ──
function createMockFile(name: string, size: number, type: string = 'application/pdf'): File {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

function mountContact(locale: string = 'en') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const langStore = useLanguageStore()
  langStore.$patch({ locale })
  return mount(ContactView, {
    global: {
      plugins: [pinia],
      stubs: { BottomNav: true, 'router-link': true, 'router-view': true },
      provide: { showToast: toastSpy },
    },
  })
}

describe('FileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
  })

  describe('Upload Zone Rendering', () => {
    it('renders upload zone with dashed border div', () => {
      const wrapper = mountContact()
      const uploadZone = wrapper.find('.border-dashed')
      expect(uploadZone.exists()).toBe(true)
    })

    it('upload zone has cursor-pointer class indicating click handler', () => {
      const wrapper = mountContact()
      const uploadZone = wrapper.find('.border-dashed')
      expect(uploadZone.classes()).toContain('cursor-pointer')
    })

    it('shows "Click to upload files" text in upload zone', () => {
      const wrapper = mountContact()
      expect(wrapper.text()).toContain('Click to upload files')
    })

    it('file input is hidden', () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')
      expect(fileInput.classes()).toContain('hidden')
    })

    it('file input accepts multiple files', () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')
      expect(fileInput.attributes('multiple')).toBeDefined()
    })
  })

  describe('File Selection', () => {
    it('shows file name and size after file is selected', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('report.pdf', 2048)],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toContain('report.pdf')
      // 2048 bytes = 2.0 KB
      expect(wrapper.text()).toContain('KB')
    })

    it('displays file size in KB format for files under 1MB', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('doc.pdf', 512 * 1024)], // 512KB
      })
      await fileInput.trigger('change')

      // Should render formatted size (e.g. "512.0 KB")
      expect(wrapper.text()).toMatch(/\d+\.\d+\s*KB/)
    })

    it('displays file size in MB format for files 1MB or larger', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('large.pdf', 2 * 1024 * 1024)], // 2MB
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toMatch(/\d+\.\d+\s*MB/)
    })

    it('shows file name after upload via file input', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // Simulate file selection by setting files and triggering change
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('uploaded.pdf', 1024)],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toContain('uploaded.pdf')
    })
  })

  describe('File Size Validation', () => {
    it('shows warning toast when a file exceeds 5MB limit', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('oversized.pdf', 6 * 1024 * 1024)], // 6MB
      })
      await fileInput.trigger('change')

      expect(toastSpy).toHaveBeenCalledWith(
        expect.stringContaining('exceeds 5MB limit'),
        'warning',
      )
    })

    it('does not add oversized files to the attachment list', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('oversized.pdf', 6 * 1024 * 1024)],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).not.toContain('oversized.pdf')
    })

    it('adds valid files while skipping oversized ones in the same batch', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('good.pdf', 1024),
          createMockFile('bad.pdf', 10 * 1024 * 1024),
        ],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toContain('good.pdf')
      expect(wrapper.text()).not.toContain('bad.pdf')
      expect(toastSpy).toHaveBeenCalledWith(
        expect.stringContaining('exceeds 5MB limit'),
        'warning',
      )
    })

    it('shows total size warning when combined attachments exceed 5MB', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // Upload two files that together exceed 5MB but are each under 5MB
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('part1.pdf', 3 * 1024 * 1024), // 3MB
        ],
      })
      await fileInput.trigger('change')

      // Upload second file to push total over 5MB
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('part2.pdf', 3 * 1024 * 1024), // 3MB
        ],
      })
      await fileInput.trigger('change')

      // Total is 6MB > 5MB
      expect(wrapper.text()).toContain('Total attachment size exceeds limit')
    })

    it('removes total size warning when oversized files are removed', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // Upload two files totalling > 5MB
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('big1.pdf', 3 * 1024 * 1024),
          createMockFile('big2.pdf', 3 * 1024 * 1024),
        ],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toContain('Total attachment size exceeds limit')

      // Remove one file
      const removeBtn = wrapper.find('.text-red-400')
      await removeBtn.trigger('click')

      // Warning should disappear
      expect(wrapper.text()).not.toContain('Total attachment size exceeds limit')
    })
  })

  describe('File Limit', () => {
    it('limits attachments to 3 files maximum when uploaded at once', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('a.pdf', 100),
          createMockFile('b.pdf', 100),
          createMockFile('c.pdf', 100),
          createMockFile('d.pdf', 100),
        ],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toContain('a.pdf')
      expect(wrapper.text()).toContain('b.pdf')
      expect(wrapper.text()).toContain('c.pdf')
      expect(wrapper.text()).not.toContain('d.pdf')
    })

    it('limits attachments to 3 when uploading in multiple batches', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // First batch: 2 files
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('a.pdf', 100),
          createMockFile('b.pdf', 100),
        ],
      })
      await fileInput.trigger('change')

      expect(wrapper.findAll('.text-red-400')).toHaveLength(2)

      // Second batch: 2 more files (should be capped at 3)
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('c.pdf', 100),
          createMockFile('d.pdf', 100),
        ],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toContain('a.pdf')
      expect(wrapper.text()).toContain('b.pdf')
      expect(wrapper.text()).toContain('c.pdf')
      expect(wrapper.text()).not.toContain('d.pdf')
    })

    it('hides upload zone when 3 files are already attached', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // Upload 3 files
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('a.pdf', 100),
          createMockFile('b.pdf', 100),
          createMockFile('c.pdf', 100),
        ],
      })
      await fileInput.trigger('change')

      // Upload zone should be hidden
      const uploadZone = wrapper.find('.border-dashed')
      expect(uploadZone.exists()).toBe(false)
    })

    it('shows upload zone again after removing a file when at the limit', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // Upload 3 files
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('a.pdf', 100),
          createMockFile('b.pdf', 100),
          createMockFile('c.pdf', 100),
        ],
      })
      await fileInput.trigger('change')

      expect(wrapper.find('.border-dashed').exists()).toBe(false)

      // Remove one file
      const removeBtns = wrapper.findAll('.text-red-400')
      await removeBtns[0].trigger('click')

      // Upload zone should reappear
      expect(wrapper.find('.border-dashed').exists()).toBe(true)
    })
  })

  describe('File Removal', () => {
    it('remove button removes file from the attachment list', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('removable.pdf', 1024)],
      })
      await fileInput.trigger('change')

      expect(wrapper.text()).toContain('removable.pdf')

      const removeBtn = wrapper.find('.text-red-400')
      await removeBtn.trigger('click')

      expect(wrapper.text()).not.toContain('removable.pdf')
    })

    it('removes correct file when multiple files exist and one is removed', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('keep.pdf', 100),
          createMockFile('remove.pdf', 100),
        ],
      })
      await fileInput.trigger('change')

      // Find and click the remove button for the second file
      const removeBtns = wrapper.findAll('.text-red-400')
      expect(removeBtns).toHaveLength(2)
      await removeBtns[1].trigger('click')

      expect(wrapper.text()).toContain('keep.pdf')
      expect(wrapper.text()).not.toContain('remove.pdf')
    })
  })

  describe('Attachment Submission', () => {
    async function fillRequiredFields(wrapper: ReturnType<typeof mount>) {
      // Fill name
      const nameInput = wrapper.findAll('input[type="text"]').at(0)
      if (nameInput) await nameInput.setValue('John Doe')

      // Fill email
      const emailInput = wrapper.find('input[type="email"]')
      if (emailInput) await emailInput.setValue('john@example.com')

      // Fill phone (second type=text input with placeholder "XX XXX XXXX")
      const phoneInput = wrapper.findAll('input[type="text"]').at(1)
      if (phoneInput) await phoneInput.setValue('+233 24 123 4567')

      // Select subject
      const select = wrapper.find('select')
      if (select) await select.setValue('product')

      // Fill message
      const textarea = wrapper.find('textarea')
      if (textarea) await textarea.setValue('Test message body')
    }

    it('includes attachments in localStorage submission data', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // Upload a file
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('quotation.pdf', 2048, 'application/pdf')],
      })
      await fileInput.trigger('change')

      // Fill required form fields
      await fillRequiredFields(wrapper)

      // Click submit
      const submitBtn = wrapper.findAll('button').find(b =>
        b.text().includes('inquiry.submit'),
      )
      expect(submitBtn).toBeDefined()
      await submitBtn!.trigger('click')

      // Verify localStorage was written with attachments
      const setItemCalls = (Storage.prototype.setItem as ReturnType<typeof vi.fn>).mock.calls
      const inquiriesCall = setItemCalls.find((call: [string, string]) => call[0] === 'inquiries')
      expect(inquiriesCall).toBeDefined()

      const storedData = JSON.parse(inquiriesCall![1])
      expect(storedData).toHaveLength(1)
      expect(storedData[0].attachments).toBeDefined()
      expect(storedData[0].attachments).toHaveLength(1)
      expect(storedData[0].attachments[0]).toEqual({
        name: 'quotation.pdf',
        size: 2048,
        type: 'application/pdf',
      })
    })

    it('stores multiple attachments in submission data', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      // Upload 2 files
      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [
          createMockFile('doc1.pdf', 1024),
          createMockFile('doc2.jpg', 2048, 'image/jpeg'),
        ],
      })
      await fileInput.trigger('change')

      await fillRequiredFields(wrapper)

      const submitBtn = wrapper.findAll('button').find(b =>
        b.text().includes('inquiry.submit'),
      )
      await submitBtn!.trigger('click')

      const setItemCalls = (Storage.prototype.setItem as ReturnType<typeof vi.fn>).mock.calls
      const inquiriesCall = setItemCalls.find((call: [string, string]) => call[0] === 'inquiries')
      const storedData = JSON.parse(inquiriesCall![1])

      expect(storedData[0].attachments).toHaveLength(2)
      expect(storedData[0].attachments[0].name).toBe('doc1.pdf')
      expect(storedData[0].attachments[1].name).toBe('doc2.jpg')
    })

    it('submits inquiry without attachments when no files are uploaded', async () => {
      const wrapper = mountContact()

      await fillRequiredFields(wrapper)

      const submitBtn = wrapper.findAll('button').find(b =>
        b.text().includes('inquiry.submit'),
      )
      await submitBtn!.trigger('click')

      const setItemCalls = (Storage.prototype.setItem as ReturnType<typeof vi.fn>).mock.calls
      const inquiriesCall = setItemCalls.find((call: [string, string]) => call[0] === 'inquiries')
      const storedData = JSON.parse(inquiriesCall![1])

      // When no files, attachments should be undefined (not sent)
      expect(storedData[0].attachments).toBeUndefined()
    })

    it('submission includes attachment fields: name, size, type', async () => {
      const wrapper = mountContact()
      const fileInput = wrapper.find('input[type="file"]')

      Object.defineProperty(fileInput.element, 'files', { configurable: true,
        value: [createMockFile('specs.pdf', 3 * 1024 * 1024, 'application/pdf')],
      })
      await fileInput.trigger('change')

      await fillRequiredFields(wrapper)

      const submitBtn = wrapper.findAll('button').find(b =>
        b.text().includes('inquiry.submit'),
      )
      await submitBtn!.trigger('click')

      const setItemCalls = (Storage.prototype.setItem as ReturnType<typeof vi.fn>).mock.calls
      const inquiriesCall = setItemCalls.find((call: [string, string]) => call[0] === 'inquiries')
      const storedData = JSON.parse(inquiriesCall![1])

      const attachment = storedData[0].attachments[0]
      expect(attachment).toHaveProperty('name')
      expect(attachment).toHaveProperty('size')
      expect(attachment).toHaveProperty('type')
      expect(typeof attachment.name).toBe('string')
      expect(typeof attachment.size).toBe('number')
      expect(typeof attachment.type).toBe('string')
    })
  })
})
