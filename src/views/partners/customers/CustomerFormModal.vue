<template>
    <MDBModal v-model="showModel" tabindex="-1" centered size="xl" @hide="onHide">

        <!-- ── Header ── -->
        <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 0.75rem;">
            <div class="d-flex align-items-center gap-3 w-100">
                <div class="modal-icon-badge" :class="customer ? 'badge-edit' : 'badge-create'">
                    <i :class="customer ? 'fas fa-user-edit' : 'fas fa-user-plus'"></i>
                </div>
                <div class="flex-grow-1">
                    <MDBModalTitle class="fw-bold mb-0 fs-6">
                        {{ customer ? $t('customers.editCustomer') : $t('customers.addCustomer') }}
                    </MDBModalTitle>
                    <small class="text-muted">{{ stepSubtitle }}</small>
                </div>
                <!-- Step pills -->
                <div class="d-none d-md-flex gap-1">
                    <span v-for="n in 4" :key="n"
                        class="step-pill"
                        :class="{ 'step-pill--active': currentStep === n, 'step-pill--done': currentStep > n }">
                        <i v-if="currentStep > n" class="fas fa-check" style="font-size:.6rem;"></i>
                        <span v-else>{{ n }}</span>
                    </span>
                </div>
            </div>
        </MDBModalHeader>

        <!-- ── Wizard progress bar ── -->
        <div class="wizard-bar-wrap px-4 pt-2 pb-0">
            <div class="wizard-bar">
                <div class="wizard-bar-fill" :style="{ width: ((currentStep - 1) / 3 * 100) + '%' }"></div>
            </div>
            <div class="wizard-labels">
                <span v-for="(label, i) in stepLabels" :key="i"
                    class="wizard-label"
                    :class="{ active: currentStep === i + 1, done: currentStep > i + 1 }">
                    {{ label }}
                </span>
            </div>
            <div v-if="stepError" class="alert alert-danger py-1 px-3 mt-2 mb-0 small d-flex align-items-center gap-2">
                <i class="fas fa-exclamation-circle"></i> {{ stepError }}
            </div>
        </div>

        <!-- ── Body ── -->
        <MDBModalBody class="px-4 pt-3 pb-2">
            <MDBRow class="g-3">

                <!-- Step 1: Basic Info -->
                <template v-if="currentStep === 1">
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">
                            {{ $t('customers.name') }} <span class="text-danger">*</span>
                        </label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-user text-primary"></i></span>
                            <input v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': stepError && !form.name?.trim() }" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.nameEn') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-language text-muted"></i></span>
                            <input v-model="form.name_en" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.code') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-hashtag text-muted"></i></span>
                            <input v-model="form.code" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>

                    <MDBCol md="12"><div class="section-divider"><span>{{ $t('customers.sections.legalInfo') }}</span></div></MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.taxNumber') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-receipt text-muted"></i></span>
                            <input v-model="form.tax_number" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.vatNumber') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-file-invoice-dollar text-muted"></i></span>
                            <input v-model="form.vat_number" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.commercialNumber') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-id-badge text-muted"></i></span>
                            <input v-model="form.commercial_number" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                </template>

                <!-- Step 2: Contact & Location -->
                <template v-if="currentStep === 2">
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.email') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-envelope text-primary"></i></span>
                            <input v-model="form.email" type="email" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.phone') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-phone text-muted"></i></span>
                            <input v-model="form.phone" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.mobile') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-mobile-alt text-muted"></i></span>
                            <input v-model="form.mobile" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="6">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.website') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-globe text-muted"></i></span>
                            <input v-model="form.website" type="text" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="6">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.contactPerson') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-id-card text-muted"></i></span>
                            <input v-model="form.contact_person" type="text" class="form-control" />
                        </div>
                    </MDBCol>
                    <MDBCol md="12">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.address') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-map-marker-alt text-muted"></i></span>
                            <input v-model="form.address" type="text" class="form-control" />
                        </div>
                    </MDBCol>

                    <MDBCol md="12"><div class="section-divider"><span>{{ $t('customers.sections.geography') }}</span></div></MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.country') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-flag text-muted"></i></span>
                            <MDBSelect v-model="form.country_id" :options="countryOptions" height="44px" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.region') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-map text-muted"></i></span>
                            <MDBSelect v-model="form.region_id" :options="regionOptions" height="44px" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.city') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-city text-muted"></i></span>
                            <MDBSelect v-model="form.city_id" :options="cityOptions" height="44px" />
                        </div>
                    </MDBCol>
                </template>

                <!-- Step 3: Financial -->
                <template v-if="currentStep === 3">
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.currency') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-coins text-primary"></i></span>
                            <MDBSelect v-model="form.default_currency_id" :options="currencyOptions" height="44px" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.arAccount') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-sitemap text-muted"></i></span>
                            <MDBSelect v-model="form.ar_account_id" :options="accountOptions" height="44px" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.paymentTerm') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-file-contract text-muted"></i></span>
                            <MDBSelect v-model="form.payment_term_id" :options="paymentTermOptions" height="44px" />
                        </div>
                    </MDBCol>
                    <MDBCol md="6">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.creditLimit') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-money-bill-wave text-muted"></i></span>
                            <input v-model.number="form.credit_limit" type="number" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="6">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.creditDays') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-clock text-muted"></i></span>
                            <input v-model.number="form.credit_days" type="number" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                </template>

                <!-- Step 4: Opening Balance & Notes -->
                <template v-if="currentStep === 4">
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.openingBalance') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-balance-scale text-primary"></i></span>
                            <input v-model.number="form.opening_balance" type="number" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.openingBalanceSide') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-adjust text-muted"></i></span>
                            <MDBSelect v-model="form.opening_balance_side" :options="sideOptions" height="44px" />
                        </div>
                    </MDBCol>
                    <MDBCol md="4">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.openingBalanceDate') }}</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text"><i class="fas fa-calendar text-muted"></i></span>
                            <input v-model="form.opening_balance_date" type="date" class="form-control" dir="ltr" />
                        </div>
                    </MDBCol>
                    <MDBCol md="12">
                        <label class="form-label fw-semibold small mb-1">{{ $t('customers.notes') }}</label>
                        <div class="input-group">
                            <span class="input-group-text align-items-start pt-2"><i class="fas fa-sticky-note text-muted"></i></span>
                            <textarea v-model="form.notes" class="form-control" rows="3" />
                        </div>
                    </MDBCol>
                </template>

            </MDBRow>
        </MDBModalBody>

        <!-- ── Footer ── -->
        <MDBModalFooter class="border-0 px-4 pt-2 pb-4 gap-2 justify-content-between">
            <div>
                <MDBBtn v-if="currentStep > 1" outline="secondary" size="sm" class="px-3 rounded-3" @click="prevStep">
                    <i class="fas fa-arrow-left me-1"></i> {{ $t('common.prev') }}
                </MDBBtn>
            </div>
            <div class="d-flex gap-2">
                <MDBBtn outline="secondary" size="sm" class="px-3 rounded-3" @click="showModel = false">
                    {{ $t('common.cancel') }}
                </MDBBtn>
                <MDBBtn v-if="currentStep < 4" color="primary" size="sm" class="px-4 fw-semibold rounded-3" @click="nextStep">
                    {{ $t('common.next') }} <i class="fas fa-arrow-right ms-1"></i>
                </MDBBtn>
                <MDBBtn v-if="currentStep === 4" :color="customer ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold rounded-3" :disabled="loading" @click="submit">
                    <span v-if="loading" class="d-flex align-items-center gap-2">
                        <MDBSpinner size="sm" />{{ $t('common.saving') }}
                    </span>
                    <span v-else class="d-flex align-items-center gap-1">
                        <i :class="customer ? 'fas fa-save' : 'fas fa-plus'"></i>
                        {{ customer ? $t('common.save') : $t('customers.addCustomer') }}
                    </span>
                </MDBBtn>
            </div>
        </MDBModalFooter>

    </MDBModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBCol, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRow, MDBSpinner } from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { customerService } from '@/services/customerService'
import { geographyService } from '@/services/geographyService'
import { currencyService } from '@/services/currencyService'
import { accountService } from '@/services/financialService'
import { paymentTermService } from '@/services/paymentTermService'
import type { Customer, CustomerForm } from '@/types/partners'

const props = defineProps<{ show: boolean; customer: Customer | null }>()
const emit = defineEmits<{ 'update:show': [boolean]; saved: [Customer, boolean] }>()
const { t } = useI18n()
const showModel = computed({ get: () => props.show, set: (v: boolean) => emit('update:show', v) })
const loading = ref(false)
const currentStep = ref<number>(1)
const stepError = ref('')

const form = ref<CustomerForm>({ name: '', is_active: true, opening_balance_side: 'debit' })
const countryOptions = ref<{ value: string; text: string }[]>([])
const allRegions = ref<{ value: string; text: string; countryUlid: string }[]>([])
const allCities = ref<{ value: string; text: string; regionUlid: string }[]>([])
const currencyOptions = ref<{ value: string; text: string }[]>([])
const accountOptions = ref<{ value: string; text: string }[]>([])
const paymentTermOptions = ref<{ value: string; text: string }[]>([])
const sideOptions = computed(() => [
    { value: 'debit', text: t('accounts.debit') },
    { value: 'credit', text: t('accounts.credit') },
])

const regionOptions = computed(() =>
    allRegions.value.filter(r => r.countryUlid === form.value.country_id).map(r => ({ value: r.value, text: r.text }))
)
const cityOptions = computed(() =>
    allCities.value.filter(c => c.regionUlid === form.value.region_id).map(c => ({ value: c.value, text: c.text }))
)

const stepLabels = computed(() => [
    t('customers.sections.basicInfo'),
    t('customers.sections.contactInfo'),
    t('customers.sections.financialSettings'),
    t('customers.sections.openingBalance'),
])

const stepSubtitle = computed(() => `${t('common.page') || 'Step'} ${currentStep.value} / 4 - ${stepLabels.value[currentStep.value - 1]}`)

watch(() => form.value.country_id, () => { form.value.region_id = undefined; form.value.city_id = undefined })
watch(() => form.value.region_id, () => { form.value.city_id = undefined })
watch(showModel, (open) => { if (open) { currentStep.value = 1; stepError.value = '' } })
watch(() => props.customer, (val) => {
    if (!val) { form.value = { name: '', is_active: true, opening_balance_side: 'debit' }; return }
    form.value = {
        code: val.code ?? '', name: val.name, name_en: val.name_en ?? '',
        branch_id: val.branch?.ulid, country_id: val.country?.ulid,
        region_id: val.region?.ulid, city_id: val.city?.ulid,
        address: val.address ?? '', email: val.email ?? '',
        phone: val.phone ?? '', mobile: val.mobile ?? '',
        website: val.website ?? '', contact_person: val.contact_person ?? '',
        tax_number: val.tax_number ?? '', vat_number: val.vat_number ?? '',
        commercial_number: val.commercial_number ?? '',
        default_currency_id: val.default_currency?.ulid,
        ar_account_id: val.ar_account?.ulid, payment_term_id: val.payment_term?.ulid,
        credit_limit: val.credit_limit, credit_days: val.credit_days,
        opening_balance: val.opening_balance, opening_balance_side: val.opening_balance_side,
        opening_balance_date: val.opening_balance_date ?? '',
        is_active: val.is_active, notes: val.notes ?? '',
    }
}, { immediate: true })

async function bootstrap() {
    const [countries, regions, cities, currencies, accounts, terms] = await Promise.all([
        geographyService.getCountries(), geographyService.getAllRegions(), geographyService.getAllCities(),
        currencyService.dropdown(), accountService.getDropdown({ allow_posting: true }),
        paymentTermService.getAll({ per_page: 200 }),
    ])
    countryOptions.value = countries.map(c => ({ value: String(c.value), text: c.text }))
    allRegions.value = regions
    allCities.value = cities
    currencyOptions.value = currencies.data.map(c => ({ value: c.ulid, text: `${c.code} - ${c.name}` }))
    accountOptions.value = accounts.map(a => ({ value: a.ulid, text: `${a.code} - ${a.name}` }))
    paymentTermOptions.value = terms.data.map(t => ({ value: t.ulid, text: `${t.code} - ${t.name}` }))
}
onMounted(bootstrap)

function validateCurrentStep() {
    stepError.value = ''
    if (currentStep.value === 1 && !form.value.name?.trim()) {
        stepError.value = `${t('customers.name')} ${t('common.isRequired') ?? 'is required'}`
        return false
    }
    return true
}
function nextStep() { if (!validateCurrentStep()) return; if (currentStep.value < 4) currentStep.value++ }
function prevStep() { stepError.value = ''; if (currentStep.value > 1) currentStep.value-- }

async function submit() {
    if (!form.value.name?.trim()) return
    loading.value = true
    try {
        const res = props.customer
            ? await customerService.update(props.customer.ulid, form.value)
            : await customerService.store(form.value)
        emit('saved', res.data, !props.customer)
        showModel.value = false
    } finally { loading.value = false }
}
function onHide() { currentStep.value = 1; stepError.value = '' }
</script>

<style scoped>
/* Icon badge */
.modal-icon-badge {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
}
.badge-create { background: linear-gradient(135deg, #1d334f, #0d6efd); color: #fff; }
.badge-edit   { background: linear-gradient(135deg, #1a1a2e, #343a40); color: #fff; }

/* Step pills (top right) */
.step-pill {
    width: 26px; height: 26px; border-radius: 50%;
    background: #e9ecef; color: #adb5bd;
    display: flex; align-items: center; justify-content: center;
    font-size: .72rem; font-weight: 700;
    transition: all .25s ease;
}
.step-pill--active { background: linear-gradient(135deg, #1d334f, #0d6efd); color: #fff; }
.step-pill--done   { background: #198754; color: #fff; }

/* Progress bar */
.wizard-bar-wrap { padding-bottom: .25rem; }
.wizard-bar {
    height: 4px; background: #e9ecef; border-radius: 999px;
    overflow: hidden; position: relative;
}
.wizard-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #1d334f, #0d6efd);
    border-radius: 999px;
    transition: width .35s cubic-bezier(.4,0,.2,1);
}
.wizard-labels {
    display: flex; justify-content: space-between;
    margin-top: .35rem;
}
.wizard-label {
    font-size: .7rem; color: #adb5bd; font-weight: 600;
    text-transform: uppercase; letter-spacing: .03em;
    transition: color .25s;
    flex: 1; text-align: center;
}
.wizard-label.active { color: #0d6efd; }
.wizard-label.done   { color: #198754; }

/* Section divider */
.section-divider {
    display: flex; align-items: center; gap: .75rem;
    margin: .25rem 0 -.25rem;
}
.section-divider::before,
.section-divider::after { content: ''; flex: 1; height: 1px; background: #dee2e6; }
.section-divider span {
    font-size: .75rem; font-weight: 700; color: #6c757d;
    text-transform: uppercase; letter-spacing: .05em; white-space: nowrap;
}
</style>