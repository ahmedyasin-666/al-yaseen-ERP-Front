<template>
    <!-- Overlay (mobile) -->
    <Transition name="overlay-fade">
        <div v-if="isOpen && isMobile" class="sidenav-overlay" @click="$emit('close')" />
    </Transition>

    <!-- Sidenav -->
    <aside class="sidenav" :class="[
        isOpen ? 'sidenav-open' : 'sidenav-hidden',
        langStore.isRtl ? 'sidenav-rtl' : 'sidenav-ltr',
    ]" :dir="langStore.dir">

        <!-- ══ Logo ══ -->
        <RouterLink to="/dashboard" class="sidenav-logo ripple-effect">
            <img :src="logo" width="130" alt="Logo" class="img-fluid" />
        </RouterLink>

        <!-- ══ User Info ══ -->
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

        <!-- ══ Menu ══ -->
        <ul class="sidenav-menu">

            <!-- ── Fiscal Year ── -->
            <SidenavCollapse id="collapse-fiscal" class="mb-3" icon="fas fa-calendar-alt"
                :label="fiscalYear?.name ?? $t('navbar.noFiscalYear')" :routes="[]" :fiscal-status="fiscalYear?.status"
                @open="onFiscalOpen">
                <!-- panel header -->
                <li class="fy-panel-head">
                    <span class="fy-panel-title">{{ $t('navbar.selectYear') }}</span>
                    <span class="fy-count">{{ fiscalStore.years.length }} {{ $t('navbar.years') }}</span>
                </li>

                <!-- loading -->
                <li v-if="fiscalStore.loading" class="fy-loading">
                    <div class="fy-spinner" />
                </li>

                <!-- list -->
                <template v-else>
                    <li v-for="year in fiscalStore.years" :key="year.ulid" class="fy-item"
                        :class="{ 'fy-item--active': year.ulid === fiscalStore.currentId }" @click="onSwitchYear(year)">
                        <div class="fy-item-body">
                            <span class="fy-item-name">{{ year.name }}</span>
                            <span class="fy-item-dates">{{ year.start_date }} – {{ year.end_date }}</span>
                        </div>
                        <span class="fy-badge" :class="`badge-${year.status}`">{{ year.status_label }}</span>
                        <i v-if="year.ulid === fiscalStore.currentId" class="fas fa-check fy-check" />
                    </li>
                    <li v-if="!fiscalStore.years.length" class="fy-empty">
                        {{ $t('navbar.noYears') }}
                    </li>
                </template>
            </SidenavCollapse>

            <!-- ── Overview ── -->
            <SidenavLink to="/dashboard" icon="fas fa-tachometer-alt" :label="$t('sidebar.overview')" />

            <!-- ── Profile ── -->
            <SidenavLink to="/profile" icon="fas fa-user" :label="$t('sidebar.profile')" />

            <!-- ══ SETTINGS ══ -->
            <li class="sidenav-divider-wrap">
                <hr class="sidenav-divider" />
                <span class="sidenav-heading">{{ $t('sidebar.sections.settings') }}</span>
            </li>

            <SidenavCollapse id="collapse-settings" icon="fas fa-cog" :label="$t('sidebar.settings')"
                :routes="['/settings']">
                <SidenavLink to="/settings/fiscal-years" icon="fas fa-calendar-alt" :label="$t('sidebar.fiscalYears')"
                    sub />
                <SidenavLink to="/settings/fiscal-years" icon="fas fa-calendar-week"
                    :label="$t('sidebar.accountingPeriods')" sub />
            </SidenavCollapse>

            <!-- ══ FINANCIAL ══ -->
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
                <SidenavLink to="/financial/tax-rates" icon="fas fa-percentage" :label="$t('sidebar.taxRates')" sub />
                <SidenavLink to="/financial/tax-groups" icon="fas fa-layer-group" :label="$t('sidebar.taxGroups')" sub />
            </SidenavCollapse>

            <SidenavCollapse id="collapse-reports" icon="fas fa-chart-bar" :label="$t('sidebar.reportsSection')"
                :routes="['/financial/reports', '/financial/opening-balance']">
                <SidenavLink to="/financial/reports" icon="fas fa-chart-pie" :label="$t('sidebar.financialReports')"
                    sub />
                <SidenavLink to="/financial/opening-balance" icon="fas fa-flag" :label="$t('sidebar.openingBalance')"
                    sub />
            </SidenavCollapse>

            <SidenavCollapse :label="$t('sidebar.partners')" icon="fas fa-handshake">
                <SidenavLink to="/partners/customers" icon="fas fa-users" :label="$t('sidebar.customers')" sub />
                <SidenavLink to="/partners/suppliers" icon="fas fa-truck" :label="$t('sidebar.suppliers')" sub />
                <SidenavLink to="/partners/payment-terms" icon="fas fa-file-contract" :label="$t('sidebar.paymentTerms')"
                    sub />
            </SidenavCollapse>

        </ul>

        <!-- ══ Footer ══ -->
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

const fiscalYear = computed(() => fiscalStore.currentYear)

async function onFiscalOpen() {
    if (!fiscalStore.years.length) {
        await fiscalStore.fetchSwitcher()
    }
}

async function onSwitchYear(year: FiscalYear) {
    if (year.ulid === fiscalStore.currentId) return
    await fiscalStore.switchTo(year.ulid)
}

const isMobile = ref(window.innerWidth < 992)
const onResize = () => { isMobile.value = window.innerWidth < 992 }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
/* ════ Design tokens ════ */
.sidenav {
    --snav-bg: #1d334f;
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

.sidenav-open {
    transform: translateX(0);
}

.sidenav-ltr.sidenav-hidden {
    transform: translateX(-100%);
}

.sidenav-rtl.sidenav-hidden {
    transform: translateX(100%);
}

/* ════ Logo ════ */
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

/* ════ User ════ */
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

/* ════ Menu ════ */
.sidenav-menu {
    list-style: none;
    padding: 0.5rem 0.5rem 1rem;
    margin: 0;
    flex-grow: 1;
}

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

/* ════ Fiscal Year — لمسة CSS فقط ════ */
.dot-open {
    background: #4ade80;
}

.dot-closed {
    background: #fbbf24;
}

.dot-locked {
    background: #f87171;
}

.badge-open {
    background: rgba(74, 222, 128, .12);
    color: #4ade80;
    border: 1px solid rgba(74, 222, 128, .25);
}

.badge-closed {
    background: rgba(251, 191, 36, .12);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, .25);
}

.badge-locked {
    background: rgba(248, 113, 113, .12);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, .25);
}

/* ════ Fiscal Year Dropdown ════ */

/* panel header */
.fy-panel-head {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 6px;
    border-bottom: 1px solid rgba(255, 255, 255, .05);
}

.fy-panel-title {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: rgba(255, 255, 255, .3);
}

.fy-count {
    font-size: 0.6rem;
    padding: 1px 6px;
    border-radius: 20px;
    background: rgba(255, 255, 255, .06);
    color: rgba(255, 255, 255, .35);
}

/* item */
.fy-item {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 9px;
    border-radius: 7px;
    cursor: pointer;
    border: 1px solid transparent;
    margin-bottom: 2px;
    transition: background .13s, border-color .13s;
}

.fy-item:last-child {
    margin-bottom: 0;
}

.fy-item:hover {
    background: rgba(255, 255, 255, .05);
}

.fy-item--active {
    background: rgba(29, 115, 66, .22);
    border-color: rgba(74, 222, 128, .18);
    position: relative;
}

.fy-item--active::before {
    content: '';
    display: block;
    width: 3px;
    align-self: stretch;
    background: #4ade80;
    border-radius: 2px;
    flex-shrink: 0;
}

.fy-item-body {
    flex: 1;
    min-width: 0;
}

.fy-item-name {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(255, 255, 255, .88);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
}

.fy-item-dates {
    display: block;
    font-size: 0.62rem;
    color: rgba(255, 255, 255, .3);
    margin-top: 2px;
}

/* badge */
.fy-badge {
    font-size: 0.58rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 20px;
    flex-shrink: 0;
    letter-spacing: .02em;
}

.badge-open {
    background: rgba(74, 222, 128, .1);
    color: #4ade80;
    border: 1px solid rgba(74, 222, 128, .2);
}

.badge-closed {
    background: rgba(251, 191, 36, .1);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, .2);
}

.badge-locked {
    background: rgba(248, 113, 113, .1);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, .2);
}

.fy-check {
    font-size: 0.6rem;
    color: #4ade80;
    flex-shrink: 0;
}

/* loading */
.fy-loading {
    list-style: none;
    display: flex;
    justify-content: center;
    padding: 12px;
}

.fy-spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, .1);
    border-top-color: #4ade80;
    animation: spin .7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.fy-empty {
    list-style: none;
    text-align: center;
    padding: 12px;
    font-size: 0.73rem;
    color: rgba(255, 255, 255, .3);
}

/* ── dots (يُستخدم في SidenavCollapse أيضاً) ── */
.sfb-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

.dot-open {
    background: #4ade80;
}

.dot-closed {
    background: #fbbf24;
}

.dot-locked {
    background: #f87171;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ════ Footer ════ */
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

/* ════ Overlay ════ */
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