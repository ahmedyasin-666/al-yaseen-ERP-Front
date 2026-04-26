import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fiscalYearService } from '@/services/fiscalYearService'
import type { FiscalYear, FiscalYearMeta, FiscalYearFilters } from '@/types/fiscalYear'

const STORAGE_KEY = 'fiscal_year_id'

export const useFiscalYearStore = defineStore('fiscalYear', () => {

  // ── State ──────────────────────────────────────────────────
  const years = ref<FiscalYear[]>([])
  const meta = ref<FiscalYearMeta>({ total: 0, current_page: 1, last_page: 1, per_page: 15 })
  const loading = ref(false)
  const filters = ref<FiscalYearFilters>({ search: '', status: '', per_page: 15 })

  // ── currentId: يأتي من localStorage أولاً ─────────────────
  const currentId = ref<string | null>(localStorage.getItem(STORAGE_KEY))

  // ── currentYear: يحاول إيجادها من years أولاً ────────────
  // إن لم توجد بعد (قبل fetchSwitcher) يرجع null وسيُحدَّث لاحقاً
  const currentYear = computed<FiscalYear | null>(() =>
    years.value.find(y => y.ulid === currentId.value) ?? null
  )

  const openYears = computed(() => years.value.filter(y => y.is_open))
  const hasData = computed(() => years.value.length > 0)

  // ── Actions ─────────────────────────────────────────────────

  async function fetchAll() {
    loading.value = true
    try {
      const res = await fiscalYearService.getAll({
        search: filters.value.search || undefined,
        status: filters.value.status || undefined,
        per_page: filters.value.per_page,
        page: meta.value.current_page,
      })
      years.value = res.data
      meta.value = res.meta
    } finally {
      loading.value = false
    }
  }

  /**
   * fetchSwitcher:
   * - يحضر قائمة السنوات من السيرفر
   * - يحترم الاختيار المحفوظ في localStorage
   * - يلجأ لـ current_id من السيرفر فقط إن لم يوجد اختيار محفوظ
   * - يتحقق أن الـ id المحفوظ لا يزال موجوداً في القائمة
   */
  async function fetchSwitcher() {
    loading.value = true
    try {
      const res = await fiscalYearService.getSwitcher()
      years.value = res.years

      const saved = localStorage.getItem(STORAGE_KEY)
      const savedStillValid = saved && res.years.some(y => y.ulid === saved)

      if (savedStillValid) {
        // ✅ استخدم الاختيار المحفوظ
        currentId.value = saved
      } else {
        // 🔄 fallback: استخدم اختيار السيرفر (السنة الافتراضية/الحالية)
        currentId.value = res.current_id
        if (res.current_id) {
          localStorage.setItem(STORAGE_KEY, res.current_id)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * switchTo: يبدّل السنة المالية ويحفظها
   */
  async function switchTo(ulid: string) {
    loading.value = true
    try {
      await fiscalYearService.switchYear(ulid)
      currentId.value = ulid
      localStorage.setItem(STORAGE_KEY, ulid)
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    meta.value.current_page = page
    fetchAll()
  }

  function resetFilters() {
    filters.value = { search: '', status: '', per_page: 15 }
    meta.value.current_page = 1
    fetchAll()
  }

  function updateYearInList(updated: FiscalYear) {
    const idx = years.value.findIndex(y => y.ulid === updated.ulid)
    if (idx !== -1) years.value[idx] = updated
  }

  function removeYearFromList(ulid: string) {
    years.value = years.value.filter(y => y.ulid !== ulid)
    meta.value.total--
    // إن كانت المحذوفة هي المختارة → صفّر
    if (currentId.value === ulid) {
      currentId.value = null
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    years, meta, loading, currentId, filters,
    currentYear, openYears, hasData,
    fetchAll, fetchSwitcher, switchTo,
    setPage, resetFilters, updateYearInList, removeYearFromList,
  }
})