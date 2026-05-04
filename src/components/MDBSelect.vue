<template>
  <div ref="wrapperRef" class="select-wrapper" :class="[sizeClass, { 'form-white': white }]" :style="wrapperStyle">
    <!-- ══ حقل الإدخال ══ -->
    <input ref="fieldRef" class="select-input form-control" :class="{
      focused: isOpen,
      'form-control-sm': size === 'sm',
      'form-control-lg': size === 'lg',
      'is-valid': validState === 'valid',
      'is-invalid': validState === 'invalid',
    }" 
    :value="displayText" 
    :disabled="disabled" 
    :tabindex="disabled ? -1 : 0" role="combobox" 
    :aria-expanded="isOpen"
    :placeholder="!hasValue ? placeholder : ''"
      aria-haspopup="listbox" readonly @click="!disabled && toggleDropdown()"
      @keydown.enter.space.prevent="!disabled && toggleDropdown()" @keydown.esc="closeDropdown"
      @keydown.tab="closeDropdown" @keydown.down.prevent="!disabled && openDropdown()" />

    <!-- Floating Label -->
    <label v-if="label" class="form-label select-label" :class="{ active: hasValue || isOpen }">{{ label }}</label>

    <!-- أيقونة حالة (valid / invalid) -->
    <span v-if="validState === 'valid'" class="select-state-icon state-valid">
      <i class="fas fa-check" />
    </span>
    <span v-else-if="validState === 'invalid'" class="select-state-icon state-invalid">
      <i class="fas fa-exclamation-circle" />
    </span>

    <!-- Clear button -->
    <span v-if="clearButton && hasValue && !disabled" class="select-clear-btn" role="button"
      @click.stop="clearValue">✕</span>

    <!-- السهم -->
    <span class="select-arrow" :class="{ 'select-arrow--open': isOpen }" />

    <!-- Notch (MDB outline style) -->
    <div class="form-notch">
      <div class="form-notch-leading" />
      <div class="form-notch-middle" :style="notchMiddleStyle" />
      <div class="form-notch-trailing" />
    </div>

    <!-- Feedback -->
    <div v-if="validState === 'invalid' && feedback" class="invalid-feedback d-block">
      {{ feedback }}
    </div>
    <div v-else-if="validState === 'valid' && feedback" class="valid-feedback d-block">
      {{ feedback }}
    </div>

    <!-- ══ Dropdown (Teleport) ══ -->
    <Teleport to="body">
      <Transition name="mdb-select-drop">
        <div v-if="isOpen" :id="dropId" class="select-dropdown-container" :style="dropStyle" :dir="currentDir">
          <div class="select-dropdown open">

            <!-- حقل البحث -->
            <div v-if="filter" class="input-group px-3 py-2">
              <input ref="searchRef" v-model="searchQuery" type="text" class="form-control form-control-sm"
                :placeholder="searchPlaceholder" autocomplete="off" @keydown.esc="closeDropdown"
                @keydown.down.prevent="focusOpt(0)" />
              <span v-if="searchQuery" class="input-group-text" style="cursor:pointer"
                @click="searchQuery = ''">✕</span>
            </div>

            <!-- تحديد الكل (multiple) -->
            <div v-if="multiple && filtered.length > 1" class="select-option select-option--all" @click="toggleAll">
              <div class="form-check mb-0 me-2">
                <input class="form-check-input" type="checkbox" :checked="allSelected"
                  :indeterminate.prop="someSelected" tabindex="-1" readonly />
              </div>
              <span class="select-option-text">
                {{ allSelected ? clearAllText : selectAllText }}
              </span>
            </div>

            <!-- قائمة الخيارات -->
            <div class="select-options-wrapper">
              <ul class="select-options-list" role="listbox" :aria-multiselectable="multiple">
                <!-- مجموعات -->
                <template v-if="grouped">
                  <template v-for="grp in groupedOpts" :key="grp.label">
                    <li class="select-option-group-label">{{ grp.label }}</li>
                    <li v-for="(opt, i) in grp.options" :key="opt.value" :ref="(el) => setRef(el, globalIdx(grp, i))"
                      class="select-option select-option-group" :class="{
                        selected: isSelected(opt.value),
                        disabled: opt.disabled,
                      }" role="option" :aria-selected="isSelected(opt.value)" tabindex="-1"
                      @click="!opt.disabled && pick(opt)" @keydown.enter.space.prevent="!opt.disabled && pick(opt)"
                      @keydown.down.prevent="focusOpt(globalIdx(grp, i) + 1)"
                      @keydown.up.prevent="focusOpt(globalIdx(grp, i) - 1)">
                      <div v-if="multiple" class="form-check mb-0 me-2">
                        <input class="form-check-input" type="checkbox" :checked="isSelected(opt.value)" tabindex="-1"
                          readonly />
                      </div>
                      <span v-if="opt.flag" class="select-option-icon me-2">{{ opt.flag }}</span>
                      <span class="select-option-text">
                        {{ opt.text }}
                        <span v-if="opt.secondary" class="select-option-secondary-text">
                          {{ opt.secondary }}
                        </span>
                      </span>
                    </li>
                  </template>
                </template>

                <!-- بدون مجموعات -->
                <template v-else>
                  <li v-for="(opt, i) in filtered" :key="opt.value" :ref="(el) => setRef(el, i)" class="select-option"
                    :class="{
                      selected: isSelected(opt.value),
                      disabled: opt.disabled,
                    }" role="option" :aria-selected="isSelected(opt.value)" tabindex="-1"
                    @click="!opt.disabled && pick(opt)" @keydown.enter.space.prevent="!opt.disabled && pick(opt)"
                    @keydown.down.prevent="focusOpt(i + 1)" @keydown.up.prevent="focusOpt(i - 1)">
                    <div v-if="multiple" class="form-check mb-0 me-2">
                      <input class="form-check-input" type="checkbox" :checked="isSelected(opt.value)" tabindex="-1"
                        readonly />
                    </div>
                    <span v-if="opt.flag" class="select-option-icon me-2">{{ opt.flag }}</span>
                    <span class="select-option-text">
                      {{ opt.text }}
                      <span v-if="opt.secondary" class="select-option-secondary-text">
                        {{ opt.secondary }}
                      </span>
                    </span>
                  </li>
                </template>

                <!-- لا نتائج -->
                <li v-if="filtered.length === 0" class="select-option select-option--no-results">
                  {{ noResultsText }}
                </li>
              </ul>
            </div>

            <!-- Footer (multiple) -->
            <div v-if="multiple && filtered.length"
              class="select-footer d-flex justify-content-end gap-2 px-3 py-2 border-top">
              <button class="btn btn-sm btn-outline-secondary" type="button" @click="clearAll">
                {{ clearText }}
              </button>
              <button class="btn btn-sm btn-primary" type="button" @click="closeDropdown">
                {{ applyText }}
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ref, computed, nextTick, onUnmounted, watchEffect,
  type PropType, type ComponentPublicInstance,
} from 'vue'
import { useLangStore } from '@/stores/langStore'

// ── Types ────────────────────────────────────────────────────────────────────
export interface SelectOption {
  value: string | number
  text: string
  flag?: string
  secondary?: string
  disabled?: boolean
  group?: string
}

// ── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, null] as PropType<string | number | (string | number)[] | null>,
    default: null,
  },
  options: { type: Array as PropType<SelectOption[]>, default: () => [] },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  filter: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clearButton: { type: Boolean, default: false },
  white: { type: Boolean, default: false },
  size: { type: String as PropType<'sm' | 'default' | 'lg'>, default: 'default' },
  width: { type: String, default: '' },
  /** ارتفاع مخصص يتجاوز قيمة size — مثال: height="44px" */
  height: { type: String, default: '' },
  validState: { type: String as PropType<'valid' | 'invalid' | ''>, default: '' },
  feedback: { type: String, default: '' },
  maxDropHeight: { type: String, default: '280px' },
  searchPlaceholder: { type: String, default: 'Search...' },
  noResultsText: { type: String, default: 'No results found' },
  selectAllText: { type: String, default: 'Select all' },
  clearAllText: { type: String, default: 'Clear all' },
  clearText: { type: String, default: 'Clear' },
  applyText: { type: String, default: 'Apply' },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[] | null]
  'change': [value: string | number | (string | number)[] | null]
  'open': []
  'close': []
}>()

// ── Lang ─────────────────────────────────────────────────────────────────────
const langStore = useLangStore()
const currentDir = computed(() => langStore.dir)

// ── Refs ─────────────────────────────────────────────────────────────────────
const isOpen = ref(false)
const searchQuery = ref('')
const wrapperRef = ref<HTMLElement | null>(null)
const fieldRef = ref<HTMLInputElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const optRefs = ref<(HTMLElement | null)[]>([])
const dropId = `mdb-sel-${Math.random().toString(36).slice(2, 8)}`
const dropPos = ref({ top: 0, left: 0, width: 0 })
const isRtl = computed(() => currentDir.value === 'rtl')

// ── Wrapper style — width + custom height CSS variable ───────────────────────
/**
 * نضع --select-height على الـ wrapper ليتوارثها الـ input والعناصر الأخرى.
 * إذا لم يُحدَّد height، تأخذ كل size قيمتها من CSS.
 */
const wrapperStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.width) style.width = props.width
  if (props.height) style['--select-height'] = props.height
  return style
})

// ── Dropdown position ────────────────────────────────────────────────────────
const dropStyle = computed(() => {
  const style: Record<string, string> = {
    position: 'fixed',
    top: `${dropPos.value.top}px`,
    width: `${dropPos.value.width}px`,
    '--mdb-drop-max-h': props.maxDropHeight,
    'z-index': '1070',
  }
  if (isRtl.value) style.right = `${dropPos.value.left}px`
  else style.left = `${dropPos.value.left}px`
  return style
})

function calcPos() {
  const r = wrapperRef.value?.getBoundingClientRect()
  if (!r) return
  const left = isRtl.value ? window.innerWidth - r.right : r.left
  dropPos.value = { top: r.bottom + 2, left, width: r.width }
}

function reposition() { if (isOpen.value) calcPos() }

watchEffect(() => {
  langStore.dir
  if (isOpen.value) nextTick(calcPos)
})

// ── Notch middle width ────────────────────────────────────────────────────────
const notchMiddleStyle = computed(() => {
  if (!props.label || (!hasValue.value && !isOpen.value)) return {}
  const approxWidth = props.label.length * 7.2 * 0.8 + 8
  return { width: `${approxWidth}px` }
})

// ── Click-outside ─────────────────────────────────────────────────────────────
function onOutside(e: MouseEvent) {
  const t = e.target as Node
  const portal = document.getElementById(dropId)
  if (!wrapperRef.value?.contains(t) && !portal?.contains(t)) closeDropdown()
}

// ── Open / Close ──────────────────────────────────────────────────────────────
function openDropdown() {
  if (isOpen.value || props.disabled) return
  calcPos()
  isOpen.value = true
  emit('open')
  nextTick(() => {
    if (props.filter) searchRef.value?.focus()
    document.addEventListener('mousedown', onOutside)
    window.addEventListener('scroll', reposition, { passive: true })
    window.addEventListener('resize', reposition, { passive: true })
  })
}

function closeDropdown() {
  if (!isOpen.value) return
  isOpen.value = false
  searchQuery.value = ''
  emit('close')
  document.removeEventListener('mousedown', onOutside)
  window.removeEventListener('scroll', reposition)
  window.removeEventListener('resize', reposition)
  fieldRef.value?.focus()
}

function toggleDropdown() { isOpen.value ? closeDropdown() : openDropdown() }

onUnmounted(() => {
  document.removeEventListener('mousedown', onOutside)
  window.removeEventListener('scroll', reposition)
  window.removeEventListener('resize', reposition)
})

// ── Computed ──────────────────────────────────────────────────────────────────
const sizeClass = computed(() => ({
  'select-sm': props.size === 'sm',
  'select-lg': props.size === 'lg',
}))

const hasValue = computed(() =>
  props.multiple
    ? Array.isArray(props.modelValue) && (props.modelValue as (string | number)[]).length > 0
    : props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
)

const displayText = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(props.modelValue) || !(props.modelValue as (string | number)[]).length) return ''
    return (props.modelValue as (string | number)[])
      .map(v => props.options.find(o => o.value === v)?.text ?? v)
      .join(', ')
  }
  const o = props.options.find(o => o.value === props.modelValue)
  if (!o) return ''
  return [o.flag, o.text, o.secondary ? `(${o.secondary})` : ''].filter(Boolean).join(' ')
})

const filtered = computed(() => {
  if (!props.filter || !searchQuery.value.trim()) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(o =>
    o.text?.toLowerCase().includes(q) ||
    o.secondary?.toLowerCase().includes(q) ||
    o.flag?.includes(q)
  )
})

const grouped = computed(() => props.options.some(o => o.group))

const groupedOpts = computed(() => {
  if (!grouped.value) return []
  const map = new Map<string, SelectOption[]>()
  filtered.value.forEach(o => {
    const g = o.group ?? ''
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(o)
  })
  return [...map.entries()].map(([label, options]) => ({ label, options }))
})

function globalIdx(grp: { label: string; options: SelectOption[] }, local: number) {
  let i = 0
  for (const g of groupedOpts.value) {
    if (g.label === grp.label) return i + local
    i += g.options.length
  }
  return local
}

const isSelected = (v: string | number) =>
  props.multiple && Array.isArray(props.modelValue)
    ? (props.modelValue as (string | number)[]).includes(v)
    : props.modelValue === v

const allSelected = computed(() =>
  filtered.value.length > 0 && filtered.value.every(o => isSelected(o.value))
)
const someSelected = computed(() =>
  filtered.value.some(o => isSelected(o.value)) && !allSelected.value
)

// ── Selection ─────────────────────────────────────────────────────────────────
function pick(opt: SelectOption) {
  if (props.multiple) {
    const cur = (Array.isArray(props.modelValue) ? [...props.modelValue] : []) as (string | number)[]
    const i = cur.indexOf(opt.value as string | number)
    if (i >= 0) cur.splice(i, 1); else cur.push(opt.value as string | number)
    emit('update:modelValue', cur)
    emit('change', cur)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
    closeDropdown()
  }
}

function clearValue() {
  const val = props.multiple ? [] : null
  emit('update:modelValue', val)
  emit('change', val)
}

function toggleAll() {
  if (allSelected.value) {
    emit('update:modelValue', [])
    emit('change', [])
  } else {
    const vals = filtered.value.filter(o => !o.disabled).map(o => o.value) as (string | number)[]
    emit('update:modelValue', vals)
    emit('change', vals)
  }
}

function clearAll() {
  emit('update:modelValue', [])
  emit('change', [])
}

// ── Keyboard ───────────────────────────────────────────────────────────────────
const setRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el instanceof HTMLElement) optRefs.value[i] = el
}

function focusOpt(i: number) {
  const len = filtered.value.length
  if (len) optRefs.value[Math.max(0, Math.min(i, len - 1))]?.focus()
}
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════════
   ارتفاعات الحقل
   --select-height   : يُعيَّن من الخارج عبر prop height=""
   --_h              : القيمة الداخلية حسب size (يغلبها --select-height)
   --_arrow-icon-h   : ارتفاع رمز السهم (تقريبي = font-size 0.8rem → 12.8px)
   --_clear-icon-h   : ارتفاع زر المسح   (font-size 1rem      → 16px)
   ════════════════════════════════════════════════════════════════ */

/* ══ Wrapper ══ */
.select-wrapper {
  /* ── قيم MDB الأصلية ── */
  --mdb-form-outline-select-arrow-color: #000;
  --mdb-form-outline-select-arrow-font-size: 0.8rem;
  --mdb-form-outline-select-valid-color: #00b74a;
  --mdb-form-outline-select-invalid-color: #f93154;
  --mdb-form-outline-select-clear-btn-color: #000;
  --mdb-form-outline-select-clear-btn-font-size: 1rem;
  --mdb-form-outline-select-clear-btn-right: 27px;
  --mdb-form-outline-select-clear-btn-focus-color: #3b71ca;
  --mdb-form-outline-select-label-color: #3b71ca;
  --mdb-form-outline-select-notch-border-color: #3b71ca;
  --mdb-form-outline-select-input-focused-arrow-color: #3b71ca;
  --mdb-form-outline-select-input-focused-color: #616161;
  --mdb-form-outline-select-label-max-width: 100%;
  --mdb-form-outline-select-label-active-transform: translateY(-1rem) translateY(0.1rem) scale(0.8);
  --mdb-form-outline-select-lg-label-active-transform: translateY(-1.25rem) translateY(0.1rem) scale(0.8);
  --mdb-form-outline-select-sm-label-active-transform: translateY(-0.83rem) translateY(0.1rem) scale(0.8);
  --mdb-form-outline-form-notch-border-top: 1px solid transparent;
  --mdb-form-outline-select-white-arrow-color: #fff;
  --mdb-form-outline-select-white-focus-arrow-color: #fff;
  --mdb-form-outline-select-white-clear-btn: #fff;

  /* ── ارتفاعات الأحجام الثلاثة ── */
  --select-h-sm: 28.8px;
  --select-h-default: 35.8px;
  --select-h-lg: 52px;

  /* ── الارتفاع الفعلي المستخدم (default) ── */
  /* يمكن تجاوزه من الخارج بـ style="--select-height: 44px" */
  --_h: var(--select-height, var(--select-h-default));

  /* ── ارتفاعات الأيقونات لحساب top بدقة ── */
  --_arrow-icon-h: 12.8px;
  /* 0.8rem  */
  --_clear-icon-h: 16px;
  /* 1rem    */

  position: relative;
  width: 100%;
}

/* size overrides — تُضبط --_h حسب الحجم ما لم يُعيَّن height خارجياً */
.select-sm {
  --_h: var(--select-height, var(--select-h-sm));
}

.select-lg {
  --_h: var(--select-height, var(--select-h-lg));
}

/* ══ Input field ══ */
.select-input {
  height: var(--_h) !important;
  cursor: pointer;
  user-select: none;
  caret-color: transparent;
  /* نُلغي border Bootstrap ويُعاد رسمه بالـ Notch */
  border: none !important;
  box-shadow: none !important;
  background-color: transparent;
  padding-inline-end: 2rem;
  padding-inline-start: 0.75rem;
  /* توسيط النص عمودياً */
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.select-sm .select-input {
  font-size: 0.875rem;
}

.select-lg .select-input {
  font-size: 1rem;
}

.select-input[disabled] {
  cursor: default;
}

.select-input.focused {
  color: var(--mdb-form-outline-select-input-focused-color);
}

/* ══ Label (floating) ══ */
.select-label {
  position: absolute;
  top: 50%;
  inset-inline-start: 0.75rem;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #757575;
  pointer-events: none;
  transition: transform 0.15s ease-in-out, font-size 0.15s ease-in-out, color 0.15s ease-in-out;
  max-width: var(--mdb-form-outline-select-label-max-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0;
}

.select-input.focused~.select-label,
.select-label.active {
  transform: var(--mdb-form-outline-select-label-active-transform);
  font-size: 0.8rem;
  color: var(--mdb-form-outline-select-label-color);
}

.select-lg .select-label {
  font-size: 1.1rem;
}

.select-sm .select-label {
  font-size: 0.875rem;
}

.select-lg .select-input.focused~.select-label,
.select-lg .select-label.active {
  transform: var(--mdb-form-outline-select-lg-label-active-transform);
}

.select-sm .select-input.focused~.select-label,
.select-sm .select-label.active {
  transform: var(--mdb-form-outline-select-sm-label-active-transform);
}

/* ══ Arrow — يتمركز عمودياً بدقة باستخدام calc ══ */
.select-arrow {
  color: var(--mdb-form-outline-select-arrow-color);
  font-size: var(--mdb-form-outline-select-arrow-font-size);
  position: absolute;
  /* top = (ارتفاع الحقل - ارتفاع الأيقونة) / 2 */
  top: calc((var(--_h) - var(--_arrow-icon-h)) / 2);
  inset-inline-end: 9px;
  pointer-events: none;
  transition: transform 0.2s ease, color 0.15s;
}

.select-arrow::before {
  content: "⮟";
}

.select-arrow--open {
  transform: rotate(180deg);
  color: var(--mdb-form-outline-select-input-focused-arrow-color);
}

.select-input.focused~.select-arrow {
  color: var(--mdb-form-outline-select-input-focused-arrow-color);
}

.form-white .select-arrow {
  color: var(--mdb-form-outline-select-white-arrow-color);
}

.form-white .select-input.focused~.select-arrow {
  color: var(--mdb-form-outline-select-white-focus-arrow-color);
}

/* ══ Clear button — يتمركز عمودياً بنفس الطريقة ══ */
.select-clear-btn {
  position: absolute;
  top: calc((var(--_h) - var(--_clear-icon-h)) / 2);
  inset-inline-end: var(--mdb-form-outline-select-clear-btn-right);
  color: var(--mdb-form-outline-select-clear-btn-color);
  font-size: var(--mdb-form-outline-select-clear-btn-font-size);
  cursor: pointer;
  z-index: 2;
  line-height: 1;
}

.select-clear-btn:focus {
  color: var(--mdb-form-outline-select-clear-btn-focus-color);
  outline: none;
}

.form-white .select-clear-btn {
  color: var(--mdb-form-outline-select-white-clear-btn);
}

/* ══ State icons — مُتمركزة عمودياً بـ transform ══ */
.select-state-icon {
  position: absolute;
  top: 50%;
  inset-inline-end: 2rem;
  transform: translateY(-50%);
  font-size: 0.85rem;
  pointer-events: none;
}

.state-valid {
  color: var(--mdb-form-outline-select-valid-color);
}

.state-invalid {
  color: var(--mdb-form-outline-select-invalid-color);
}

/* ══ Notch — يمتد بطول الحقل كاملاً ══ */
.form-notch {
  display: flex;
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  width: 100%;
  /* يتبع ارتفاع الحقل تلقائياً */
  height: var(--_h);
  pointer-events: none;
}

.form-notch-leading,
.form-notch-middle,
.form-notch-trailing {
  border: 1px solid #bdbdbd;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-notch-leading {
  width: 0.5rem;
  border-inline-end: none;
  border-start-start-radius: 4px;
  border-end-start-radius: 4px;
}

.form-notch-middle {
  border-left: none;
  border-right: none;
  flex: 0 0 auto;
  width: 0;
  transition: width 0.15s ease-in-out, border-top 0.15s ease-in-out;
}

.form-notch-trailing {
  flex-grow: 1;
  border-inline-start: none;
  border-start-end-radius: 4px;
  border-end-end-radius: 4px;
}

/* Focused notch */
.select-input.focused~.form-notch .form-notch-leading {
  border-color: var(--mdb-form-outline-select-notch-border-color);
  box-shadow: -1px 0 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 1px 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 -1px 0 0 var(--mdb-form-outline-select-notch-border-color);
}

.select-input.focused~.form-notch .form-notch-middle {
  border-top: var(--mdb-form-outline-form-notch-border-top);
  border-color: var(--mdb-form-outline-select-notch-border-color);
  box-shadow: 0 1px 0 0 var(--mdb-form-outline-select-notch-border-color);
}

.select-input.focused~.form-notch .form-notch-trailing {
  border-color: var(--mdb-form-outline-select-notch-border-color);
  box-shadow: 1px 0 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 -1px 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 1px 0 0 var(--mdb-form-outline-select-notch-border-color);
}

/* Valid notch */
.select-input.is-valid~.form-notch .form-notch-leading,
.select-input.is-valid~.form-notch .form-notch-middle,
.select-input.is-valid~.form-notch .form-notch-trailing {
  border-color: var(--mdb-form-outline-select-valid-color);
}

/* Invalid notch */
.select-input.is-invalid~.form-notch .form-notch-leading,
.select-input.is-invalid~.form-notch .form-notch-middle,
.select-input.is-invalid~.form-notch .form-notch-trailing {
  border-color: var(--mdb-form-outline-select-invalid-color);
}

/* ══ RTL notch box-shadow overrides ══ */
[dir="rtl"] .select-input.focused~.form-notch .form-notch-leading {
  border-color: var(--mdb-form-outline-select-notch-border-color);
  box-shadow: 1px 0 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 1px 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 -1px 0 0 var(--mdb-form-outline-select-notch-border-color);
}

[dir="rtl"] .select-input.focused~.form-notch .form-notch-trailing {
  border-color: var(--mdb-form-outline-select-notch-border-color);
  box-shadow: -1px 0 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 -1px 0 0 var(--mdb-form-outline-select-notch-border-color),
    0 1px 0 0 var(--mdb-form-outline-select-notch-border-color);
}

[dir="rtl"] .select-input.is-valid~.form-notch .form-notch-leading,
[dir="rtl"] .select-input.is-invalid~.form-notch .form-notch-leading {
  border-right-color: inherit;
  border-left-color: transparent;
}

[dir="rtl"] .select-input.is-valid~.form-notch .form-notch-trailing,
[dir="rtl"] .select-input.is-invalid~.form-notch .form-notch-trailing {
  border-left-color: inherit;
  border-right-color: transparent;
}

/* ══ Dropdown container ══ */
.select-dropdown-container {
  --mdb-form-outline-select-dropdown-bg: #fff;
  --mdb-form-outline-select-dropdown-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
  --mdb-form-outline-select-dropdown-min-width: 100px;
  --mdb-form-outline-select-options-wrapper-scrollbar-width: 4px;
  --mdb-form-outline-select-options-wrapper-scrollbar-height: 4px;
  --mdb-form-outline-select-options-wrapper-scrollbar-thumb-bg: #999;
  --mdb-form-outline-select-options-wrapper-scrollbar-thumb-border-radius: 4px;
}

.select-dropdown {
  background-color: var(--mdb-form-outline-select-dropdown-bg);
  box-shadow: var(--mdb-form-outline-select-dropdown-box-shadow);
  margin: 0;
  min-width: var(--mdb-form-outline-select-dropdown-min-width);
  outline: 0;
  position: relative;
  transform: scaleY(0.8);
  transform-origin: top center;
  opacity: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
  border-radius: 4px;
}

.select-dropdown.open {
  transform: scaleY(1);
  opacity: 1;
}

/* ══ Options wrapper ══ */
.select-options-wrapper {
  overflow-y: auto;
  max-height: var(--mdb-drop-max-h, 280px);
}

.select-options-wrapper::-webkit-scrollbar {
  width: var(--mdb-form-outline-select-options-wrapper-scrollbar-width);
  height: var(--mdb-form-outline-select-options-wrapper-scrollbar-height);
}

.select-options-wrapper::-webkit-scrollbar-thumb:vertical {
  background-color: var(--mdb-form-outline-select-options-wrapper-scrollbar-thumb-bg);
  border-radius: var(--mdb-form-outline-select-options-wrapper-scrollbar-thumb-border-radius);
}

/* ══ Options list ══ */
.select-options-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ══ Option ══ */
.select-option {
  --mdb-form-outline-select-option-color: rgba(0, 0, 0, .87);
  --mdb-form-outline-select-option-padding-left: 16px;
  --mdb-form-outline-select-option-padding-right: 16px;
  --mdb-form-outline-select-option-font-size: 1rem;
  --mdb-form-outline-select-option-font-weight: 400;
  --mdb-form-outline-select-option-hover-not-disabled-bg: rgba(0, 0, 0, .048);
  --mdb-form-outline-select-option-active-bg: rgba(0, 0, 0, .048);
  --mdb-form-outline-select-option-selected-bg: rgba(0, 0, 0, .02);
  --mdb-form-outline-select-option-selected-active-bg: rgba(0, 0, 0, .048);
  --mdb-form-outline-select-option-selected-disabled-color: #9e9e9e;
  --mdb-form-outline-select-option-disabled-color: #9e9e9e;
  --mdb-form-outline-select-option-secondary-text-font-size: 0.8rem;
  --mdb-form-outline-select-option-secondary-text-color: #6c757d;
  --mdb-form-outline-select-option-icon-width: 28px;
  --mdb-form-outline-select-option-icon-height: 28px;

  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--mdb-form-outline-select-option-color);
  padding-inline-start: var(--mdb-form-outline-select-option-padding-left);
  padding-inline-end: var(--mdb-form-outline-select-option-padding-right);
  font-size: var(--mdb-form-outline-select-option-font-size);
  font-weight: var(--mdb-form-outline-select-option-font-weight);
  background-color: transparent;
  user-select: none;
  min-height: 38px;
  transition: background-color 0.15s ease;
}

.select-option:hover:not(.disabled) {
  background-color: var(--mdb-form-outline-select-option-hover-not-disabled-bg);
}

.select-option.active {
  background-color: var(--mdb-form-outline-select-option-active-bg);
}

.select-option.selected {
  background-color: var(--mdb-form-outline-select-option-selected-bg);
}

.select-option.selected.active {
  background-color: var(--mdb-form-outline-select-option-selected-active-bg);
}

.select-option.selected.disabled {
  cursor: default;
  color: var(--mdb-form-outline-select-option-selected-disabled-color);
  background-color: transparent;
}

.select-option.disabled {
  cursor: default;
  color: var(--mdb-form-outline-select-option-disabled-color);
}

.select-option--no-results {
  color: #9e9e9e;
  cursor: default;
  justify-content: center;
}

.select-option--all {
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
}

/* ══ Option inner elements ══ */
.select-option-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-option-secondary-text {
  font-size: var(--mdb-form-outline-select-option-secondary-text-font-size);
  color: var(--mdb-form-outline-select-option-secondary-text-color);
  display: block;
  line-height: normal;
}

.select-option-icon {
  width: var(--mdb-form-outline-select-option-icon-width);
  height: var(--mdb-form-outline-select-option-icon-height);
  font-size: 1.1rem;
  line-height: 1;
  flex-shrink: 0;
}

/* ══ Group label ══ */
.select-option-group-label {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-inline-start: 16px;
  padding-inline-end: 16px;
  font-size: 0.85rem;
  font-weight: 400;
  background-color: transparent;
  color: rgba(0, 0, 0, .54);
  user-select: none;
  min-height: 32px;
}

/* ══ Transition ══ */
.mdb-select-drop-enter-active,
.mdb-select-drop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mdb-select-drop-enter-from,
.mdb-select-drop-leave-to {
  opacity: 0;
  transform: scaleY(0.8);
}
</style>