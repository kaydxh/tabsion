import type { SavedTab } from '@/types'
import { extractDomain } from '@/utils/domain'
import { normalizeUrl, isDuplicate } from '@/utils/dedup'
import { getTabs, saveTabs } from '@/utils/storage'

const TAB_MANAGER_PATH = 'src/pages/tab-manager/index.html'

// URLs to skip
function shouldSkip(url: string | undefined): boolean {
  if (!url) return true
  if (url.startsWith('chrome://')) return true
  if (url.startsWith('chrome-extension://')) return true
  if (url.startsWith('about:')) return true
  if (url === 'chrome://newtab/') return true
  return false
}

// Find or open tab-manager page
async function openTabManager(): Promise<void> {
  const managerUrl = chrome.runtime.getURL(TAB_MANAGER_PATH)
  const tabs = await chrome.tabs.query({})
  const existing = tabs.find(tab => tab.url?.startsWith(managerUrl))

  if (existing && existing.id) {
    await chrome.tabs.update(existing.id, { active: true })
    if (existing.windowId) {
      await chrome.windows.update(existing.windowId, { focused: true })
    }
  } else {
    await chrome.tabs.create({ url: managerUrl })
  }
}

// Main handler: save all tabs and close them
async function saveAndCloseTabs(): Promise<void> {
  const currentTabs = await chrome.tabs.query({ currentWindow: true, pinned: false })
  const existingTabs = await getTabs()

  const managerUrl = chrome.runtime.getURL(TAB_MANAGER_PATH)
  const newTabs: SavedTab[] = []
  const tabIdsToClose: number[] = []

  for (const tab of currentTabs) {
    if (shouldSkip(tab.url)) continue
    if (tab.url?.startsWith(managerUrl)) continue

    if (!isDuplicate(existingTabs, tab.url!)) {
      newTabs.push({
        id: crypto.randomUUID(),
        url: tab.url!,
        title: tab.title || tab.url!,
        favicon: tab.favIconUrl || '',
        domain: extractDomain(tab.url!),
        savedAt: Date.now(),
      })
    }

    if (tab.id) {
      tabIdsToClose.push(tab.id)
    }
  }

  // Also check new tabs against each other for duplicates
  const dedupedNewTabs: SavedTab[] = []
  const seenUrls = new Set(existingTabs.map(t => normalizeUrl(t.url)))
  for (const tab of newTabs) {
    const normalized = normalizeUrl(tab.url)
    if (!seenUrls.has(normalized)) {
      seenUrls.add(normalized)
      dedupedNewTabs.push(tab)
    }
  }

  if (dedupedNewTabs.length > 0) {
    await saveTabs([...existingTabs, ...dedupedNewTabs])
  }

  // Close tabs
  if (tabIdsToClose.length > 0) {
    await chrome.tabs.remove(tabIdsToClose)
  }

  // Open tab manager
  await openTabManager()
}

// Listen for extension icon click
chrome.action.onClicked.addListener(saveAndCloseTabs)
