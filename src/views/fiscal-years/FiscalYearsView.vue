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
        {{ selected.length }} {{ t('common.selected') }}
      </div>
      <div class="d-flex gap-2 align-items-center">
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
              <th class="text-center fw-bold" style="width:48px;">#</th>
              <th class="text-center fw-bold" style="width:100px;">ULID</th>
              <th class="text-center fw-bold">{{ t('fiscalYears.name') }}</th>
              <th class="text-center fw-bold">{{ t('fiscalYears.period') }}</th>
              <th class="text-center fw-bold">{{ t('fiscalYears.duration') }}</th>
              <th class="text-center fw-bold" style="min-width:150px;">{{ t('fiscalYears.progress') }}</th>
              <th class="text-center fw-bold">{{ t('fiscalYears.status.label') }}</th>
              <!-- ★ النجمة قابلة للنقر الآن -->
              <th class="text-center fw-bold" style="width:60px;">{{ t('fiscalYears.default') }}</th>
              <th class="text-center fw-bold" style="min-width:210px;">{{ t('common.actions') }}</th>
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

                <!-- ★ Default — قابل للنقر لتعيين السنة الافتراضية -->
                <td class="text-center">
                  <MDBIcon icon="star" :icon-style="year.is_default ? 'fas' : 'far'" :class="[
                    year.is_default ? 'text-warning' : 'text-muted opacity-25 star-clickable',
                    actionLoading === year.ulid + '_default' ? 'opacity-50' : ''
                  ]" size="lg" :title="year.is_default ? t('fiscalYears.isDefault') : t('fiscalYears.setAsDefault')"
                    @click="!year.is_default && onSetDefault(year)" />
                </td>

                <!-- ══ Actions ══
                     open   → switch | view | edit | close(lock) | delete
                     closed → switch | view |       reopen | lock-permanent | delete
                     locked → switch | view |                                       (no delete)
                -->
                <td class="text-center">
                  <div class="d-flex justify-content-center align-items-center gap-1 action-icons flex-wrap">

                    <!-- Switch to this year -->
                    <BaseSvg v-if="!year.is_current" name="exchange-alt" :size="22" class="icon-action text-primary"
                      :title="t('fiscalYears.actions.switch')" @click="onSwitch(year)" />

                    <!-- View details -->
                    <BaseSvg name="eye" :size="22" class="icon-action text-info" :title="t('common.view')"
                      @click="openShow(year)" />

                    <!-- Edit — only when editable -->
                    <BaseSvg v-if="year.is_editable" name="edit" :size="22" class="icon-action text-dark"
                      :title="t('common.edit')" @click="openEdit(year)" />

                    <!-- ★ NEW — Close (soft) — only when open -->
                    <BaseSvg v-if="year.is_open" name="lock" :size="22" class="icon-action text-warning"
                      :title="t('fiscalYears.actions.close')" @click="confirmClose(year)" />

                    <!-- ★ NEW — Reopen — only when closed (not permanently locked) -->
                    <BaseSvg v-if="year.is_closed" name="lock-open" :size="22" class="icon-action text-success"
                      :title="t('fiscalYears.actions.reopen')" @click="confirmReopen(year)" />

                    <!-- Lock permanently — only when closed -->
                    <BaseSvg v-if="year.is_closed" name="ban" :size="22" class="icon-action text-danger"
                      :title="t('fiscalYears.actions.lock')" @click="confirmLock(year)" />

                    <!-- Delete — not allowed when locked -->
                    <BaseSvg v-if="!year.is_locked" name="trash" :size="22" class="icon-action text-danger"
                      :title="t('common.delete')" @click="confirmDelete(year)" />

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

    <!-- Delete -->
    <ConfirmModal v-model:show="showDeleteModal" type="danger" icon="trash-alt" :title="t('fiscalYears.deleteTitle')"
      :message="t('fiscalYears.deleteMessage', { name: confirmTarget?.name })" :confirm-label="t('common.delete')"
      :loading="actionLoading !== null" @confirm="onDeleteConfirmed" />

    <!-- ★ NEW — Close (soft) -->
    <ConfirmModal v-model:show="showCloseModal" type="warning" icon="lock" :title="t('fiscalYears.closeTitle')"
      :message="t('fiscalYears.closeMessage', { name: confirmTarget?.name })"
      :confirm-label="t('fiscalYears.actions.close')" :loading="actionLoading !== null" @confirm="onCloseConfirmed" />

    <!-- ★ NEW — Reopen -->
    <ConfirmModal v-model:show="showReopenModal" type="success" icon="lock-open" :title="t('fiscalYears.reopenTitle')"
      :message="t('fiscalYears.reopenMessage', { name: confirmTarget?.name })"
      :confirm-label="t('fiscalYears.actions.reopen')" :loading="actionLoading !== null" @confirm="onReopenConfirmed" />

    <!-- Lock permanently -->
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

// ── Misc state ─────────────────────────────────────────────────────
const showSwitcher = ref(false)

// ── Modal visibility ──────────────────────────────────────────────
const showFormModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const showCloseModal = ref(false)   // ★ NEW
const showReopenModal = ref(false)   // ★ NEW
const showLockModal = ref(false)

// ── Shared action state ───────────────────────────────────────────
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
  selected.value = selected.value.includes(ulid)
    ? selected.value.filter(id => id !== ulid)
    : [...selected.value, ulid]
}
function isSelected(ulid: string) {
  return selected.value.includes(ulid)
}
function toggleSelectAll() {
  selected.value = selected.value.length === store.years.length
    ? []
    : store.years.map(y => y.ulid)
}

// ── Search ────────────────────────────────────────────────────────
function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.meta.current_page = 1
    store.fetchAll()
  }, 400)
}

// ── CRUD helpers ──────────────────────────────────────────────────
function openCreate() { editingYear.value = null; showFormModal.value = true }
function openEdit(y: FiscalYear) { editingYear.value = y; showFormModal.value = true }
function openShow(y: FiscalYear) { showingUlid.value = y.ulid; showDetailsModal.value = true }

function onSaved(updated: FiscalYear, isNew: boolean) {
  isNew ? store.fetchAll() : store.updateYearInList(updated)
  toast.value?.show(t('common.savedSuccess'), 'success')
}

// ── Switch ────────────────────────────────────────────────────────
async function onSwitch(year: FiscalYear) {
  actionLoading.value = year.ulid
  try {
    await store.switchTo(year.ulid)
    toast.value?.show(t('fiscalYears.switchedTo', { name: year.name }), 'success')
  } catch (e: unknown) {
    toast.value?.show((e as any)?.response?.data?.message ?? t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

// ── ★ NEW — Set Default ───────────────────────────────────────────
async function onSetDefault(year: FiscalYear) {
  if (year.is_default) return
  actionLoading.value = year.ulid + '_default'
  try {
    const res = await fiscalYearService.setDefault(year.ulid)
    // fetchAll to reset is_default on all rows correctly
    await store.fetchAll()
    toast.value?.show(res.message, 'success')
  } catch (e: unknown) {
    toast.value?.show((e as any)?.response?.data?.message ?? t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

// ── Delete ────────────────────────────────────────────────────────
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

// ── ★ NEW — Close (soft) ──────────────────────────────────────────
function confirmClose(y: FiscalYear) { confirmTarget.value = y; showCloseModal.value = true }

async function onCloseConfirmed() {
  if (!confirmTarget.value) return
  actionLoading.value = confirmTarget.value.ulid
  try {
    const res = await fiscalYearService.close(confirmTarget.value.ulid)
    store.updateYearInList(res.data)
    showCloseModal.value = false
    toast.value?.show(res.message, 'success')
  } catch (e: unknown) {
    toast.value?.show((e as any)?.response?.data?.message ?? t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

// ── ★ NEW — Reopen ────────────────────────────────────────────────
function confirmReopen(y: FiscalYear) { confirmTarget.value = y; showReopenModal.value = true }

async function onReopenConfirmed() {
  if (!confirmTarget.value) return
  actionLoading.value = confirmTarget.value.ulid
  try {
    const res = await fiscalYearService.reopen(confirmTarget.value.ulid)
    store.updateYearInList(res.data)
    showReopenModal.value = false
    toast.value?.show(res.message, 'success')
  } catch (e: unknown) {
    toast.value?.show((e as any)?.response?.data?.message ?? t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

// ── Lock permanently ──────────────────────────────────────────────
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
    toast.value?.show(t('common.deletedSuccess'), 'success')
  } catch {
    toast.value?.show(t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

async function bulkClose() {
  if (!selected.value.length) return
  actionLoading.value = 'bulk'
  try {
    const results = await Promise.all(selected.value.map(id => fiscalYearService.close(id)))
    results.forEach(res => store.updateYearInList(res.data))
    selected.value = []
    toast.value?.show(t('fiscalYears.closedSuccess'), 'success')
  } catch {
    toast.value?.show(t('common.error'), 'danger')
  } finally { actionLoading.value = null }
}

async function bulkReopen() {
  if (!selected.value.length) return
  actionLoading.value = 'bulk'
  try {
    const results = await Promise.all(selected.value.map(id => fiscalYearService.reopen(id)))
    results.forEach(res => store.updateYearInList(res.data))
    selected.value = []
    toast.value?.show(t('fiscalYears.reopenedSuccess'), 'success')
  } catch {
    toast.value?.show(t('common.error'), 'danger')
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

/* ── Star (set-default) ── */
.star-clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-clickable:hover {
  opacity: 0.7 !important;
  color: #ffc107 !important;
  transform: scale(1.2);
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

/* ── Fiscal Switcher Panel ── */
.switcher-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1999;
}
</style>