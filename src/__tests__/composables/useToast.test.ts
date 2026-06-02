import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useToast } from '@/composables/useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initial state has show as false with empty message and success type', () => {
    const { toast } = useToast()
    expect(toast.show).toBe(false)
    expect(toast.message).toBe('')
    expect(toast.type).toBe('success')
  })

  it('showToast sets message and type', () => {
    const { toast, showToast } = useToast()
    showToast('Hello World', 'error')
    expect(toast.show).toBe(true)
    expect(toast.message).toBe('Hello World')
    expect(toast.type).toBe('error')
  })

  it('showToast uses success as default type', () => {
    const { toast, showToast } = useToast()
    showToast('Success message')
    expect(toast.type).toBe('success')
  })

  it('showToast accepts info type', () => {
    const { toast, showToast } = useToast()
    showToast('Info message', 'info')
    expect(toast.type).toBe('info')
  })

  it('auto-dismisses toast after 2500ms timeout', () => {
    const { toast, showToast } = useToast()
    showToast('Temp message')
    expect(toast.show).toBe(true)

    vi.advanceTimersByTime(2500)
    expect(toast.show).toBe(false)
  })

  it('replaces previous timeout when showToast is called again before dismissal', () => {
    const { toast, showToast } = useToast()
    showToast('First message')
    vi.advanceTimersByTime(1000)
    showToast('Second message')
    expect(toast.message).toBe('Second message')
    expect(toast.show).toBe(true)

    // Should auto-dismiss after new 2500ms timeout from second call
    vi.advanceTimersByTime(2500)
    expect(toast.show).toBe(false)
  })
})
