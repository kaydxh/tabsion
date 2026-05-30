import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getTabs, saveTabs, addTabs, removeTab, clearAllTabs } from '@/utils/storage'
import type { SavedTab } from '@/types'

// Mock chrome.storage.local
const mockStorage: Record<string, any> = {}

const chromeMock = {
  storage: {
    local: {
      get: vi.fn((keys: string[]) => Promise.resolve({ [keys[0]]: mockStorage[keys[0]] })),
      set: vi.fn((items: Record<string, any>) => {
        Object.assign(mockStorage, items)
        return Promise.resolve()
      }),
    },
  },
}

vi.stubGlobal('chrome', chromeMock)

const tab1: SavedTab = {
  id: '1',
  url: 'https://github.com/vue',
  title: 'Vue',
  favicon: '',
  domain: 'github.com',
  savedAt: 1000,
}

const tab2: SavedTab = {
  id: '2',
  url: 'https://google.com',
  title: 'Google',
  favicon: '',
  domain: 'google.com',
  savedAt: 2000,
}

describe('storage', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key])
    vi.clearAllMocks()
  })

  it('getTabs returns empty array when no data', async () => {
    const tabs = await getTabs()
    expect(tabs).toEqual([])
  })

  it('saveTabs persists tabs', async () => {
    await saveTabs([tab1, tab2])
    expect(mockStorage.tabs).toEqual([tab1, tab2])
  })

  it('addTabs appends to existing tabs', async () => {
    mockStorage.tabs = [tab1]
    await addTabs([tab2])
    expect(mockStorage.tabs).toEqual([tab1, tab2])
  })

  it('removeTab removes by id', async () => {
    mockStorage.tabs = [tab1, tab2]
    await removeTab('1')
    expect(mockStorage.tabs).toEqual([tab2])
  })

  it('clearAllTabs empties storage', async () => {
    mockStorage.tabs = [tab1, tab2]
    await clearAllTabs()
    expect(mockStorage.tabs).toEqual([])
  })
})
