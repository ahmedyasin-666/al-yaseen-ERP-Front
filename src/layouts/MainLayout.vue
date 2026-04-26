<template>
    <div class="layout-container" :dir="langStore.dir">
        <!-- Sidebar -->
        <Sidebar 
        :is-open="isSidebarOpen" 
        :dir="langStore.dir" 
        @closeSidebar="isSidebarOpen = false"
         @close="isSidebarOpen = false" 
         />

        <!-- Main Content -->
        <div :class="[
            'flex-grow-1 d-flex flex-column main-content',
            { expanded: !isSidebarOpen },
            langStore.dir === 'rtl' ? 'rtl-mode' : 'ltr-mode',
        ]">
            <Navbar :isSidebarOpen="isSidebarOpen" @toggleSidebar="toggleSidebar" />
            <main class="flex-grow-1 p-4 bg-light">
                <RouterView />
            </main>
            <!-- Footer -->
            <Footer :dir="langStore.dir" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Navbar from '@/components/navigation/Navbar.vue'
import Sidebar from '@/components/navigation/Sidebar.vue'
import Footer from '@/components/navigation/Footer.vue'
import { useLangStore } from '@/stores/langStore'

const isSidebarOpen = ref(true)
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)

const langStore = useLangStore()

// تحديث اتجاه الصفحة تلقائياً
watch(
    () => langStore.dir,
    (dir) => {
        document.documentElement.setAttribute('dir', dir)
    },
    { immediate: true }
)
</script>

<style scoped>
.layout-container {
    display: flex;
    min-height: 100vh;
    /* ✅ تفعيل Typography System */
    font-size: var(--text-base);
    font-weight: var(--weight-regular);
    line-height: var(--leading-normal);
}

.main-content {
    transition: all 0.3s ease;
    min-height: 100vh;
}

.main-content.ltr-mode {
    margin-left: 240px;
}

.main-content.rtl-mode {
    margin-right: 240px;
}

.main-content.expanded.ltr-mode {
    margin-left: 0;
}

.main-content.expanded.rtl-mode {
    margin-right: 0;
}

main {
    overflow-y: auto;
}
</style>
