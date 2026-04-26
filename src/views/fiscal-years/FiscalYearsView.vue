<template>
  <div class="container-fluid p-4" style="animation: pageIn 0.25s ease;">

    <!-- ══ Page Header Banner ══ -->
    <div class="rounded-4 px-4 py-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3"
      style="background: linear-gradient(135deg, #1d334f 0%, #1d7342 100%);">

      <!-- Left: Icon + Title + Breadcrumb -->
      <div class="d-flex align-items-center gap-3">
        <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style="width:46px;height:46px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);">
          <i class="fas fa-calendar-alt text-white"></i>
        </div>
        <div>
          <h6 class="fw-bold text-white mb-0">{{ t('fiscalYears.title') }}</h6>
          <MDBBreadcrumb class="mb-0 small">
            <MDBBreadcrumbItem>
              <a href="#" class="text-white-50 text-decoration-none">{{ t('common.home') }}</a>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem>
              <a href="#" class="text-white-50 text-decoration-none">{{ t('common.settings') }}</a>
            </MDBBreadcrumbItem>
            <MDBBreadcrumbItem active class="text-white">{{ t('fiscalYears.title') }}</MDBBreadcrumbItem>
          </MDBBreadcrumb>
        </div>
      </div>

      <!-- Right: Create Button -->
      <MDBBtn color="light" size="sm" class="fw-semibold rounded-3" @click="openCreate">
        <MDBIcon icon="plus" class="me-1" />
        {{ t('fiscalYears.create') }}
      </MDBBtn>

    </div>

    <!-- Switcher backdrop -->
    <div v-if="showSwitcher" class="switcher-backdrop" @click="showSwitcher = false" />

    <!-- ══ Stats Cards ══ -->
    <MDBRow class="g-3 mb-4">
      <MDBCol md="3" v-for="card in statCards" :key="card.key">
        <MDBCard class="border-0 shadow-lg h-100 rounded-4">
          <MDBCardBody class="d-flex align-items-center justify-content-between p-3">
            <div>
              <div class="text-muted small mb-1">{{ card.label }}</div>
              <div class="fw-bold fs-3 lh-1">{{ card.value }}</div>
            </div>
            <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
              :class="`text-${card.color} bg-${card.color} bg-opacity-10`"
              style="width:50px;height:50px;font-size:1.3rem;">
              <i :class="card.icon"></i>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>

    <!-- ══ Filters ══ -->
    <MDBCard class="border-0 shadow-lg rounded-4 mb-4">
      <MDBCardBody class="py-3 px-4">
        <MDBRow class="g-2 align-items-end">

          <!-- Search -->
          <MDBCol md="3">
            <div>
              <label class="form-label fw-bold">{{ t('common.search') }}</label>
              <MDBInput v-model="store.filters.search" :placeholder="t('common.search')" type="text" outline
                class="form-icon-trailing mb-0" @input="onSearch">
                <MDBIcon icon="search" class="trailing text-muted" />
              </MDBInput>
            </div>
          </MDBCol>

          <!-- Status -->
          <MDBCol md="2">
            <label class="form-label fw-bold">{{ t('common.status') }}</label>
            <MDBSelect v-model="store.filters.status" :options="statuses" @change="store.fetchAll()" />
          </MDBCol>

          <!-- Per Page -->
          <MDBCol md="2">
            <label class="form-label fw-bold">{{ t('common.perPage') }}</label>
            <MDBSelect v-model.number="store.filters.per_page" :options="perPages" @change="store.fetchAll()" />
          </MDBCol>

          <!-- Reset -->
          <MDBCol md="auto" class="ms-auto">
            <MDBBtn outline="secondary" size="sm" class="rounded-3" @click="store.resetFilters()">
              <MDBIcon icon="undo" class="me-1" />
              {{ t('common.reset') }}
            </MDBBtn>
          </MDBCol>

        </MDBRow>
      </MDBCardBody>
    </MDBCard>

    <!-- ══ Bulk Action Bar ══ -->
    <div v-if="selected.length > 0"
      class="bulk-bar d-flex justify-content-between align-items-center mb-3 p-2 px-3 rounded-3">
      <div class="small">
        {{ selected.length }} selected
      </div>
      <div class="d-flex gap-2">
        <BaseSvg name="trash" :size="20" class="icon-action text-danger" @click="bulkDelete" />
        <BaseSvg name="lock" :size="20" class="icon-action text-warning" @click="bulkClose" />
        <BaseSvg name="lock-open" :size="20" class="icon-action text-success" @click="bulkReopen" />
      </div>
    </div>

    <!-- ══ Table Card ══ -->
    <MDBCard class="border-0 shadow-lg rounded-4 overflow-hidden">

      <!-- Loading bar -->
      <MDBProgress v-if="store.loading" style="height:8px;border-radius:0;">
        <MDBProgressBar striped animated :value="100" />
      </MDBProgress>
      <div v-else style="height:3px;"></div>

      <div class="table-responsive p-3">
        <MDBTable border bordered hover striped class="align-middle mb-0 table-custom">
          <thead>
            <tr>
              <th scope="col">
                <MDBCheckbox :checked="selected.length === store.years.length && store.years.length > 0"
                  @change="toggleSelectAll" />
              </th>
              <th class="text-center" style="width:48px;">#</th>
              <th class="text-center" style="width:100px;">ULID</th>
              <th>{{ t('fiscalYears.name') }}</th>
              <th>{{ t('fiscalYears.period') }}</th>
              <th>{{ t('fiscalYears.duration') }}</th>
              <th style="min-width:150px;">{{ t('fiscalYears.progress') }}</th>
              <th>{{ t('fiscalYears.status.label') }}</th>
              <th class="text-center" style="width:60px;">{{ t('fiscalYears.default') }}</th>
              <th class="text-center" style="width:170px;">{{ t('common.actions') }}</th>
            </tr>
          </thead>

          <tbody>

            <!-- Loading skeleton -->
            <tr v-if="store.loading && !store.hasData">
              <td colspan="10" class="text-center py-5">
                <MDBSpinner color="primary" class="mb-2" />
                <div class="text-muted small">{{ t('common.loading') }}</div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-else-if="!store.hasData">
              <td colspan="10" class="text-center py-5">
                <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                  style="width:60px;height:60px;">
                  <MDBIcon icon="calendar-times" size="lg" class="text-muted" />
                </div>
                <div class="fw-semibold text-muted mb-2">{{ t('fiscalYears.empty') }}</div>
                <MDBBtn color="primary" size="sm" class="rounded-3" @click="openCreate">
                  <BaseSvg name="plus" :size="16" class="me-1" />
                  {{ t('fiscalYears.create') }}
                </MDBBtn>
              </td>
            </tr>

            <!-- Data rows -->
            <template v-else>
              <tr v-for="(year, index) in store.years" :key="year.ulid" :class="{ 'row-current': year.is_current }">

                <td>
                  <MDBCheckbox :checked="isSelected(year.ulid)" @change="toggleSelect(year.ulid)" />
                </td>

                <!-- # -->
                <td class="text-center text-muted small fw-semibold">
                  {{ (store.meta.current_page - 1) * store.meta.per_page + index + 1 }}
                </td>

                <!-- ULID -->
                <td class="text-center">
                  <MDBTooltip tag="div">
                    <template #reference>
                      <span class="ulid-short" @click="copyUlid(year.ulid)">
                        {{ shortUlid(year.ulid) }}
                      </span>
                    </template>
                    <template #tip>
                      <div class="text-start">
                        <div class="mb-1 small">{{ year.ulid }}</div>
                        <div class="text-primary small">Click to copy</div>
                      </div>
                    </template>
                  </MDBTooltip>
                </td>

                <!-- Name -->
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="rounded-circle flex-shrink-0" :class="`bg-${year.status_color}`"
                      style="width:8px;height:8px;display:inline-block;"></span>
                    <div>
                      <div class="fw-semibold">{{ year.name }}</div>
                      <span v-if="year.is_current"
                        class="badge rounded-pill px-2 py-1 mt-1 d-inline-flex align-items-center gap-1"
                        style="background:#e8f5ee;color:#1d7342;border:1px solid #c3e6d0;font-size:0.65rem;">
                        <i class="fas fa-circle" style="font-size:5px;"></i>
                        {{ t('fiscalYears.current') }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Period -->
                <td class="small">
                  <div class="d-flex align-items-center gap-1 text-nowrap mb-1">
                    <MDBIcon icon="calendar" class="text-primary" size="sm" />
                    <span>{{ formatDate(year.start_date) }}</span>
                  </div>
                  <div class="d-flex align-items-center gap-1 text-nowrap text-muted">
                    <MDBIcon icon="calendar-check" class="text-success" size="sm" />
                    <span>{{ formatDate(year.end_date) }}</span>
                  </div>
                </td>

                <!-- Duration -->
                <td>
                  <MDBBadge color="light" class="text-dark border fw-semibold px-2 py-1">
                    <MDBIcon icon="clock" class="text-muted me-1" size="sm" />
                    {{ year.duration_months }} {{ t('fiscalYears.months') }}
                  </MDBBadge>
                </td>

                <!-- Progress -->
                <td>
                  <template v-if="year.is_open">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small fw-semibold" :class="progressTextClass(year.progress_percentage)">
                        {{ year.progress_percentage }}%
                      </span>
                      <span class="small text-muted">
                        {{ year.days_remaining }} {{ t('fiscalYears.daysLeft') }}
                      </span>
                    </div>
                    <MDBProgress style="height:6px;border-radius:4px;">
                      <MDBProgressBar :value="year.progress_percentage"
                        :class="progressBarClass(year.progress_percentage)" style="border-radius:4px;" />
                    </MDBProgress>
                  </template>
                  <span v-else class="text-muted small">—</span>
                </td>

                <!-- Status -->
                <td>
                  <MDBBadge :color="year.status_color" pill class="px-2 d-inline-flex align-items-center gap-1">
                    <MDBIcon :icon="year.status_icon" size="sm" />
                    {{ year.status_label }}
                  </MDBBadge>
                </td>

                <!-- Default -->
                <td class="text-center">
                  <MDBIcon icon="star" :icon-style="year.is_default ? 'fas' : 'far'"
                    :class="year.is_default ? 'text-warning' : 'text-muted opacity-25'" size="lg" />
                </td>

                <!-- Actions -->
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2 action-icons">
                    <BaseSvg v-if="!year.is_current" name="exchange-alt" :size="24" class="icon-action text-primary"
                      @click="onSwitch(year)" />
                    <BaseSvg name="eye" :size="24" class="icon-action text-info" @click="openShow(year)" />
                    <BaseSvg v-if="year.is_editable" name="edit" :size="24" class="icon-action text-dark"
                      @click="openEdit(year)" />
                    <BaseSvg v-if="year.is_closed" name="lock" :size="24" class="icon-action text-warning"
                      @click="confirmLock(year)" />
                    <BaseSvg v-if="!year.is_locked" name="trash" :size="24" class="icon-action text-danger"
                      @click="confirmDelete(year)" />
                  </div>
                </td>

              </tr>
            </template>
          </tbody>
        </MDBTable>
      </div>

      <!-- ══ Pagination ══ -->
      <MDBCardBody v-if="store.meta.last_page > 1"
        class="d-flex justify-content-between align-items-center py-3 px-4 border-top">
        <small class="text-muted">
          {{ t('common.showing', { from: paginationFrom, to: paginationTo, total: store.meta.total }) }}
        </small>
        <MDBPagination small class="mb-0">
          <MDBPageNav prev @click="store.setPage(store.meta.current_page - 1)"
            :disabled="store.meta.current_page === 1" />
          <MDBPageItem v-for="p in store.meta.last_page" :key="p" :active="p === store.meta.current_page"
            @click="store.setPage(p)">
            {{ p }}
          </MDBPageItem>
          <MDBPageNav next @click="store.setPage(store.meta.current_page + 1)"
            :disabled="store.meta.current_page === store.meta.last_page" />
        </MDBPagination>
      </MDBCardBody>

    </MDBCard>

    <!-- ══ Modals ══ -->
    <FiscalYearFormModal v-model:show="showFormModal" :year="editingYear" @saved="onSaved" />
    <FiscalYearShowModal v-model:show="showDetailsModal" :ulid="showingUlid" />

    <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="t('fiscalYears.deleteTitle')"
      :message="t('fiscalYears.deleteMessage', { name: confirmTarget?.name })" :confirm-label="t('common.delete')"
      :loading="actionLoading !== null" @confirm="onDeleteConfirmed" />

    <ConfirmModal v-model:show="showLockModal" type="danger" icon="ban" :title="t('fiscalYears.lockTitle')"
      :message="t('fiscalYears.lockMessage', { name: confirmTarget?.name })"
      :confirm-label="t('fiscalYears.actions.lock')" :loading="actionLoading !== null" @confirm="onLockConfirmed" />

    <ToastNotification ref="toast" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFiscalYearStore } from '@/stores/fiscalYearStore'
import { fiscalYearService } from '@/services/fiscalYearService'
import type { FiscalYear } from '@/types/fiscalYear'
import {
  MDBRow, MDBCol, MDBCard, MDBCardBody,
  MDBTable, MDBBadge, MDBBtn, MDBIcon,
  MDBProgress, MDBProgressBar, MDBSpinner,
  MDBTooltip,
  MDBBreadcrumb, MDBBreadcrumbItem,
  MDBPagination, MDBPageNav, MDBPageItem,
  MDBInput,
  MDBCheckbox,
} from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import FiscalYearFormModal from './FiscalYearFormModal.vue'
import FiscalYearShowModal from './FiscalYearShowModal.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import ToastNotification from '@/components/shared/ToastNotification.vue'
import BaseSvg from '@/components/BaseSvg.vue'

const { t, locale } = useI18n()
const store = useFiscalYearStore()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

// ── Fiscal Year Pill state ─────────────────────────────────────────
const showSwitcher = ref(false)

// ── Modal state ───────────────────────────────────────────────────
const showFormModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const showLockModal = ref(false)
const editingYear = ref<FiscalYear | null>(null)
const showingUlid = ref('')
const confirmTarget = ref<FiscalYear | null>(null)
const actionLoading = ref<string | null>(null)
const selected = ref<string[]>([])
let searchTimeout: ReturnType<typeof setTimeout>

onMounted(() => store.fetchAll())

// ── Computed ──────────────────────────────────────────────────────
const statCards = computed(() => [
  {
    key: 'total', icon: 'fas fa-calendar-alt', color: 'primary',
    value: store.meta.total ?? 0,
    label: t('fiscalYears.stats.total'),
  },
  {
    key: 'open', icon: 'fas fa-lock-open', color: 'success',
    value: store.years.filter(y => y.is_open).length,
    label: t('fiscalYears.stats.open'),
  },
  {
    key: 'closed', icon: 'fas fa-lock', color: 'warning',
    value: store.years.filter(y => y.is_closed).length,
    label: t('fiscalYears.stats.closed'),
  },
  {
    key: 'locked', icon: 'fas fa-ban', color: 'danger',
    value: store.years.filter(y => y.is_locked).length,
    label: t('fiscalYears.stats.locked'),
  },
])

const statuses = computed(() => [
  { value: '', text: t('common.allStatuses') },
  { value: 'open', text: t('fiscalYears.status.open') },
  { value: 'closed', text: t('fiscalYears.status.closed') },
  { value: 'locked', text: t('fiscalYears.status.locked') },
])

const perPages = computed(() => [
  { value: 10, text: `10 / ${t('common.page')}` },
  { value: 15, text: `15 / ${t('common.page')}` },
  { value: 25, text: `25 / ${t('common.page')}` },
  { value: 50, text: `50 / ${t('common.page')}` },
])

const paginationFrom = computed(() =>
  (store.meta.current_page - 1) * store.meta.per_page + 1
)
const paginationTo = computed(() =>
  Math.min(store.meta.current_page * store.meta.per_page, store.meta.total)
)

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    locale.value === 'ar' ? 'ar-SA' : 'en-GB',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
}
function progressBarClass(pct: number) {
  return pct > 80 ? 'bg-danger' : pct > 60 ? 'bg-warning' : 'bg-success'
}
function progressTextClass(pct: number) {
  return pct > 80 ? 'text-danger' : pct > 60 ? 'text-warning' : 'text-success'
}
function shortUlid(ulid: string) {
  return ulid.slice(0, 6) + '...' + ulid.slice(-4)
}
function copyUlid(ulid: string) {
  navigator.clipboard.writeText(ulid)
  toast.value?.show('Copied ULID', 'success')
}

// ── Selection ─────────────────────────────────────────────────────
function toggleSelect(ulid: string) {
  if (selected.value.includes(ulid)) {
    selected.value = selected.value.filter(id => id !== ulid)
  } else {
    selected.value.push(ulid)
  }
}
function isSelected(ulid: string) {
  return selected.value.includes(ulid)
}
function toggleSelectAll() {
  if (selected.value.length === store.years.length) {
    selected.value = []
  } else {
    selected.value = store.years.map(y => y.ulid)
  }
}

// ── Methods ───────────────────────────────────────────────────────
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { store.meta.current_page = 1; store.fetchAll() }, 400)
}
function openCreate() { editingYear.value = null; showFormModal.value = true }
function openEdit(y: FiscalYear) { editingYear.value = y; showFormModal.value = true }
function openShow(y: FiscalYear) { showingUlid.value = y.ulid; showDetailsModal.value = true }

function onSaved(updated: FiscalYear, isNew: boolean) {
  isNew ? store.fetchAll() : store.updateYearInList(updated)
  toast.value?.show(t('common.savedSuccess'), 'success')
}

async function onSwitch(year: FiscalYear) {
  actionLoading.value = year.ulid
  try {
    await store.switchTo(year.ulid)
    toast.value?.show(t('fiscalYears.switchedTo', { name: year.name }), 'success')
  } catch (e: unknown) {
    toast.value?.show((e as any)?.response?.data?.message ?? t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

function confirmDelete(y: FiscalYear) { confirmTarget.value = y; showDeleteModal.value = true }
async function onDeleteConfirmed() {
  if (!confirmTarget.value) return
  actionLoading.value = confirmTarget.value.ulid
  try {
    await fiscalYearService.destroy(confirmTarget.value.ulid)
    store.removeYearFromList(confirmTarget.value.ulid)
    showDeleteModal.value = false
    toast.value?.show(t('common.deletedSuccess'), 'success')
  } catch (e: unknown) {
    toast.value?.show((e as any)?.response?.data?.message ?? t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

function confirmLock(y: FiscalYear) { confirmTarget.value = y; showLockModal.value = true }
async function onLockConfirmed() {
  if (!confirmTarget.value) return
  actionLoading.value = confirmTarget.value.ulid
  try {
    const res = await fiscalYearService.lock(confirmTarget.value.ulid)
    store.updateYearInList(res.data)
    showLockModal.value = false
    toast.value?.show(res.message, 'success')
  } catch (e: unknown) {
    toast.value?.show((e as any)?.response?.data?.message ?? t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

// ── Bulk Actions ──────────────────────────────────────────────────
async function bulkDelete() {
  if (!selected.value.length) return
  actionLoading.value = 'bulk'
  try {
    await Promise.all(selected.value.map(id => fiscalYearService.destroy(id)))
    selected.value.forEach(id => store.removeYearFromList(id))
    selected.value = []
    toast.value?.show('Deleted successfully', 'success')
  } catch {
    toast.value?.show('Error deleting', 'danger')
  } finally { actionLoading.value = null }
}

async function bulkClose() {
  actionLoading.value = 'bulk'
  try {
    const results = await Promise.all(selected.value.map(id => fiscalYearService.close(id)))
    results.forEach(res => store.updateYearInList(res.data))
    selected.value = []
    toast.value?.show('Closed successfully', 'success')
  } catch {
    toast.value?.show('Error', 'danger')
  } finally { actionLoading.value = null }
}

async function bulkReopen() {
  actionLoading.value = 'bulk'
  try {
    const results = await Promise.all(selected.value.map(id => fiscalYearService.reopen(id)))
    results.forEach(res => store.updateYearInList(res.data))
    selected.value = []
    toast.value?.show('Reopened successfully', 'success')
  } catch {
    toast.value?.show('Error', 'danger')
  } finally { actionLoading.value = null }
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

/* ── Current year row highlight ── */
:deep(.row-current td) {
  background-color: #f0faf5 !important;
}

:deep(.row-current:hover td) {
  background-color: #e5f5ee !important;
}

/* ── Action icons ── */
.action-icons .icon-action {
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.action-icons .icon-action:hover {
  transform: scale(1.2);
  opacity: 1;
}

/* ── ULID ── */
.ulid-short {
  font-family: monospace;
  font-size: 0.8rem;
  background: #f5f7fa;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ulid-short:hover {
  background: #e9ecef;
  color: #0d6efd;
}

/* ── Trailing icon in search input ── */
:deep(.form-icon-trailing .trailing) {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  pointer-events: none;
}

/* ── Bulk bar ── */
.bulk-bar {
  background: #f8f9fb;
  border: 1px solid #e5e7eb;
}

/* ══ Info Pills ══ */
.info-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 0.35rem 0.75rem;
  transition: background 0.2s, border-color 0.2s;
}

.fiscal-pill:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
}

.fiscal-pill--empty {
  border-color: rgba(255, 193, 7, 0.4);
  background: rgba(255, 193, 7, 0.08);
}

.pill-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #fff;
  flex-shrink: 0;
}

.pill-body {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.pill-label {
  font-size: 0.6rem;
  opacity: 0.65;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pill-value {
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill-chevron {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.6);
  margin-inline-start: 0.25rem;
}

.pill-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
}

/* ── Status dots ── */
.fiscal-status-dot,
.switcher-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

.dot-open {
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
}

.dot-closed {
  background: #fbbf24;
  box-shadow: 0 0 6px #fbbf24;
}

.dot-locked {
  background: #f87171;
  box-shadow: 0 0 6px #f87171;
}

/* ── Fiscal Switcher Panel ── */
.fiscal-switcher {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  background: #0f3d24;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  z-index: 2000;
  overflow: hidden;
}

.switcher-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
}

.switcher-list {
  max-height: 260px;
  overflow-y: auto;
  padding: 0.4rem;
}

.switcher-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85);
  transition: background 0.15s;
  gap: 0.5rem;
}

.switcher-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.switcher-item--active {
  background: rgba(29, 115, 66, 0.4) !important;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.switcher-badge {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.badge-open {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.badge-closed {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.badge-locked {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

/* ── Backdrop ── */
.switcher-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1999;
}

/* ── Transitions ── */
.switcher-slide-enter-active,
.switcher-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.switcher-slide-enter-from,
.switcher-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>