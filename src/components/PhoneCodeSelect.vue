<template>
    <div ref="wrapper" class="phone-select">

        <!-- Trigger -->
        <div class="phone-select-trigger" @click="toggle">
            <span>{{ selected?.text || '+---' }}</span>
            <i class="fas fa-chevron-down"></i>
        </div>

        <!-- Dropdown -->
        <div v-if="isOpen" class="phone-select-dropdown">

            <!-- Search -->
            <div class="phone-select-search">
                <input v-model="search" type="text" placeholder="Search..." />
            </div>

            <!-- Options -->
            <div class="phone-select-list">
                <div v-for="option in filteredOptions" :key="option.value" class="phone-select-option"
                    :class="{ active: option.value === modelValue }" @click="select(option)">
                    <span class="flag">{{ option.flag }}</span>
                    <span class="text">{{ option.text }}</span>
                </div>

                <div v-if="filteredOptions.length === 0" class="empty">
                    No results
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    modelValue: String,
    options: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const wrapper = ref(null)
const search = ref('')

const selected = computed(() =>
    props.options.find(o => o.value === props.modelValue)
)

const filteredOptions = computed(() => {
    if (!search.value) return props.options

    const q = search.value.toLowerCase()

    return props.options.filter(o =>
        o.text?.toLowerCase().includes(q) ||
        o.value?.toLowerCase?.()?.includes(q)
    )
})

function toggle() {
    isOpen.value = !isOpen.value
}

function select(option) {
    emit('update:modelValue', option.value)
    isOpen.value = false
    search.value = ''
}

function handleClickOutside(e) {
    if (wrapper.value && !wrapper.value.contains(e.target)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>


<style>
.phone-select {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    font-family: system-ui, sans-serif;
}

/* Trigger */
.phone-select-trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 12px;
    height: 100%;
    cursor: pointer;

    border-left: 1px solid #dee2e6;
    white-space: nowrap;

    transition: background 0.2s;
}

.phone-select-trigger:hover {
    background: #f8f9fa;
}

/* Dropdown */
.phone-select-dropdown {
    position: absolute;
    top: 100%;
    right: 0;

    width: 220px;
    background: #fff;

    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);

    z-index: 999;
    overflow: hidden;
}

/* Search */
.phone-select-search {
    padding: 8px;
    border-bottom: 1px solid #eee;
}

.phone-select-search input {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;
}

.phone-select-search input:focus {
    border-color: #1d7342;
}

/* List */
.phone-select-list {
    max-height: 240px;
    overflow-y: auto;
}

/* Option */
.phone-select-option {
    display: flex;
    gap: 8px;
    align-items: center;

    padding: 10px 12px;
    cursor: pointer;

    transition: background 0.15s;
}

.phone-select-option:hover {
    background: #f5f5f5;
}

.phone-select-option.active {
    background: #e8f5ee;
    color: #1d7342;
}

/* Empty */
.empty {
    padding: 12px;
    text-align: center;
    color: #999;
}

/* RTL */
[dir="rtl"] .phone-select-trigger {
    border-left: none;
    border-right: 1px solid #dee2e6;
}

[dir="rtl"] .phone-select-dropdown {
    right: auto;
    left: 0;
}
</style>