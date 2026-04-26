<!-- ================================================================
     FiscalYearShowModal.vue
================================================================ -->
<template>
  <MDBModal v-model="isOpen" tabindex="-1" centered size="lg">

    <!-- Header -->
    <MDBModalHeader class="show-modal-header border-0 pb-0">
      <div class="d-flex align-items-center gap-3">
        <div class="show-icon-badge">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div>
          <MDBModalTitle class="fw-bold mb-0">{{ t('fiscalYears.details') }}</MDBModalTitle>
          <p class="text-muted small mb-0 mt-1">{{ t('fiscalYears.detailsSubtitle') }}</p>
        </div>
      </div>
    </MDBModalHeader>

    <!-- Body -->
    <MDBModalBody class="px-4 pt-3 pb-2">

      <!-- Loading -->
      <div v-if="loadingDetail" class="text-center py-5">
        <div class="spinner-border text-primary" style="width:2rem;height:2rem;"></div>
        <div class="text-muted small mt-2">{{ t('common.loading') }}</div>
      </div>

      <template v-else-if="detail">

        <!-- Status Banner -->
        <div class="status-banner rounded-3 p-3 mb-4" :class="`banner-${detail.data.status_color}`">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div class="d-flex align-items-center gap-3">
              <span class="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                :class="`bg-${detail.data.status_color}`">
                <i :class="`fas fa-${detail.data.status_icon}`"></i>
                {{ detail.data.status_label }}
              </span>
              <div>
                <div class="fw-bold fs-5">{{ detail.data.name }}</div>
                <div class="small text-muted mt-1 d-flex align-items-center gap-2 flex-wrap" dir="ltr">
                  <i class="fas fa-calendar text-primary"></i>
                  {{ detail.data.start_date }}
                  <i class="fas fa-arrow-right text-muted"></i>
                  <i class="fas fa-calendar-check text-success"></i>
                  {{ detail.data.end_date }}
                </div>
              </div>
            </div>
            <i v-if="detail.data.is_default" class="fas fa-star fa-2x text-warning"></i>
          </div>
        </div>

        <!-- Progress -->
        <div v-if="detail.data.is_open" class="mb-4">
          <div class="d-flex justify-content-between mb-2">
            <span class="small fw-semibold text-muted">{{ t('fiscalYears.progress') }}</span>
            <span class="small text-muted">
              <i class="fas fa-clock me-1"></i>
              {{ detail.data.days_remaining }} {{ t('fiscalYears.daysLeft') }}
            </span>
          </div>
          <div class="progress" style="height:10px; border-radius:6px;">
            <div class="progress-bar" :class="`bg-${detail.data.progress_percentage > 80 ? 'danger' : 'primary'}`"
              :style="{ width: detail.data.progress_percentage + '%', borderRadius: '6px' }">
              {{ detail.data.progress_percentage }}%
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="row g-3 mb-4">
          <div class="col-md-6" v-for="info in infoItems" :key="info.label">
            <div class="info-item rounded-3 p-3 border">
              <div class="d-flex align-items-center gap-2 mb-1">
                <div class="info-icon-wrap">
                  <i :class="`fas fa-${info.icon} text-primary`" style="font-size:0.75rem;"></i>
                </div>
                <span class="small text-muted">{{ info.label }}</span>
              </div>
              <div class="fw-semibold" :class="info.mono ? 'font-monospace' : ''">
                {{ info.value || '—' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mb-3">
          <div class="small fw-semibold text-muted text-uppercase mb-2" style="letter-spacing:0.05em;">
            {{ t('fiscalYears.stats.overview') }}
          </div>
          <div class="row g-2">
            <div class="col-6">
              <div class="stats-box text-center rounded-3 p-3 border">
                <div class="stats-num text-primary fw-bold">{{ detail.stats.journal_entries }}</div>
                <div class="small text-muted mt-1">{{ t('fiscalYears.stats.journalEntries') }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="stats-box text-center rounded-3 p-3 border">
                <div class="stats-num text-success fw-bold">{{ detail.stats.invoices }}</div>
                <div class="small text-muted mt-1">{{ t('fiscalYears.stats.invoices') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="detail.data.notes" class="notes-box p-3 rounded-3 d-flex align-items-start gap-2">
          <i class="fas fa-sticky-note text-warning mt-1 flex-shrink-0"></i>
          <span class="small">{{ detail.data.notes }}</span>
        </div>

      </template>
    </MDBModalBody>

    <!-- Footer -->
    <MDBModalFooter class="border-0 px-4 pt-0 pb-4">
      <button class="btn btn-outline-secondary btn-sm px-4" @click="isOpen = false">
        {{ t('common.close') }}
      </button>
    </MDBModalFooter>

  </MDBModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter,
} from 'mdb-vue-ui-kit'
import { fiscalYearService } from '@/services/fiscalYearService'
import type { FiscalYear, FiscalYearStats } from '@/types/fiscalYear'

const props = defineProps<{ show: boolean; ulid: string }>()
const emit = defineEmits<{ 'update:show': [v: boolean] }>()

const { t } = useI18n()
const isOpen = computed({ get: () => props.show, set: v => emit('update:show', v) })
const loadingDetail = ref(false)
const detail = ref<{ data: FiscalYear; stats: FiscalYearStats } | null>(null)

watch(() => props.ulid, async (uid) => {
  if (!uid || !props.show) return
  loadingDetail.value = true
  try {
    detail.value = await fiscalYearService.show(uid)
  } finally {
    loadingDetail.value = false
  }
})

const infoItems = computed(() => {
  if (!detail.value) return []
  const d = detail.value.data
  return [
    { icon: 'calendar', label: t('fiscalYears.startDate'), value: d.start_date, mono: true },
    { icon: 'calendar-check', label: t('fiscalYears.endDate'), value: d.end_date, mono: true },
    { icon: 'clock', label: t('fiscalYears.duration'), value: `${d.duration_months} ${t('fiscalYears.months')}`, mono: false },
    { icon: 'user', label: t('common.createdBy'), value: d.created_by?.name ?? '—', mono: false },
    { icon: 'calendar-alt', label: t('common.createdAt'), value: d.created_at, mono: false },
    { icon: 'lock', label: t('fiscalYears.closedAt'), value: d.closed_at ?? '—', mono: false },
  ]
})
</script>

<style scoped>
.show-modal-header {
  padding: 1.5rem 1.5rem 1rem;
}

.show-icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1d334f, #1d7342);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(29, 51, 79, 0.25);
}

/* Status Banner */
.status-banner {
  border: 1px solid transparent;
}

.banner-success {
  background: #edf7f2;
  border-color: #c3e6d0 !important;
}

.banner-warning {
  background: #fffbf0;
  border-color: #ffe8a1 !important;
}

.banner-danger {
  background: #fef5f5;
  border-color: #f5c2c7 !important;
}

.banner-primary {
  background: #f0f6ff;
  border-color: #b6d4fe !important;
}

.banner-secondary {
  background: #f8f9fa;
  border-color: #dee2e6 !important;
}

/* Info Items */
.info-item {
  background: #fafbfc;
  transition: background 0.15s;
}

.info-item:hover {
  background: #f0f7ff;
}

.info-icon-wrap {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #e8f0fe;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Stats */
.stats-box {
  background: #fafbfc;
  transition: transform 0.15s, box-shadow 0.15s;
}

.stats-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.stats-num {
  font-size: 2rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

/* Notes */
.notes-box {
  background: #fffef0;
  border: 1px solid #fde8a1;
}
</style>