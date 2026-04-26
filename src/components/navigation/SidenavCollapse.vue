<template>
    <li class="sidenav-collapse-item" :class="{ open: isOpen }">

        <!-- Toggle button -->
        <button class="sidenav-link sidenav-toggle" :class="{ active: isParentActive }" :aria-expanded="isOpen"
            :aria-controls="id" @click="toggle">
            <i :class="[icon, 'fa-fw sidenav-icon']" />
            <span class="sidenav-label">{{ label }}</span>
            <i class="fas fa-chevron-down sidenav-chevron" :class="{ rotated: isOpen }" />
        </button>

        <!-- Collapsible sub-list -->
        <div :id="id" class="sidenav-sub-wrapper" :style="subWrapperStyle" ref="subRef">
            <ul class="sidenav-submenu">
                <slot />
            </ul>
        </div>

    </li>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
    id: string
    icon: string
    label: string
    /** مسارات تُحدِّد متى تكون الـ parent active وتُفتح تلقائياً */
    routes?: string[]
}>()

const route = useRoute()
const isOpen = ref(false)
const subRef = ref<HTMLElement | null>(null)
const height = ref(0)

// ── هل أي مسار فرعي active؟ ──────────────────────────────────
const isParentActive = computed(() =>
    props.routes?.some(r => route.path.startsWith(r)) ?? false
)

// ── تُفتح تلقائياً إذا كان المسار الحالي ضمن هذا القسم ──────
watch(isParentActive, (val) => {
    if (val) openCollapse()
}, { immediate: true })

// ── قياس الارتفاع الفعلي للمحتوى ──────────────────────────────
async function measureHeight() {
    await nextTick()
    height.value = subRef.value?.scrollHeight ?? 0
}

onMounted(measureHeight)

function toggle() {
    if (!isOpen.value) openCollapse()
    else closeCollapse()
}

function openCollapse() {
    measureHeight()
    isOpen.value = true
}

function closeCollapse() {
    isOpen.value = false
}

const subWrapperStyle = computed(() => ({
    maxHeight: isOpen.value ? `${height.value}px` : '0px',
}))
</script>

<style scoped>
.sidenav-collapse-item {
    list-style: none;
    margin-bottom: 2px;
}

/* ── Toggle button ── */
.sidenav-toggle {
    width: 100%;
    background: none;
    border: none;
    text-align: start;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.62rem 0.85rem;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    transition: background 0.18s, color 0.18s;
    white-space: nowrap;
}

.sidenav-toggle:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
}

.sidenav-toggle.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
}

/* ── Chevron ── */
.sidenav-chevron {
    margin-inline-start: auto;
    font-size: 0.7rem;
    opacity: 0.6;
    transition: transform 0.25s ease;
    flex-shrink: 0;
}

.sidenav-chevron.rotated {
    transform: rotate(180deg);
    opacity: 1;
}

/* ── Icon ── */
.sidenav-icon {
    font-size: 0.9rem;
    width: 1.1rem;
    flex-shrink: 0;
    opacity: 0.85;
}

.sidenav-toggle.active .sidenav-icon {
    opacity: 1;
}

.sidenav-label {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

/* ── Collapse wrapper (smooth height animation) ── */
.sidenav-sub-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Sub-menu list ── */
.sidenav-submenu {
    list-style: none;
    padding: 0.2rem 0 0.25rem;
    margin: 0;
}
</style>