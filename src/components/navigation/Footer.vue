<template>
    <footer class="footer shadow-sm mt-auto py-2 text-white">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center small flex-wrap" :dir="langStore.dir">
                <!-- النص حسب اللغة -->
                <span>
                    &copy; 2025
                    {{ $t("footer.rights") }} -
                    <strong>Munagasatcom</strong>
                </span>

                <!-- بيانات التواصل -->
                <span class="d-flex align-items-center gap-2 flex-wrap">
                    <span>{{ $t("footer.email") }}:</span>
                    <a href="mailto:support@example.com" class="text-white text-decoration-underline">
                        support@example.com
                    </a>

                    <span class="mx-2 text-muted">|</span>

                    <span>{{ $t("footer.phone") }}:</span>
                    <a href="tel:+123456789" class="text-white text-decoration-underline">
                        +123 456 789
                    </a>
                </span>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useLangStore } from "@/stores/langStore";
const langStore = useLangStore();
</script>

<style scoped>
.footer {
    background-color: #1d334f;
    font-size: 0.85rem;
}

a:hover {
    color: #a3e4b0 !important;
}
</style>
