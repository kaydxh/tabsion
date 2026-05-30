import type { SavedTab } from '@/types'

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    u.hash = ''
    return u.href
  } catch {
    return url
  }
}

export function isDuplicate(existingTabs: SavedTab[], newUrl: string): boolean {
  const normalized = normalizeUrl(newUrl)
  return existingTabs.some(tab => normalizeUrl(tab.url) === normalized)
}
