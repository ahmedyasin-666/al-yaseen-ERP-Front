<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge"><i class="fas fa-project-diagram text-white"></i></div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('costCenters.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home')
                                }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{
                            $t('sidebar.financial') }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('costCenters.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>
            <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate">
                <i class="fas fa-plus me-1"></i>{{ $t('costCenters.create') }}
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
                        <MDBInput v-model="filters.search" :placeholder="$t('costCenters.searchPlaceholder')"
                            type="text" outline class="form-icon-trailing mb-0" @input="onSearch">
                            <MDBIcon icon="search" class="trailing text-muted" />
                        </MDBInput>
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('costCenters.type') }}</label>
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

        <!-- ══ Table ══ -->
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
                            <th style="min-width:80px;">{{ $t('costCenters.code') }}</th>
                            <th style="min-width:200px;">{{ $t('costCenters.name') }}</th>
                            <th class="text-center">{{ $t('costCenters.type') }}</th>
                            <th class="text-center">{{ $t('accounts.depth') }}</th>
                            <th class="text-center">{{ $t('accounts.posting') }}</th>
                            <th class="text-center">{{ $t('common.status') }}</th>
                            <th class="text-center" style="width:150px;">{{ $t('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading && !centers.length">
                            <td colspan="8" class="text-center py-5">
                                <MDBSpinner color="primary" class="mb-2" />
                                <div class="text-muted small">{{ $t('common.loading') }}</div>
                            </td>
                        </tr>
                        <tr v-else-if="!centers.length">
                            <td colspan="8" class="text-center py-5">
                                <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style="width:60px;height:60px;"><i
                                        class="fas fa-project-diagram fa-lg text-muted"></i></div>
                                <div class="fw-semibold text-muted mb-2">{{ $t('costCenters.empty') }}</div>
                                <MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate"><i
                                        class="fas fa-plus me-1"></i>{{ $t('costCenters.create') }}</MDBBtn>
                            </td>
                        </tr>
                        <tr v-else v-for="(cc, idx) in centers" :key="cc.ulid">
                            <td class="text-center text-muted small fw-semibold">{{ (meta.current_page - 1) *
                                meta.per_page + idx + 1 }}</td>
                            <td><span class="font-monospace fw-bold text-primary small">{{ cc.code }}</span></td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <span v-if="cc.depth > 0" class="text-muted"
                                        :style="`padding-inline-start:${cc.depth * 12}px`">
                                        <i class="fas fa-level-up-alt fa-rotate-90 text-muted"
                                            style="font-size:10px;"></i>
                                    </span>
                                    <div>
                                        <div class="fw-semibold">{{ cc.name }}</div>
                                        <div v-if="cc.name_en" class="text-muted small">{{ cc.name_en }}</div>
                                        <div v-if="cc.parent" class="text-muted" style="font-size:11px;"><i
                                                class="fas fa-level-up-alt me-1 text-muted"
                                                style="font-size:9px;"></i>{{ cc.parent.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill px-2" :class="ccTypeClass(cc.type)">{{ cc.type_label
                                    }}</span>
                            </td>
                            <td class="text-center"><span
                                    class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill">{{ cc.depth
                                    }}</span></td>
                            <td class="text-center">
                                <span v-if="cc.allow_posting"
                                    class="badge bg-success bg-opacity-10 text-success rounded-pill"><i
                                        class="fas fa-check me-1" style="font-size:9px;"></i>{{ $t('accounts.postable')
                                        }}</span>
                                <span v-else class="badge bg-warning bg-opacity-10 text-warning rounded-pill"><i
                                        class="fas fa-layer-group me-1" style="font-size:9px;"></i>{{
                                            $t('accounts.grouping') }}</span>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill"
                                    :class="cc.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                                    <i class="fas fa-circle me-1" style="font-size:7px;"></i>
                                    {{ cc.status === 'active' ? $t('common.active') : $t('common.inactive') }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 action-icons">
                                    <i v-if="!cc.is_system" class="fas fa-edit icon-action text-dark"
                                        :title="$t('common.edit')" @click="openEdit(cc)"></i>
                                    <i class="fas fa-toggle-on icon-action"
                                        :class="cc.status === 'active' ? 'text-success' : 'text-secondary'"
                                        @click="toggleStatus(cc)"></i>
                                    <i v-if="!cc.is_system" class="fas fa-trash icon-action text-danger"
                                        :title="$t('common.delete')" @click="confirmDeleteItem(cc)"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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
        <MDBModal v-model="showFormModal" tabindex="-1" centered size="lg"
            @hide="() => { formErrors = {}; generalError = '' }">

            <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 1rem;">
                <div class="d-flex align-items-center gap-3">
                    <div class="modal-icon-badge" :class="editingCC ? 'badge-dark' : 'badge-primary'">
                        <i :class="editingCC ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
                    </div>
                    <div>
                        <MDBModalTitle class="fw-bold mb-0">
                            {{ editingCC ? $t('costCenters.editTitle') : $t('costCenters.createTitle') }}
                        </MDBModalTitle>
                    </div>
                </div>
            </MDBModalHeader>

            <MDBModalBody class="px-4 pt-3 pb-2" :dir="langStore.dir">
                <MDBRow class="g-3">

                    <!-- Code -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('costCenters.code') }}
                            <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-hashtag"></i>
                            </span>
                            <input v-model="form.code" type="text" class="form-control"
                                :class="{ 'is-invalid': formErrors.code }" placeholder="CC-001" dir="ltr" />
                        </div>
                        <div v-if="formErrors.code" class="invalid-feedback d-block mt-1 small">
                            {{ formErrors.code }}
                        </div>
                    </MDBCol>

                    <!-- Type -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('costCenters.type') }}
                            <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-tag"></i>
                            </span>
                            <MDBSelect v-model="form.type" :options="ccTypeOptions"
                                :placeholder="$t('costCenters.type')" :dir="langStore.dir"
                                :class="{ 'is-invalid': formErrors.type }" height="44.63px" />
                        </div>
                        <div v-if="formErrors.type" class="invalid-feedback d-block mt-1 small">
                            {{ formErrors.type }}
                        </div>
                    </MDBCol>

                    <!-- Parent -->
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('accounts.parentAccount') }}
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-level-up-alt"></i>
                            </span>
                            <MDBSelect v-model="form.parent_id" :options="parentOptions"
                                :placeholder="$t('accounts.parentAccount')" :dir="langStore.dir" filter clearButton
                                height="44.63px" />
                        </div>
                    </MDBCol>

                    <!-- Name AR -->
                    <MDBCol md="6">
                        <label class="form-label fw-semibold small">
                            {{ $t('costCenters.name') }}
                            <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-font"></i>
                            </span>
                            <input v-model="form.name" type="text" class="form-control"
                                :class="{ 'is-invalid': formErrors.name }"
                                :placeholder="$t('costCenters.namePlaceholder')" />
                        </div>
                        <div v-if="formErrors.name" class="invalid-feedback d-block mt-1 small">
                            {{ formErrors.name }}
                        </div>
                    </MDBCol>

                    <!-- Name EN -->
                    <MDBCol md="6">
                        <label class="form-label fw-semibold small">
                            {{ $t('journals.nameEn') }}
                        </label>
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
                <MDBBtn :color="editingCC ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold" @click="onSubmit"
                    :disabled="saving">
                    <span v-if="saving" class="d-flex align-items-center gap-2">
                        <MDBSpinner size="sm" />
                        {{ $t('common.saving') }}
                    </span>
                    <span v-else class="d-flex align-items-center gap-1">
                        <i :class="editingCC ? 'fas fa-save' : 'fas fa-plus'"></i>
                        {{ editingCC ? $t('common.save') : $t('costCenters.create') }}
                    </span>
                </MDBBtn>
            </MDBModalFooter>

        </MDBModal>

        <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt"
            :title="$t('costCenters.deleteTitle')"
            :message="$t('costCenters.deleteMessage', { name: confirmTarget?.name })"
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
    MDBModalTitle, MDBModalBody, MDBModalFooter, MDBTextarea,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { costCenterService } from '@/services/financialService'
import { useLangStore } from '@/stores/langStore'
import type { CostCenter, CostCenterForm, PaginationMeta } from '@/types/financial'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'

const { t } = useI18n()
const langStore = useLangStore()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const centers = ref<CostCenter[]>([])
const meta = ref<PaginationMeta>({ total: 0, current_page: 1, last_page: 1, per_page: 15 })
const loading = ref(false)
const saving = ref(false)
const actionLoading = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingCC = ref<CostCenter | null>(null)
const confirmTarget = ref<CostCenter | null>(null)
const formErrors = ref<Record<string, string>>({})
const generalError = ref('')
const parentOptions = ref<any[]>([])
let searchTimeout: ReturnType<typeof setTimeout>

const filters = reactive({ search: '', type: '', status: '' })
const defaultForm = (): CostCenterForm => ({ code: '', name: '', name_en: '', type: 'cost', parent_id: null, allow_posting: true, status: 'active', notes: '' })
const form = ref<CostCenterForm>(defaultForm())

const statCards = computed(() => [
    { key: 'total', label: t('costCenters.stats.total'), value: meta.value.total, icon: 'fas fa-project-diagram', color: 'primary' },
    { key: 'cost', label: t('costCenters.types.cost'), value: centers.value.filter(c => c.type === 'cost').length, icon: 'fas fa-minus-circle', color: 'danger' },
    { key: 'revenue', label: t('costCenters.types.revenue'), value: centers.value.filter(c => c.type === 'revenue').length, icon: 'fas fa-plus-circle', color: 'success' },
    { key: 'active', label: t('common.active'), value: centers.value.filter(c => c.status === 'active').length, icon: 'fas fa-check-circle', color: 'info' },
])

const typeOptions = computed(() => [
    { value: '', text: t('common.allTypes') },
    ...['cost', 'revenue', 'profit', 'investment'].map(v => ({ value: v, text: t(`costCenters.types.${v}`) }))
])

const ccTypeOptions = computed(() =>
    ['cost', 'revenue', 'profit', 'investment'].map(v => ({ value: v, text: t(`costCenters.types.${v}`) }))
)

const statusOptions = computed(() => [
    { value: '', text: t('common.allStatuses') },
    { value: 'active', text: t('common.active') },
    { value: 'inactive', text: t('common.inactive') },
])

function ccTypeClass(type: string) {
    const m: Record<string, string> = {
        cost: 'bg-danger bg-opacity-10 text-danger',
        revenue: 'bg-success bg-opacity-10 text-success',
        profit: 'bg-primary bg-opacity-10 text-primary',
        investment: 'bg-warning bg-opacity-10 text-warning',
    }
    return m[type] ?? 'bg-light text-dark'
}

async function fetchData() {
    loading.value = true
    try {
        const res = await costCenterService.getAll({ search: filters.search || undefined, type: filters.type || undefined, status: filters.status || undefined, page: meta.value.current_page })
        centers.value = res.data
        meta.value = res.meta
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally { loading.value = false }
}

onMounted(async () => {
    await fetchData()
    const dropdown = await costCenterService.getDropdown()
    parentOptions.value = [
        { value: '', text: `— ${t('accounts.noParent')} —` },
        ...dropdown.map(c => ({ value: c.ulid, text: `${c.code} — ${c.name}` }))
    ]
})

function onSearch() { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { meta.value.current_page = 1; fetchData() }, 400) }
function setPage(p: number) { meta.value.current_page = p; fetchData() }
function resetFilters() { Object.assign(filters, { search: '', type: '', status: '' }); meta.value.current_page = 1; fetchData() }

function openCreate() { editingCC.value = null; form.value = defaultForm(); showFormModal.value = true }
function openEdit(cc: CostCenter) {
    editingCC.value = cc
    form.value = { code: cc.code, name: cc.name, name_en: cc.name_en ?? '', type: cc.type, parent_id: cc.parent?.ulid ?? null, allow_posting: cc.allow_posting, status: cc.status, notes: cc.notes ?? '' }
    showFormModal.value = true
}

async function onSubmit() {
    formErrors.value = {}; generalError.value = ''
    saving.value = true
    try {
        const payload = { ...form.value }
        if (!payload.parent_id) delete payload.parent_id
        if (editingCC.value) {
            const res = await costCenterService.update(editingCC.value.ulid, payload)
            const idx = centers.value.findIndex(c => c.ulid === editingCC.value!.ulid)
            if (idx !== -1) centers.value[idx] = res.data
        } else {
            const res = await costCenterService.store(payload)
            centers.value.unshift(res.data); meta.value.total++
        }
        showFormModal.value = false
        toast.value?.show(t('common.savedSuccess'), 'success')
    } catch (e: any) {
        const errs = e?.response?.data?.errors ?? {}
        Object.entries(errs).forEach(([k, v]) => { formErrors.value[k] = (v as string[])[0] ?? '' })
        generalError.value = e?.response?.data?.message ?? t('common.error')
    } finally { saving.value = false }
}

async function toggleStatus(cc: CostCenter) {
    try {
        const res = cc.status === 'active' ? await costCenterService.deactivate(cc.ulid) : await costCenterService.activate(cc.ulid)
        const idx = centers.value.findIndex(c => c.ulid === cc.ulid)
        if (idx !== -1) centers.value[idx] = res.data
        toast.value?.show(res.message, 'success')
    } catch (e: any) { toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger') }
}

function confirmDeleteItem(cc: CostCenter) { confirmTarget.value = cc; showDeleteModal.value = true }
async function onDeleteConfirmed() {
    if (!confirmTarget.value) return
    actionLoading.value = true
    try {
        await costCenterService.destroy(confirmTarget.value.ulid)
        centers.value = centers.value.filter(c => c.ulid !== confirmTarget.value!.ulid)
        meta.value.total--; showDeleteModal.value = false
        toast.value?.show(t('common.deletedSuccess'), 'success')
    } catch (e: any) { toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger') }
    finally { actionLoading.value = false }
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
</style>