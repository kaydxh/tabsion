import type { SavedTab } from '@/types'
import { extractDomain } from '@/utils/domain'
import { normalizeUrl } from '@/utils/dedup'
import { getTabs, saveTabs } from '@/utils/storage'

const TAB_MANAGER_PATH = 'src/pages/tab-manager/index.html'

function shouldSkip(url: string | undefined): boolean {
  if (!url) return true
  if (url.startsWith('chrome://')) return true
  if (url.startsWith('chrome-extension://')) return true
  if (url.startsWith('about:')) return true
  return false
}

async function openTabManager(): Promise<void> {
  const managerUrl = chrome.runtime.getURL(TAB_MANAGER_PATH)
  const tabs = await chrome.tabs.query({})
  const existing = tabs.find(tab => tab.url?.startsWith(managerUrl))

  if (existing?.id) {
    await chrome.tabs.update(existing.id, { active: true })
    if (existing.windowId) {
      await chrome.windows.update(existing.windowId, { focused: true })
    }
  } else {
    await chrome.tabs.create({ url: managerUrl })
  }
}

async function saveAndCloseTabs(): Promise<void> {
  const currentTabs = await chrome.tabs.query({ currentWindow: true, pinned: false })
  const existingTabs = await getTabs()
  const managerUrl = chrome.runtime.getURL(TAB_MANAGER_PATH)

  // Build URL Set for O(1) dedup lookup
  const existingUrls = new Set(existingTabs.map(t => normalizeUrl(t.url)))

  const newTabs: SavedTab[] = []
  const tabIdsToClose: number[] = []

  for (const tab of currentTabs) {
    if (shouldSkip(tab.url)) continue
    if (tab.url!.startsWith(managerUrl)) continue

    if (tab.id) {
      tabIdsToClose.push(tab.id)
    }

    const normalized = normalizeUrl(tab.url!)
    if (existingUrls.has(normalized)) continue

    // Also dedup within current batch
    existingUrls.add(normalized)
    newTabs.push({
      id: crypto.randomUUID(),
      url: tab.url!,
      title: tab.title || tab.url!,
      favicon: tab.favIconUrl || '',
      domain: extractDomain(tab.url!),
      savedAt: Date.now(),
    })
  }

  // CRITICAL: Save data FIRST, then close tabs
  // If save fails, tabs remain open — no data loss
  if (newTabs.length > 0) {
    await saveTabs([...existingTabs, ...newTabs])
  }

  if (tabIdsToClose.length > 0) {
    await chrome.tabs.remove(tabIdsToClose)
  }

  await openTabManager()
}

chrome.action.onClicked.addListener((tab) => {
  saveAndCloseTabs().catch(err => {
    console.error('TabSilo: Failed to save tabs:', err)
  })
})
