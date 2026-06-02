import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate, generateOrderNumber, getStockStatusText } from '@/utils/format'

describe('formatPrice', () => {
  it('formats a normal price with two decimal places', () => {
    expect(formatPrice(1500.5)).toBe('₵1,500.50')
  })

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('₵0.00')
  })

  it('formats a large number', () => {
    expect(formatPrice(1000000)).toBe('₵1,000,000.00')
  })

  it('formats a small decimal value', () => {
    expect(formatPrice(0.1)).toBe('₵0.10')
  })

  it('formats integer value', () => {
    expect(formatPrice(99)).toBe('₵99.00')
  })
})

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2025-06-15T10:30:00Z')
    expect(result).toBe('Jun 15, 2025')
  })

  it('returns the original string for invalid dates', () => {
    const result = formatDate('not-a-date')
    expect(result).toBe('not-a-date')
  })

  it('handles edge date values', () => {
    expect(formatDate('2024-01-01T00:00:00Z')).toBe('Jan 1, 2024')
    expect(formatDate('2024-12-31T12:00:00Z')).toBe('Dec 31, 2024')
  })
})

describe('generateOrderNumber', () => {
  it('starts with GH prefix', () => {
    const orderNum = generateOrderNumber()
    expect(orderNum.startsWith('GH')).toBe(true)
  })

  it('has the correct total length (GH + 4 year + 2 month + 2 day + 9 random = 19 chars)', () => {
    const orderNum = generateOrderNumber()
    expect(orderNum.length).toBe(19)
  })

  it('generates unique numbers on successive calls', () => {
    const orderNum1 = generateOrderNumber()
    const orderNum2 = generateOrderNumber()
    expect(orderNum1).not.toBe(orderNum2)
  })
})

describe('getStockStatusText', () => {
  it('returns correct text and color for in_stock', () => {
    const result = getStockStatusText('in_stock')
    expect(result.text).toBe('In Stock')
    expect(result.color).toBe('#22c55e')
  })

  it('returns correct text and color for low_stock', () => {
    const result = getStockStatusText('low_stock')
    expect(result.text).toBe('Low Stock')
    expect(result.color).toBe('#f59e0b')
  })

  it('returns correct text and color for out_of_stock', () => {
    const result = getStockStatusText('out_of_stock')
    expect(result.text).toBe('Out of Stock')
    expect(result.color).toBe('#ef4444')
  })
})
