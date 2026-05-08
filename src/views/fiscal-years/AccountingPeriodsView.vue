<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">
        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge">
                    <i class="fas fa-calendar-week text-white"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('accountingPeriods.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem>
                            <RouterLink to="/dashboard" class="text-white-50 text-decoration-none">
                                {{ $t('common.home') }}
                            </RouterLink>
                        </MDBBreadcrumbItem>
                        <MDBBreadcrumbItem>
                            <RouterLink to="/settings/fiscal-years" class="text-white-50 text-decoration-none">
                                {{ $t('fiscalYears.title') }}
                            </RouterLink>
                        </MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('accountingPeriods.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>

            <div class="d-flex gap-2 align-items-center">
                <MDBBtn outline="light" size="sm" class="fw-semibold rounded-3" @click="goBack">
                    <i :class="langStore.isRtl ? 'fas fa-arrow-right' : 'fas fa-arrow-left'" class="me-1"></i>
                    {{ $t('common.back') }}
                </MDBBtn>
                <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="onGenerate"
                    :disabled="loadingAction">
                    <i class="fas fa-magic me-1"></i>
                    {{ $t('accountingPeriods.generate') }}
                </MDBBtn>
            </div>
        </div>

        <!-- ══ Table Card ══ -->
        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
            <MDBProgress v-if="loading" style="height:3px;border-radius:0;">
                <MDBProgressBar striped animated :value="100" />
            </MDBProgress>
            <div v-else style="height:3px;"></div>

            <div class="table-responsive">
                <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                    <thead>
                        <tr>
                            <th class="text-center" style="width:48px;">#</th>
                            <th class="text-center" style="min-width:120px;">{{ $t('accountingPeriods.periodNumber') }}</th>
                            <th style="min-width:220px;">{{ $t('accountingPeriods.name') }}</th>
                            <th class="text-center" style="min-width:120px;">{{ $t('accountingPeriods.code') }}</th>
                            <th class="text-center" style="min-width:120px;">{{ $t('accountingPeriods.startDate') }}</th>
                            <th class="text-center" style="min-width:120px;">{{ $t('accountingPeriods.endDate') }}</th>
                            <th class="text-center" style="min-width:120px;">{{ $t('common.status') }}</th>
                            <th class="text-center" style="min-width:140px;">{{ $t('accountingPeriods.allowAdjustments') }}</th>
                            <th class="text-center" style="width:160px;">{{ $t('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading && !periods.length">
                            <td colspan="9" class="text-center py-5">
                                <MDBSpinner color="primary" class="mb-2" />
                                <div class="text-muted small">{{ $t('common.loading') }}</div>
                            </td>
                        </tr>
                        <tr v-else-if="!periods.length">
                            <td colspan="9" class="text-center py-5">
                                <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style="width:60px;height:60px;">
                                    <i class="fas fa-calendar-week fa-lg text-muted"></i>
                                </div>
                                <div class="fw-semibold text-muted mb-2">{{ $t('accountingPeriods.empty') }}</div>
                                <MDBBtn color="primary" size="sm" class="rounded-3" @click="onGenerate"
                                    :disabled="loadingAction">
                                    <i class="fas fa-magic me-1"></i>{{ $t('accountingPeriods.generate') }}
                                </MDBBtn>
                            </td>
                        </tr>
                        <tr v-else v-for="(p, idx) in periods" :key="p.ulid" :class="{ 'row-current': p.is_current }">
                            <td class="text-center text-muted small fw-semibold">{{ idx + 1 }}</td>
                            <td class="text-center">
                                <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill font-monospace">
                                    {{ p.period_number }}
                                </span>
                            </td>
                            <td>
                                <div class="fw-semibold">{{ p.name }}</div>
                                <div v-if="p.display_name && p.display_name !== p.name" class="text-muted small">{{ p.display_name }}</div>
                            </td>
                            <td class="text-center">
                                <span v-if="p.code" class="badge bg-light text-dark border rounded-pill font-monospace">{{ p.code }}</span>
                                <span v-else class="text-muted small">—</span>
                            </td>
                            <td class="text-center small text-nowrap">{{ p.start_date }}</td>
                            <td class="text-center small text-nowrap">{{ p.end_date }}</td>
                            <td class="text-center">
                                <span class="badge rounded-pill px-2" :class="statusClass(p.status)">
                                    <i class="fas fa-circle me-1" style="font-size:7px;"></i>
                                    {{ $t(`accountingPeriods.statuses.${p.status}`) }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill"
                                    :class="p.allow_adjustments ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'">
                                    <i :class="p.allow_adjustments ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="me-1"
                                        style="font-size:9px;"></i>
                                    {{ p.allow_adjustments ? $t('common.yes') : $t('common.no') }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 action-icons">
                                    <i v-if="p.status === 'open'" class="fas fa-lock icon-action text-warning"
                                        :title="$t('accountingPeriods.close')" @click="confirmClose(p)"></i>
                                    <i v-if="p.status === 'closed'" class="fas fa-lock-open icon-action text-success"
                                        :title="$t('accountingPeriods.reopen')" @click="confirmReopen(p)"></i>
                                    <i v-if="p.status === 'closed'" class="fas fa-ban icon-action text-danger"
                                        :title="$t('accountingPeriods.lock')" @click="confirmLock(p)"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </MDBCard>

        <!-- ══ Confirm Modals ══ -->
        <ConfirmModal v-model:show="showCloseModal" type="warning" icon="lock" :title="$t('accountingPeriods.closeTitle')"
            :message="$t('accountingPeriods.closeMessage', { name: confirmTarget?.name })"
            :confirm-label="$t('accountingPeriods.close')" :loading="loadingAction" @confirm="onCloseConfirmed" />

        <ConfirmModal v-model:show="showReopenModal" type="success" icon="lock-open"
            :title="$t('accountingPeriods.reopenTitle')"
            :message="$t('accountingPeriods.reopenMessage', { name: confirmTarget?.name })"
            :confirm-label="$t('accountingPeriods.reopen')" :loading="loadingAction" @confirm="onReopenConfirmed" />

        <ConfirmModal v-model:show="showLockModal" type="danger" icon="ban" :title="$t('accountingPeriods.lockTitle')"
            :message="$t('accountingPeriods.lockMessage', { name: confirmTarget?.name })"
            :confirm-label="$t('accountingPeriods.lock')" :loading="loadingAction" @confirm="onLockConfirmed" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
    MDBCard, MDBBtn,
    MDBProgress, MDBProgressBar, MDBSpinner,
    MDBBreadcrumb, MDBBreadcrumbItem,
} from 'mdb-vue-ui-kit'
import { useLangStore } from '@/stores/langStore'
import { accountingPeriodService } from '@/services/accountingPeriodService'
import type { AccountingPeriod } from '@/types/financial'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'

const { t } = useI18n()
const langStore = useLangStore()
const route = useRoute()
const router = useRouter()

const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const fiscalYearUlid = route.params.fiscalYearUlid as string

const periods = ref<AccountingPeriod[]>([])
const loading = ref(false)
const loadingAction = ref(false)

const confirmTarget = ref<AccountingPeriod | null>(null)
const showCloseModal = ref(false)
const showReopenModal = ref(false)
const showLockModal = ref(false)

function statusClass(status: string) {
    return {
        open: 'bg-success bg-opacity-10 text-success',
        closed: 'bg-warning bg-opacity-10 text-warning',
        locked: 'bg-danger bg-opacity-10 text-danger',
    }[status] ?? 'bg-secondary bg-opacity-10 text-secondary'
}

async function fetchData() {
    loading.value = true
    try {
        const res = await accountingPeriodService.getAll(fiscalYearUlid)
        periods.value = res.data
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loading.value = false
    }
}

onMounted(fetchData)

function goBack() {
    router.push('/settings/fiscal-years')
}

async function onGenerate() {
    loadingAction.value = true
    try {
        const res = await accountingPeriodService.generate(fiscalYearUlid)
        periods.value = res.data
        toast.value?.show(res.message ?? t('accountingPeriods.generatedSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loadingAction.value = false
    }
}

function confirmClose(p: AccountingPeriod) { confirmTarget.value = p; showCloseModal.value = true }
function confirmReopen(p: AccountingPeriod) { confirmTarget.value = p; showReopenModal.value = true }
function confirmLock(p: AccountingPeriod) { confirmTarget.value = p; showLockModal.value = true }

async function onCloseConfirmed() {
    if (!confirmTarget.value) return
    loadingAction.value = true
    try {
        const res = await accountingPeriodService.close(fiscalYearUlid, confirmTarget.value.ulid)
        const idx = periods.value.findIndex(p => p.ulid === confirmTarget.value!.ulid)
        if (idx !== -1) periods.value[idx] = res.data
        showCloseModal.value = false
        toast.value?.show(res.message ?? t('accountingPeriods.closedSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loadingAction.value = false
    }
}

async function onReopenConfirmed() {
    if (!confirmTarget.value) return
    loadingAction.value = true
    try {
        const res = await accountingPeriodService.reopen(fiscalYearUlid, confirmTarget.value.ulid)
        const idx = periods.value.findIndex(p => p.ulid === confirmTarget.value!.ulid)
        if (idx !== -1) periods.value[idx] = res.data
        showReopenModal.value = false
        toast.value?.show(res.message ?? t('accountingPeriods.reopenedSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loadingAction.value = false
    }
}

async function onLockConfirmed() {
    if (!confirmTarget.value) return
    loadingAction.value = true
    try {
        const res = await accountingPeriodService.lock(fiscalYearUlid, confirmTarget.value.ulid)
        const idx = periods.value.findIndex(p => p.ulid === confirmTarget.value!.ulid)
        if (idx !== -1) periods.value[idx] = res.data
        showLockModal.value = false
        toast.value?.show(res.message ?? t('accountingPeriods.lockedSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loadingAction.value = false
    }
}
</script>

<style scoped>
@keyframes pageIn {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

.header-icon-badge {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
}

.table-custom th {
    background: #f8f9fa;
    font-size: 0.83rem;
    font-weight: 700;
    color: #344054;
    white-space: nowrap;
    vertical-align: middle;
}

.table-custom td {
    font-size: 0.88rem;
    vertical-align: middle;
}

.action-icons .icon-action {
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.75;
    font-size: 0.95rem;
}

.action-icons .icon-action:hover {
    transform: scale(1.2);
    opacity: 1;
}

/* current period row */
.row-current td {
    background-color: #f0faf5 !important;
}
</style>

