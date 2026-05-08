<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">
        <ToastNotification ref="toast" />

        <!-- ══ Page Header ══ -->
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge">
                    <i class="fas fa-layer-group text-white"></i>
                </div>
                <div>
                    <h6 class="fw-bold text-white mb-0">{{ $t('taxGroups.title') }}</h6>
                    <MDBBreadcrumb class="mb-0 small">
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{ $t('common.home')
                                }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem><a href="#" class="text-white-50 text-decoration-none">{{ $t('sidebar.financial')
                                }}</a></MDBBreadcrumbItem>
                        <MDBBreadcrumbItem active class="text-white">{{ $t('taxGroups.title') }}</MDBBreadcrumbItem>
                    </MDBBreadcrumb>
                </div>
            </div>
            <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate">
                <i class="fas fa-plus me-1"></i>{{ $t('taxGroups.create') }}
            </MDBBtn>
        </div>

        <!-- ══ Filters ══ -->
        <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
            <MDBCardBody class="py-3 px-4">
                <MDBRow class="g-2 align-items-end">
                    <MDBCol md="5">
                        <label class="form-label fw-bold small">{{ $t('common.search') }}</label>
                        <MDBInput v-model="filters.search" :placeholder="$t('taxGroups.searchPlaceholder')" type="text" outline
                            class="form-icon-trailing mb-0" @input="onSearch">
                            <MDBIcon icon="search" class="trailing text-muted" />
                        </MDBInput>
                    </MDBCol>
                    <MDBCol md="3">
                        <label class="form-label fw-bold small">{{ $t('taxGroups.scope') }}</label>
                        <MDBSelect v-model="filters.scope" :options="scopeOptions" @change="fetchData" />
                    </MDBCol>
                    <MDBCol md="2">
                        <label class="form-label fw-bold small">{{ $t('common.status') }}</label>
                        <MDBSelect v-model="filters.is_active" :options="activeOptions" @change="fetchData" />
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
                            <th style="min-width:90px;">{{ $t('taxGroups.code') }}</th>
                            <th style="min-width:220px;">{{ $t('taxGroups.name') }}</th>
                            <th class="text-center" style="min-width:120px;">{{ $t('taxGroups.scope') }}</th>
                            <th class="text-center" style="min-width:120px;">{{ $t('common.status') }}</th>
                            <th class="text-center" style="min-width:140px;">{{ $t('taxGroups.taxRatesCount') }}</th>
                            <th class="text-center" style="width:140px;">{{ $t('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading && !items.length">
                            <td colspan="7" class="text-center py-5">
                                <MDBSpinner color="primary" class="mb-2" />
                                <div class="text-muted small">{{ $t('common.loading') }}</div>
                            </td>
                        </tr>
                        <tr v-else-if="!items.length">
                            <td colspan="7" class="text-center py-5">
                                <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style="width:60px;height:60px;">
                                    <i class="fas fa-layer-group fa-lg text-muted"></i>
                                </div>
                                <div class="fw-semibold text-muted mb-2">{{ $t('taxGroups.empty') }}</div>
                                <MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate">
                                    <i class="fas fa-plus me-1"></i>{{ $t('taxGroups.create') }}
                                </MDBBtn>
                            </td>
                        </tr>
                        <tr v-else v-for="(g, idx) in items" :key="g.ulid">
                            <td class="text-center text-muted small fw-semibold">{{ idx + 1 }}</td>
                            <td><span class="font-monospace fw-bold text-primary small">{{ g.code }}</span></td>
                            <td>
                                <div class="fw-semibold">{{ g.name }}</div>
                                <div v-if="g.name_en" class="text-muted small">{{ g.name_en }}</div>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2">
                                    {{ $t(`taxGroups.scopes.${g.scope}`) }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="badge rounded-pill"
                                    :class="g.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                                    <i class="fas fa-circle me-1" style="font-size:7px;"></i>
                                    {{ g.is_active ? $t('common.active') : $t('common.inactive') }}
                                </span>
                            </td>
                            <td class="text-center font-monospace fw-semibold small">{{ g.tax_rates_count ?? '—' }}</td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 action-icons">
                                    <i class="fas fa-edit icon-action text-dark" :title="$t('common.edit')" @click="openEdit(g)"></i>
                                    <i class="fas fa-trash icon-action text-danger" :title="$t('common.delete')" @click="confirmDeleteItem(g)"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </MDBCard>

        <!-- ══ Form Modal (Create/Edit) ══ -->
        <MDBModal v-model="showFormModal" tabindex="-1" centered size="lg" @hide="onHideForm">
            <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 1rem;">
                <div class="d-flex align-items-center gap-3">
                    <div class="modal-icon-badge" :class="editing ? 'badge-dark' : 'badge-primary'">
                        <i :class="editing ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
                    </div>
                    <div>
                        <MDBModalTitle class="fw-bold mb-0">
                            {{ editing ? $t('taxGroups.editTitle') : $t('taxGroups.createTitle') }}
                        </MDBModalTitle>
                        <p class="text-muted small mb-0 mt-1">{{ $t('taxGroups.formSubtitle') }}</p>
                    </div>
                </div>
            </MDBModalHeader>

            <MDBModalBody class="px-4 pt-3 pb-2" :dir="langStore.dir">
                <MDBRow class="g-3">
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">
                            {{ $t('taxGroups.code') }} <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                            <input v-model="form.code" type="text" class="form-control" dir="ltr"
                                :class="{ 'is-invalid': formErrors.code }" />
                        </div>
                        <div v-if="formErrors.code" class="invalid-feedback d-block mt-1 small">{{ formErrors.code }}</div>
                    </MDBCol>

                    <MDBCol md="8">
                        <label class="form-label fw-semibold small">
                            {{ $t('taxGroups.name') }} <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-font"></i></span>
                            <input v-model="form.name" type="text" class="form-control"
                                :class="{ 'is-invalid': formErrors.name }" />
                        </div>
                        <div v-if="formErrors.name" class="invalid-feedback d-block mt-1 small">{{ formErrors.name }}</div>
                    </MDBCol>

                    <MDBCol md="6">
                        <label class="form-label fw-semibold small">{{ $t('taxGroups.scope') }} <span class="text-danger">*</span></label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-bullseye"></i></span>
                            <MDBSelect v-model="form.scope" :options="scopeOptionsEdit" height="44.63px"
                                :class="{ 'is-invalid': formErrors.scope }" />
                        </div>
                        <div v-if="formErrors.scope" class="invalid-feedback d-block mt-1 small">{{ formErrors.scope }}</div>
                    </MDBCol>

                    <MDBCol md="6" class="d-flex align-items-end pb-1">
                        <div class="toggle-card w-100 d-flex align-items-center justify-content-between p-3 rounded-3 border">
                            <div>
                                <div class="fw-semibold small">{{ $t('taxGroups.active') }}</div>
                                <div class="text-muted" style="font-size:0.75rem;">{{ $t('taxGroups.activeHint') }}</div>
                            </div>
                            <div class="form-check form-switch mb-0">
                                <input v-model="form.is_active" class="form-check-input" type="checkbox" role="switch" id="tgActive">
                            </div>
                        </div>
                    </MDBCol>

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
                <MDBBtn :color="editing ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold" @click="onSubmit"
                    :disabled="saving">
                    <span v-if="saving" class="d-flex align-items-center gap-2">
                        <MDBSpinner size="sm" />
                        {{ $t('common.saving') }}
                    </span>
                    <span v-else class="d-flex align-items-center gap-1">
                        <i :class="editing ? 'fas fa-save' : 'fas fa-plus'"></i>
                        {{ editing ? $t('common.save') : $t('taxGroups.create') }}
                    </span>
                </MDBBtn>
            </MDBModalFooter>
        </MDBModal>

        <!-- ══ Delete Confirm ══ -->
        <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="$t('taxGroups.deleteTitle')"
            :message="$t('taxGroups.deleteMessage', { name: confirmTarget?.name })" :confirm-label="$t('common.delete')"
            :loading="actionLoading" @confirm="onDeleteConfirmed" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBIcon, MDBInput,
    MDBProgress, MDBProgressBar, MDBSpinner, MDBBreadcrumb, MDBBreadcrumbItem,
    MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { taxGroupService } from '@/services/taxService'
import { useLangStore } from '@/stores/langStore'
import type { TaxGroup, TaxGroupForm } from '@/types/financial'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'

const { t } = useI18n()
const langStore = useLangStore()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const items = ref<TaxGroup[]>([])
const loading = ref(false)
const saving = ref(false)
const actionLoading = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const confirmTarget = ref<TaxGroup | null>(null)
const editingItem = ref<TaxGroup | null>(null)
const formErrors = ref<Record<string, string>>({})
const generalError = ref('')
let searchTimeout: ReturnType<typeof setTimeout>

const filters = reactive<{ search: string; scope: string; is_active: string }>({ search: '', scope: '', is_active: '' })

const defaultForm = (): TaxGroupForm => ({
    code: '',
    name: '',
    name_en: '',
    description: '',
    scope: 'both',
    is_default: false,
    is_active: true,
})
const form = ref<TaxGroupForm>(defaultForm())

const editing = computed(() => !!editingItem.value)

const scopeOptions = computed(() => [
    { value: '', text: t('common.all') },
    { value: 'sales', text: t('taxGroups.scopes.sales') },
    { value: 'purchases', text: t('taxGroups.scopes.purchases') },
    { value: 'both', text: t('taxGroups.scopes.both') },
])

const scopeOptionsEdit = computed(() => [
    { value: 'sales', text: t('taxGroups.scopes.sales') },
    { value: 'purchases', text: t('taxGroups.scopes.purchases') },
    { value: 'both', text: t('taxGroups.scopes.both') },
])

const activeOptions = computed(() => [
    { value: '', text: t('common.all') },
    { value: '1', text: t('common.active') },
    { value: '0', text: t('common.inactive') },
])

async function fetchData() {
    loading.value = true
    try {
        const res = await taxGroupService.getAll({
            search: filters.search || undefined,
            scope: filters.scope || undefined,
            is_active: filters.is_active === '' ? undefined : filters.is_active,
        })
        items.value = res.data
    } catch (e: any) {
        toast.value?.show(e?.response?.data?.message ?? t('common.error'), 'danger')
    } finally {
        loading.value = false
    }
}

onMounted(fetchData)

function onSearch() {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => fetchData(), 400)
}

function resetFilters() {
    Object.assign(filters, { search: '', scope: '', is_active: '' })
    fetchData()
}

function openCreate() {
    editingItem.value = null
    form.value = defaultForm()
    showFormModal.value = true
}

function openEdit(item: TaxGroup) {
    editingItem.value = item
    form.value = {
        code: item.code,
        name: item.name,
        name_en: item.name_en ?? '',
        description: item.description ?? '',
        scope: item.scope,
        is_default: item.is_default,
        is_active: item.is_active,
    }
    showFormModal.value = true
}

function onHideForm() {
    formErrors.value = {}
    generalError.value = ''
}

async function onSubmit() {
    formErrors.value = {}
    generalError.value = ''
    saving.value = true
    try {
        if (editingItem.value) {
            const res = await taxGroupService.update(editingItem.value.ulid, form.value)
            const idx = items.value.findIndex(x => x.ulid === editingItem.value!.ulid)
            if (idx !== -1) items.value[idx] = res.data
        } else {
            const res = await taxGroupService.store(form.value)
            items.value.unshift(res.data)
        }
        showFormModal.value = false
        toast.value?.show(t('common.savedSuccess'), 'success')
    } catch (e: any) {
        const errs = e?.response?.data?.errors ?? {}
        Object.entries(errs).forEach(([k, v]) => { formErrors.value[k] = (v as string[])[0] ?? '' })
        generalError.value = e?.response?.data?.message ?? t('common.error')
    } finally {
        saving.value = false
    }
}

function confirmDeleteItem(item: TaxGroup) {
    confirmTarget.value = item
    showDeleteModal.value = true
}

async function onDeleteConfirmed() {
    if (!confirmTarget.value) return
    actionLoading.value = true
    try {
        await taxGroupService.destroy(confirmTarget.value.ulid)
        items.value = items.value.filter(x => x.ulid !== confirmTarget.value!.ulid)
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

.toggle-card {
    background: #f8fafb;
    transition: all .2s;
}

.toggle-card:has(input:checked) {
    background: #e8f5ee;
    border-color: #1d7342 !important;
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

::deep(.form-icon-trailing .trailing) {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    pointer-events: none;
}

.input-group .form-select {
    border-inline-start: none;
}
</style>

