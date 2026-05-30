<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTabStore } from './composables/useTabStore'
import DomainGroup from './components/DomainGroup.vue'

const {
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
} = useTabStore()

function handleClearAll() {
  if (confirm('Delete all saved tabs?')) {
    deleteAll()
  }
}

onMounted(() => {
  loadTabs()
  chrome.storage.onChanged.addListener(onStorageChange)
})

onUnmounted(() => {
  chrome.storage.onChanged.removeListener(onStorageChange)
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
      <div v-if="loading" class="loading-state">
        <p>Loading...</p>
      </div>

      <div v-else-if="groupedTabs.length === 0" class="empty-state">
        <p>No saved tabs yet. Click the TabSilo icon to save your open tabs.</p>
      </div>

      <DomainGroup
        v-for="group in groupedTabs"
        :key="group.domain"
        :domain="group.domain"
        :tabs="group.tabs"
        @delete-tab="deleteTab"
        @delete-group="deleteGroup"
        @restore-tab="restoreTab"
      />
    </main>
  </div>
</template>
