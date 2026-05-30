import type { SavedTab } from '@/types'

export async function getTabs(): Promise<SavedTab[]> {
  const result = await chrome.storage.local.get(['tabs'])
  return result.tabs || []
}

export async function saveTabs(tabs: SavedTab[]): Promise<void> {
  await chrome.storage.local.set({ tabs })
}

export async function addTabs(newTabs: SavedTab[]): Promise<void> {
  const existing = await getTabs()
  await saveTabs([...existing, ...newTabs])
}

export async function removeTab(id: string): Promise<void> {
  const tabs = await getTabs()
  await saveTabs(tabs.filter(tab => tab.id !== id))
}

export async function clearAllTabs(): Promise<void> {
  await saveTabs([])
}
