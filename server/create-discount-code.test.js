import { test, expect, describe } from 'bun:test'
import { generateCode } from './create-discount-code.shared.js'

describe('generateCode', () => {
  test('normal input: Davis on April 30', () => {
    const code = generateCode('Davis', new Date(2026, 3, 30))
    expect(code).toMatch(/^Davis-3004-\d{2}$/)
  })

  test('single-digit day and month: 3 January', () => {
    const code = generateCode('Alice', new Date(2026, 0, 3))
    expect(code).toMatch(/^Alice-0301-\d{2}$/)
  })

  test('single-digit day, double-digit month: 5 December', () => {
    const code = generateCode('Bob', new Date(2026, 11, 5))
    expect(code).toMatch(/^Bob-0512-\d{2}$/)
  })

  test('double-digit day and month: 21 November', () => {
    const code = generateCode('Clara', new Date(2026, 10, 21))
    expect(code).toMatch(/^Clara-2111-\d{2}$/)
  })

  test('preserves original capitalisation', () => {
    const code = generateCode('mCdOnAlD', new Date(2026, 5, 15))
    expect(code).toStartWith('mCdOnAlD-1506-')
  })

  test('trims whitespace from name', () => {
    const code = generateCode('  Davis  ', new Date(2026, 3, 30))
    expect(code).toMatch(/^Davis-3004-\d{2}$/)
  })

  test('empty name falls back to WELCOME-XXXXXX', () => {
    const code = generateCode('', new Date(2026, 3, 30))
    expect(code).toMatch(/^WELCOME-[0-9A-F]{6}$/)
  })

  test('null name falls back to WELCOME-XXXXXX', () => {
    const code = generateCode(null)
    expect(code).toMatch(/^WELCOME-[0-9A-F]{6}$/)
  })

  test('undefined name falls back to WELCOME-XXXXXX', () => {
    const code = generateCode(undefined)
    expect(code).toMatch(/^WELCOME-[0-9A-F]{6}$/)
  })

  test('whitespace-only name falls back to WELCOME-XXXXXX', () => {
    const code = generateCode('   ')
    expect(code).toMatch(/^WELCOME-[0-9A-F]{6}$/)
  })

  test('suffix is zero-padded two digits (00-99)', () => {
    const results = new Set()
    for (let i = 0; i < 200; i++) {
      const code = generateCode('Test', new Date(2026, 0, 1))
      const suffix = code.split('-').pop()
      expect(suffix).toMatch(/^\d{2}$/)
      results.add(suffix)
    }
    expect(results.size).toBeGreaterThan(1)
  })

  test('defaults to current date when none provided', () => {
    const code = generateCode('Zoe')
    const now = new Date()
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    expect(code).toMatch(new RegExp(`^Zoe-${dd}${mm}-\\d{2}$`))
  })
})
