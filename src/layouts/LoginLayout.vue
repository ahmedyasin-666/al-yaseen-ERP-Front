<template>
    <div class="login-layout d-flex align-items-center justify-content-center min-vh-100 px-3 py-4"
        :dir="langStore.dir">
        <div class="bg-white shadow-lg rounded-4 py-5 px-4 px-sm-5
                    col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLangStore } from '@/stores/langStore'
const langStore = useLangStore()
</script>

<style scoped>
.login-layout {
    background: linear-gradient(135deg, #1d7342, #1d334f);
}
</style>