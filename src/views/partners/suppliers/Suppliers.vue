<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">
        <ToastNotification ref="toast" />
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge"><i class="fas fa-truck text-white"></i></div>
                <h6 class="fw-bold text-white mb-0">{{ $t('suppliers.title') }}</h6>
            </div>
            <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate"><i class="fas fa-plus me-1"></i>{{ $t('suppliers.addSupplier') }}</MDBBtn>
        </div>

        <MDBCard class="border-0 shadow-sm rounded-4 mb-4">
            <MDBCardBody class="py-3 px-4">
                <MDBRow class="g-2 align-items-end">
                    <MDBCol md="4">
                        <label class="form-label fw-bold small">{{ $t('common.search') }}</label>
                        <MDBInput v-model="filters.search" :placeholder="$t('common.search')" type="text" outline
                            class="form-icon-trailing mb-0" @input="onSearch">
                            <MDBIcon icon="search" class="trailing text-muted" />
                        </MDBInput>
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

        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
            <MDBProgress v-if="loading" style="height:3px;border-radius:0;"><MDBProgressBar striped animated :value="100" /></MDBProgress>
            <div v-else style="height:3px;"></div>
            <div class="table-responsive">
                <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                    <thead><tr><th class="text-center" style="width:48px;">#</th><th>{{ $t('customers.code') }}</th><th>{{ $t('suppliers.name') }}</th><th class="text-center">{{ $t('suppliers.bankName') }}</th><th class="text-center">{{ $t('suppliers.bankIban') }}</th><th class="text-center">{{ $t('common.status') }}</th><th class="text-center" style="width:150px;">{{ $t('common.actions') }}</th></tr></thead>
                    <tbody>
                        <tr v-if="loading && !items.length"><td colspan="7" class="text-center py-5"><MDBSpinner color="primary" class="mb-2" /><div class="text-muted small">{{ $t('common.loading') }}</div></td></tr>
                        <tr v-else-if="!items.length"><td colspan="7" class="text-center py-5"><div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style="width:60px;height:60px;"><i class="fas fa-truck fa-lg text-muted"></i></div><div class="fw-semibold text-muted mb-2">{{ $t('suppliers.empty') }}</div><MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate"><i class="fas fa-plus me-1"></i>{{ $t('suppliers.addSupplier') }}</MDBBtn></td></tr>
                        <tr v-else v-for="(item, idx) in items" :key="item.ulid">
                            <td class="text-center text-muted small fw-semibold">{{ (meta.current_page - 1) * meta.per_page + idx + 1 }}</td>
                            <td><span class="font-monospace fw-bold text-primary small">{{ item.code || '—' }}</span></td>
                            <td class="fw-semibold">{{ item.name }}</td>
                            <td class="text-center">{{ item.bank_name || '—' }}</td>
                            <td class="text-center font-monospace">{{ item.bank_iban_masked || item.bank_iban || '—' }}</td>
                            <td class="text-center"><span class="badge rounded-pill" :class="item.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'"><i class="fas fa-circle me-1" style="font-size:7px;"></i>{{ item.is_active ? $t('common.active') : $t('common.inactive') }}</span></td>
                            <td class="text-center"><div class="d-flex justify-content-center gap-2 action-icons"><i class="fas fa-eye icon-action text-info" @click="goDetail(item.ulid)"></i><i class="fas fa-edit icon-action text-dark" @click="openEdit(item)"></i><i class="fas fa-toggle-on icon-action" :class="item.is_active ? 'text-success' : 'text-secondary'" @click="toggle(item)"></i><i class="fas fa-trash icon-action text-danger" @click="confirmDelete(item)"></i></div></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <MDBCardBody v-if="meta.last_page > 1" class="d-flex justify-content-between align-items-center py-3 px-4 border-top">
                <small class="text-muted">{{ $t('common.showing', { from: (meta.current_page - 1) * meta.per_page + 1, to: Math.min(meta.current_page * meta.per_page, meta.total), total: meta.total }) }}</small>
                <MDBPagination small class="mb-0">
                    <MDBPageNav prev :disabled="meta.current_page === 1" @click="setPage(meta.current_page - 1)" />
                    <MDBPageItem v-for="p in meta.last_page" :key="p" :active="p === meta.current_page" @click="setPage(p)">{{ p }}</MDBPageItem>
                    <MDBPageNav next :disabled="meta.current_page === meta.last_page" @click="setPage(meta.current_page + 1)" />
                </MDBPagination>
            </MDBCardBody>
        </MDBCard>

        <SupplierFormModal v-model:show="showFormModal" :supplier="editingItem" @saved="onSaved" />
        <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="$t('common.confirm')" :message="$t('suppliers.deleteConfirm')" :confirm-label="$t('common.delete')" @confirm="onDeleteConfirmed" />
    </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBPageItem, MDBPageNav, MDBPagination, MDBProgress, MDBProgressBar, MDBRow, MDBSpinner } from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import SupplierFormModal from './SupplierFormModal.vue'
import { supplierService } from '@/services/supplierService'
import type { Supplier } from '@/types/partners'
const router = useRouter()
const { t } = useI18n()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)
const items = ref<Supplier[]>([])
const loading = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingItem = ref<Supplier | null>(null)
const deletingItem = ref<Supplier | null>(null)
const meta = ref({ total: 0, current_page: 1, last_page: 1, per_page: 15 })
const filters = reactive({ search: '', status: '' })
const statusOptions = computed(() => [
  { value: '', text: t('common.allStatuses') },
  { value: 'active', text: t('common.active') },
  { value: 'inactive', text: t('common.inactive') },
])
let timer: ReturnType<typeof setTimeout>
async function fetchData() {
  loading.value = true
  try {
    const res = await supplierService.getAll({
      page: meta.value.current_page,
      per_page: meta.value.per_page,
      search: filters.search || undefined,
      status: filters.status || undefined,
    })
    items.value = res.data
    meta.value = res.meta
  } finally { loading.value = false }
}
fetchData()
function onSearch() { clearTimeout(timer); timer = setTimeout(() => { meta.value.current_page = 1; fetchData() }, 350) }
function setPage(page: number) { meta.value.current_page = page; fetchData() }
function resetFilters() { Object.assign(filters, { search: '', status: '' }); meta.value.current_page = 1; fetchData() }
function openCreate() { editingItem.value = null; showFormModal.value = true }
function openEdit(item: Supplier) { editingItem.value = item; showFormModal.value = true }
function goDetail(ulid: string) { router.push(`/partners/suppliers/${ulid}`) }
async function toggle(item: Supplier) { item.is_active ? await supplierService.deactivate(item.ulid) : await supplierService.activate(item.ulid); fetchData() }
function confirmDelete(item: Supplier) { deletingItem.value = item; showDeleteModal.value = true }
async function onDeleteConfirmed() { if (!deletingItem.value) return; await supplierService.destroy(deletingItem.value.ulid); toast.value?.show(t('common.deletedSuccess'), 'success'); showDeleteModal.value = false; fetchData() }
function onSaved() { fetchData(); toast.value?.show(t('common.savedSuccess'), 'success') }
</script>

<style scoped>
@keyframes pageIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.header-icon-badge { width: 46px; height: 46px; border-radius: 12px; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25); display: flex; align-items: center; justify-content: center; }
.table-custom th { background: #f8f9fa; font-size: .83rem; font-weight: 700; color: #344054; white-space: nowrap; vertical-align: middle; }
.table-custom td { font-size: .88rem; vertical-align: middle; }
.action-icons .icon-action { cursor: pointer; transition: all .2s ease; opacity: .75; font-size: .95rem; }
.action-icons .icon-action:hover { transform: scale(1.2); opacity: 1; }
::deep(.form-icon-trailing .trailing) { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: .8rem; pointer-events: none; }
</style>
