<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">
        <ToastNotification ref="toast" />
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge"><i class="fas fa-file-contract text-white"></i></div>
                <h6 class="fw-bold text-white mb-0">{{ $t('paymentTerms.title') }}</h6>
            </div>
            <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate"><i class="fas fa-plus me-1"></i>{{ $t('paymentTerms.addTerm') }}</MDBBtn>
        </div>
        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
            <MDBProgress v-if="loading" style="height:3px;border-radius:0;"><MDBProgressBar striped animated :value="100" /></MDBProgress>
            <div v-else style="height:3px;"></div>
            <div class="table-responsive">
                <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                    <thead><tr><th>{{ $t('paymentTerms.code') }}</th><th>{{ $t('paymentTerms.name') }}</th><th class="text-center">{{ $t('paymentTerms.dueDays') }}</th><th class="text-center">{{ $t('paymentTerms.discountPercentage') }}</th><th class="text-center">{{ $t('paymentTerms.discountDays') }}</th><th class="text-center">{{ $t('paymentTerms.isDefault') }}</th><th class="text-center">{{ $t('common.status') }}</th><th class="text-center" style="width:140px;">{{ $t('common.actions') }}</th></tr></thead>
                    <tbody>
                        <tr v-if="loading && !items.length"><td colspan="8" class="text-center py-5"><MDBSpinner color="primary" class="mb-2" /><div class="text-muted small">{{ $t('common.loading') }}</div></td></tr>
                        <tr v-else-if="!items.length"><td colspan="8" class="text-center py-5"><div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style="width:60px;height:60px;"><i class="fas fa-file-contract fa-lg text-muted"></i></div><div class="fw-semibold text-muted mb-2">{{ $t('paymentTerms.empty') }}</div><MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate"><i class="fas fa-plus me-1"></i>{{ $t('paymentTerms.addTerm') }}</MDBBtn></td></tr>
                        <tr v-else v-for="it in items" :key="it.ulid">
                            <td><span class="font-monospace fw-bold text-primary small">{{ it.code }}</span></td>
                            <td class="fw-semibold">{{ it.name }}</td>
                            <td class="text-center font-monospace">{{ it.due_days }}</td>
                            <td class="text-center font-monospace">{{ it.discount_percentage }}</td>
                            <td class="text-center font-monospace">{{ it.discount_days }}</td>
                            <td class="text-center"><span class="badge rounded-pill" :class="it.is_default ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-secondary'">{{ it.is_default ? $t('common.yes') : $t('common.no') }}</span></td>
                            <td class="text-center"><span class="badge rounded-pill" :class="it.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'"><i class="fas fa-circle me-1" style="font-size:7px;"></i>{{ it.is_active ? $t('common.active') : $t('common.inactive') }}</span></td>
                            <td class="text-center"><div class="d-flex justify-content-center gap-2 action-icons"><i class="fas fa-edit icon-action text-dark" @click="openEdit(it)"></i><i class="fas fa-trash icon-action text-danger" @click="confirmDelete(it)"></i></div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </MDBCard>
        <MDBModal v-model="showFormModal" tabindex="-1" centered size="lg">
            <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 1rem;">
                <div class="d-flex align-items-center gap-3">
                    <div class="modal-icon-badge" :class="editingItem ? 'badge-dark' : 'badge-primary'"><i :class="editingItem ? 'fas fa-edit' : 'fas fa-plus-circle'"></i></div>
                    <MDBModalTitle class="fw-bold mb-0">{{ editingItem ? $t('paymentTerms.editTerm') : $t('paymentTerms.addTerm') }}</MDBModalTitle>
                </div>
            </MDBModalHeader>
            <MDBModalBody class="px-4 pt-3 pb-2">
                <MDBRow class="g-3">
                    <MDBCol md="6"><label class="form-label fw-semibold small">{{ $t('paymentTerms.code') }}</label><div class="input-group input-group-lg"><span class="input-group-text"><i class="fas fa-hashtag"></i></span><input v-model="form.code" type="text" class="form-control" dir="ltr" /></div></MDBCol>
                    <MDBCol md="6"><label class="form-label fw-semibold small">{{ $t('paymentTerms.name') }}</label><div class="input-group input-group-lg"><span class="input-group-text"><i class="fas fa-font"></i></span><input v-model="form.name" type="text" class="form-control" /></div></MDBCol>
                    <MDBCol md="4"><label class="form-label fw-semibold small">{{ $t('paymentTerms.dueDays') }}</label><div class="input-group input-group-lg"><span class="input-group-text"><i class="fas fa-calendar-day"></i></span><input v-model.number="form.due_days" type="number" class="form-control" dir="ltr" /></div></MDBCol>
                    <MDBCol md="4"><label class="form-label fw-semibold small">{{ $t('paymentTerms.discountPercentage') }}</label><div class="input-group input-group-lg"><span class="input-group-text"><i class="fas fa-percentage"></i></span><input v-model.number="form.discount_percentage" type="number" class="form-control" dir="ltr" /></div></MDBCol>
                    <MDBCol md="4"><label class="form-label fw-semibold small">{{ $t('paymentTerms.discountDays') }}</label><div class="input-group input-group-lg"><span class="input-group-text"><i class="fas fa-clock"></i></span><input v-model.number="form.discount_days" type="number" class="form-control" dir="ltr" /></div></MDBCol>
                    <MDBCol md="12"><label class="form-label fw-semibold small">{{ $t('paymentTerms.description') }}</label><div class="input-group"><span class="input-group-text align-items-start pt-2"><i class="fas fa-sticky-note"></i></span><textarea v-model="form.description" class="form-control" rows="2" /></div></MDBCol>
                </MDBRow>
            </MDBModalBody>
            <MDBModalFooter class="border-0 px-4 pt-0 pb-4 gap-2"><MDBBtn outline="secondary" size="sm" class="px-4" @click="showFormModal = false">{{ $t('common.cancel') }}</MDBBtn><MDBBtn :color="editingItem ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold" @click="submit">{{ $t('common.save') }}</MDBBtn></MDBModalFooter>
        </MDBModal>
        <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="$t('common.confirm')" :message="$t('paymentTerms.deleteConfirm')" :confirm-label="$t('common.delete')" @confirm="onDeleteConfirmed" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBCard, MDBCol, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBProgress, MDBProgressBar, MDBRow, MDBSpinner } from 'mdb-vue-ui-kit'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import { paymentTermService } from '@/services/paymentTermService'
import type { PaymentTerm, PaymentTermForm } from '@/types/partners'
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)
const { t } = useI18n()
const items = ref<PaymentTerm[]>([])
const loading = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingItem = ref<PaymentTerm | null>(null)
const deletingItem = ref<PaymentTerm | null>(null)
const form = ref<PaymentTermForm>({ code: '', name: '', due_days: 0, discount_percentage: 0, discount_days: 0, is_default: false, is_active: true })
async function fetchData() { loading.value = true; try { const res = await paymentTermService.getAll({ per_page: 200 }); items.value = res.data } finally { loading.value = false } }
fetchData()
function openCreate() { editingItem.value = null; form.value = { code: '', name: '', due_days: 0, discount_percentage: 0, discount_days: 0, is_default: false, is_active: true }; showFormModal.value = true }
function openEdit(item: PaymentTerm) { editingItem.value = item; form.value = { code: item.code, name: item.name, name_en: item.name_en ?? '', due_days: item.due_days, discount_percentage: item.discount_percentage, discount_days: item.discount_days, is_default: item.is_default, is_active: item.is_active, description: item.description ?? '' }; showFormModal.value = true }
async function submit() { if (!form.value.name?.trim()) return; if (editingItem.value) await paymentTermService.update(editingItem.value.ulid, form.value); else await paymentTermService.store(form.value); showFormModal.value = false; toast.value?.show(t('common.savedSuccess'), 'success'); fetchData() }
function confirmDelete(item: PaymentTerm) { deletingItem.value = item; showDeleteModal.value = true }
async function onDeleteConfirmed() { if (!deletingItem.value) return; await paymentTermService.destroy(deletingItem.value.ulid); showDeleteModal.value = false; toast.value?.show(t('common.deletedSuccess'), 'success'); fetchData() }
</script>

<style scoped>
@keyframes pageIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.header-icon-badge { width: 46px; height: 46px; border-radius: 12px; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25); display: flex; align-items: center; justify-content: center; }
.modal-icon-badge { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
.badge-primary { background: linear-gradient(135deg, #1d334f, #0d6efd); color: #fff; }
.badge-dark { background: linear-gradient(135deg, #1a1a2e, #343a40); color: #fff; }
.table-custom th { background: #f8f9fa; font-size: .83rem; font-weight: 700; color: #344054; white-space: nowrap; vertical-align: middle; }
.table-custom td { font-size: .88rem; vertical-align: middle; }
.action-icons .icon-action { cursor: pointer; transition: all .2s ease; opacity: .75; font-size: .95rem; }
.action-icons .icon-action:hover { transform: scale(1.2); opacity: 1; }
</style>
