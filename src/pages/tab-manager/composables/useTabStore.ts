import { ref, computed } from 'vue'
import type { SavedTab } from '@/types'
import { getTabs, removeTab, clearAllTabs, saveTabs } from '@/utils/storage'

export function useTabStore() {
  const tabs = ref<SavedTab[]>([])
  const searchQuery = ref('')
  const loading = ref(false)

  const groupedTabs = computed(() => {
    const filtered = searchQuery.value
      ? tabs.value.filter(
          tab =>
            tab.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            tab.url.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      : tabs.value

    const groups = new Map<string, SavedTab[]>()
    for (const tab of filtered) {
      const existing = groups.get(tab.domain) || []
      existing.push(tab)
      groups.set(tab.domain, existing)
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([domain, domainTabs]) => ({
        domain,
        tabs: [...domainTabs].sort((a, b) => b.savedAt - a.savedAt),
      }))
  })

  const totalCount = computed(() => tabs.value.length)

  async function loadTabs() {
    loading.value = true
    try {
      tabs.value = await getTabs()
    } finally {
      loading.value = false
    }
  }

  async function deleteTab(id: string) {
    await removeTab(id)
    tabs.value = tabs.value.filter(t => t.id !== id)
  }

  async function deleteGroup(domain: string) {
    const remaining = tabs.value.filter(t => t.domain !== domain)
    await saveTabs(remaining)
    tabs.value = remaining
  }

  async function deleteAll() {
    await clearAllTabs()
    tabs.value = []
  }

  function restoreTab(url: string) {
    chrome.tabs.create({ url })
  }

  function onStorageChange(changes: { [key: string]: chrome.storage.StorageChange }) {
    if (changes.tabs) {
      tabs.value = changes.tabs.newValue || []
    }
  }

  return {
    tabs,
    searchQuery,
    loading,
    groupedTabs,
    totalCount,
    loadTabs,
    deleteTab,
    deleteGroup,
    deleteAll,
    restoreTab,
    onStorageChange,
  }
}
