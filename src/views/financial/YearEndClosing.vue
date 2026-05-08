<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge">
                    <i class="fas fa-flag-checkered text-white"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('yearEnd.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem>
                            <a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home') }}</a>
                        </MDBBreadcrumbItem>
                        <MDBBreadcrumbItem>
                            <a href="#" class="text-white-50 text-decoration-none">{{ $t('sidebar.financial') }}</a>
                        </MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('yearEnd.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>

            <!-- Status badge -->
            <div v-if="previewData" class="d-flex align-items-center gap-2">
                <span class="badge rounded-pill px-3 py-2 fs-6"
                    :class="previewData.is_balanced ? 'bg-success' : 'bg-danger'">
                    <i :class="previewData.is_balanced ? 'fas fa-check-circle me-1' : 'fas fa-times-circle me-1'"></i>
                    {{ previewData.is_balanced ? $t('yearEnd.balanced') : $t('yearEnd.unbalanced') }}
                </span>
            </div>
        </div>

        <!-- ══ Step 1: Setup ══ -->
        <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
            <MDBCardBody class="p-4">

                <!-- Step Title -->
                <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="step-badge step-badge--active">1</div>
                    <div>
                        <div class="fw-bold">{{ $t('yearEnd.step1Title') }}</div>
                        <div class="text-muted small">{{ $t('yearEnd.step1Desc') }}</div>
                    </div>
                </div>

                <MDBRow class="g-3">

                    <!-- Fiscal Year -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('yearEnd.fiscalYear') }}
                            <span class="text-danger ms-1">*</span>
                        </label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="fas fa-calendar-alt text-primary"></i>
                            </span>
                            <MDBSelect v-model="form.fiscal_year_id" :options="fiscalYearOptions"
                                :placeholder="$t('yearEnd.selectFiscalYear')" :dir="langStore.dir"
                                @change="resetPreview" />
                        </div>
                        <!-- Info about selected year -->
                        <div v-if="selectedFiscalYear" class="mt-2">
                            <span class="badge rounded-pill px-2 py-1 small"
                                :class="`bg-${selectedFiscalYear.status_color}`">
                                <i :class="`fas fa-${selectedFiscalYear.status_icon} me-1`"></i>
                                {{ selectedFiscalYear.status_label }}
                            </span>
                            <span class="text-muted small ms-2">
                                {{ selectedFiscalYear.start_date }} → {{ selectedFiscalYear.end_date }}
                            </span>
                        </div>
                    </MDBCol>

                    <!-- Retained Earnings Account -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('yearEnd.retainedEarnings') }}
                            <span class="text-danger ms-1">*</span>
                        </label>
                        <div class="input-group">
                            <span class="input-group-text bg-light">
                                <i class="fas fa-piggy-bank text-success"></i>
                            </span>
                            <MDBSelect v-model="form.retained_earnings_account_ulid" :options="accountOptions"
                                :placeholder="$t('yearEnd.selectAccount')" :dir="langStore.dir" filter
                                @change="resetPreview" />
                        </div>
                    </MDBCol>

                    <!-- Preview Button -->
                    <MDBCol md="auto" class="d-flex align-items-end">
                        <MDBBtn color="primary" size="sm" class="rounded-3 fw-semibold px-4" @click="loadPreview"
                            :disabled="!canPreview || loadingPreview">
                            <span v-if="loadingPreview" class="d-flex align-items-center gap-2">
                                <MDBSpinner size="sm" />{{ $t('common.loading') }}
                            </span>
                            <span v-else>
                                <i class="fas fa-search me-1"></i>{{ $t('yearEnd.preview') }}
                            </span>
                        </MDBBtn>
                    </MDBCol>

                </MDBRow>
            </MDBCardBody>
        </MDBCard>

        <!-- ══ Preview Section ══ -->
        <template v-if="previewData">

            <!-- ── Summary Cards ── -->
            <MDBRow class="g-3 mb-4">

                <MDBCol md="3">
                    <div class="summary-card summary-card--revenue">
                        <div class="summary-icon"><i class="fas fa-arrow-trend-up"></i></div>
                        <div class="summary-body">
                            <div class="summary-label">{{ $t('yearEnd.totalRevenues') }}</div>
                            <div class="summary-value text-success">{{ fmt(previewData.total_revenue) }}</div>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol md="3">
                    <div class="summary-card summary-card--expense">
                        <div class="summary-icon"><i class="fas fa-arrow-trend-down"></i></div>
                        <div class="summary-body">
                            <div class="summary-label">{{ $t('yearEnd.totalExpenses') }}</div>
                            <div class="summary-value text-danger">{{ fmt(previewData.total_expense) }}</div>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol md="3">
                    <div class="summary-card"
                        :class="previewData.is_profit ? 'summary-card--profit' : 'summary-card--loss'">
                        <div class="summary-icon">
                            <i :class="previewData.is_profit ? 'fas fa-trophy' : 'fas fa-exclamation-triangle'"></i>
                        </div>
                        <div class="summary-body">
                            <div class="summary-label">
                                {{ previewData.is_profit ? $t('yearEnd.netProfit') : $t('yearEnd.netLoss') }}
                            </div>
                            <div class="summary-value" :class="previewData.is_profit ? 'text-success' : 'text-danger'">
                                {{ fmt(previewData.net_income) }}
                            </div>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol md="3">
                    <div class="summary-card summary-card--accounts">
                        <div class="summary-icon"><i class="fas fa-list-check"></i></div>
                        <div class="summary-body">
                            <div class="summary-label">{{ $t('yearEnd.closingEntries') }}</div>
                            <div class="summary-value text-primary">{{ previewData.closing_lines?.length ?? 0 }}</div>
                        </div>
                    </div>
                </MDBCol>

            </MDBRow>

            <!-- ── Closing Entries Preview Table ── -->
            <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <MDBCardBody class="py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
                    <div class="fw-bold small text-muted text-uppercase" style="letter-spacing:.05em;">
                        <i class="fas fa-file-invoice me-2 text-primary"></i>
                        {{ $t('yearEnd.closingEntriesPreview') }}
                    </div>
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill small">
                        {{ previewData.closing_lines?.length ?? 0 }} {{ $t('yearEnd.lines') }}
                    </span>
                </MDBCardBody>

                <div class="table-responsive">
                    <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                        <thead>
                            <tr>
                                <th>{{ $t('accounts.code') }}</th>
                                <th>{{ $t('accounts.name') }}</th>
                                <th class="text-center">{{ $t('yearEnd.entryType') }}</th>
                                <th class="text-end">{{ $t('accounts.debit') }}</th>
                                <th class="text-end">{{ $t('accounts.credit') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="line in previewData.closing_lines" :key="line.account_ulid">
                                <td class="font-monospace fw-bold text-primary small">{{ line.account_code }}</td>
                                <td class="small fw-semibold">{{ line.account_name }}</td>
                                <td class="text-center">
                                    <span class="badge rounded-pill px-2 small" :class="line.entry_type === 'revenue'
                                        ? 'bg-success bg-opacity-10 text-success'
                                        : line.entry_type === 'expense'
                                            ? 'bg-danger bg-opacity-10 text-danger'
                                            : 'bg-primary bg-opacity-10 text-primary'">
                                        {{ $t(`yearEnd.types.${line.entry_type}`) }}
                                    </span>
                                </td>
                                <td class="text-end font-monospace small text-primary">
                                    {{ line.debit > 0 ? fmt(line.debit) : '—' }}
                                </td>
                                <td class="text-end font-monospace small text-success">
                                    {{ line.credit > 0 ? fmt(line.credit) : '—' }}
                                </td>
                            </tr>

                            <!-- Net Income / Net Loss line -->
                            <tr class="table-secondary fw-semibold">
                                <td class="font-monospace small" colspan="2">
                                    {{ previewData.retained_earnings_account?.code }}
                                    — {{ previewData.retained_earnings_account?.name }}
                                </td>
                                <td class="text-center">
                                    <span class="badge rounded-pill px-2 small bg-warning bg-opacity-10 text-warning">
                                        {{ $t('yearEnd.types.retained_earnings') }}
                                    </span>
                                </td>
                                <td class="text-end font-monospace small text-primary">
                                    {{ !previewData.is_profit ? fmt(previewData.net_income) : '—' }}
                                </td>
                                <td class="text-end font-monospace small text-success">
                                    {{ previewData.is_profit ? fmt(previewData.net_income) : '—' }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="table-dark fw-bold">
                                <td colspan="3">{{ $t('common.total') }}</td>
                                <td class="text-end font-monospace">{{ fmt(previewData.total_debit) }}</td>
                                <td class="text-end font-monospace">{{ fmt(previewData.total_credit) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </MDBCard>

            <!-- ══ Step 2: Options ══ -->
            <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
                <MDBCardBody class="p-4">

                    <!-- Step Title -->
                    <div class="d-flex align-items-center gap-3 mb-4">
                        <div class="step-badge"
                            :class="previewData.is_balanced ? 'step-badge--active' : 'step-badge--disabled'">
                            2
                        </div>
                        <div>
                            <div class="fw-bold">{{ $t('yearEnd.step2Title') }}</div>
                            <div class="text-muted small">{{ $t('yearEnd.step2Desc') }}</div>
                        </div>
                    </div>

                    <!-- Carry Forward Toggle -->
                    <div class="option-card d-flex align-items-start gap-3 p-3 rounded-3 border mb-3"
                        :class="{ 'option-card--active': form.carry_forward_to_new_year }">
                        <MDBSwitch v-model="form.carry_forward_to_new_year" class="mt-1 flex-shrink-0" />
                        <div class="flex-grow-1">
                            <div class="fw-semibold small">{{ $t('yearEnd.carryForward') }}</div>
                            <div class="text-muted" style="font-size:0.78rem;">
                                {{ $t('yearEnd.carryForwardDesc') }}
                            </div>

                            <!-- New Fiscal Year Selector -->
                            <Transition name="fade-slide">
                                <div v-if="form.carry_forward_to_new_year" class="mt-3">
                                    <label class="form-label fw-semibold small">
                                        {{ $t('yearEnd.newFiscalYear') }}
                                        <span class="text-danger ms-1">*</span>
                                    </label>
                                    <div class="input-group" style="max-width:400px;">
                                        <span class="input-group-text bg-light">
                                            <i class="fas fa-calendar-plus text-success"></i>
                                        </span>
                                        <MDBSelect v-model="form.new_fiscal_year_ulid" :options="nextFiscalYearOptions"
                                            :placeholder="$t('yearEnd.selectNewYear')" :dir="langStore.dir" />
                                    </div>
                                    <div class="text-muted mt-1" style="font-size:0.75rem;">
                                        <i class="fas fa-info-circle me-1 text-info"></i>
                                        {{ $t('yearEnd.carryForwardHint') }}
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <!-- Warning: Unbalanced -->
                    <div v-if="!previewData.is_balanced"
                        class="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-0 py-2 px-3 small">
                        <i class="fas fa-exclamation-triangle flex-shrink-0 fa-lg"></i>
                        <div>
                            <strong>{{ $t('yearEnd.cannotExecute') }}</strong>
                            {{ $t('yearEnd.unbalancedDesc') }}
                        </div>
                    </div>

                    <!-- Warning: Already Closed -->
                    <div v-if="previewData.already_closed"
                        class="alert alert-warning d-flex align-items-center gap-2 rounded-3 mb-0 py-2 px-3 small">
                        <i class="fas fa-exclamation-circle flex-shrink-0 fa-lg"></i>
                        <div>
                            <strong>{{ $t('yearEnd.alreadyClosed') }}</strong>
                            {{ $t('yearEnd.alreadyClosedDesc') }}
                        </div>
                    </div>

                </MDBCardBody>
            </MDBCard>

            <!-- ══ Step 3: Execute ══ -->
            <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
                <MDBCardBody class="p-4">

                    <!-- Step Title -->
                    <div class="d-flex align-items-center gap-3 mb-4">
                        <div class="step-badge" :class="previewData.is_balanced && !previewData.already_closed
                            ? 'step-badge--execute'
                            : 'step-badge--disabled'">
                            3
                        </div>
                        <div>
                            <div class="fw-bold">{{ $t('yearEnd.step3Title') }}</div>
                            <div class="text-muted small">{{ $t('yearEnd.step3Desc') }}</div>
                        </div>
                    </div>

                    <!-- Execute summary box -->
                    <div class="execute-summary rounded-3 p-3 mb-4">
                        <div class="row g-2 align-items-center small">
                            <div class="col-md-4 d-flex align-items-center gap-2">
                                <i class="fas fa-calendar-alt text-primary"></i>
                                <span class="text-muted">{{ $t('yearEnd.closingYear') }}:</span>
                                <strong>{{ selectedFiscalYear?.name ?? '—' }}</strong>
                            </div>
                            <div class="col-md-4 d-flex align-items-center gap-2">
                                <i class="fas fa-piggy-bank text-success"></i>
                                <span class="text-muted">{{ $t('yearEnd.retainedAccount') }}:</span>
                                <strong>{{ selectedRetainedAccount?.text ?? '—' }}</strong>
                            </div>
                            <div class="col-md-4 d-flex align-items-center gap-2">
                                <i
                                    :class="form.carry_forward_to_new_year ? 'fas fa-arrow-right text-info' : 'fas fa-times text-muted'"></i>
                                <span class="text-muted">{{ $t('yearEnd.carryForward') }}:</span>
                                <strong>
                                    {{ form.carry_forward_to_new_year
                                        ? (selectedNewYear?.text ?? $t('common.yes'))
                                    : $t('common.no') }}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <!-- Execute Button -->
                    <div class="d-flex justify-content-end gap-3">
                        <MDBBtn outline="secondary" size="sm" class="px-4 rounded-3" @click="resetAll">
                            <i class="fas fa-undo me-1"></i>{{ $t('common.reset') }}
                        </MDBBtn>
                        <MDBBtn color="success" size="sm" class="px-5 fw-bold rounded-3 execute-btn"
                            @click="showExecuteModal = true" :disabled="!canExecute">
                            <i class="fas fa-flag-checkered me-2"></i>
                            {{ $t('yearEnd.execute') }}
                        </MDBBtn>
                    </div>

                </MDBCardBody>
            </MDBCard>

        </template>

        <!-- ══ Empty state ══ -->
        <div v-else-if="!loadingPreview" class="text-center py-5">
            <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                style="width:80px;height:80px;">
                <i class="fas fa-flag-checkered fa-2x text-muted"></i>
            </div>
            <div class="fw-semibold text-muted mb-1">{{ $t('yearEnd.selectToPreview') }}</div>
            <small class="text-muted">{{ $t('yearEnd.selectToPreviewDesc') }}</small>
        </div>

        <!-- ══ Result Card (بعد التنفيذ) ══ -->
        <Transition name="fade-slide">
            <MDBCard v-if="executeResult" class="border-0 shadow-sm rounded-4 overflow-hidden result-card">
                <div class="p-4" style="background: linear-gradient(135deg, #1d7342, #16a34a);">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle bg-white d-flex align-items-center justify-content-center"
                            style="width:56px;height:56px;flex-shrink:0;">
                            <i class="fas fa-check-circle text-success fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold text-white mb-1">{{ $t('yearEnd.executeSuccess') }}</h5>
                            <div class="text-white-50 small">
                                {{ $t('yearEnd.executeSuccessDesc', { name: executeResult.fiscal_year?.name }) }}
                            </div>
                        </div>
                    </div>
                </div>
                <MDBCardBody class="p-4">
                    <MDBRow class="g-3">
                        <MDBCol md="4">
                            <div class="result-item">
                                <div class="result-label">{{ $t('yearEnd.closingEntry') }}</div>
                                <div class="result-value font-monospace text-primary">
                                    {{ executeResult.closing_entry?.number ?? '—' }}
                                </div>
                            </div>
                        </MDBCol>
                        <MDBCol md="4">
                            <div class="result-item">
                                <div class="result-label">{{ $t('fiscalYears.status.label') }}</div>
                                <div class="result-value">
                                    <span class="badge bg-warning rounded-pill px-2">
                                        {{ executeResult.fiscal_year?.status }}
                                    </span>
                                </div>
                            </div>
                        </MDBCol>
                        <MDBCol md="4" v-if="executeResult.carry_forward">
                            <div class="result-item">
                                <div class="result-label">{{ $t('yearEnd.carriedAccounts') }}</div>
                                <div class="result-value text-success fw-bold">
                                    {{ executeResult.carry_forward?.accounts_carried ?? 0 }}
                                    {{ $t('yearEnd.accounts') }}
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </Transition>

        <!-- ══ Confirm Execute Modal ══ -->
        <ConfirmModal v-model:show="showExecuteModal" type="success" icon="flag-checkered"
            :title="$t('yearEnd.confirmTitle')"
            :message="$t('yearEnd.confirmMessage', { name: selectedFiscalYear?.name })"
            :confirm-label="$t('yearEnd.execute')" :loading="executing" @confirm="doExecute" />

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBSpinner, MDBSwitch,
    MDBBreadcrumb, MDBBreadcrumbItem,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { yearEndService, accountService } from '@/services/financialService'
import { useFiscalYearStore } from '@/stores/fiscalYearStore'
import { useLangStore } from '@/stores/langStore'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'

const { t } = useI18n()
const langStore = useLangStore()
const fyStore = useFiscalYearStore()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

// ── State ────────────────────────────────────────────────────────
const accountOptions = ref<{ value: string; text: string }[]>([])
const loadingPreview = ref(false)
const executing = ref(false)
const showExecuteModal = ref(false)
const previewData = ref<any>(null)
const executeResult = ref<any>(null)

const form = ref({
    fiscal_year_id: '',
    retained_earnings_account_ulid: '',
    carry_forward_to_new_year: false,
    new_fiscal_year_ulid: '',
})

// ── Lifecycle ─────────────────────────────────────────────────────
onMounted(async () => {
    await fyStore.fetchAll()

    // تحميل حسابات دفتر الأستاذ (حقوق الملكية فقط للأرباح المحتجزة)
    try {
        const accounts = await accountService.getDropdown({ allow_posting: true, type: 'equity' })
        accountOptions.value = accounts.map((a: any) => ({
            value: a.ulid,
            text: `${a.code} — ${a.name}`,
        }))
    } catch {
        // fallback: كل الحسابات
        const accounts = await accountService.getDropdown({ allow_posting: true })
        accountOptions.value = accounts.map((a: any) => ({
            value: a.ulid,
            text: `${a.code} — ${a.name}`,
        }))
    }

    // تعيين السنة الحالية تلقائياً
    if (fyStore.currentId) {
        form.value.fiscal_year_id = fyStore.currentId
    }
})

// ── Computed ──────────────────────────────────────────────────────
const fiscalYearOptions = computed(() =>
    fyStore.years.map(y => ({ value: y.ulid, text: y.name }))
)

/** السنوات المتاحة للترحيل إليها (غير السنة المختارة + مفتوحة أو بعدها) */
const nextFiscalYearOptions = computed(() =>
    fyStore.years
        .filter(y => y.ulid !== form.value.fiscal_year_id)
        .map(y => ({ value: y.ulid, text: y.name }))
)

const selectedFiscalYear = computed(() =>
    fyStore.years.find(y => y.ulid === form.value.fiscal_year_id) ?? null
)

const selectedRetainedAccount = computed(() =>
    accountOptions.value.find(a => a.value === form.value.retained_earnings_account_ulid) ?? null
)

const selectedNewYear = computed(() =>
    nextFiscalYearOptions.value.find(y => y.value === form.value.new_fiscal_year_ulid) ?? null
)

const canPreview = computed(() =>
    !!form.value.fiscal_year_id && !!form.value.retained_earnings_account_ulid
)

const canExecute = computed(() => {
    if (!previewData.value) return false
    if (!previewData.value.is_balanced) return false
    if (previewData.value.already_closed) return false
    if (form.value.carry_forward_to_new_year && !form.value.new_fiscal_year_ulid) return false
    return true
})

// ── Helpers ───────────────────────────────────────────────────────
function fmt(val: number | undefined | null) {
    return (val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function resetPreview() {
    previewData.value = null
    executeResult.value = null
}

function resetAll() {
    resetPreview()
    form.value = {
        fiscal_year_id: fyStore.currentId ?? '',
        retained_earnings_account_ulid: '',
        carry_forward_to_new_year: false,
        new_fiscal_year_ulid: '',
    }
}

// ── Preview ───────────────────────────────────────────────────────
async function loadPreview() {
    if (!canPreview.value) return
    loadingPreview.value = true
    previewData.value = null
    executeResult.value = null

    try {
        const res = await yearEndService.preview(
            form.value.fiscal_year_id,
            form.value.retained_earnings_account_ulid
        )
        previewData.value = res.data
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loadingPreview.value = false
    }
}

// ── Execute ───────────────────────────────────────────────────────
async function doExecute() {
    executing.value = true
    try {
        const res = await yearEndService.execute(form.value.fiscal_year_id, {
            retained_earnings_account_ulid: form.value.retained_earnings_account_ulid,
            carry_forward_to_new_year: form.value.carry_forward_to_new_year,
            new_fiscal_year_ulid: form.value.new_fiscal_year_ulid || undefined,
        })

        executeResult.value = res.data
        showExecuteModal.value = false
        previewData.value = null

        // تحديث قائمة السنوات في الـ store
        await fyStore.fetchAll()

        toast.value?.show(res.message ?? t('yearEnd.executeSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        executing.value = false
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

/* ── Header icon ── */
.header-icon-badge {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: rgba(255, 255, 255, .15);
    border: 1px solid rgba(255, 255, 255, .25);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ── Step badges ── */
.step-badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1rem;
    flex-shrink: 0;
    transition: all .2s;
}

.step-badge--active {
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    box-shadow: 0 4px 12px rgba(29, 51, 79, .25);
}

.step-badge--execute {
    background: linear-gradient(135deg, #1d7342, #16a34a);
    color: #fff;
    box-shadow: 0 4px 12px rgba(29, 115, 66, .25);
}

.step-badge--disabled {
    background: #e9ecef;
    color: #adb5bd;
}

/* ── Summary Cards ── */
.summary-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    border: 1px solid transparent;
}

.summary-card--revenue {
    background: #f0faf5;
    border-color: #c3e6d0;
}

.summary-card--expense {
    background: #fff5f5;
    border-color: #f5c2c7;
}

.summary-card--profit {
    background: #f0faf5;
    border-color: #c3e6d0;
}

.summary-card--loss {
    background: #fff5f5;
    border-color: #f5c2c7;
}

.summary-card--accounts {
    background: #f0f6ff;
    border-color: #b6d4fe;
}

.summary-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255, 255, 255, .8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.summary-label {
    font-size: .75rem;
    color: #6c757d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .04em;
}

.summary-value {
    font-size: 1.1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
}

/* ── Option Card ── */
.option-card {
    background: #f8f9fa;
    transition: background .2s, border-color .2s;
    cursor: default;
}

.option-card--active {
    background: #e8f5ee;
    border-color: #1d7342 !important;
}

/* ── Execute Summary ── */
.execute-summary {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
}

/* ── Execute Button ── */
.execute-btn {
    background: linear-gradient(135deg, #1d7342, #16a34a) !important;
    border-color: transparent !important;
    box-shadow: 0 4px 15px rgba(29, 115, 66, .3);
    transition: transform .2s, box-shadow .2s;
}

.execute-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(29, 115, 66, .4);
}

.execute-btn:disabled {
    opacity: .6;
    box-shadow: none;
}

/* ── Table ── */
.table-custom th {
    background: #f8f9fa;
    font-size: .83rem;
    font-weight: 700;
    color: #344054;
    white-space: nowrap;
    vertical-align: middle;
}

.table-custom td {
    font-size: .88rem;
    vertical-align: middle;
}

/* ── Result Card ── */
.result-card {
    border: 2px solid #1d7342 !important;
}

.result-item {
    padding: .75rem 1rem;
    border-radius: .75rem;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
}

.result-label {
    font-size: .72rem;
    color: #6c757d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .04em;
    margin-bottom: .25rem;
}

.result-value {
    font-size: .95rem;
    font-weight: 700;
    color: #1d334f;
}

/* ── Transitions ── */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity .3s, transform .3s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>