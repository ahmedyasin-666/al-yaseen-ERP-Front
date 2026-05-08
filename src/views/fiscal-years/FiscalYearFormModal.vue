<template>
  <MDBModal v-model="isOpen" tabindex="-1" centered size="lg" @hide="onHide">

    <!-- Header -->
    <MDBModalHeader class="modal-header-custom border-0 pb-0">
      <div class="d-flex align-items-center gap-3">
        <div class="modal-icon-badge" :class="isEdit ? 'badge-dark' : 'badge-primary'">
          <MDBIcon :icon="isEdit ? 'edit' : 'plus-circle'" />
        </div>
        <div>
          <MDBModalTitle class="fw-bold mb-0">
            {{ isEdit ? t('fiscalYears.editTitle') : t('fiscalYears.createTitle') }}
          </MDBModalTitle>
          <p class="text-muted small mb-0 mt-1">
            {{ isEdit ? t('fiscalYears.editSubtitle') : t('fiscalYears.createSubtitle') }}
          </p>
        </div>
      </div>
    </MDBModalHeader>

    <!-- Body -->
    <MDBModalBody class="px-4 pt-3 pb-2" :dir="langStore.dir">

      <!-- General Error -->
      <div v-if="generalError"
        class="alert alert-danger d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-3 small">
        <MDBIcon icon="exclamation-circle" class="flex-shrink-0" />
        {{ generalError }}
      </div>

      <MDBRow class="g-3">

        <!-- Start Date -->
        <MDBCol md="6">
          <label class="form-label fw-semibold small mb-1">
            {{ t('fiscalYears.startDate') }}
            <span class="text-danger ms-1">*</span>
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <MDBIcon icon="calendar" class="text-primary" />
            </span>
            <input v-model="form.start_date" type="date" class="form-control"
              :class="{ 'is-invalid': errors.start_date }" @change="onStartDateChange" />
          </div>
          <div v-if="errors.start_date" class="invalid-feedback d-block mt-1 small">
            {{ errors.start_date }}
          </div>
        </MDBCol>

        <!-- End Date -->
        <MDBCol md="6">
          <label class="form-label fw-semibold small mb-1">
            {{ t('fiscalYears.endDate') }}
            <span class="text-danger ms-1">*</span>
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <MDBIcon icon="calendar-check" class="text-success" />
            </span>
            <input v-model="form.end_date" type="date" class="form-control"
              :class="{ 'is-invalid': errors.end_date }" />
          </div>
          <div v-if="errors.end_date" class="invalid-feedback d-block mt-1 small">
            {{ errors.end_date }}
          </div>
        </MDBCol>

        <!-- Name -->
        <MDBCol md="6">
          <label class="form-label fw-semibold small mb-1">
            {{ t('fiscalYears.name') }}
            <span class="text-danger ms-1">*</span>
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <MDBIcon icon="tag" class="text-muted" />
            </span>
            <input v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
              :placeholder="t('fiscalYears.nameHint')" />
          </div>
          <div v-if="errors.name" class="invalid-feedback d-block mt-1 small">
            {{ errors.name }}
          </div>
        </MDBCol>

        <!-- Code -->
        <MDBCol md="6">
          <label class="form-label fw-semibold small mb-1">
            {{ t('fiscalYears.code') }}
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <MDBIcon icon="hashtag" class="text-muted" />
            </span>
            <input v-model="form.code" type="text" class="form-control" dir="ltr"
              :class="{ 'is-invalid': errors.code }" :placeholder="t('fiscalYears.codeHint')" />
          </div>
          <div v-if="errors.code" class="invalid-feedback d-block mt-1 small">
            {{ errors.code }}
          </div>
        </MDBCol>

        <!-- Period Type -->
        <MDBCol md="6">
          <label class="form-label fw-semibold small mb-1">
            {{ t('fiscalYears.periodType') }}
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <MDBIcon icon="sliders-h" class="text-muted" />
            </span>
            <select v-model="form.period_type" class="form-select" :class="{ 'is-invalid': errors.period_type }">
              <option value="monthly">{{ t('fiscalYears.periodTypes.monthly') }}</option>
              <option value="quarterly">{{ t('fiscalYears.periodTypes.quarterly') }}</option>
              <option value="custom">{{ t('fiscalYears.periodTypes.custom') }}</option>
            </select>
          </div>
          <div v-if="errors.period_type" class="invalid-feedback d-block mt-1 small">
            {{ errors.period_type }}
          </div>
        </MDBCol>

        <!-- Periods Count (custom) -->
        <MDBCol md="6" v-if="form.period_type === 'custom'">
          <label class="form-label fw-semibold small mb-1">
            {{ t('fiscalYears.periodsCount') }}
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <MDBIcon icon="list-ol" class="text-muted" />
            </span>
            <input v-model.number="form.periods_count" type="number" min="1" step="1" class="form-control" dir="ltr"
              :class="{ 'is-invalid': errors.periods_count }" />
          </div>
          <div v-if="errors.periods_count" class="invalid-feedback d-block mt-1 small">
            {{ errors.periods_count }}
          </div>
        </MDBCol>

        <!-- Is Default -->
        <MDBCol md="6" class="d-flex align-items-end pb-1">
          <div class="toggle-card w-100 d-flex align-items-center justify-content-between p-3 rounded-3 border">
            <div>
              <div class="fw-semibold small">{{ t('fiscalYears.setDefault') }}</div>
              <div class="text-muted" style="font-size:0.75rem;">
                {{ t('fiscalYears.setDefaultHint') }}
              </div>
            </div>
            <MDBSwitch v-model="form.is_default" />
          </div>
        </MDBCol>

        <!-- Notes -->
        <MDBCol cols="12">
          <label class="form-label fw-semibold small mb-1">
            {{ t('common.notes') }}
          </label>
          <div class="input-group">
            <span class="input-group-text">
              <MDBIcon icon="sticky-note" class="text-muted" />
            </span>
            <textarea v-model="form.notes" class="form-control" rows="2"
              :placeholder="t('fiscalYears.notesPlaceholder')" />
          </div>
        </MDBCol>

        <!-- Duration Preview -->
        <MDBCol cols="12" v-if="form.start_date && form.end_date">
          <div class="preview-card d-flex align-items-center justify-content-between p-3 rounded-3">
            <div class="d-flex align-items-center gap-3 small">
              <div class="d-flex align-items-center gap-1">
                <MDBIcon icon="calendar" class="text-primary" size="sm" />
                <span class="fw-semibold">{{ form.start_date }}</span>
              </div>
              <MDBIcon :icon="langStore.isRtl ? 'arrow-left' : 'arrow-right'" class="text-muted" size="sm" />
              <div class="d-flex align-items-center gap-1">
                <MDBIcon icon="calendar-check" class="text-success" size="sm" />
                <span class="fw-semibold">{{ form.end_date }}</span>
              </div>
            </div>
            <MDBBadge color="success" pill class="px-3 py-2">
              <MDBIcon icon="clock" class="me-1" size="sm" />
              {{ previewDuration }} {{ t('fiscalYears.months') }}
            </MDBBadge>
          </div>
        </MDBCol>

      </MDBRow>
    </MDBModalBody>

    <!-- Footer -->
    <MDBModalFooter class="border-0 px-4 pt-0 pb-4 gap-2">
      <MDBBtn outline="secondary" size="sm" class="px-4" @click="isOpen = false" :disabled="loading">
        {{ t('common.cancel') }}
      </MDBBtn>
      <MDBBtn :color="isEdit ? 'dark' : 'primary'" size="sm" class="px-4 fw-semibold" @click="onSubmit"
        :disabled="loading">
        <span v-if="loading" class="d-flex align-items-center gap-2">
          <MDBSpinner size="sm" />
          {{ t('common.saving') }}
        </span>
        <span v-else class="d-flex align-items-center gap-1">
          <MDBIcon :icon="isEdit ? 'save' : 'plus'" size="sm" />
          {{ isEdit ? t('common.save') : t('fiscalYears.create') }}
        </span>
      </MDBBtn>
    </MDBModalFooter>

  </MDBModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter,
  MDBRow, MDBCol, MDBSwitch,
  MDBBtn, MDBIcon, MDBSpinner, MDBBadge,
} from 'mdb-vue-ui-kit'
import { fiscalYearService } from '@/services/fiscalYearService'
import { useLangStore } from '@/stores/langStore'
import type { FiscalYear, FiscalYearForm } from '@/types/fiscalYear'

const props = defineProps<{ show: boolean; year: FiscalYear | null }>()
const emit = defineEmits<{ 'update:show': [v: boolean]; saved: [year: FiscalYear, isNew: boolean] }>()

const { t } = useI18n()
const langStore = useLangStore()

const loading = ref(false)
const errors = ref<Partial<FiscalYearForm>>({})
const generalError = ref('')

const isOpen = computed({
  get: () => props.show,
  set: v => emit('update:show', v)
})

const isEdit = computed(() => !!props.year)

const defaultForm = (): FiscalYearForm => ({
  name: '',
  code: '',
  start_date: '',
  end_date: '',
  period_type: 'monthly',
  periods_count: undefined,
  is_default: false,
  notes: '',
})

const form = ref<FiscalYearForm>(defaultForm())

watch(() => props.year, (y) => {
  if (y) {
    form.value = {
      name: y.name,
      code: (y as any).code ?? '',
      start_date: y.start_date,
      end_date: y.end_date,
      period_type: ((y as any).period_type as any) ?? 'monthly',
      periods_count: (y as any).periods_count ?? undefined,
      is_default: y.is_default,
      notes: y.notes ?? '',
    }
  } else {
    form.value = defaultForm()
  }
  errors.value = {}
  generalError.value = ''
}, { immediate: true })

const previewDuration = computed(() => {
  if (!form.value.start_date || !form.value.end_date) return 0
  const s = new Date(form.value.start_date)
  const e = new Date(form.value.end_date)
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 30)) + 1
})

function onStartDateChange() {
  if (form.value.start_date && !isEdit.value) {
    const s = new Date(form.value.start_date)
    const e = new Date(s)
    e.setFullYear(e.getFullYear() + 1)
    e.setDate(e.getDate() - 1)
    form.value.end_date = e.toISOString().split('T')[0]!
    const eYear = e.getFullYear()
    form.value.name =
      s.getFullYear() === eYear
        ? String(s.getFullYear())
        : `${s.getFullYear()}-${eYear}`
  }
}

function onHide() {
  errors.value = {}
  generalError.value = ''
}

async function onSubmit() {
  errors.value = {}
  generalError.value = ''
  loading.value = true

  try {
    let res

    if (isEdit.value && props.year) {
      res = await fiscalYearService.update(props.year.ulid, form.value)
    } else {
      res = await fiscalYearService.store(form.value)
    }

    emit('saved', res.data, !isEdit.value)
    isOpen.value = false
    form.value = defaultForm()

  } catch (e: any) {
    const status = e?.response?.status
    const errData = e?.response?.data

    if (status === 422 && errData?.errors) {
      Object.entries(errData.errors).forEach(([k, v]) => {
        errors.value[k as keyof FiscalYearForm] = Array.isArray(v) ? v[0] : v as any
      })
      return
    }

    generalError.value = errData?.message ?? t('common.error')

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

.preview-card {
  background: linear-gradient(135deg, #f0f7ff, #f0faf5);
  border: 1px solid #c8ddf0;
}

:deep(.btn-primary) {
  background: #1d334f !important;
  border-color: #1d334f !important;
}
</style>