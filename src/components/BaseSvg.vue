<template>
  <span class="svg-icon" :style="{ width: size + 'px', height: size + 'px' }" v-html="icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: number
}>()

const icons: Record<string, string> = {
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`,

  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
    </svg>`,

  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5l4 4L7 21l-4 1 1-4z"/>
    </svg>`,

  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>`,

  "lock-open": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M17 11V7a5 5 0 0 0-9.9-1"/>
    </svg>`,

  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>`,

  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`,

  "exchange-alt": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>`,

  ban: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4" y1="4" x2="20" y2="20"/>
    </svg>`,

  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9"/>
    </svg>`,

  ellipsis: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2">
      <circle cx="5" cy="12" r="1"/>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
    </svg>`
}

const icon = computed(() => icons[props.name] || '')
</script>

<style scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.svg-icon svg {
  width: 100%;
  height: 100%;
}
</style>