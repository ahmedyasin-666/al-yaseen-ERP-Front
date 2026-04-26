```vue
<template>
    <MDBModal v-model="isOpen" tabindex="-1" centered size="lg" @hide="onHide">
        <MDBModalHeader class="modal-header-custom border-0 pb-0">
            <div class="d-flex align-items-center gap-3">
                <div class="modal-icon-badge" :class="isEdit ? 'badge-dark' : 'badge-primary'">
                    <i :class="isEdit ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
                </div>
                <div>
                    <MDBModalTitle class="fw-bold mb-0">
                        {{ isEdit ? $t('accounts.editTitle') : $t('accounts.createTitle') }}
                    </MDBModalTitle>
                    <p class="text-muted small mb-0 mt-1">{{ $t('accounts.formSubtitle') }}</p>
                </div>
            </div>
        </MDBModalHeader>

        <MDBModalBody class="px-4 pt-3 pb-2" :dir="langStore.dir">
            <MDBRow class="g-3">

                <!-- Code -->
                <MDBCol md="4">
                    <label class="form-label fw-semibold small">
                        {{ $t('accounts.code') }} <span class="text-danger">*</span>
                    </label>
                    <div class="input-group input-group-lg">
                        <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                        <input v-model="form.code" type="text" class="form-control"
                            :class="{ 'is-invalid': errors.code }" placeholder="e.g. 1001"  />
                    </div>
                    <div v-if="errors.code" class="invalid-feedback d-block mt-1 small">
                        {{ errors.code }}
                    </div>
                </MDBCol>

                <!-- Type -->
                <MDBCol md="4">
                    <label class="form-label fw-semibold small">
                        {{ $t('accounts.type') }} <span class="text-danger">*</span>
                    </label>
                    <div class="input-group input-group-lg">
                        <span class="input-group-text"><i class="fas fa-tag"></i></span>
                        <MDBSelect v-model="form.type" :options="typeOptions" :placeholder="$t('accounts.type')"
                            :dir="langStore.dir" height="44px" />
                    </div>
                    <div v-if="errors.type" class="invalid-feedback d-block mt-1 small">
                        {{ errors.type }}
                    </div>
                </MDBCol>

                <!-- Parent Account -->
                <MDBCol md="4">
                    <label class="form-label fw-semibold small">{{ $t('accounts.parentAccount') }}</label>
                    <div class="input-group input-group-lg">
                        <span class="input-group-text"><i class="fas fa-level-up-alt"></i></span>
                        <MDBSelect v-model="form.parent_id" :options="parentOptions"
                            :placeholder="$t('accounts.parentAccount')" :dir="langStore.dir" filter clearButton
                            height="44px" />
                    </div>
                </MDBCol>

                <!-- Name AR -->
                <MDBCol md="6">
                    <label class="form-label fw-semibold small">
                        {{ $t('accounts.name') }} <span class="text-danger">*</span>
                    </label>
                    <div class="input-group input-group-lg">
                        <span class="input-group-text"><i class="fas fa-font"></i></span>
                        <input v-model="form.name" type="text" class="form-control"
                            :class="{ 'is-invalid': errors.name }" :placeholder="$t('accounts.namePlaceholder')" />
                    </div>
                    <div v-if="errors.name" class="invalid-feedback d-block mt-1 small">
                        {{ errors.name }}
                    </div>
                </MDBCol>

                <!-- Name EN -->
                <MDBCol md="6">
                    <label class="form-label fw-semibold small">{{ $t('accounts.nameEn') }}</label>
                    <div class="input-group input-group-lg">
                        <span class="input-group-text"><i class="fas fa-language"></i></span>
                        <input v-model="form.name_en" type="text" class="form-control" placeholder="English name"
                             />
                    </div>
                </MDBCol>

                <!-- Opening Balance -->
                <MDBCol md="4">
                    <label class="form-label fw-semibold small">{{ $t('accounts.openingBalance') }}</label>
                    <div class="input-group input-group-lg">
                        <span class="input-group-text"><i class="fas fa-coins"></i></span>
                        <input v-model.number="form.opening_balance" type="number" class="form-control" min="0"
                            step="0.01" placeholder="0.00"  />
                    </div>
                </MDBCol>

                <!-- Opening Side -->
                <MDBCol md="4">
                    <label class="form-label fw-semibold small">{{ $t('accounts.openingBalanceSide') }}</label>
                    <div class="input-group input-group-lg">
                        <span class="input-group-text"><i class="fas fa-balance-scale"></i></span>
                        <MDBSelect v-model="form.opening_balance_side" :options="sideOptions"
                            :placeholder="$t('accounts.openingBalanceSide')" :dir="langStore.dir" height="44.63px" />
                    </div>
                </MDBCol>

                <!-- Opening Date -->
                <MDBCol md="4">
                    <label class="form-label fw-semibold small">{{ $t('accounts.openingBalanceDate') }}</label>
                    <div class="input-group input-group-lg" >
                        <span class="input-group-text"><i class="fas fa-calendar"></i></span>
                        <input v-model="form.opening_balance_date" type="date" class="form-control" />
                    </div>
                </MDBCol>

                <!-- Flags Row -->
                <MDBCol md="12">
                    <div class="d-flex gap-3 flex-wrap">

                        <div
                            class="toggle-card flex-1 d-flex align-items-center justify-content-between p-3 rounded-3 border">
                            <div>
                                <div class="fw-semibold small">{{ $t('accounts.allowPosting') }}</div>
                                <div class="text-muted" style="font-size:0.75rem;">{{ $t('accounts.allowPostingHint') }}
                                </div>
                            </div>
                            <MDBSwitch v-model="form.allow_posting" />
                        </div>

                        <div
                            class="toggle-card flex-1 d-flex align-items-center justify-content-between p-3 rounded-3 border">
                            <div>
                                <div class="fw-semibold small">{{ $t('accounts.cashAccount') }}</div>
                                <div class="text-muted" style="font-size:0.75rem;">{{ $t('accounts.cashAccountHint') }}
                                </div>
                            </div>
                            <MDBSwitch v-model="form.is_cash_account" />
                        </div>

                        <div
                            class="toggle-card flex-1 d-flex align-items-center justify-content-between p-3 rounded-3 border">
                            <div>
                                <div class="fw-semibold small">{{ $t('accounts.bankAccount') }}</div>
                                <div class="text-muted" style="font-size:0.75rem;">{{ $t('accounts.bankAccountHint') }}
                                </div>
                            </div>
                            <MDBSwitch v-model="form.is_bank_account" />
                        </div>

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
            <MDBBtn outline="secondary" size="sm" class="px-4" @click="isOpen = false" :disabled="loading">
                {{ $t('common.cancel') }}
            </MDBBtn>
            <MDBBtn :color="isEdit ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold" @click="onSubmit"
                :disabled="loading">
                <span v-if="loading" class="d-flex align-items-center gap-2">
                    <MDBSpinner size="sm" />{{ $t('common.saving') }}
                </span>
                <span v-else class="d-flex align-items-center gap-1">
                    <i :class="isEdit ? 'fas fa-save' : 'fas fa-plus'"></i>
                    {{ isEdit ? $t('common.save') : $t('accounts.create') }}
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
    MDBRow, MDBCol, MDBBtn, MDBSpinner, MDBSwitch,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { accountService } from '@/services/financialService'
import { useLangStore } from '@/stores/langStore'
import type { Account, AccountForm } from '@/types/financial'
import type { SelectOption } from '@/types/company'

const props = defineProps<{ show: boolean; account: Account | null }>()
const emit = defineEmits<{ 'update:show': [v: boolean]; saved: [acc: Account, isNew: boolean] }>()

const { t } = useI18n()
const langStore = useLangStore()
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const generalError = ref('')
const parentOptions = ref<SelectOption[]>([])

const isOpen = computed({ get: () => props.show, set: v => emit('update:show', v) })
const isEdit = computed(() => !!props.account)

const defaultForm = (): AccountForm => ({
    code: '', name: '', name_en: '', type: 'asset',
    parent_id: null, allow_posting: true,
    is_cash_account: false, is_bank_account: false,
    opening_balance: 0, opening_balance_side: 'debit',
    status: 'active', notes: '',
})

const form = ref<AccountForm>(defaultForm())

const typeOptions = computed(() => [
    { value: 'asset', text: t('accounts.types.asset') },
    { value: 'liability', text: t('accounts.types.liability') },
    { value: 'equity', text: t('accounts.types.equity') },
    { value: 'revenue', text: t('accounts.types.revenue') },
    { value: 'expense', text: t('accounts.types.expense') },
])

const sideOptions = computed(() => [
    { value: 'debit', text: t('accounts.debit') },
    { value: 'credit', text: t('accounts.credit') },
])

onMounted(async () => {
    try {
        const res = await accountService.getDropdown()
        parentOptions.value = [
            { value: '', text: `— ${t('accounts.noParent')} —` },
            ...res.map(a => ({ value: a.ulid, text: `${a.code} — ${a.name}` })),
        ]
    } catch { /* silent */ }
})

watch(() => props.account, (acc) => {
    if (acc) {
        form.value = {
            code: acc.code,
            name: acc.name,
            name_en: acc.name_en ?? '',
            type: acc.type,
            parent_id: acc.parent?.ulid ?? null,
            allow_posting: acc.allow_posting,
            is_cash_account: acc.is_cash_account,
            is_bank_account: acc.is_bank_account,
            opening_balance: parseFloat(acc.opening_balance) || 0,
            opening_balance_side: acc.opening_balance_side,
            opening_balance_date: acc.opening_balance_date ?? '',
            status: acc.status,
            notes: acc.notes ?? '',
        }
    } else {
        form.value = defaultForm()
    }
    errors.value = {}
    generalError.value = ''
}, { immediate: true })

function onHide() {
    errors.value = {}
    generalError.value = ''
}

async function onSubmit() {
    errors.value = {}
    generalError.value = ''
    loading.value = true
    try {
        const payload = { ...form.value }
        if (!payload.parent_id) delete payload.parent_id

        let res
        if (isEdit.value && props.account) {
            res = await accountService.update(props.account.ulid, payload)
        } else {
            res = await accountService.store(payload)
        }
        emit('saved', res.data, !isEdit.value)
        isOpen.value = false
        form.value = defaultForm()
    } catch (e: any) {
        const status = e?.response?.status
        const errs = e?.response?.data?.errors ?? {}

        if (status === 422 && Object.keys(errs).length) {
            Object.entries(errs).forEach(([k, v]) => {
                errors.value[k] = (v as string[])[0] ?? ''
            })
            return
        }

        generalError.value = e?.response?.data?.message ?? t('common.error')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.modal-header-custom {
    padding: 1.5rem 1.5rem 1rem;
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
    min-width: 180px;
}

.toggle-card:has(input:checked) {
    background: #e8f5ee;
    border-color: #1d7342 !important;
}

:deep(.btn-primary) {
    background: #1d334f !important;
    border-color: #1d334f !important;
}
</style>
```