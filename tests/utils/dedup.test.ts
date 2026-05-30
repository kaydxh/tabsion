import { describe, it, expect } from 'vitest'
import { normalizeUrl, isDuplicate } from '@/utils/dedup'
import type { SavedTab } from '@/types'

describe('normalizeUrl', () => {
  it('removes hash fragment', () => {
    expect(normalizeUrl('https://example.com/page#section')).toBe('https://example.com/page')
  })

  it('preserves query params', () => {
    expect(normalizeUrl('https://example.com/page?id=123')).toBe('https://example.com/page?id=123')
  })

  it('preserves trailing slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/')
  })
})

describe('isDuplicate', () => {
  const existingTabs: SavedTab[] = [
    {
      id: '1',
      url: 'https://github.com/vuejs/core',
      title: 'Vue',
      favicon: '',
      domain: 'github.com',
      savedAt: 1000,
    },
    {
      id: '2',
      url: 'https://google.com/search?q=test',
      title: 'Google',
      favicon: '',
      domain: 'google.com',
      savedAt: 2000,
    },
  ]

  it('detects exact URL duplicate', () => {
    expect(isDuplicate(existingTabs, 'https://github.com/vuejs/core')).toBe(true)
  })

  it('detects duplicate ignoring hash', () => {
    expect(isDuplicate(existingTabs, 'https://github.com/vuejs/core#readme')).toBe(true)
  })

  it('returns false for new URL', () => {
    expect(isDuplicate(existingTabs, 'https://github.com/vuejs/router')).toBe(false)
  })

  it('treats different query params as different URLs', () => {
    expect(isDuplicate(existingTabs, 'https://google.com/search?q=other')).toBe(false)
  })
})
