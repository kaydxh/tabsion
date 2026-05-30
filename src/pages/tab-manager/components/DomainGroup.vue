<script setup lang="ts">
import { ref } from 'vue'
import type { SavedTab } from '@/types'
import TabItem from './TabItem.vue'

const props = defineProps<{
  domain: string
  tabs: SavedTab[]
}>()

const emit = defineEmits<{
  deleteTab: [id: string]
  deleteGroup: [domain: string]
  restoreTab: [url: string]
}>()

const collapsed = ref(false)

function toggle() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="domain-group">
    <div class="group-header" @click="toggle">
      <span class="toggle-icon">{{ collapsed ? '▶' : '▼' }}</span>
      <span class="domain-name">{{ domain }}</span>
      <span class="tab-count">({{ tabs.length }})</span>
      <button
        class="btn-delete-group"
        @click.stop="emit('deleteGroup', domain)"
        title="Delete all in group"
      >
        ×
      </button>
    </div>

    <div v-show="!collapsed" class="group-tabs">
      <TabItem
        v-for="tab in tabs"
        :key="tab.id"
        :tab="tab"
        @delete="emit('deleteTab', $event)"
        @restore="emit('restoreTab', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.domain-group {
  margin-bottom: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.group-header:hover {
  background: #f0f0f0;
}

.toggle-icon {
  font-size: 10px;
  color: #666;
  width: 14px;
}

.domain-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.tab-count {
  font-size: 12px;
  color: #999;
}

.btn-delete-group {
  margin-left: auto;
  opacity: 0;
  border: none;
  background: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.group-header:hover .btn-delete-group {
  opacity: 1;
}

.btn-delete-group:hover {
  color: #e74c3c;
}

.group-tabs {
  padding: 4px 0;
}
</style>
