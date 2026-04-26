<template>
    <MDBModal v-model="isOpen" tabindex="-1" centered size="xl" @hide="onHide">
        <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 1rem;">
            <div class="d-flex align-items-center gap-3">
                <div class="modal-icon-badge" :class="isEdit ? 'badge-dark' : 'badge-primary'">
                    <i :class="isEdit ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
                </div>
                <div>
                    <MDBModalTitle class="fw-bold mb-0">{{ isEdit ? $t('entries.editTitle') : $t('entries.createTitle')
                    }}</MDBModalTitle>
                    <p class="text-muted small mb-0 mt-1">{{ $t('entries.formSubtitle') }}</p>
                </div>
            </div>
        </MDBModalHeader>

        <MDBModalBody class="px-4 pt-3 pb-2" :dir="langStore.dir">

            <!-- Header Fields -->
            <div class="rounded-3 p-3 mb-4" style="background:#f8fafb;border:1px solid #e3e8ed;">
                <div class="fw-bold small text-muted mb-3 text-uppercase" style="letter-spacing:.05em;">
                    <i class="fas fa-info-circle me-2 text-primary"></i>{{ $t('entries.headerInfo') }}
                </div>
                <MDBRow class="g-3">
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">{{ $t('entries.journal') }} <span
                                class="text-danger">*</span></label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-book"></i></span>
                            <MDBSelect v-model="form.financial_journal_id" :options="journalOptions"
                                :placeholder="$t('entries.journal')" :dir="langStore.dir" height="44px" filter />
                        </div>
                        <div v-if="errors.financial_journal_id" class="invalid-feedback d-block mt-1 small">{{
                            errors.financial_journal_id }}</div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">{{ $t('entries.date') }} <span
                                class="text-danger">*</span></label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-calendar"></i></span>
                            <input v-model="form.entry_date" type="date" class="form-control"
                                :class="{ 'is-invalid': errors.entry_date }" />
                            <div v-if="errors.entry_date" class="invalid-feedback">{{ errors.entry_date }}</div>
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">{{ $t('entries.fiscalYear') }} <span
                                class="text-danger">*</span></label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                            <MDBSelect v-model="form.fiscal_year_id" :options="fiscalYearOptions"
                                :placeholder="$t('entries.fiscalYear')" height="44px" :dir="langStore.dir" />
                        </div>
                    </MDBCol>
                    <MDBCol md="8">
                        <label class="form-label fw-semibold small">{{ $t('entries.description') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-align-left"></i></span>
                            <input v-model="form.description" type="text" class="form-control"
                                :placeholder="$t('entries.descriptionPlaceholder')" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small">{{ $t('entries.reference') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-link"></i></span>
                            <input v-model="form.reference" type="text" class="form-control" dir="ltr"
                                placeholder="REF-001" />
                        </div>
                    </MDBCol>
                </MDBRow>
            </div>

            <!-- Lines -->
            <div class="mb-3">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="fw-bold small text-muted text-uppercase" style="letter-spacing:.05em;">
                        <i class="fas fa-list me-2 text-primary"></i>{{ $t('entries.lines.title') }}
                        <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-2">{{ form.lines.length
                        }}</span>
                    </div>
                    <MDBBtn color="success" size="sm" class="rounded-3 fw-semibold" @click="addLine">
                        <i class="fas fa-plus me-1"></i>{{ $t('entries.lines.add') }}
                    </MDBBtn>
                </div>

                <!-- Balance check -->
                <div v-if="form.lines.length >= 2"
                    class="balance-bar rounded-3 p-2 px-3 mb-3 d-flex align-items-center justify-content-between">
                    <div class="d-flex gap-4 small">
                        <span><span class="text-muted">{{ $t('accounts.debit') }}:</span> <span
                                class="fw-bold text-primary font-monospace">{{ formatAmount(totalDebit) }}</span></span>
                        <span><span class="text-muted">{{ $t('accounts.credit') }}:</span> <span
                                class="fw-bold text-success font-monospace">{{ formatAmount(totalCredit)
                                }}</span></span>
                        <span><span class="text-muted">{{ $t('entries.diff') }}:</span> <span
                                class="fw-bold font-monospace" :class="isBalanced ? 'text-success' : 'text-danger'">{{
                                    formatAmount(Math.abs(totalDebit - totalCredit)) }}</span></span>
                    </div>
                    <span class="badge rounded-pill" :class="isBalanced ? 'bg-success' : 'bg-danger'">
                        <i :class="isBalanced ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="me-1"></i>
                        {{ isBalanced ? $t('entries.balanced') : $t('entries.unbalanced') }}
                    </span>
                </div>

                <!-- Lines table -->
                <div class="table-responsive border rounded-3 overflow-hidden">
                    <table class="table table-bordered table-sm align-middle mb-0">
                        <thead>
                            <tr>
                                <th style="width:40px;" class="text-center">#</th>
                                <th style="min-width:220px;">{{ $t('entries.lines.account') }} <span
                                        class="text-danger">*</span></th>
                                <th style="min-width:150px;">{{ $t('entries.lines.costCenter') }}</th>
                                <th style="min-width:130px;" class="text-end">{{ $t('accounts.debit') }}</th>
                                <th style="min-width:130px;" class="text-end">{{ $t('accounts.credit') }}</th>
                                <th style="min-width:180px;">{{ $t('entries.lines.description') }}</th>
                                <th style="width:50px;" class="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(line, idx) in form.lines" :key="idx">
                                <td class="text-center text-muted small">{{ idx + 1 }}</td>
                                <td>
                                    <MDBSelect v-model="line.account_id" :options="accountOptions"
                                        :placeholder="$t('entries.lines.account')" size="sm" filter
                                        :dir="langStore.dir" />
                                </td>
                                <td>
                                    <MDBSelect v-model="line.cost_center_id" :options="costCenterOptions"
                                        :placeholder="$t('entries.lines.costCenter')" size="sm" filter clearButton
                                        :dir="langStore.dir" />
                                </td>
                                <td>
                                    <input v-model.number="line.debit" type="number"
                                        class="form-control form-control-sm text-end font-monospace" min="0" step="0.01"
                                        placeholder="0.00" @input="onDebitInput(line)" />
                                </td>
                                <td>
                                    <input v-model.number="line.credit" type="number"
                                        class="form-control form-control-sm text-end font-monospace" min="0" step="0.01"
                                        placeholder="0.00" @input="onCreditInput(line)" />
                                </td>
                                <td>
                                    <input v-model="line.description" type="text" class="form-control form-control-sm"
                                        :placeholder="$t('common.optional')" />
                                </td>
                                <td class="text-center">
                                    <i class="fas fa-times-circle text-danger" style="cursor:pointer;font-size:1rem;"
                                        @click="removeLine(idx)" v-if="form.lines.length > 2"></i>
                                </td>
                            </tr>
                            <tr v-if="form.lines.length === 0">
                                <td colspan="7" class="text-center text-muted py-3 small">
                                    {{ $t('entries.lines.empty') }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="errors.lines" class="text-danger small mt-1">{{ errors.lines }}</div>
            </div>

            <!-- General Error -->
            <div v-if="generalError" class="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i class="fas fa-exclamation-circle"></i>{{ generalError }}
            </div>
        </MDBModalBody>

        <MDBModalFooter class="border-0 px-4 pt-0 pb-4 gap-2">
            <MDBBtn outline="secondary" size="sm" class="px-4" @click="isOpen = false" :disabled="loading">{{
                $t('common.cancel') }}</MDBBtn>
            <MDBBtn :color="isEdit ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold" @click="onSubmit"
                :disabled="loading">
                <span v-if="loading" class="d-flex align-items-center gap-2">
                    <MDBSpinner size="sm" />{{ $t('common.saving') }}
                </span>
                <span v-else class="d-flex align-items-center gap-1">
                    <i :class="isEdit ? 'fas fa-save' : 'fas fa-plus'"></i>
                    {{ isEdit ? $t('common.save') : $t('entries.create') }}
                </span>
            </MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter,
    MDBRow, MDBCol, MDBBtn, MDBSpinner,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { entryService, journalService, accountService, costCenterService } from '@/services/financialService'
import { useFiscalYearStore } from '@/stores/fiscalYearStore'
import { useLangStore } from '@/stores/langStore'
import type { JournalEntry, EntryForm } from '@/types/financial'

const props = defineProps<{ show: boolean; entry: JournalEntry | null }>()
const emit = defineEmits<{ 'update:show': [v: boolean]; saved: [e: JournalEntry, isNew: boolean] }>()

const { t } = useI18n()
const langStore = useLangStore()
const fyStore = useFiscalYearStore()
const isOpen = computed({ get: () => props.show, set: v => emit('update:show', v) })
const isEdit = computed(() => !!props.entry)
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const generalError = ref('')
const journalOptions = ref<any[]>([])
const accountOptions = ref<any[]>([])
const costCenterOptions = ref<any[]>([])

const defaultLine = () => ({ account_id: '', cost_center_id: '', debit: 0, credit: 0, description: '' })
const defaultForm = (): EntryForm => ({
    financial_journal_id: '',
    fiscal_year_id: fyStore.currentId ?? '',
    entry_date: new Date().toISOString().split('T')[0]!,
    description: '',
    reference: '',
    lines: [defaultLine(), defaultLine()],
})
const form = ref<EntryForm>(defaultForm())

const fiscalYearOptions = computed(() =>
    fyStore.years.filter(y => y.is_open).map(y => ({ value: y.ulid, text: y.name }))
)

const totalDebit = computed(() => form.value.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0))
const totalCredit = computed(() => form.value.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0))
const isBalanced = computed(() => form.value.lines.length >= 2 && Math.abs(totalDebit.value - totalCredit.value) < 0.001 && totalDebit.value > 0)

function formatAmount(val: number) {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
    await fyStore.fetchAll()
    const [journals, accounts, costCenters] = await Promise.all([
        journalService.getDropdown(),
        accountService.getDropdown({ allow_posting: true }),
        costCenterService.getDropdown(),
    ])
    journalOptions.value = journals.map(j => ({ value: j.ulid, text: `${j.code} — ${j.name}` }))
    
    accountOptions.value = [
        { value: '', text: `— ${t('entries.lines.selectAccount')} —` },
        ...accounts.map(a => ({ value: a.ulid, text: `${a.code} — ${a.name}` })),
    ]
    costCenterOptions.value = [
        { value: '', text: `— ${t('entries.lines.noCostCenter')} —` },
        ...costCenters.map(c => ({ value: c.ulid, text: `${c.code} — ${c.name}` })),
    ]
})

function onDebitInput(line: any) {
    if (line.debit > 0) {
        line.credit = 0
    }
}

function onCreditInput(line: any) {
    if (line.credit > 0) {
        line.debit = 0
    }
}

watch(() => props.entry, (e) => {
    if (e) {
        form.value = {
            financial_journal_id: e.financial_journal?.ulid ?? '',
            fiscal_year_id: e.fiscal_year?.ulid ?? '',
            entry_date: e.entry_date,
            description: e.description ?? '',
            reference: e.reference ?? '',
            lines: e.lines?.map(l => ({
                account_id: l.account?.ulid ?? '',
                cost_center_id: l.cost_center?.ulid ?? '',
                debit: parseFloat(l.debit) || 0,
                credit: parseFloat(l.credit) || 0,
                description: l.description ?? '',
            })) ?? [defaultLine(), defaultLine()],
        }
    } else {
        form.value = defaultForm()
    }
    errors.value = {}
    generalError.value = ''
}, { immediate: true })

function addLine() { form.value.lines.push(defaultLine()) }
function removeLine(i: number) { form.value.lines.splice(i, 1) }
function onHide() { errors.value = {}; generalError.value = '' }

async function onSubmit() {
    errors.value = {}; generalError.value = ''
    if (!form.value.financial_journal_id) { errors.value.financial_journal_id = t('journals.required'); return }
    if (!form.value.fiscal_year_id) { errors.value.fiscal_year_id = t('entries.fiscalYearRequired'); return }
    if (form.value.lines.length < 2) { errors.value.lines = t('entries.minLines'); return }
    if (!isBalanced.value) { errors.value.lines = t('entries.unbalancedError'); return }

    loading.value = true
    try {
        let res
        if (isEdit.value && props.entry) {
            res = await entryService.update(props.entry.ulid, form.value)
        } else {
            res = await entryService.store(form.value)
        }
        emit('saved', res.data, !isEdit.value)
        isOpen.value = false
    } catch (e: any) {
        const errs = e?.response?.data?.errors ?? {}
        Object.entries(errs).forEach(([k, v]) => { errors.value[k] = (v as string[])[0] ?? '' })
        generalError.value = e?.response?.data?.message ?? t('common.error')
    } finally { loading.value = false }
}
</script>

<style scoped>
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

.balance-bar {
    background: #f8fafb;
    border: 1px solid #e3e8ed;
}
</style>