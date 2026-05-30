<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SavedTab } from '@/types'
import { getTabs, removeTab, clearAllTabs, saveTabs } from '@/utils/storage'
import DomainGroup from './components/DomainGroup.vue'

const tabs = ref<SavedTab[]>([])
const searchQuery = ref('')

// Group tabs by domain
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

  // Sort groups alphabetically, tabs within group by savedAt desc
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([domain, domainTabs]) => ({
      domain,
      tabs: domainTabs.sort((a, b) => b.savedAt - a.savedAt),
    }))
})

const totalCount = computed(() => tabs.value.length)

async function loadTabs() {
  tabs.value = await getTabs()
}

async function handleDeleteTab(id: string) {
  await removeTab(id)
  tabs.value = tabs.value.filter(t => t.id !== id)
}

async function handleDeleteGroup(domain: string) {
  const remaining = tabs.value.filter(t => t.domain !== domain)
  await saveTabs(remaining)
  tabs.value = remaining
}

async function handleClearAll() {
  if (confirm('Delete all saved tabs?')) {
    await clearAllTabs()
    tabs.value = []
  }
}

function handleRestoreTab(url: string) {
  chrome.tabs.create({ url })
}

onMounted(loadTabs)

// Listen for storage changes (if tabs saved from background)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.tabs) {
    tabs.value = changes.tabs.newValue || []
  }
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="logo">🔵 TabSilo</h1>
      <span class="tab-count">{{ totalCount }} tabs</span>
      <div class="actions">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tabs..."
          class="search-input"
        />
        <button class="btn-danger" @click="handleClearAll">Delete All</button>
      </div>
    </header>

    <main class="content">
      <div v-if="groupedTabs.length === 0" class="empty-state">
        <p>No saved tabs yet. Click the TabSilo icon to save your open tabs.</p>
      </div>

      <DomainGroup
        v-for="group in groupedTabs"
        :key="group.domain"
        :domain="group.domain"
        :tabs="group.tabs"
        @delete-tab="handleDeleteTab"
        @delete-group="handleDeleteGroup"
        @restore-tab="handleRestoreTab"
      />
    </main>
  </div>
</template>
