<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

        <!-- ══ Toast ══════════════════════════════════════════════════ -->
        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══════════════════════════════════════════════ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge">
                    <i class="fas fa-sitemap text-white"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('accounts.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem>
                            <a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home') }}</a>
                        </MDBBreadcrumbItem>
                        <MDBBreadcrumbItem>
                            <a href="#" class="text-white-50 text-decoration-none">{{ $t('sidebar.financial') }}</a>
                        </MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('accounts.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>
            <div class="d-flex gap-2 flex-wrap">
                <!-- View Toggle -->
                <div class="btn-group">
                    <button class="btn btn-sm fw-semibold"
                        :class="viewMode === 'list' ? 'btn-light' : 'btn-outline-light'" @click="viewMode = 'list'">
                        <i class="fas fa-list me-1"></i> {{ $t('common.list') }}
                    </button>
                    <button class="btn btn-sm fw-semibold"
                        :class="viewMode === 'tree' ? 'btn-light' : 'btn-outline-light'" @click="switchToTree">
                        <i class="fas fa-sitemap me-1"></i> {{ $t('accounts.tree') }}
                    </button>
                </div>
                <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate">
                    <i class="fas fa-plus me-1"></i>{{ $t('accounts.create') }}
                </MDBBtn>
            </div>
        </div>

        <!-- ══ Stats ════════════════════════════════════════════════════ -->
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

        <!-- ══ Filters ══════════════════════════════════════════════════ -->
        <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
            <MDBCardBody class="py-3 px-4">
                <MDBRow class="g-2 align-items-end">
                    <MDBCol md="3">
                        <label class="form-label fw-bold small">{{ $t('common.search') }}</label>
                        <MDBInput v-model="filters.search" :placeholder="$t('accounts.searchPlaceholder')" type="text"
                            outline class="form-icon-trailing mb-0" @input="onSearch">
                            <MDBIcon icon="search" class="trailing text-muted" />
                        </MDBInput>
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('accounts.type') }}</label>
                        <MDBSelect v-model="filters.type" :options="typeOptions" @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('common.status') }}</label>
                        <MDBSelect v-model="filters.status" :options="statusOptions" @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('common.perPage') }}</label>
                        <MDBSelect v-model.number="filters.per_page" :options="perPageOptions" @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="auto" class="ms-auto">
                        <MDBBtn outline="secondary" size="sm" class="rounded-3" @click="resetFilters">
                            <MDBIcon icon="undo" class="me-1" />{{ $t('common.reset') }}
                        </MDBBtn>
                    </MDBCol>
                </MDBRow>
            </MDBCardBody>
        </MDBCard>

        <!-- ══ Main Card ════════════════════════════════════════════════ -->
        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
            <MDBProgress v-if="loading" style="height:3px;border-radius:0;">
                <MDBProgressBar striped animated :value="100" />
            </MDBProgress>
            <div v-else style="height:3px;"></div>

            <!-- ── LIST VIEW ─────────────────────────────────────────── -->
            <div v-if="viewMode === 'list'" class="table-responsive">
                <table class="table table-bordered table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th class="fw-bold text-center" style="width:48px;">#</th>
                            <th class="fw-bold" style="min-width:100px;">{{ $t('accounts.code') }}</th>
                            <th class="fw-bold" style="min-width:200px;">{{ $t('accounts.name') }}</th>
                            <th class="fw-bold text-center">{{ $t('accounts.type') }}</th>
                            <th class="fw-bold text-center">{{ $t('accounts.normalSide') }}</th>
                            <th class="fw-bold text-center" style="width:80px;">{{ $t('accounts.depth') }}</th>
                            <th class="fw-bold text-center">{{ $t('accounts.posting') }}</th>
                            <th class="fw-bold text-center">{{ $t('common.status') }}</th>
                            <th class="fw-bold text-center" style="width:160px;">{{ $t('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Loading skeleton -->
                        <tr v-if="loading && !accounts.length">
                            <td colspan="9" class="text-center py-5">
                                <MDBSpinner color="primary" class="mb-2" />
                                <div class="text-muted small">{{ $t('common.loading') }}</div>
                            </td>
                        </tr>
                        <!-- Empty -->
                        <tr v-else-if="!accounts.length">
                            <td colspan="9" class="text-center py-5">
                                <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style="width:60px;height:60px;">
                                    <i class="fas fa-sitemap fa-lg text-muted"></i>
                                </div>
                                <div class="fw-semibold text-muted mb-2">{{ $t('accounts.empty') }}</div>
                                <MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate">
                                    <i class="fas fa-plus me-1"></i>{{ $t('accounts.create') }}
                                </MDBBtn>
                            </td>
                        </tr>
                        <!-- Rows -->
                        <tr v-else v-for="(acc, idx) in accounts" :key="acc.ulid">
                            <td class="text-center text-muted small fw-semibold">
                                {{ (meta.current_page - 1) * meta.per_page + idx + 1 }}
                            </td>
                            <td>
                                <span class="font-monospace fw-bold text-primary small">{{ acc.code }}</span>
                            </td>
                            <td>
                                <div v-if="acc.name" class="text-muted">{{ acc.name }}</div>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill px-2" :class="typeClass(acc.type)">
                                    {{ $t(`accounts.types.${acc.type}`) }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill px-2"
                                    :class="acc.normal_balance_side === 'debit' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-success bg-opacity-10 text-success'">
                                    {{ acc.normal_balance_side === 'debit' ? $t('accounts.debit') :
                                        $t('accounts.credit') }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill">{{ acc.depth
                                    }}</span>
                            </td>
                            <td class="text-center">
                                <span v-if="acc.allow_posting"
                                    class="badge bg-success bg-opacity-10 text-success rounded-pill">
                                    <i class="fas fa-check me-1" style="font-size:9px;"></i>{{ $t('accounts.postable')
                                    }}
                                </span>
                                <span v-else class="badge bg-warning bg-opacity-10 text-warning rounded-pill">
                                    <i class="fas fa-layer-group me-1" style="font-size:9px;"></i>{{
                                        $t('accounts.grouping') }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill"
                                    :class="acc.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                                    <i class="fas fa-circle me-1" style="font-size:7px;"></i>
                                    {{ acc.status === 'active' ? $t('common.active') : $t('common.inactive') }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 action-icons">
                                    <i class="fas fa-eye icon-action text-info" :title="$t('common.view')"
                                        @click="openShow(acc)"></i>
                                    <i v-if="!acc.is_system" class="fas fa-edit icon-action text-dark"
                                        :title="$t('common.edit')" @click="openEdit(acc)"></i>
                                    <i class="fas fa-toggle-on icon-action"
                                        :class="acc.status === 'active' ? 'text-success' : 'text-secondary'"
                                        :title="$t('accounts.toggleStatus')" @click="toggleStatus(acc)"></i>
                                    <i v-if="!acc.is_system" class="fas fa-trash icon-action text-danger"
                                        :title="$t('common.delete')" @click="confirmDeleteItem(acc)"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- ── TREE VIEW ─────────────────────────────────────────── -->
            <div v-else class="p-3">
                <div v-if="treeLoading" class="text-center py-5">
                    <MDBSpinner color="primary" />
                    <div class="text-muted small mt-2">{{ $t('common.loading') }}</div>
                </div>
                <div v-else-if="!treeData.length" class="text-center py-5 text-muted">
                    {{ $t('accounts.empty') }}
                </div>
                <div v-else>
                    <AccountTreeNode v-for="node in treeData" :key="node.ulid" :node="node" @edit="openEdit"
                        @show="openShow" @delete="confirmDeleteItem" @toggle="toggleStatus" />
                </div>
            </div>

            <!-- ── Pagination ────────────────────────────────────────── -->
            <MDBCardBody v-if="viewMode === 'list' && meta.last_page > 1"
                class="d-flex justify-content-between align-items-center py-3 px-4 border-top">
                <small class="text-muted">
                    {{ $t('common.showing', { from: paginationFrom, to: paginationTo, total: meta.total }) }}
                </small>
                <MDBPagination small class="mb-0">
                    <MDBPageNav prev @click="setPage(meta.current_page - 1)" :disabled="meta.current_page === 1" />
                    <MDBPageItem v-for="p in meta.last_page" :key="p" :active="p === meta.current_page"
                        @click="setPage(p)">
                        {{ p }}
                    </MDBPageItem>
                    <MDBPageNav next @click="setPage(meta.current_page + 1)"
                        :disabled="meta.current_page === meta.last_page" />
                </MDBPagination>
            </MDBCardBody>
        </MDBCard>

        <!-- ══ Modals ════════════════════════════════════════════════════ -->
        <AccountFormModal v-model:show="showFormModal" :account="editingAccount" @saved="onSaved" />
        <AccountShowModal v-model:show="showDetailsModal" :account="showingAccount" />

        <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="$t('accounts.deleteTitle')"
            :message="$t('accounts.deleteMessage', { name: confirmTarget?.name })" :confirm-label="$t('common.delete')"
            :loading="actionLoading" @confirm="onDeleteConfirmed" />

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBRow, MDBCol, MDBCard, MDBCardBody,
    MDBBtn, MDBIcon, MDBInput,
    MDBProgress, MDBProgressBar, MDBSpinner,
    MDBBreadcrumb, MDBBreadcrumbItem,
    MDBPagination, MDBPageNav, MDBPageItem,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { accountService } from '@/services/financialService'
import type { Account, PaginationMeta } from '@/types/financial'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import AccountFormModal from './AccountFormModal.vue'
import AccountShowModal from '@/components/financial/accounts/AccountShowModal.vue'
import AccountTreeNode from '@/components/financial/accounts/AccountTreeNode.vue'

const { t } = useI18n()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

// ── State ──────────────────────────────────────────────────────
const accounts = ref<Account[]>([])
const treeData = ref<Account[]>([])
const meta = ref<PaginationMeta>({ total: 0, current_page: 1, last_page: 1, per_page: 15 })
const loading = ref(false)
const treeLoading = ref(false)
const viewMode = ref<'list' | 'tree'>('list')

const showFormModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const editingAccount = ref<Account | null>(null)
const showingAccount = ref<Account | null>(null)
const confirmTarget = ref<Account | null>(null)
const actionLoading = ref(false)
let searchTimeout: ReturnType<typeof setTimeout>

const filters = reactive({ search: '', type: '', status: '', per_page: 15 })

// ── Computed ────────────────────────────────────────────────────
const paginationFrom = computed(() => (meta.value.current_page - 1) * meta.value.per_page + 1)
const paginationTo = computed(() => Math.min(meta.value.current_page * meta.value.per_page, meta.value.total))

const typeOptions = computed(() => [
    { value: '', text: t('common.allTypes') },
    { value: 'asset', text: t('accounts.types.asset') },
    { value: 'liability', text: t('accounts.types.liability') },
    { value: 'equity', text: t('accounts.types.equity') },
    { value: 'revenue', text: t('accounts.types.revenue') },
    { value: 'expense', text: t('accounts.types.expense') },
])

const statusOptions = computed(() => [
    { value: '', text: t('common.allStatuses') },
    { value: 'active', text: t('common.active') },
    { value: 'inactive', text: t('common.inactive') },
])

const perPageOptions = computed(() => [
    { value: 15, text: `15 / ${t('common.page')}` },
    { value: 25, text: `25 / ${t('common.page')}` },
    { value: 50, text: `50 / ${t('common.page')}` },
])

const statCards = computed(() => [
    {
        key: 'total', label: t('accounts.stats.total'), value: meta.value.total,
        icon: 'fas fa-sitemap', color: 'primary',
    },
    {
        key: 'asset', label: t('accounts.types.asset'),
        value: accounts.value.filter(a => a.type === 'asset').length,
        icon: 'fas fa-coins', color: 'success',
    },
    {
        key: 'posting', label: t('accounts.postable'),
        value: accounts.value.filter(a => a.allow_posting).length,
        icon: 'fas fa-check-circle', color: 'info',
    },
    {
        key: 'inactive', label: t('common.inactive'),
        value: accounts.value.filter(a => a.status === 'inactive').length,
        icon: 'fas fa-ban', color: 'danger',
    },
])

// ── Helpers ─────────────────────────────────────────────────────
function typeClass(type: string) {
    const map: Record<string, string> = {
        asset: 'bg-success bg-opacity-10 text-success',
        liability: 'bg-danger bg-opacity-10 text-danger',
        equity: 'bg-warning bg-opacity-10 text-warning',
        revenue: 'bg-info bg-opacity-10 text-info',
        expense: 'bg-secondary bg-opacity-10 text-secondary',
    }
    return map[type] ?? 'bg-light text-dark'
}

// ── Data Fetching ────────────────────────────────────────────────
async function fetchData() {
    loading.value = true
    try {
        const res = await accountService.getAll({
            search: filters.search || undefined,
            type: filters.type || undefined,
            status: filters.status || undefined,
            per_page: filters.per_page,
            page: meta.value.current_page,
        })
        accounts.value = res.data
        meta.value = res.meta
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loading.value = false
    }
}

async function switchToTree() {
    viewMode.value = 'tree'
    if (treeData.value.length) return
    treeLoading.value = true
    try {
        treeData.value = await accountService.getTree()
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        treeLoading.value = false
    }
}

onMounted(fetchData)

function onSearch() {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => { meta.value.current_page = 1; fetchData() }, 400)
}

function setPage(page: number) { meta.value.current_page = page; fetchData() }

function resetFilters() {
    Object.assign(filters, { search: '', type: '', status: '', per_page: 15 })
    meta.value.current_page = 1
    fetchData()
}

// ── Modal Actions ────────────────────────────────────────────────
function openCreate() { editingAccount.value = null; showFormModal.value = true }
function openEdit(acc: Account) { editingAccount.value = acc; showFormModal.value = true }
function openShow(acc: Account) { showingAccount.value = acc; showDetailsModal.value = true }

function onSaved(updated: Account, isNew: boolean) {
    if (isNew) {
        fetchData()
        treeData.value = [] // invalidate tree
    } else {
        const idx = accounts.value.findIndex(a => a.ulid === updated.ulid)
        if (idx !== -1) accounts.value[idx] = updated
        treeData.value = []
    }
    toast.value?.show(t('common.savedSuccess'), 'success')
}

async function toggleStatus(acc: Account) {
    try {
        const res = await accountService.toggleStatus(acc.ulid)
        const idx = accounts.value.findIndex(a => a.ulid === acc.ulid)
        if (idx !== -1) accounts.value[idx] = res.data
        toast.value?.show(res.message, 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    }
}

function confirmDeleteItem(acc: Account) {
    confirmTarget.value = acc
    showDeleteModal.value = true
}

async function onDeleteConfirmed() {
    if (!confirmTarget.value) return
    actionLoading.value = true
    try {
        await accountService.destroy(confirmTarget.value.ulid)
        accounts.value = accounts.value.filter(a => a.ulid !== confirmTarget.value!.ulid)
        meta.value.total--
        treeData.value = []
        showDeleteModal.value = false
        toast.value?.show(t('common.deletedSuccess'), 'success')
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        actionLoading.value = false
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

.stat-icon-wrap {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

:deep(.form-icon-trailing .trailing) {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    pointer-events: none;
}

/* .table-custom th {
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
} */

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
</style>