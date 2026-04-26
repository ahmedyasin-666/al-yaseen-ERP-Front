<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge">
                    <i class="fas fa-receipt text-white"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('entries.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home')
                                }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{
                                $t('sidebar.financial') }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('entries.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>
            <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate">
                <i class="fas fa-plus me-1"></i>{{ $t('entries.create') }}
            </MDBBtn>
        </div>

        <!-- ══ Stats ══ -->
        <MDBRow class="g-3 mb-4">
            <MDBCol md="3" v-for="card in statCards" :key="card.key">
                <MDBCard class="border-0 shadow-sm h-100 rounded-4">
                    <MDBCardBody class="d-flex align-items-center justify-content-between p-3">
                        <div>
                            <div class="text-muted small mb-1">{{ card.label }}</div>
                            <div class="fw-bold fs-3 lh-1">{{ card.value }}</div>
                        </div>
                        <div class="stat-icon-wrap rounded-3"
                            :class="`text-${card.color} bg-${card.color} bg-opacity-10`">
                            <i :class="card.icon"></i>
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>

        <!-- ══ Filters ══ -->
        <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
            <MDBCardBody class="py-3 px-4">
                <MDBRow class="g-2 align-items-end">
                    <MDBCol md="3">
                        <label class="form-label fw-bold small">{{ $t('common.search') }}</label>
                        <MDBInput v-model="filters.search" :placeholder="$t('entries.searchPlaceholder')" type="text"
                            outline class="form-icon-trailing mb-0" @input="onSearch">
                            <MDBIcon icon="search" class="trailing text-muted" />
                        </MDBInput>
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('entries.status') }}</label>
                        <MDBSelect v-model="filters.status" :options="statusOptions" @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('entries.dateFrom') }}</label>
                        <input v-model="filters.date_from" type="date" class="form-control" dir="ltr"
                            @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('entries.dateTo') }}</label>
                        <input v-model="filters.date_to" type="date" class="form-control" dir="ltr"
                            @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="auto" class="ms-auto">
                        <MDBBtn outline="secondary" size="sm" class="rounded-3" @click="resetFilters">
                            <MDBIcon icon="undo" class="me-1" />{{ $t('common.reset') }}
                        </MDBBtn>
                    </MDBCol>
                </MDBRow>
            </MDBCardBody>
        </MDBCard>

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
                            <th class="text-center" style="min-width:120px;">{{ $t('entries.number') }}</th>
                            <th class="text-center" style="min-width:100px;">{{ $t('entries.date') }}</th>
                            <th class="text-center" style="min-width:130px;">{{ $t('entries.journal') }}</th>
                            <th class="text-center" style="min-width:110px;">{{ $t('entries.totalDebit') }}</th>
                            <th class="text-center" style="min-width:110px;">{{ $t('entries.totalCredit') }}</th>
                            <th class="text-center">{{ $t('entries.balanced') }}</th>
                            <th class="text-center">{{ $t('entries.status') }}</th>
                            <th class="text-center" style="width:180px;">{{ $t('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading && !entries.length">
                            <td colspan="9" class="text-center py-5">
                                <MDBSpinner color="primary" class="mb-2" />
                                <div class="text-muted small">{{ $t('common.loading') }}</div>
                            </td>
                        </tr>
                        <tr v-else-if="!entries.length">
                            <td colspan="9" class="text-center py-5">
                                <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style="width:60px;height:60px;">
                                    <i class="fas fa-receipt fa-lg text-muted"></i>
                                </div>
                                <div class="fw-semibold text-muted mb-2">{{ $t('entries.empty') }}</div>
                                <MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate">
                                    <i class="fas fa-plus me-1"></i>{{ $t('entries.create') }}
                                </MDBBtn>
                            </td>
                        </tr>
                        <tr v-else v-for="(entry, idx) in entries" :key="entry.ulid">
                            <td class="text-center text-muted small fw-semibold">{{ (meta.current_page - 1) *
                                meta.per_page + idx + 1 }}</td>
                            <td>
                                <span class="font-monospace fw-bold text-primary small">{{ entry.number }}</span>
                                <span v-if="entry.is_opening"
                                    class="badge bg-info bg-opacity-10 text-info rounded-pill ms-1"
                                    style="font-size:9px;">
                                    <i class="fas fa-flag me-1" style="font-size:8px;"></i>{{ $t('entries.opening') }}
                                </span>
                            </td>
                            <td class="small text-nowrap">{{ entry.entry_date }}</td>
                            <td class="small">
                                <div class="fw-semibold">{{ entry.financial_journal?.code }}</div>
                                <div class="text-muted">{{ entry.financial_journal?.name }}</div>
                            </td>
                            <td class="text-end font-monospace fw-semibold text-primary small">{{
                                formatAmount(entry.total_debit) }}</td>
                            <td class="text-end font-monospace fw-semibold text-success small">{{
                                formatAmount(entry.total_credit) }}</td>
                            <td class="text-center">
                                <i v-if="entry.is_balanced" class="fas fa-check-circle text-success"></i>
                                <i v-else class="fas fa-times-circle text-danger"></i>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill px-2" :class="statusClass(entry.status)">
                                    <i class="fas fa-circle me-1" style="font-size:7px;"></i>
                                    {{ $t(`entries.statuses.${entry.status}`) }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 action-icons">
                                    <i class="fas fa-eye icon-action text-info" :title="$t('common.view')"
                                        @click="openShow(entry)"></i>
                                    <!-- Post -->
                                    <i v-if="entry.status === 'draft' && entry.is_balanced"
                                        class="fas fa-paper-plane icon-action text-success" :title="$t('entries.post')"
                                        @click="confirmPost(entry)"></i>
                                    <!-- Cancel -->
                                    <i v-if="entry.status === 'posted' && !entry.is_auto"
                                        class="fas fa-ban icon-action text-warning" :title="$t('entries.cancel')"
                                        @click="confirmCancel(entry)"></i>
                                    <!-- Edit -->
                                    <i v-if="entry.is_editable && !entry.is_auto"
                                        class="fas fa-edit icon-action text-dark" :title="$t('common.edit')"
                                        @click="openEdit(entry)"></i>
                                    <!-- Delete -->
                                    <i v-if="entry.is_deletable" class="fas fa-trash icon-action text-danger"
                                        :title="$t('common.delete')" @click="confirmDeleteItem(entry)"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <MDBCardBody v-if="meta.last_page > 1"
                class="d-flex justify-content-between align-items-center py-3 px-4 border-top">
                <small class="text-muted">{{ $t('common.showing', {
                    from: (meta.current_page - 1) * meta.per_page + 1,
                    to: Math.min(meta.current_page * meta.per_page, meta.total), total: meta.total }) }}</small>
                <MDBPagination small class="mb-0">
                    <MDBPageNav prev @click="setPage(meta.current_page - 1)" :disabled="meta.current_page === 1" />
                    <MDBPageItem v-for="p in meta.last_page" :key="p" :active="p === meta.current_page"
                        @click="setPage(p)">{{ p }}</MDBPageItem>
                    <MDBPageNav next @click="setPage(meta.current_page + 1)"
                        :disabled="meta.current_page === meta.last_page" />
                </MDBPagination>
            </MDBCardBody>
        </MDBCard>

        <!-- ══ Show Modal (Entry Details) ══ -->
        <MDBModal v-model="showDetailsModal" tabindex="-1" centered size="xl">
            <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 1rem;">
                <div class="d-flex align-items-center gap-3">
                    <div
                        style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#1d334f,#1d7342);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div>
                        <MDBModalTitle class="fw-bold mb-0">{{ $t('entries.details') }}</MDBModalTitle>
                        <p class="text-muted small mb-0 mt-1" v-if="showingEntry">{{ showingEntry.number }}</p>
                    </div>
                </div>
            </MDBModalHeader>
            <MDBModalBody class="px-4 pt-3 pb-2" v-if="showingEntry">
                <!-- Entry meta -->
                <MDBRow class="g-3 mb-4">
                    <MDBCol md="3" v-for="info in entryInfoItems" :key="info.label">
                        <div class="p-3 rounded-3 border bg-light">
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <i :class="`fas fa-${info.icon} text-primary`" style="font-size:.75rem;"></i>
                                <small class="text-muted">{{ info.label }}</small>
                            </div>
                            <div class="fw-semibold small">{{ info.value }}</div>
                        </div>
                    </MDBCol>
                </MDBRow>
                <!-- Lines table -->
                <div v-if="showingEntry.lines?.length" class="table-responsive">
                    <table class="table table-bordered table-sm align-middle mb-0">
                        <thead>
                            <tr>
                                <th>{{ $t('entries.lines.account') }}</th>
                                <th>{{ $t('entries.lines.costCenter') }}</th>
                                <th class="text-end">{{ $t('accounts.debit') }}</th>
                                <th class="text-end">{{ $t('accounts.credit') }}</th>
                                <th>{{ $t('entries.lines.description') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="line in showingEntry.lines" :key="line.id">
                                <td>
                                    <div class="fw-semibold small font-monospace text-primary">{{ line.account?.code }}
                                    </div>
                                    <div class="small text-muted">{{ line.account?.name }}</div>
                                </td>
                                <td class="small text-muted">{{ line.cost_center?.name ?? '—' }}</td>
                                <td class="text-end font-monospace fw-semibold text-primary small">{{
                                    parseFloat(line.debit) > 0 ? formatAmount(line.debit) : '—' }}</td>
                                <td class="text-end font-monospace fw-semibold text-success small">{{
                                    parseFloat(line.credit) > 0 ? formatAmount(line.credit) : '—' }}</td>
                                <td class="small text-muted">{{ line.description ?? '—' }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="table-light fw-bold">
                                <td colspan="2" class="small">{{ $t('common.total') }}</td>
                                <td class="text-end font-monospace text-primary small">{{
                                    formatAmount(showingEntry.total_debit) }}</td>
                                <td class="text-end font-monospace text-success small">{{
                                    formatAmount(showingEntry.total_credit) }}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div v-else class="text-center py-4 text-muted small">
                    <MDBSpinner size="sm" v-if="loadingDetail" class="me-2" />
                    {{ loadingDetail ? $t('common.loading') : $t('entries.noLines') }}
                </div>
            </MDBModalBody>
            <MDBModalFooter class="border-0 px-4 pt-0 pb-4">
                <button class="btn btn-outline-secondary btn-sm px-4" @click="showDetailsModal = false">{{
                    $t('common.close') }}</button>
            </MDBModalFooter>
        </MDBModal>

        <!-- ══ Create/Edit Modal ══ -->
        <EntryFormModal v-model:show="showFormModal" :entry="editingEntry" @saved="onSaved" />

        <!-- ══ Confirm Modals ══ -->
        <ConfirmModal v-model:show="showPostModal" type="success" icon="paper-plane" :title="$t('entries.postTitle')"
            :message="$t('entries.postMessage', { number: confirmTarget?.number })" :confirm-label="$t('entries.post')"
            :loading="actionLoading" @confirm="onPostConfirmed" />

        <ConfirmModal v-model:show="showCancelModal" type="warning" icon="ban" :title="$t('entries.cancelTitle')"
            :message="$t('entries.cancelMessage', { number: confirmTarget?.number })"
            :confirm-label="$t('entries.cancel')" :loading="actionLoading" @confirm="onCancelConfirmed" />

        <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="$t('entries.deleteTitle')"
            :message="$t('entries.deleteMessage', { number: confirmTarget?.number })"
            :confirm-label="$t('common.delete')" :loading="actionLoading" @confirm="onDeleteConfirmed" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBIcon, MDBInput,
    MDBProgress, MDBProgressBar, MDBSpinner, MDBBreadcrumb, MDBBreadcrumbItem,
    MDBPagination, MDBPageNav, MDBPageItem, MDBModal, MDBModalHeader,
    MDBModalTitle, MDBModalBody, MDBModalFooter,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { entryService } from '@/services/financialService'
import type { JournalEntry, PaginationMeta } from '@/types/financial'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import EntryFormModal from './EntryFormModal.vue'

const { t } = useI18n()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const entries = ref<JournalEntry[]>([])
const meta = ref<PaginationMeta>({ total: 0, current_page: 1, last_page: 1, per_page: 15 })
const loading = ref(false)
const loadingDetail = ref(false)
const actionLoading = ref(false)
const showDetailsModal = ref(false)
const showFormModal = ref(false)
const showPostModal = ref(false)
const showCancelModal = ref(false)
const showDeleteModal = ref(false)
const showingEntry = ref<JournalEntry | null>(null)
const editingEntry = ref<JournalEntry | null>(null)
const confirmTarget = ref<JournalEntry | null>(null)
let searchTimeout: ReturnType<typeof setTimeout>

const filters = reactive({ search: '', status: '', date_from: '', date_to: '' })

const statCards = computed(() => [
    { key: 'total', label: t('entries.stats.total'), value: meta.value.total, icon: 'fas fa-receipt', color: 'primary' },
    { key: 'draft', label: t('entries.statuses.draft'), value: entries.value.filter(e => e.status === 'draft').length, icon: 'fas fa-pen', color: 'warning' },
    { key: 'posted', label: t('entries.statuses.posted'), value: entries.value.filter(e => e.status === 'posted').length, icon: 'fas fa-check-circle', color: 'success' },
    { key: 'cancelled', label: t('entries.statuses.cancelled'), value: entries.value.filter(e => e.status === 'cancelled').length, icon: 'fas fa-ban', color: 'danger' },
])

const statusOptions = computed(() => [
    { value: '', text: t('common.allStatuses') },
    { value: 'draft', text: t('entries.statuses.draft') },
    { value: 'posted', text: t('entries.statuses.posted') },
    { value: 'cancelled', text: t('entries.statuses.cancelled') },
])

const entryInfoItems = computed(() => {
    if (!showingEntry.value) return []
    const e = showingEntry.value
    return [
        { icon: 'hashtag', label: t('entries.number'), value: e.number },
        { icon: 'calendar', label: t('entries.date'), value: e.entry_date },
        { icon: 'book', label: t('entries.journal'), value: e.financial_journal?.name ?? '—' },
        { icon: 'info-circle', label: t('entries.status'), value: t(`entries.statuses.${e.status}`) },
    ]
})

function formatAmount(val: string | number) {
    return parseFloat(String(val)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function statusClass(status: string) {
    return {
        draft: 'bg-warning bg-opacity-10 text-warning',
        posted: 'bg-success bg-opacity-10 text-success',
        cancelled: 'bg-danger bg-opacity-10 text-danger',
    }[status] ?? 'bg-secondary bg-opacity-10 text-secondary'
}

async function fetchData() {
    loading.value = true
    try {
        const res = await entryService.getAll({
            search: filters.search || undefined,
            status: filters.status || undefined,
            date_from: filters.date_from || undefined,
            date_to: filters.date_to || undefined,
            page: meta.value.current_page,
        })
        entries.value = res.data
        meta.value = res.meta
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { loading.value = false }
}

onMounted(fetchData)

function onSearch() { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { meta.value.current_page = 1; fetchData() }, 400) }
function setPage(p: number) { meta.value.current_page = p; fetchData() }
function resetFilters() { Object.assign(filters, { search: '', status: '', date_from: '', date_to: '' }); meta.value.current_page = 1; fetchData() }

function openCreate() { editingEntry.value = null; showFormModal.value = true }
function openEdit(e: JournalEntry) { editingEntry.value = e; showFormModal.value = true }

async function openShow(entry: JournalEntry) {
    showingEntry.value = entry
    showDetailsModal.value = true
    if (!entry.lines?.length) {
        loadingDetail.value = true
        try {
            const res = await entryService.show(entry.ulid)
            showingEntry.value = res.data
            const idx = entries.value.findIndex(e => e.ulid === entry.ulid)
            if (idx !== -1) entries.value[idx] = res.data
        } catch {/* silent */ } finally { loadingDetail.value = false }
    }
}

function onSaved(entry: JournalEntry, isNew: boolean) {
    if (isNew) { entries.value.unshift(entry); meta.value.total++ }
    else { const i = entries.value.findIndex(e => e.ulid === entry.ulid); if (i !== -1) entries.value[i] = entry }
    toast.value?.show(t('common.savedSuccess'), 'success')
}

function confirmPost(e: JournalEntry) { confirmTarget.value = e; showPostModal.value = true }
async function onPostConfirmed() {
    if (!confirmTarget.value) return
    actionLoading.value = true
    try {
        const res = await entryService.post(confirmTarget.value.ulid)
        const i = entries.value.findIndex(e => e.ulid === confirmTarget.value!.ulid)
        if (i !== -1) entries.value[i] = res.data
        showPostModal.value = false
        toast.value?.show(t('entries.postedSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { actionLoading.value = false }
}

function confirmCancel(e: JournalEntry) { confirmTarget.value = e; showCancelModal.value = true }
async function onCancelConfirmed() {
    if (!confirmTarget.value) return
    actionLoading.value = true
    try {
        const res = await entryService.cancel(confirmTarget.value.ulid)
        const i = entries.value.findIndex(e => e.ulid === confirmTarget.value!.ulid)
        if (i !== -1) entries.value[i] = res.data
        showCancelModal.value = false
        toast.value?.show(t('entries.cancelledSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { actionLoading.value = false }
}

function confirmDeleteItem(e: JournalEntry) { confirmTarget.value = e; showDeleteModal.value = true }
async function onDeleteConfirmed() {
    if (!confirmTarget.value) return
    actionLoading.value = true
    try {
        await entryService.destroy(confirmTarget.value.ulid)
        entries.value = entries.value.filter(e => e.ulid !== confirmTarget.value!.ulid)
        meta.value.total--
        showDeleteModal.value = false
        toast.value?.show(t('common.deletedSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { actionLoading.value = false }
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

.stat-icon-wrap {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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

:deep(.form-icon-trailing .trailing) {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    pointer-events: none;
}
</style>