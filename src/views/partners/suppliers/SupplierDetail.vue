<template>
    <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">
        <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
            style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">
            <div class="d-flex align-items-center gap-3">
                <div class="header-icon-badge"><i class="fas fa-truck text-white"></i></div>
                <h6 class="fw-bold text-white mb-0">{{ item?.name || $t('suppliers.title') }}</h6>
            </div>
            <div class="d-flex gap-2">
                <MDBBtn outline="light" size="sm" class="fw-semibold rounded-3" @click="$router.push('/partners/suppliers')">{{ $t('common.back') }}</MDBBtn>
                <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="showFormModal = true">{{ $t('common.edit') }}</MDBBtn>
            </div>
        </div>
        <MDBCard class="border-0 shadow-sm rounded-4 overflow-hidden">
            <MDBCardBody class="p-4">
                <MDBTabs v-model="activeTab">
                    <MDBTabNav tabsClasses="mb-3"><MDBTabItem tabId="info">{{ $t('customers.info') }}</MDBTabItem><MDBTabItem tabId="balance">{{ $t('customers.balance') }}</MDBTabItem><MDBTabItem tabId="ledger">{{ $t('customers.ledger') }}</MDBTabItem></MDBTabNav>
                    <MDBTabContent>
                        <MDBTabPane tabId="info">
                            <MDBRow class="g-3">
                                <MDBCol md="4"><div class="p-3 rounded-3 border bg-light"><small class="text-muted">{{ $t('suppliers.name') }}</small><div class="fw-semibold">{{ item?.name || '—' }}</div></div></MDBCol>
                                <MDBCol md="4"><div class="p-3 rounded-3 border bg-light"><small class="text-muted">{{ $t('suppliers.bankName') }}</small><div class="fw-semibold">{{ item?.bank_name || '—' }}</div></div></MDBCol>
                                <MDBCol md="4"><div class="p-3 rounded-3 border bg-light"><small class="text-muted">{{ $t('suppliers.bankIban') }}</small><div class="fw-semibold">{{ item?.bank_iban || '—' }}</div></div></MDBCol>
                            </MDBRow>
                        </MDBTabPane>
                        <MDBTabPane tabId="balance"><div v-if="balance" class="p-3 rounded-3 border bg-light"><small class="text-muted">{{ $t('partnerLedger.closingBalance') }}</small><div class="fw-semibold">{{ balance.closing_balance }} ({{ balance.balance_side }})</div></div></MDBTabPane>
                        <MDBTabPane tabId="ledger">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover table-striped align-middle mb-0 table-custom">
                                    <thead><tr><th>{{ $t('partnerLedger.entryNumber') }}</th><th>{{ $t('partnerLedger.entryDate') }}</th><th class="text-end">{{ $t('partnerLedger.debit') }}</th><th class="text-end">{{ $t('partnerLedger.credit') }}</th><th class="text-end">{{ $t('partnerLedger.balance') }}</th></tr></thead>
                                    <tbody><tr v-if="!ledger?.transactions?.length"><td colspan="5" class="text-center py-4">{{ $t('partnerLedger.noTransactions') }}</td></tr><tr v-for="tx in ledger?.transactions || []" :key="tx.entry_ulid"><td>{{ tx.entry_number }}</td><td>{{ tx.entry_date }}</td><td class="text-end font-monospace">{{ tx.debit }}</td><td class="text-end font-monospace">{{ tx.credit }}</td><td class="text-end font-monospace">{{ tx.running_balance }} {{ tx.running_side }}</td></tr></tbody>
                                </table>
                            </div>
                        </MDBTabPane>
                    </MDBTabContent>
                </MDBTabs>
            </MDBCardBody>
        </MDBCard>
        <SupplierFormModal v-model:show="showFormModal" :supplier="item" @saved="onSaved" />
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MDBBtn, MDBCard, MDBCardBody, MDBTabContent, MDBTabItem, MDBTabNav, MDBTabPane, MDBTabs } from 'mdb-vue-ui-kit'
import { supplierService } from '@/services/supplierService'
import type { PartnerBalance, PartnerLedger, Supplier } from '@/types/partners'
import SupplierFormModal from './SupplierFormModal.vue'
const route = useRoute()
const activeTab = ref('info')
const showFormModal = ref(false)
const item = ref<Supplier | null>(null)
const balance = ref<PartnerBalance | null>(null)
const ledger = ref<PartnerLedger | null>(null)
async function loadAll() {
  const ulid = String(route.params.ulid || '')
  if (!ulid) return
  const [showRes, balRes, ledRes] = await Promise.all([supplierService.show(ulid), supplierService.getBalance(ulid, { fiscal_year_id: localStorage.getItem('fiscal_year_id') }), supplierService.getLedger(ulid, { fiscal_year_id: localStorage.getItem('fiscal_year_id') })])
  item.value = showRes.data
  balance.value = balRes.data
  ledger.value = ledRes.data
}
watch(() => route.params.ulid, loadAll, { immediate: true })
function onSaved(updated: Supplier) { item.value = updated }
</script>

<style scoped>
@keyframes pageIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.header-icon-badge { width: 46px; height: 46px; border-radius: 12px; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25); display: flex; align-items: center; justify-content: center; }
.table-custom th { background: #f8f9fa; font-size: .83rem; font-weight: 700; color: #344054; white-space: nowrap; vertical-align: middle; }
.table-custom td { font-size: .88rem; vertical-align: middle; }
</style>
