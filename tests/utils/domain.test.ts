import { describe, it, expect } from 'vitest'
import { extractDomain } from '@/utils/domain'

describe('extractDomain', () => {
  it('extracts subdomain from full URL', () => {
    expect(extractDomain('https://iwiki.woa.com/page/123?id=abc')).toBe('iwiki.woa.com')
  })

  it('extracts plain domain', () => {
    expect(extractDomain('https://google.com/search?q=test')).toBe('google.com')
  })

  it('preserves www subdomain', () => {
    expect(extractDomain('https://www.github.com/repo')).toBe('www.github.com')
  })

  it('handles port in URL', () => {
    expect(extractDomain('http://localhost:3000/page')).toBe('localhost')
  })

  it('handles deep subdomain', () => {
    expect(extractDomain('https://a.b.c.example.com/path')).toBe('a.b.c.example.com')
  })
})
