<template>
    <div class="login-layout d-flex align-items-center justify-content-center min-vh-100" :dir="langStore.dir">
        <div class="login-container bg-white shadow-lg rounded-4 py-5 px-4">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/langStore";
const langStore = useLangStore();
</script>

<style scoped>
.login-layout {
    background: linear-gradient(135deg, #1d7342, #1d334f);
    padding: 2rem 1rem;
    /* يمنع الـ container من لصق حواف الشاشة */
}

.login-container {
    width: 100%;
    max-width: 680px;
    /* كافي للـ Register وللـ Login */
}
</style>