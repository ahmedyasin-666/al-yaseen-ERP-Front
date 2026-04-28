<template>
    <li class="sidenav-item" :class="{ 'sidenav-item-sub': sub }">
        <RouterLink :to="to" class="sidenav-link" :class="{ active: isActive }" @click="$emit('click')">
            <i :class="[icon, 'fa-fw sidenav-icon']" />
            <span class="sidenav-label">{{ label }}</span>
        </RouterLink>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps<{
    to: string
    icon: string
    label: string
    sub?: boolean
}>()

defineEmits<{ click: [] }>()

const route = useRoute()
const isActive = computed(() => route.path === props.to || route.path.startsWith(props.to + '/'))
</script>

<style scoped>
.sidenav-item {
    list-style: none;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 2px;
}

.sidenav-link {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.62rem 0.85rem;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 0.875rem;
    transition: background 0.18s, color 0.18s;
    white-space: nowrap;
}

.sidenav-link:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
}

.sidenav-link.active {
    background: #1d7342;
    color: #fff;
    font-weight: 600;
}

.sidenav-item-sub .sidenav-link {
    padding-inline-start: 2.2rem;
    font-size: 0.845rem;
}

.sidenav-item-sub .sidenav-link.active {
    background: rgba(29, 115, 66, 0.75);
}

.sidenav-icon {
    font-size: 0.9rem;
    width: 1.1rem;
    flex-shrink: 0;
    opacity: 0.85;
}

.sidenav-link.active .sidenav-icon {
    opacity: 1;
}

.sidenav-label {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>