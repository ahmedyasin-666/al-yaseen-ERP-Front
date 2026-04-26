<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge">
                    <i class="fas fa-chart-bar text-white"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('reports.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home')
                        }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{
                            $t('sidebar.financial') }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('reports.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>
            <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="printReport">
                <i class="fas fa-print me-1"></i>{{ $t('reports.print') }}
            </MDBBtn>
        </div>

        <!-- ══ Report Type Tabs ══ -->
        <div class="report-tab-bar mb-4">
            <button v-for="tab in reportTabs" :key="tab.key" class="report-tab-btn"
                :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key; reportData = null">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- ══ Filters Bar ══ -->
        <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
            <MDBCardBody class="py-3 px-4">
                <MDBRow class="g-2 align-items-end">
                    <MDBCol md="3">
                        <label class="form-label fw-bold small">{{ $t('reports.fiscalYear') }} <span
                                class="text-danger">*</span></label>
                        <div class="input-group ">
                            <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                            <MDBSelect v-model="filters.fiscal_year_id" :options="fiscalYearOptions"
                                :placeholder="$t('reports.fiscalYear')" :dir="langStore.dir"  />
                        </div>
                    </MDBCol>
                    <!-- Date range — only for Trial Balance & General Ledger -->
                    <template v-if="activeTab === 'trial_balance' || activeTab === 'general_ledger'">
                        <MDBCol md="2">
                            <label class="form-label fw-bold small">{{ $t('reports.dateFrom') }}</label>
                            <input v-model="filters.date_from" type="date" class="form-control" dir="ltr" />
                        </MDBCol>
                        <MDBCol md="2">
                            <label class="form-label fw-bold small">{{ $t('reports.dateTo') }}</label>
                            <input v-model="filters.date_to" type="date" class="form-control" dir="ltr" />
                        </MDBCol>
                    </template>
                    <!-- Account for General Ledger -->
                    <MDBCol md="3" v-if="activeTab === 'general_ledger'">
                        <label class="form-label fw-bold small">{{ $t('reports.account') }} <span
                                class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-sitemap"></i></span>
                            <MDBSelect v-model="filters.account_ulid" :options="accountOptions"
                                :placeholder="$t('reports.account')" :dir="langStore.dir" filter />
                        </div>
                    </MDBCol>
                    <MDBCol md="auto" class="ms-auto d-flex gap-2">
                        <MDBBtn color="primary" size="sm" class="rounded-3 fw-semibold" @click="loadReport"
                            :disabled="loading">
                            <span v-if="loading">
                                <MDBSpinner size="sm" class="me-1" />{{ $t('common.loading') }}
                            </span>
                            <span v-else><i class="fas fa-chart-bar me-1"></i>{{ $t('reports.generate') }}</span>
                        </MDBBtn>
                        <MDBBtn outline="secondary" size="sm" class="rounded-3" @click="clearReport">
                            <MDBIcon icon="undo" />
                        </MDBBtn>
                    </MDBCol>
                </MDBRow>
            </MDBCardBody>
        </MDBCard>

        <!-- ══ Report Content ══ -->
        <div v-if="reportData" class="report-wrapper" ref="printArea">

            <!-- ── Header ── -->
            <div class="report-header rounded-4 p-4 mb-4"
                style="background:linear-gradient(135deg,#1d334f 0%,#1d7342 100%);">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h5 class="fw-bold text-white mb-1">{{ currentTabLabel }}</h5>
                        <div class="text-white small d-flex gap-3 flex-wrap">
                            <span><i class="fas fa-calendar me-1"></i>{{ reportData.fiscal_year?.name }}</span>
                            <span v-if="reportData.filters?.date_from"><i class="fas fa-filter me-1"></i>{{
                                reportData.filters.date_from }} → {{ reportData.filters.date_to }}</span>
                        </div>
                    </div>
                    <div class="d-flex gap-3 text-white">
                        <div v-if="activeTab === 'trial_balance'" class="text-center">
                            <div class="small opacity-75">{{ $t('reports.balanced') }}</div>
                            <div class="fw-bold">
                                <i :class="reportData.is_balanced ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'"
                                    class="fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Trial Balance ── -->
            <template v-if="activeTab === 'trial_balance'">
                <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                            <thead>
                                <tr>
                                    <th>{{ $t('reports.tb.account') }}</th>
                                    <th class="text-center">{{ $t('accounts.type') }}</th>
                                    <th class="text-end">{{ $t('reports.tb.openingDebit') }}</th>
                                    <th class="text-end">{{ $t('reports.tb.openingCredit') }}</th>
                                    <th class="text-end">{{ $t('reports.tb.periodDebit') }}</th>
                                    <th class="text-end">{{ $t('reports.tb.periodCredit') }}</th>
                                    <th class="text-end">{{ $t('reports.tb.closingDebit') }}</th>
                                    <th class="text-end">{{ $t('reports.tb.closingCredit') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="line in reportData.lines" :key="line.account_ulid">
                                    <td>
                                        <div class="fw-semibold small">{{ line.account_code }}</div>
                                        <div class="text-muted small">{{ line.account_name }}</div>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge rounded-pill px-2 small"
                                            :class="typeClass(line.account_type)">{{
                                                $t(`accounts.types.${line.account_type}`) }}</span>
                                    </td>
                                    <td class="text-end font-monospace small">{{ fmt(line.opening_debit) }}</td>
                                    <td class="text-end font-monospace small">{{ fmt(line.opening_credit) }}</td>
                                    <td class="text-end font-monospace small text-primary">{{ fmt(line.period_debit) }}
                                    </td>
                                    <td class="text-end font-monospace small text-success">{{ fmt(line.period_credit) }}
                                    </td>
                                    <td class="text-end font-monospace small fw-bold">{{ fmt(line.closing_debit) }}</td>
                                    <td class="text-end font-monospace small fw-bold">{{ fmt(line.closing_credit) }}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="table-dark fw-bold">
                                    <td colspan="2">{{ $t('common.total') }}</td>
                                    <td class="text-end font-monospace">{{ fmt(reportData.totals.opening_debit) }}</td>
                                    <td class="text-end font-monospace">{{ fmt(reportData.totals.opening_credit) }}</td>
                                    <td class="text-end font-monospace text-primary">{{
                                        fmt(reportData.totals.period_debit) }}</td>
                                    <td class="text-end font-monospace text-success">{{
                                        fmt(reportData.totals.period_credit) }}</td>
                                    <td class="text-end font-monospace">{{ fmt(reportData.totals.closing_debit) }}</td>
                                    <td class="text-end font-monospace">{{ fmt(reportData.totals.closing_credit) }}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </MDBCard>
            </template>

            <!-- ── General Ledger ── -->
            <template v-else-if="activeTab === 'general_ledger'">
                <!-- Account info -->
                <MDBRow class="g-3 mb-4">
                    <MDBCol md="3" v-for="info in ledgerAccountInfo" :key="info.label">
                        <div class="p-3 rounded-3 border bg-light">
                            <div class="text-muted small mb-1">{{ info.label }}</div>
                            <div class="fw-semibold font-monospace small">{{ info.value }}</div>
                        </div>
                    </MDBCol>
                </MDBRow>
                <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                            <thead>
                                <tr>
                                    <th>{{ $t('reports.gl.number') }}</th>
                                    <th>{{ $t('reports.gl.date') }}</th>
                                    <th>{{ $t('reports.gl.journal') }}</th>
                                    <th>{{ $t('reports.gl.description') }}</th>
                                    <th class="text-end">{{ $t('accounts.debit') }}</th>
                                    <th class="text-end">{{ $t('accounts.credit') }}</th>
                                    <th class="text-end">{{ $t('reports.gl.balance') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="line in reportData.lines" :key="line.number + line.date">
                                    <td class="font-monospace small text-primary fw-semibold">{{ line.number }}</td>
                                    <td class="small text-nowrap">{{ line.date }}</td>
                                    <td class="small">{{ line.journal }}</td>
                                    <td class="small text-muted">{{ line.description ?? '—' }}</td>
                                    <td class="text-end font-monospace small">{{ line.debit > 0 ? fmt(line.debit) : '—'
                                    }}</td>
                                    <td class="text-end font-monospace small">{{ line.credit > 0 ? fmt(line.credit) :
                                        '—' }}</td>
                                    <td class="text-end font-monospace small fw-bold">
                                        {{ fmt(line.balance) }}
                                        <span class="badge rounded-pill ms-1 small"
                                            :class="line.balance_side === 'debit' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-success bg-opacity-10 text-success'">
                                            {{ line.balance_side === 'debit' ? $t('accounts.debit') :
                                                $t('accounts.credit') }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="table-dark fw-bold">
                                    <td colspan="4">{{ $t('common.total') }}</td>
                                    <td class="text-end font-monospace text-primary">{{
                                        fmt(reportData.totals.total_debit) }}</td>
                                    <td class="text-end font-monospace text-success">{{
                                        fmt(reportData.totals.total_credit) }}</td>
                                    <td class="text-end font-monospace">{{ fmt(reportData.totals.closing_balance) }}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </MDBCard>
            </template>

            <!-- ── Income Statement ── -->
            <template v-else-if="activeTab === 'income_statement'">
                <MDBRow class="g-4">
                    <!-- Revenues -->
                    <MDBCol md="6">
                        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                            <MDBCardBody class="p-0">
                                <div class="p-3 d-flex align-items-center gap-2"
                                    style="background:#e8f5ee;border-bottom:2px solid #1d7342;">
                                    <i class="fas fa-arrow-trend-up text-success"></i>
                                    <span class="fw-bold text-success">{{ $t('reports.is.revenues') }}</span>
                                </div>
                                <table class="table table-bordered table-sm align-middle mb-0">
                                    <tbody>
                                        <tr v-for="r in reportData.revenues" :key="r.account_ulid">
                                            <td class="small">
                                                <div class="fw-semibold">{{ r.account_code }}</div>
                                                <div class="text-muted">{{ r.account_name }}</div>
                                            </td>
                                            <td class="text-end font-monospace fw-bold text-success small">{{
                                                fmt(r.balance) }}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr style="background:#e8f5ee;">
                                            <td class="fw-bold small">{{ $t('reports.is.totalRevenues') }}</td>
                                            <td class="text-end font-monospace fw-bold text-success">{{
                                                fmt(reportData.total_revenue) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <!-- Expenses -->
                    <MDBCol md="6">
                        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                            <MDBCardBody class="p-0">
                                <div class="p-3 d-flex align-items-center gap-2"
                                    style="background:#fee2e2;border-bottom:2px solid #dc2626;">
                                    <i class="fas fa-arrow-trend-down text-danger"></i>
                                    <span class="fw-bold text-danger">{{ $t('reports.is.expenses') }}</span>
                                </div>
                                <table class="table table-bordered table-sm align-middle mb-0">
                                    <tbody>
                                        <tr v-for="e in reportData.expenses" :key="e.account_ulid">
                                            <td class="small">
                                                <div class="fw-semibold">{{ e.account_code }}</div>
                                                <div class="text-muted">{{ e.account_name }}</div>
                                            </td>
                                            <td class="text-end font-monospace fw-bold text-danger small">{{
                                                fmt(e.balance) }}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr style="background:#fee2e2;">
                                            <td class="fw-bold small">{{ $t('reports.is.totalExpenses') }}</td>
                                            <td class="text-end font-monospace fw-bold text-danger">{{
                                                fmt(reportData.total_expense) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <!-- Net Income -->
                    <MDBCol md="12">
                        <div class="net-income-card rounded-4 p-4 d-flex align-items-center justify-content-between"
                            :class="reportData.is_profit ? 'profit-card' : 'loss-card'">
                            <div>
                                <div class="fw-bold fs-5 text-white">
                                    <i :class="reportData.is_profit ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down'"
                                        class="me-2"></i>
                                    {{ reportData.is_profit ? $t('reports.is.netProfit') : $t('reports.is.netLoss') }}
                                </div>
                                <div class="text-white opacity-75 small">{{ reportData.fiscal_year?.name }}</div>
                            </div>
                            <div class="text-white fw-bold fs-2 font-monospace">{{ fmt(reportData.net_income) }}</div>
                        </div>
                    </MDBCol>
                </MDBRow>
            </template>

            <!-- ── Balance Sheet ── -->
            <template v-else-if="activeTab === 'balance_sheet'">
                <MDBRow class="g-4">
                    <!-- Assets -->
                    <MDBCol md="6">
                        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
                            <MDBCardBody class="p-0">
                                <div class="p-3" style="background:linear-gradient(135deg,#1d334f,#2563eb);">
                                    <span class="fw-bold text-white"><i class="fas fa-coins me-2"></i>{{
                                        $t('reports.bs.assets') }}</span>
                                </div>
                                <table class="table table-bordered table-sm align-middle mb-0">
                                    <tbody>
                                        <tr v-for="a in reportData.assets" :key="a.account_ulid">
                                            <td class="small">
                                                <div class="fw-semibold">{{ a.account_code }}</div>
                                                <div class="text-muted">{{ a.account_name }}</div>
                                            </td>
                                            <td class="text-end font-monospace fw-bold text-primary small">{{
                                                fmt(a.balance) }}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr class="table-primary">
                                            <td class="fw-bold small">{{ $t('reports.bs.totalAssets') }}</td>
                                            <td class="text-end font-monospace fw-bold text-primary">{{
                                                fmt(reportData.total_assets) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <!-- Liabilities + Equity -->
                    <MDBCol md="6">
                        <!-- Liabilities -->
                        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <MDBCardBody class="p-0">
                                <div class="p-3" style="background:linear-gradient(135deg,#dc2626,#ef4444);">
                                    <span class="fw-bold text-white"><i class="fas fa-hand-holding-usd me-2"></i>{{
                                        $t('reports.bs.liabilities') }}</span>
                                </div>
                                <table class="table table-bordered table-sm align-middle mb-0">
                                    <tbody>
                                        <tr v-for="l in reportData.liabilities" :key="l.account_ulid">
                                            <td class="small">
                                                <div class="fw-semibold">{{ l.account_code }}</div>
                                                <div class="text-muted">{{ l.account_name }}</div>
                                            </td>
                                            <td class="text-end font-monospace fw-bold text-danger small">{{
                                                fmt(l.balance) }}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr class="table-danger">
                                            <td class="fw-bold small">{{ $t('reports.bs.totalLiabilities') }}</td>
                                            <td class="text-end font-monospace fw-bold text-danger">{{
                                                fmt(reportData.total_liabilities) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </MDBCardBody>
                        </MDBCard>
                        <!-- Equity -->
                        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
                            <MDBCardBody class="p-0">
                                <div class="p-3" style="background:linear-gradient(135deg,#1d7342,#16a34a);">
                                    <span class="fw-bold text-white"><i class="fas fa-piggy-bank me-2"></i>{{
                                        $t('reports.bs.equity') }}</span>
                                </div>
                                <table class="table table-bordered table-sm align-middle mb-0">
                                    <tbody>
                                        <tr v-for="e in reportData.equity" :key="e.account_ulid">
                                            <td class="small">
                                                <div class="fw-semibold">{{ e.account_code }}</div>
                                                <div class="text-muted">{{ e.account_name }}</div>
                                            </td>
                                            <td class="text-end font-monospace fw-bold text-success small">{{
                                                fmt(e.balance) }}</td>
                                        </tr>
                                        <tr class="bg-light">
                                            <td class="small text-muted">{{ $t('reports.bs.netIncome') }}</td>
                                            <td class="text-end font-monospace small"
                                                :class="reportData.net_income_in_equity >= 0 ? 'text-success' : 'text-danger'">
                                                {{ fmt(reportData.net_income_in_equity) }}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr class="table-success">
                                            <td class="fw-bold small">{{ $t('reports.bs.totalEquity') }}</td>
                                            <td class="text-end font-monospace fw-bold text-success">{{
                                                fmt(reportData.total_equity_with_income) }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <!-- Balance check -->
                    <MDBCol md="12">
                        <div class="rounded-3 p-3 d-flex align-items-center justify-content-between"
                            :class="reportData.is_balanced ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'">
                            <div class="fw-bold small">
                                <i :class="reportData.is_balanced ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'"
                                    class="me-2 fa-lg"></i>
                                {{ reportData.is_balanced ? $t('reports.bs.balanced') : $t('reports.bs.unbalanced') }}
                            </div>
                            <div class="d-flex gap-4 font-monospace small">
                                <span>{{ $t('reports.bs.assets') }}: <strong>{{ fmt(reportData.total_assets)
                                }}</strong></span>
                                <span>=</span>
                                <span>{{ $t('reports.bs.liabilitiesEquity') }}: <strong>{{
                                    fmt(reportData.total_liabilities_and_equity) }}</strong></span>
                            </div>
                        </div>
                    </MDBCol>
                </MDBRow>
            </template>
        </div>

        <!-- Empty state -->
        <div v-else-if="!loading" class="text-center py-5">
            <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                style="width:80px;height:80px;">
                <i class="fas fa-chart-bar fa-2x text-muted"></i>
            </div>
            <div class="fw-semibold text-muted mb-2">{{ $t('reports.selectAndGenerate') }}</div>
            <small class="text-muted">{{ $t('reports.selectFiscalYear') }}</small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBIcon,
    MDBSpinner, MDBBreadcrumb, MDBBreadcrumbItem,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { reportService, accountService } from '@/services/financialService'
import { useFiscalYearStore } from '@/stores/fiscalYearStore'
import { useLangStore } from '@/stores/langStore'
import ToastNotification from '@/components/shared/ToastNotification.vue'

const { t } = useI18n()
const langStore = useLangStore()
const fyStore = useFiscalYearStore()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)
const printArea = ref<HTMLElement | null>(null)

type ReportTab = 'trial_balance' | 'general_ledger' | 'income_statement' | 'balance_sheet'
const activeTab = ref<ReportTab>('trial_balance')
const reportData = ref<any>(null)
const loading = ref(false)
const accountOptions = ref<any[]>([])

const filters = reactive({ fiscal_year_id: '', date_from: '', date_to: '', account_ulid: '' })

onMounted(async () => {
    await fyStore.fetchAll()
    if (fyStore.currentId) filters.fiscal_year_id = fyStore.currentId

    const accounts = await accountService.getDropdown({ allow_posting: true })
    accountOptions.value = accounts.map(a => ({ value: a.ulid, text: `${a.code} — ${a.name}` }))
})

const fiscalYearOptions = computed(() =>
    fyStore.years.map(y => ({ value: y.ulid, text: y.name }))
)

const reportTabs = computed(() => [
    { key: 'trial_balance' as ReportTab, label: t('reports.trialBalance'), icon: 'fas fa-balance-scale' },
    { key: 'general_ledger' as ReportTab, label: t('reports.generalLedger'), icon: 'fas fa-book-open' },
    { key: 'income_statement' as ReportTab, label: t('reports.incomeStatement'), icon: 'fas fa-chart-line' },
    { key: 'balance_sheet' as ReportTab, label: t('reports.balanceSheet'), icon: 'fas fa-building' },
])

const currentTabLabel = computed(() => reportTabs.value.find(t => t.key === activeTab.value)?.label ?? '')

const ledgerAccountInfo = computed(() => {
    if (!reportData.value?.account) return []
    const a = reportData.value.account
    return [
        { label: t('accounts.code'), value: a.code },
        { label: t('accounts.name'), value: a.name },
        { label: t('accounts.normalSide'), value: a.normal_balance_side },
        { label: t('accounts.openingBalance'), value: `${fmt(a.opening_balance)} (${a.opening_side})` },
    ]
})

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

async function loadReport() {
    if (!filters.fiscal_year_id) {
        toast.value?.show(t('reports.fiscalYearRequired'), 'warning')
        return
    }
    if (activeTab.value === 'general_ledger' && !filters.account_ulid) {
        toast.value?.show(t('reports.accountRequired'), 'warning')
        return
    }
    loading.value = true
    reportData.value = null
    try {
        const params: Record<string, string> = { fiscal_year_id: filters.fiscal_year_id }
        if (filters.date_from) params.date_from = filters.date_from
        if (filters.date_to) params.date_to = filters.date_to
        if (activeTab.value === 'general_ledger') params.account_ulid = filters.account_ulid

        let res
        if (activeTab.value === 'trial_balance') res = await reportService.getTrialBalance(params)
        else if (activeTab.value === 'general_ledger') res = await reportService.getGeneralLedger(params)
        else if (activeTab.value === 'income_statement') res = await reportService.getIncomeStatement(params)
        else res = await reportService.getBalanceSheet(params)

        reportData.value = res.data
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { loading.value = false }
}

function clearReport() { reportData.value = null; Object.assign(filters, { date_from: '', date_to: '', account_ulid: '' }) }

function printReport() {
    if (!reportData.value) return
    window.print()
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

.report-tab-bar {
    display: flex;
    gap: .5rem;
    background: #fff;
    border-radius: 1rem;
    padding: .5rem;
    border: 1px solid rgba(0, 0, 0, .07);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .04);
    flex-wrap: wrap;
}

.report-tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    padding: .6rem 1.25rem;
    border-radius: .75rem;
    border: none;
    background: transparent;
    color: #6c757d;
    font-weight: 600;
    font-size: .85rem;
    cursor: pointer;
    transition: all .25s;
    white-space: nowrap;
}

.report-tab-btn:hover {
    background: #f0f2f5;
    color: #1d334f;
}

.report-tab-btn.active {
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    box-shadow: 0 4px 14px rgba(29, 51, 79, .25);
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

.net-income-card {}

.profit-card {
    background: linear-gradient(135deg, #1d7342, #16a34a);
}

.loss-card {
    background: linear-gradient(135deg, #dc2626, #ef4444);
}

@media print {

    .report-tab-bar,
    .header-icon-badge,
    button {
        display: none !important;
    }
}
</style>