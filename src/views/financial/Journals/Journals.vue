<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge">
                    <i class="fas fa-book text-white"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('journals.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home')
                                }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{
                            $t('sidebar.financial') }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('journals.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>
            <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate">
                <i class="fas fa-plus me-1"></i>{{ $t('journals.create') }}
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
                    <MDBCol md="4">
                        <label class="form-label fw-bold small">{{ $t('common.search') }}</label>
                        <MDBInput v-model="filters.search" :placeholder="$t('journals.searchPlaceholder')" type="text"
                            outline class="form-icon-trailing mb-0" @input="onSearch">
                            <MDBIcon icon="search" class="trailing text-muted" />
                        </MDBInput>
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('journals.type') }}</label>
                        <MDBSelect v-model="filters.type" :options="typeOptions" @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('common.status') }}</label>
                        <MDBSelect v-model="filters.status" :options="statusOptions" @change="fetchData" />
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
                            <th style="min-width:80px;">{{ $t('journals.code') }}</th>
                            <th style="min-width:180px;">{{ $t('journals.name') }}</th>
                            <th class="text-center">{{ $t('journals.type') }}</th>
                            <th class="text-center">{{ $t('journals.prefix') }}</th>
                            <th class="text-center">{{ $t('common.status') }}</th>
                            <th class="text-center">{{ $t('journals.system') }}</th>
                            <th class="text-center" style="width:140px;">{{ $t('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading && !journals.length">
                            <td colspan="8" class="text-center py-5">
                                <MDBSpinner color="primary" class="mb-2" />
                                <div class="text-muted small">{{ $t('common.loading') }}</div>
                            </td>
                        </tr>
                        <tr v-else-if="!journals.length">
                            <td colspan="8" class="text-center py-5">
                                <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style="width:60px;height:60px;">
                                    <i class="fas fa-book fa-lg text-muted"></i>
                                </div>
                                <div class="fw-semibold text-muted mb-2">{{ $t('journals.empty') }}</div>
                                <MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate">
                                    <i class="fas fa-plus me-1"></i>{{ $t('journals.create') }}
                                </MDBBtn>
                            </td>
                        </tr>
                        <tr v-else v-for="(journal, idx) in journals" :key="journal.ulid">
                            <td class="text-center text-muted small fw-semibold">{{ (meta.current_page - 1) *
                                meta.per_page + idx + 1 }}</td>
                            <td><span class="font-monospace fw-bold text-primary small">{{ journal.code }}</span></td>
                            <td>
                                <div class="fw-semibold">{{ journal.name }}</div>
                                <div v-if="journal.name_en" class="text-muted small">{{ journal.name_en }}</div>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill px-2" :class="typeClass(journal.type)">
                                    {{ $t(`journals.types.${journal.type}`) }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span v-if="journal.prefix"
                                    class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill font-monospace">{{
                                        journal.prefix }}</span>
                                <span v-else class="text-muted small">—</span>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill"
                                    :class="journal.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                                    <i class="fas fa-circle me-1" style="font-size:7px;"></i>
                                    {{ journal.status === 'active' ? $t('common.active') : $t('common.inactive') }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span v-if="journal.is_system"
                                    class="badge bg-warning bg-opacity-10 text-warning rounded-pill">
                                    <i class="fas fa-shield-alt me-1" style="font-size:9px;"></i>{{
                                        $t('journals.system') }}
                                </span>
                                <span v-else class="text-muted small">—</span>
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 action-icons">
                                    <i class="fas fa-edit icon-action text-dark" :title="$t('common.edit')"
                                        @click="openEdit(journal)"></i>
                                    <i v-if="!journal.is_system" class="fas fa-trash icon-action text-danger"
                                        :title="$t('common.delete')" @click="confirmDeleteItem(journal)"></i>
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
                    to: Math.min(meta.current_page * meta.per_page, meta.total), total: meta.total
                }) }}</small>
                <MDBPagination small class="mb-0">
                    <MDBPageNav prev @click="setPage(meta.current_page - 1)" :disabled="meta.current_page === 1" />
                    <MDBPageItem v-for="p in meta.last_page" :key="p" :active="p === meta.current_page"
                        @click="setPage(p)">{{ p }}</MDBPageItem>
                    <MDBPageNav next @click="setPage(meta.current_page + 1)"
                        :disabled="meta.current_page === meta.last_page" />
                </MDBPagination>
            </MDBCardBody>
        </MDBCard>

        <!-- ══ Form Modal ══ -->
        <!-- ══ Form Modal ══ -->
        <MDBModal v-model="showFormModal" tabindex="-1" centered size="lg"
            @hide="() => { formErrors = {}; generalError = '' }">

            <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 1rem;">
                <div class="d-flex align-items-center gap-3">
                    <div class="modal-icon-badge" :class="editingJournal ? 'badge-dark' : 'badge-primary'">
                        <i :class="editingJournal ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
                    </div>
                    <div>
                        <MDBModalTitle class="fw-bold mb-0">
                            {{ editingJournal ? $t('journals.editTitle') : $t('journals.createTitle') }}
                        </MDBModalTitle>
                        <p class="text-muted small mb-0 mt-1">{{ $t('journals.formSubtitle') }}</p>
                    </div>
                </div>
            </MDBModalHeader>

            <MDBModalBody class="px-4 pt-3 pb-2" :dir="langStore.dir">
                <MDBRow class="g-3">

                    <!-- Code -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('journals.code') }}
                            <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-hashtag"></i>
                            </span>
                            <input v-model="form.code" type="text" class="form-control"
                                :class="{ 'is-invalid': formErrors.code }" placeholder="e.g. JV" dir="ltr" />
                        </div>
                        <div v-if="formErrors.code" class="invalid-feedback d-block mt-1 small">
                            {{ formErrors.code }}
                        </div>
                    </MDBCol>

                    <!-- Type -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('journals.type') }}
                            <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-tag"></i>
                            </span>
                            <MDBSelect v-model="form.type" :options="journalTypeOptions"
                                :placeholder="$t('journals.type')" :dir="langStore.dir"
                                :class="{ 'is-invalid': formErrors.type }" height="44.63px" />
                        </div>
                        <div v-if="formErrors.type" class="invalid-feedback d-block mt-1 small">
                            {{ formErrors.type }}
                        </div>
                    </MDBCol>

                    <!-- Prefix -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">{{ $t('journals.prefix') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-tag"></i>
                            </span>
                            <input v-model="form.prefix" type="text" class="form-control" placeholder="e.g. JV"
                                dir="ltr" />
                        </div>
                    </MDBCol>

                    <!-- Name -->
                    <MDBCol md="8">
                        <label class="form-label fw-semibold small">
                            {{ $t('journals.name') }}
                            <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-font"></i>
                            </span>
                            <input v-model="form.name" type="text" class="form-control"
                                :class="{ 'is-invalid': formErrors.name }"
                                :placeholder="$t('journals.namePlaceholder')" />
                        </div>
                        <div v-if="formErrors.name" class="invalid-feedback d-block mt-1 small">
                            {{ formErrors.name }}
                        </div>
                    </MDBCol>

                    <!-- Status -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">{{ $t('common.status') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-toggle-on"></i>
                            </span>
                            <MDBSelect v-model="form.status" :options="statusOptions" :placeholder="$t('common.status')"
                                :dir="langStore.dir" height="44.63px" />
                        </div>
                    </MDBCol>

                    <!-- Name EN -->
                    <MDBCol md="12">
                        <label class="form-label fw-semibold small">{{ $t('journals.nameEn') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-language"></i>
                            </span>
                            <input v-model="form.name_en" type="text" class="form-control" placeholder="English name"
                                dir="ltr" />
                        </div>
                    </MDBCol>

                    <!-- Notes -->
                    <MDBCol md="12">
                        <label class="form-label fw-semibold small">{{ $t('common.notes') }}</label>
                        <div class="input-group">
                            <span class="input-group-text align-items-start pt-2">
                                <i class="fas fa-sticky-note"></i>
                            </span>
                            <textarea v-model="form.notes" class="form-control" rows="2"
                                :placeholder="$t('common.notes')" />
                        </div>
                    </MDBCol>

                    <!-- General Error -->
                    <MDBCol v-if="generalError" md="12">
                        <div class="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-0">
                            <i class="fas fa-exclamation-circle flex-shrink-0"></i>
                            {{ generalError }}
                        </div>
                    </MDBCol>

                </MDBRow>
            </MDBModalBody>

            <MDBModalFooter class="border-0 px-4 pt-0 pb-4 gap-2">
                <MDBBtn outline="secondary" size="sm" class="px-4" @click="showFormModal = false" :disabled="saving">
                    {{ $t('common.cancel') }}
                </MDBBtn>
                <MDBBtn :color="editingJournal ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold"
                    @click="onSubmit" :disabled="saving">
                    <span v-if="saving" class="d-flex align-items-center gap-2">
                        <MDBSpinner size="sm" />
                        {{ $t('common.saving') }}
                    </span>
                    <span v-else class="d-flex align-items-center gap-1">
                        <i :class="editingJournal ? 'fas fa-save' : 'fas fa-plus'"></i>
                        {{ editingJournal ? $t('common.save') : $t('journals.create') }}
                    </span>
                </MDBBtn>
            </MDBModalFooter>

        </MDBModal>

        <!-- ══ Delete Confirm ══ -->
        <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="$t('journals.deleteTitle')"
            :message="$t('journals.deleteMessage', { name: confirmTarget?.name })" :confirm-label="$t('common.delete')"
            :loading="actionLoading" @confirm="onDeleteConfirmed" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBIcon, MDBInput,
    MDBProgress, MDBProgressBar, MDBSpinner, MDBBreadcrumb, MDBBreadcrumbItem,
    MDBPagination, MDBPageNav, MDBPageItem, MDBModal, MDBModalHeader,
    MDBModalTitle, MDBModalBody, MDBModalFooter, MDBTextarea,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { journalService } from '@/services/financialService'
import { useLangStore } from '@/stores/langStore'
import type { FinancialJournal, JournalForm, PaginationMeta } from '@/types/financial'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'

const { t } = useI18n()
const langStore = useLangStore()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const journals = ref<FinancialJournal[]>([])
const meta = ref<PaginationMeta>({ total: 0, current_page: 1, last_page: 1, per_page: 15 })
const loading = ref(false)
const saving = ref(false)
const actionLoading = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingJournal = ref<FinancialJournal | null>(null)
const confirmTarget = ref<FinancialJournal | null>(null)
const formErrors = ref<Record<string, string>>({})
const generalError = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

const filters = reactive({ search: '', type: '', status: '' })

const defaultForm = (): JournalForm => ({ code: '', name: '', name_en: '', type: 'general', prefix: '', status: 'active', notes: '' })
const form = ref<JournalForm>(defaultForm())

const statCards = computed(() => [
    { key: 'total', label: t('journals.stats.total'), value: meta.value.total, icon: 'fas fa-book', color: 'primary' },
    { key: 'active', label: t('common.active'), value: journals.value.filter(j => j.status === 'active').length, icon: 'fas fa-check-circle', color: 'success' },
    { key: 'system', label: t('journals.system'), value: journals.value.filter(j => j.is_system).length, icon: 'fas fa-shield-alt', color: 'warning' },
    { key: 'general', label: t('journals.types.general'), value: journals.value.filter(j => j.type === 'general').length, icon: 'fas fa-file-alt', color: 'info' },
])

const typeOptions = computed(() => [
    { value: '', text: t('common.allTypes') },
    ...['general', 'sales', 'purchases', 'bank', 'cash', 'payroll', 'opening'].map(v => ({ value: v, text: t(`journals.types.${v}`) }))
])

const journalTypeOptions = computed(() =>
    ['general', 'sales', 'purchases', 'bank', 'cash', 'payroll', 'opening'].map(v => ({ value: v, text: t(`journals.types.${v}`) }))
)

const statusOptions = computed(() => [
    { value: '', text: t('common.allStatuses') },
    { value: 'active', text: t('common.active') },
    { value: 'inactive', text: t('common.inactive') },
])

function typeClass(type: string) {
    const m: Record<string, string> = {
        general: 'bg-primary bg-opacity-10 text-primary',
        sales: 'bg-success bg-opacity-10 text-success',
        purchases: 'bg-warning bg-opacity-10 text-warning',
        bank: 'bg-info bg-opacity-10 text-info',
        cash: 'bg-success bg-opacity-10 text-success',
        payroll: 'bg-secondary bg-opacity-10 text-secondary',
        opening: 'bg-danger bg-opacity-10 text-danger',
    }
    return m[type] ?? 'bg-light text-dark'
}

async function fetchData() {
    loading.value = true
    try {
        const res = await journalService.getAll({ search: filters.search || undefined, type: filters.type || undefined, status: filters.status || undefined, page: meta.value.current_page })
        journals.value = res.data
        meta.value = res.meta
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { loading.value = false }
}

onMounted(fetchData)

function onSearch() { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { meta.value.current_page = 1; fetchData() }, 400) }
function setPage(p: number) { meta.value.current_page = p; fetchData() }
function resetFilters() { Object.assign(filters, { search: '', type: '', status: '' }); meta.value.current_page = 1; fetchData() }

function openCreate() { editingJournal.value = null; form.value = defaultForm(); showFormModal.value = true }
function openEdit(j: FinancialJournal) {
    editingJournal.value = j
    form.value = { code: j.code, name: j.name, name_en: j.name_en ?? '', type: j.type, prefix: j.prefix ?? '', status: j.status, notes: j.notes ?? '' }
    showFormModal.value = true
}

async function onSubmit() {
    formErrors.value = {}; generalError.value = ''
    saving.value = true
    try {
        if (editingJournal.value) {
            const res = await journalService.update(editingJournal.value.ulid, form.value)
            const idx = journals.value.findIndex(j => j.ulid === editingJournal.value!.ulid)
            if (idx !== -1) journals.value[idx] = res.data
        } else {
            const res = await journalService.store(form.value)
            journals.value.unshift(res.data)
            meta.value.total++
        }
        showFormModal.value = false
        toast.value?.show(t('common.savedSuccess'), 'success')
    } catch (e: any) {
        const errs = e?.response?.data?.errors ?? {}
        Object.entries(errs).forEach(([k, v]) => { formErrors.value[k] = (v as string[])[0] ?? '' })
        generalError.value = e?.response?.data?.message ?? t('common.error')
    } finally { saving.value = false }
}

function confirmDeleteItem(j: FinancialJournal) { confirmTarget.value = j; showDeleteModal.value = true }

async function onDeleteConfirmed() {
    if (!confirmTarget.value) return
    actionLoading.value = true
    try {
        await journalService.destroy(confirmTarget.value.ulid)
        journals.value = journals.value.filter(j => j.ulid !== confirmTarget.value!.ulid)
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

.modal-icon-badge {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.badge-primary {
    background: linear-gradient(135deg, #1d334f, #0d6efd);
    color: #fff;
}

.badge-dark {
    background: linear-gradient(135deg, #1a1a2e, #343a40);
    color: #fff;
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

/* form-select داخل input-group */
.input-group .form-select {
    border-inline-start: none;
}

:deep(.btn-primary) {
    background: #1d334f !important;
    border-color: #1d334f !important;
}
</style>