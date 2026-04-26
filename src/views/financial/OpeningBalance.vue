<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge"><i class="fas fa-flag text-white"></i></div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('openingBalance.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home')
                        }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{
                            $t('sidebar.financial') }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('openingBalance.title') }}
                        </MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>
        </div>

        <!-- ══ Fiscal Year Selector ══ -->
        <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
            <MDBCardBody class="py-3 px-4">
                <MDBRow class="g-2 align-items-end">
                    <MDBCol md="4">
                        <label class="form-label fw-bold small">{{ $t('openingBalance.fiscalYear') }} <span
                                class="text-danger">*</span></label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                            <MDBSelect v-model="selectedFiscalYear" :options="fiscalYearOptions"
                                :placeholder="$t('openingBalance.fiscalYear')" height="44px" :dir="langStore.dir" @change="loadPreview" />
                        </div>
                    </MDBCol>
                    <MDBCol md="auto">
                        <MDBBtn color="primary" size="sm" class="rounded-3 fw-semibold" @click="loadPreview"
                            :disabled="!selectedFiscalYear || loadingPreview">
                            <span v-if="loadingPreview">
                                <MDBSpinner size="sm" class="me-1" />{{ $t('common.loading') }}
                            </span>
                            <span v-else><i class="fas fa-eye me-1"></i>{{ $t('openingBalance.preview') }}</span>
                        </MDBBtn>
                    </MDBCol>
                </MDBRow>
            </MDBCardBody>
        </MDBCard>

        <!-- ══ Preview ══ -->
        <template v-if="previewData">

            <!-- Status Banner -->
            <div class="rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
                :class="previewData.already_exists ? 'bg-success bg-opacity-25 border border-success' : 'bg-primary bg-opacity-25 border border-primary'">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-3 d-flex align-items-center justify-content-center"
                        :class="previewData.already_exists ? 'bg-success text-white' : 'bg-primary text-white'"
                        style="width:48px;height:48px;font-size:1.3rem;">
                        <i :class="previewData.already_exists ? 'fas fa-check-circle' : 'fas fa-flag'"></i>
                    </div>
                    <div>
                        <div class="fw-bold">{{ previewData.fiscal_year.name }}</div>
                        <div class="text-muted small">{{ previewData.fiscal_year.start_date }}</div>
                    </div>
                </div>
                <div class="d-flex gap-3">
                    <!-- Balance Summary -->
                    <div class="text-center px-3 py-2 rounded-3 bg-white">
                        <div class="text-muted small">{{ $t('accounts.debit') }}</div>
                        <div class="fw-bold text-primary font-monospace">{{ fmt(previewData.total_debit) }}</div>
                    </div>
                    <div class="text-center px-3 py-2 rounded-3 bg-white">
                        <div class="text-muted small">{{ $t('accounts.credit') }}</div>
                        <div class="fw-bold text-success font-monospace">{{ fmt(previewData.total_credit) }}</div>
                    </div>
                    <div class="text-center px-3 py-2 rounded-3 bg-white">
                        <div class="text-muted small">{{ $t('openingBalance.diff') }}</div>
                        <div class="fw-bold font-monospace"
                            :class="previewData.is_balanced ? 'text-success' : 'text-danger'">{{
                                fmt(previewData.difference) }}</div>
                    </div>
                </div>
            </div>

            <!-- Alerts -->
            <div v-if="previewData.already_exists"
                class="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4">
                <i class="fas fa-check-circle fa-lg flex-shrink-0"></i>
                <div>
                    <strong>{{ $t('openingBalance.alreadyExists') }}</strong>
                    <div class="small mt-1">{{ $t('openingBalance.alreadyExistsDesc') }}</div>
                </div>
                <MDBBtn outline="danger" size="sm" class="ms-auto flex-shrink-0" @click="confirmDeleteOpening = true">
                    <i class="fas fa-trash me-1"></i>{{ $t('openingBalance.delete') }}
                </MDBBtn>
            </div>

            <div v-if="!previewData.is_balanced"
                class="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
                <i class="fas fa-exclamation-triangle fa-lg flex-shrink-0"></i>
                <div>
                    <strong>{{ $t('openingBalance.unbalanced') }}</strong>
                    <div class="small mt-1">{{ $t('openingBalance.unbalancedDesc', {
                        diff: fmt(previewData.difference)
                    }) }}</div>
                </div>
            </div>

            <!-- Preview Table -->
            <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <MDBCardBody class="py-3 px-4 border-bottom">
                    <div class="fw-bold small text-muted text-uppercase" style="letter-spacing:.05em;">
                        <i class="fas fa-list me-2 text-primary"></i>
                        {{ $t('openingBalance.accounts', { count: previewData.accounts_count }) }}
                    </div>
                </MDBCardBody>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                        <thead>
                            <tr>
                                <th>{{ $t('accounts.code') }}</th>
                                <th>{{ $t('accounts.name') }}</th>
                                <th class="text-center">{{ $t('accounts.type') }}</th>
                                <th class="text-end">{{ $t('accounts.debit') }}</th>
                                <th class="text-end">{{ $t('accounts.credit') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="line in previewData.lines" :key="line.account_ulid">
                                <td class="font-monospace fw-bold text-primary small">{{ line.account_code }}</td>
                                <td class="small fw-semibold">{{ line.account_name }}</td>
                                <td class="text-center">
                                    <span class="badge rounded-pill px-2 small" :class="typeClass(line.account_type)">{{
                                        $t(`accounts.types.${line.account_type}`) }}</span>
                                </td>
                                <td class="text-end font-monospace small text-primary">{{ line.debit > 0 ?
                                    fmt(line.debit) : '—' }}</td>
                                <td class="text-end font-monospace small text-success">{{ line.credit > 0 ?
                                    fmt(line.credit) : '—' }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="table-light fw-bold">
                                <td colspan="3">{{ $t('common.total') }}</td>
                                <td class="text-end font-monospace text-primary">{{ fmt(previewData.total_debit) }}</td>
                                <td class="text-end font-monospace text-success">{{ fmt(previewData.total_credit) }}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </MDBCard>

            <!-- Generate Button -->
            <div v-if="!previewData.already_exists" class="d-flex justify-content-end">
                <MDBBtn color="success" size="sm" class="px-5 fw-bold rounded-3" @click="confirmGenerate = true"
                    :disabled="!previewData.is_balanced">
                    <i class="fas fa-rocket me-2"></i>{{ $t('openingBalance.generate') }}
                </MDBBtn>
            </div>
        </template>

        <!-- Empty state -->
        <div v-else-if="!loadingPreview" class="text-center py-5">
            <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                style="width:80px;height:80px;">
                <i class="fas fa-flag fa-2x text-muted"></i>
            </div>
            <div class="fw-semibold text-muted mb-2">{{ $t('openingBalance.selectYear') }}</div>
            <small class="text-muted">{{ $t('openingBalance.selectYearDesc') }}</small>
        </div>

        <!-- ══ Confirm Generate ══ -->
        <ConfirmModal v-model:show="confirmGenerate" type="success" icon="rocket"
            :title="$t('openingBalance.confirmTitle')" :message="$t('openingBalance.confirmMessage')"
            :confirm-label="$t('openingBalance.generate')" :loading="generating" @confirm="doGenerate" />

        <!-- ══ Confirm Delete ══ -->
        <ConfirmModal v-model:show="confirmDeleteOpening" type="danger" icon="trash-alt"
            :title="$t('openingBalance.deleteTitle')" :message="$t('openingBalance.deleteMessage')"
            :confirm-label="$t('common.delete')" :loading="deleting" @confirm="doDelete" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBSpinner,
    MDBBreadcrumb, MDBBreadcrumbItem,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { openingBalanceService } from '@/services/financialService'
import { useFiscalYearStore } from '@/stores/fiscalYearStore'
import { useLangStore } from '@/stores/langStore'
import type { OpeningBalancePreview } from '@/types/financial'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'

const { t } = useI18n()
const langStore = useLangStore()
const fyStore = useFiscalYearStore()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const selectedFiscalYear = ref('')
const previewData = ref<OpeningBalancePreview | null>(null)
const loadingPreview = ref(false)
const generating = ref(false)
const deleting = ref(false)
const confirmGenerate = ref(false)
const confirmDeleteOpening = ref(false)

onMounted(async () => {
    await fyStore.fetchAll()
    if (fyStore.currentId) { selectedFiscalYear.value = fyStore.currentId; await loadPreview() }
})

const fiscalYearOptions = computed(() => fyStore.years.map(y => ({ value: y.ulid, text: y.name })))

function fmt(val: number) {
    return (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function typeClass(type: string) {
    const m: Record<string, string> = {
        asset: 'bg-success bg-opacity-10 text-success',
        liability: 'bg-danger bg-opacity-10 text-danger',
        equity: 'bg-warning bg-opacity-10 text-warning',
        revenue: 'bg-info bg-opacity-10 text-info',
        expense: 'bg-secondary bg-opacity-10 text-secondary',
    }
    return m[type] ?? 'bg-light text-dark'
}

async function loadPreview() {
    if (!selectedFiscalYear.value) return
    loadingPreview.value = true; previewData.value = null
    try {
        const res = await openingBalanceService.preview(selectedFiscalYear.value)
        previewData.value = res.data
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { loadingPreview.value = false }
}

async function doGenerate() {
    generating.value = true
    try {
        await openingBalanceService.generate(selectedFiscalYear.value)
        confirmGenerate.value = false
        toast.value?.show(t('openingBalance.generatedSuccess'), 'success')
        await loadPreview()
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { generating.value = false }
}

async function doDelete() {
    deleting.value = true
    try {
        await openingBalanceService.destroy(selectedFiscalYear.value)
        confirmDeleteOpening.value = false
        toast.value?.show(t('openingBalance.deletedSuccess'), 'success')
        await loadPreview()
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { deleting.value = false }
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
</style>