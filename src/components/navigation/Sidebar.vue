<template>
    <!--
     ╔══════════════════════════════════════════════════════════╗
     ║  TheSidebar.vue — Frontend Panel                        ║
     ║  Custom MDB-style sidenav — no paid Vue component needed ║
     ╚══════════════════════════════════════════════════════════╝
    -->

    <!-- Overlay (mobile) -->
    <Transition name="overlay-fade">
        <div v-if="isOpen && isMobile" class="sidenav-overlay" @click="$emit('close')" />
    </Transition>

    <!-- Sidenav -->
    <aside class="sidenav" :class="[
        isOpen ? 'sidenav-open' : 'sidenav-hidden',
        langStore.isRtl ? 'sidenav-rtl' : 'sidenav-ltr',
    ]" :dir="langStore.dir">

        <!-- ══ Logo ════════════════════════════════════════════════ -->
        <RouterLink to="/dashboard" class="sidenav-logo ripple-effect">
            <img :src="logo" width="130" alt="Logo" class="img-fluid" />
        </RouterLink>

        <!-- ══ User Info ══════════════════════════════════════════ -->
        <div class="sidenav-user">
            <img :src="authStore.user?.company?.logo || avatarFallback" class="sidenav-avatar" alt="Avatar" />
            <div class="sidenav-user-info">
                <strong class="sidenav-user-name">
                    {{ authStore.fullName || $t('sidebar.user') }}
                </strong>
                <span class="sidenav-company">
                    {{ authStore.user?.company?.title || $t('sidebar.noCompany') }}
                </span>
            </div>
        </div>

        <!-- ══ Fiscal Year Block ══════════════════════════════════ -->
        <div class="sidenav-fiscal-block">

            <!-- Divider -->
            <div class="sfb-sep" />

            <!-- Fiscal Year row (clickable) -->
            <div class="sfb-row sfb-row--clickable" @click="toggleFiscalSwitcher">
                <div class="sfb-icon" :class="fiscalYear ? 'sfb-icon--active' : 'sfb-icon--warn'">
                    <i class="fas fa-calendar-alt" />
                </div>
                <div class="sfb-body">
                    <span class="sfb-label">{{ $t('navbar.fiscalYear') }}</span>
                    <span class="sfb-value sfb-value--accent">
                        {{ fiscalYear?.name ?? $t('navbar.noFiscalYear') }}
                    </span>
                </div>
                <div class="sfb-right">
                    <span v-if="fiscalYear" class="sfb-dot" :class="`dot-${fiscalYear.status}`"
                        :title="fiscalYear.status_label" />
                    <i class="fas sfb-chevron" :class="showSwitcher ? 'fa-chevron-up' : 'fa-chevron-down'" />
                </div>
            </div>

            <!-- ── Fiscal Switcher Dropdown ── -->
            <Transition name="sfb-slide">
                <div v-if="showSwitcher" class="sfb-switcher">
                    <div v-if="fiscalStore.loading" class="text-center py-3">
                        <div class="sfb-spinner" />
                    </div>
                    <template v-else>
                        <div v-for="year in fiscalStore.years" :key="year.ulid" class="sfb-item" :class="{
                            'sfb-item--active': year.ulid === fiscalStore.currentId,
                            'sfb-item--current': year.is_current,
                        }" @click="onSwitchYear(year)">
                            <div class="d-flex align-items-center gap-2">
                                <span class="sfb-dot" :class="`dot-${year.status}`" />
                                <div>
                                    <div class="sfb-item-name">{{ year.name }}</div>
                                    <div class="sfb-item-dates">
                                        {{ year.start_date }} → {{ year.end_date }}
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2 flex-shrink-0">
                                <span class="sfb-badge" :class="`badge-${year.status}`">
                                    {{ year.status_label }}
                                </span>
                                <i v-if="year.ulid === fiscalStore.currentId" class="fas fa-check"
                                    style="color:#4ade80;font-size:0.75rem;" />
                            </div>
                        </div>
                        <div v-if="!fiscalStore.years.length" class="sfb-empty">
                            {{ $t('navbar.noYears') }}
                        </div>
                    </template>
                </div>
            </Transition>

        </div>

        <!-- ══ Menu ═══════════════════════════════════════════════ -->
        <ul class="sidenav-menu">

            <!-- ─── Overview ──────────────────────────────────── -->
            <SidenavLink to="/dashboard" icon="fas fa-tachometer-alt" :label="$t('sidebar.overview')" />

            <!-- ─── Profile ───────────────────────────────────── -->
            <SidenavLink to="/profile" icon="fas fa-user" :label="$t('sidebar.profile')" />

            <!-- ══ SETTINGS SECTION ════════════════════════════ -->
            <li class="sidenav-divider-wrap">
                <hr class="sidenav-divider" />
                <span class="sidenav-heading">{{ $t('sidebar.sections.settings') }}</span>
            </li>

            <SidenavCollapse id="collapse-settings" icon="fas fa-cog" :label="$t('sidebar.settings')"
                :routes="['/settings']">
                <SidenavLink to="/settings/fiscal-years" icon="fas fa-calendar-alt" :label="$t('sidebar.fiscalYears')"
                    sub />
            </SidenavCollapse>

            <!-- ── FINANCIAL SECTION ─────────────────────────────── -->
            <li class="sidenav-divider-wrap">
                <hr class="sidenav-divider" />
                <span class="sidenav-heading">{{ $t('sidebar.sections.financial') }}</span>
            </li>

            <SidenavCollapse id="collapse-financial" icon="fas fa-calculator" :label="$t('sidebar.financial')"
                :routes="['/financial']">
                <SidenavLink to="/financial/accounts" icon="fas fa-sitemap" :label="$t('sidebar.accounts')" sub />
                <SidenavLink to="/financial/journals" icon="fas fa-book" :label="$t('sidebar.journals')" sub />
                <SidenavLink to="/financial/entries" icon="fas fa-receipt" :label="$t('sidebar.entries')" sub />
                <SidenavLink to="/financial/cost-centers" icon="fas fa-project-diagram"
                    :label="$t('sidebar.costCenters')" sub />
            </SidenavCollapse>

            <SidenavCollapse id="collapse-reports" icon="fas fa-chart-bar" :label="$t('sidebar.reportsSection')"
                :routes="['/financial/reports', '/financial/opening-balance']">
                <SidenavLink to="/financial/reports" icon="fas fa-chart-pie" :label="$t('sidebar.financialReports')"
                    sub />
                <SidenavLink to="/financial/opening-balance" icon="fas fa-flag" :label="$t('sidebar.openingBalance')"
                    sub />
            </SidenavCollapse>

        </ul>

        <!-- ══ Footer ════════════════════════════════════════════ -->
        <div class="sidenav-footer">
            <button class="sidenav-close-btn" @click="$emit('close')">
                <i :class="langStore.isRtl ? 'fas fa-angle-double-right' : 'fas fa-angle-double-left'" />
                {{ $t('sidebar.close') }}
            </button>
        </div>

    </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'
import { useFiscalYearStore } from '@/stores/fiscalYearStore'
import type { FiscalYear } from '@/types/fiscalYear'
import logo from '@/assets/images/logo.png'

import SidenavLink from './SidenavLink.vue'
import SidenavCollapse from './SidenavCollapse.vue'

defineEmits<{ close: [] }>()
defineProps<{ isOpen: boolean }>()

const authStore = useAuthStore()
const langStore = useLangStore()
const fiscalStore = useFiscalYearStore()

const avatarFallback = 'https://ui-avatars.com/api/?background=1d334f&color=fff&name=U'

// ── Fiscal Year Switcher ───────────────────────────────────────
const fiscalYear = computed(() => fiscalStore.currentYear)
const showSwitcher = ref(false)

async function toggleFiscalSwitcher() {
    showSwitcher.value = !showSwitcher.value
    if (showSwitcher.value && !fiscalStore.years.length) {
        await fiscalStore.fetchSwitcher()
    }
}

async function onSwitchYear(year: FiscalYear) {
    if (year.ulid === fiscalStore.currentId) {
        showSwitcher.value = false
        return
    }
    await fiscalStore.switchTo(year.ulid)
    showSwitcher.value = false
}

onMounted(async () => {
    if (!fiscalStore.years.length) {
        await fiscalStore.fetchSwitcher()
    }
})

// ── Detect mobile ──────────────────────────────────────────────
const isMobile = ref(window.innerWidth < 992)
const onResize = () => { isMobile.value = window.innerWidth < 992 }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════════
   Design tokens
════════════════════════════════════════════════════════════════ */
.sidenav {
    --snav-bg: #1d334f;
    --snav-bg-hover: #162843;
    --snav-bg-active: #1d7342;
    --snav-accent: #1d7342;
    --snav-text: rgba(255, 255, 255, 0.85);
    --snav-text-muted: rgba(255, 255, 255, 0.45);
    --snav-divider: rgba(255, 255, 255, 0.1);
    --snav-width: 240px;
    --snav-transition: 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    --snav-radius: 8px;

    width: var(--snav-width);
    background-color: var(--snav-bg);
    color: var(--snav-text);
    min-height: 100vh;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    z-index: 1045;
    overflow-x: hidden;
    overflow-y: auto;
    transition: transform var(--snav-transition), box-shadow var(--snav-transition);
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.sidenav::-webkit-scrollbar {
    width: 4px;
}

.sidenav::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
}

/* ── Position ── */
.sidenav-ltr {
    left: 0;
    right: auto;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.25);
}

.sidenav-rtl {
    right: 0;
    left: auto;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.25);
}

/* ── Open / Hidden ── */
.sidenav-open {
    transform: translateX(0);
}

.sidenav-ltr.sidenav-hidden {
    transform: translateX(-100%);
}

.sidenav-rtl.sidenav-hidden {
    transform: translateX(100%);
}

/* ════════════════════════════════════════════════════════════════
   Logo
════════════════════════════════════════════════════════════════ */
.sidenav-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 1rem;
    border-bottom: 1px solid var(--snav-divider);
    text-decoration: none;
    transition: background 0.2s;
}

.sidenav-logo:hover {
    background: rgba(255, 255, 255, 0.04);
}

/* ════════════════════════════════════════════════════════════════
   User info
════════════════════════════════════════════════════════════════ */
.sidenav-user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.1rem;
    border-bottom: 1px solid var(--snav-divider);
}

.sidenav-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
}

.sidenav-user-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.sidenav-user-name {
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
}

.sidenav-company {
    font-size: 0.75rem;
    color: var(--snav-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ════════════════════════════════════════════════════════════════
   Fiscal Year Block  (sfb-*)
════════════════════════════════════════════════════════════════ */
.sidenav-fiscal-block {
    margin: 0.6rem 0.6rem 0;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 10px;
    overflow: hidden;
}

/* ── Row ── */
.sfb-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
}

.sfb-row--clickable {
    cursor: pointer;
    transition: background 0.18s;
    user-select: none;
}

.sfb-row--clickable:hover {
    background: rgba(255, 255, 255, 0.07);
}

/* ── Icon ── */
.sfb-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.75);
    flex-shrink: 0;
    transition: background 0.2s;
}

.sfb-icon--active {
    background: rgba(29, 115, 66, 0.5);
    color: #4ade80;
}

.sfb-icon--warn {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
}

/* ── Body ── */
.sfb-body {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
    flex: 1;
    min-width: 0;
}

.sfb-label {
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--snav-text-muted);
}

.sfb-value {
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sfb-value--accent {
    color: #7ee8b0;
}

/* ── Right side ── */
.sfb-right {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
}

.sfb-chevron {
    font-size: 0.58rem;
    color: var(--snav-text-muted);
    transition: transform 0.2s;
}

/* ── Separator ── */
.sfb-sep {
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
    margin: 0 0.5rem;
}

/* ── Status dots ── */
.sfb-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

.dot-open {
    background: #4ade80;
    box-shadow: 0 0 5px #4ade80;
}

.dot-closed {
    background: #fbbf24;
    box-shadow: 0 0 5px #fbbf24;
}

.dot-locked {
    background: #f87171;
    box-shadow: 0 0 5px #f87171;
}

/* ── Switcher dropdown ── */
.sfb-switcher {
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    max-height: 240px;
    overflow-y: auto;
    padding: 0.3rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.sfb-switcher::-webkit-scrollbar {
    width: 3px;
}

.sfb-switcher::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.sfb-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.6rem;
    border-radius: 7px;
    cursor: pointer;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    transition: background 0.15s;
}

.sfb-item:hover {
    background: rgba(255, 255, 255, 0.07);
}

.sfb-item--active {
    background: rgba(29, 115, 66, 0.35) !important;
    border: 1px solid rgba(74, 222, 128, 0.25);
}

.sfb-item-name {
    font-size: 0.8rem;
    font-weight: 600;
}

.sfb-item-dates {
    font-size: 0.65rem;
    opacity: 0.55;
}

.sfb-badge {
    font-size: 0.6rem;
    padding: 2px 7px;
    border-radius: 20px;
    font-weight: 600;
    white-space: nowrap;
}

.badge-open {
    background: rgba(74, 222, 128, 0.15);
    color: #4ade80;
    border: 1px solid rgba(74, 222, 128, 0.3);
}

.badge-closed {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.3);
}

.badge-locked {
    background: rgba(248, 113, 113, 0.15);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, 0.3);
}

.sfb-empty {
    text-align: center;
    padding: 0.75rem;
    font-size: 0.75rem;
    color: var(--snav-text-muted);
}

/* ── Spinner ── */
.sfb-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-top-color: #4ade80;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Transition ── */
.sfb-slide-enter-active,
.sfb-slide-leave-active {
    transition: max-height 0.25s ease, opacity 0.2s ease;
    overflow: hidden;
}

.sfb-slide-enter-from,
.sfb-slide-leave-to {
    max-height: 0;
    opacity: 0;
}

.sfb-slide-enter-to,
.sfb-slide-leave-from {
    max-height: 240px;
    opacity: 1;
}

/* ════════════════════════════════════════════════════════════════
   Menu list
════════════════════════════════════════════════════════════════ */
.sidenav-menu {
    list-style: none;
    padding: 0.5rem 0.5rem 1rem;
    margin: 0;
    flex-grow: 1;
}

/* ── Divider + Heading ── */
.sidenav-divider-wrap {
    padding: 0.75rem 0.6rem 0.25rem;
    list-style: none;
}

.sidenav-divider {
    border: none;
    border-top: 1px solid var(--snav-divider);
    margin: 0 0 0.5rem;
}

.sidenav-heading {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--snav-text-muted);
    padding-inline-start: 0.4rem;
}

/* ════════════════════════════════════════════════════════════════
   Footer
════════════════════════════════════════════════════════════════ */
.sidenav-footer {
    border-top: 1px solid var(--snav-divider);
    padding: 0.75rem;
    text-align: center;
    flex-shrink: 0;
}

.sidenav-close-btn {
    width: 100%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--snav-radius);
    color: var(--snav-text);
    font-size: 0.82rem;
    padding: 0.45rem 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s;
}

.sidenav-close-btn:hover {
    background: rgba(255, 255, 255, 0.12);
}

/* ════════════════════════════════════════════════════════════════
   Overlay (mobile)
════════════════════════════════════════════════════════════════ */
.sidenav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1044;
    backdrop-filter: blur(2px);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.25s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}
</style>