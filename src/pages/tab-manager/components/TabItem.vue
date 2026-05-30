<script setup lang="ts">
import type { SavedTab } from '@/types'

const props = defineProps<{
  tab: SavedTab
}>()

const emit = defineEmits<{
  delete: [id: string]
  restore: [url: string]
}>()

function handleClick(e: MouseEvent) {
  e.preventDefault()
  emit('restore', props.tab.url)
}
</script>

<template>
  <div class="tab-item">
    <img
      v-if="tab.favicon"
      :src="tab.favicon"
      class="favicon"
      alt=""
      @error="($event.target as HTMLImageElement).style.display = 'none'"
    />
    <span v-else class="favicon-placeholder">🔗</span>
    <a
      :href="tab.url"
      class="tab-title"
      :title="tab.url"
      @click="handleClick"
    >
      {{ tab.title }}
    </a>
    <button class="btn-delete" @click="emit('delete', tab.id)" title="Delete">×</button>
  </div>
</template>

<style scoped>
.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
}

.tab-item:hover {
  background: #f0f0f0;
}

.favicon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.favicon-placeholder {
  font-size: 12px;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.tab-title {
  flex: 1;
  color: #1a73e8;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-title:hover {
  text-decoration: underline;
}

.btn-delete {
  opacity: 0;
  border: none;
  background: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.tab-item:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  color: #e74c3c;
}
</style>
